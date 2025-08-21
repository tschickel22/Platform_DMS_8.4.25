import React from 'react'

interface SiteRendererProps {
  site: Site
}

interface Site {
  id: string
  name: string
  slug: string
  pages: Page[]
  theme?: Theme
  nav?: NavConfig
  brand?: { logoUrl?: string; color?: string }
  faviconUrl?: string
  seo?: SeoMeta
  tracking?: Tracking
}

interface Page {
  id: string
  title: string
  path: string
  blocks: Block[]
  seo?: PageSeo
}

interface Block {
  id: string
  type: string
  content: any
  order: number
}

interface Theme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

interface NavConfig {
  manufacturersMenu: {
    enabled: boolean
    label: string
    items: Manufacturer[]
  }
  showLandHomeMenu?: boolean
  landHomeLabel?: string
}

interface Manufacturer {
  id: string
  name: string
  slug: string
  logoUrl?: string
  externalUrl?: string
  enabled: boolean
  linkType: 'inventory' | 'external'
}

interface SeoMeta {
  siteDefaults: {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalBase?: string
  }
  pages: Record<string, {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalPath?: string
  }>
}

interface PageSeo {
  title?: string
  description?: string
  ogImageUrl?: string
  robots?: string
  canonicalPath?: string
}

interface Tracking {
  ga4Id?: string
  gtagId?: string
  gtmId?: string
  headHtml?: string
  bodyEndHtml?: string
}

export function SiteRenderer({ site }: SiteRendererProps) {
  console.log('SiteRenderer received site:', site)
  
  // Find the current page based on URL path, default to home page
  const pathParts = window.location.pathname.split('/')
  const currentPath = pathParts[pathParts.length - 1] || ''
  console.log('Current path for page matching:', currentPath)
  
  const currentPage = site.pages?.find(page => {
    const pagePath = page.path?.replace(/^\//, '') || ''
    console.log('Checking page:', page.title, 'with path:', pagePath, 'against:', currentPath)
    return pagePath === currentPath || (currentPath === site.slug && page.path === '/')
  }) || site.pages?.[0] || null

  console.log('Selected page:', currentPage?.title || 'none')

  if (!currentPage) {
    console.error('No page found to render')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Content</h1>
          <p className="text-gray-600">This website has no pages to display.</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Available pages: {site.pages?.map(p => p.title).join(', ') || 'none'}</p>
            <p>Current path: {currentPath}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderBlock = (block: Block) => {
    console.log('Rendering block:', block.type, block.id)
    const primaryColor = site.brand?.color || site.theme?.primaryColor || '#3b82f6'

    switch (block.type) {
      case 'hero':
        return (
          <section key={block.id} className="relative bg-gray-900 text-white">
            {block.content.backgroundImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                {block.content.title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {block.content.title}
                  </h1>
                )}
                {block.content.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {block.content.subtitle}
                  </p>
                )}
                {block.content.ctaText && (
                  <button 
                    className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                    onClick={() => block.content.ctaLink && (window.location.href = block.content.ctaLink)}
                  >
                    {block.content.ctaText}
                  </button>
                )}
              </div>
            </div>
          </section>
        )

      case 'text':
        return (
          <section key={block.id} className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div 
                className={`prose prose-lg max-w-none ${block.content.alignment || 'text-left'}`}
                dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text || '' }}
              />
            </div>
          </section>
        )

      case 'image':
        return (
          <section key={block.id} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-${block.content.alignment || 'center'}`}>
                <img 
                  src={block.content.src} 
                  alt={block.content.alt || ''} 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
                {block.content.caption && (
                  <p className="mt-4 text-gray-600 text-sm">{block.content.caption}</p>
                )}
              </div>
            </div>
          </section>
        )

      case 'gallery':
        return (
          <section key={block.id} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {block.content.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(block.content.images || []).map((image: any, index: number) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image.src} 
                      alt={image.alt || ''} 
                      className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    {image.caption && (
                      <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'cta':
        return (
          <section key={block.id} className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {block.content.title && (
                <h2 className="text-3xl font-bold mb-4">{block.content.title}</h2>
              )}
              {block.content.description && (
                <p className="text-lg text-gray-600 mb-8">{block.content.description}</p>
              )}
              {block.content.buttonText && (
                <button 
                  className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                  onClick={() => block.content.buttonLink && (window.location.href = block.content.buttonLink)}
                >
                  {block.content.buttonText}
                </button>
              )}
            </div>
          </section>
        )

      case 'contact':
        return (
          <section key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {block.content.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  {block.content.description && (
                    <p className="text-lg text-gray-600 mb-6">{block.content.description}</p>
                  )}
                  <div className="space-y-4">
                    {block.content.phone && (
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Phone:</span>
                        <a href={`tel:${block.content.phone}`} className="text-blue-600 hover:underline">
                          {block.content.phone}
                        </a>
                      </div>
                    )}
                    {block.content.email && (
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        <a href={`mailto:${block.content.email}`} className="text-blue-600 hover:underline">
                          {block.content.email}
                        </a>
                      </div>
                    )}
                    {block.content.address && (
                      <div className="flex items-start">
                        <span className="font-semibold mr-2">Address:</span>
                        <span>{block.content.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <form className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea 
                      placeholder="Your Message" 
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                    <button 
                      type="submit"
                      className="w-full px-6 py-3 font-semibold rounded-md transition-colors"
                      style={{ backgroundColor: primaryColor, color: 'white' }}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )

      case 'inventory':
        return (
          <section key={block.id} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {block.content.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(block.content.items || []).map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                        ${item.price?.toLocaleString()}
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.specs && Object.entries(item.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'landHome':
        return (
          <section key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {block.content.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(block.content.packages || []).map((pkg: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                      <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                        ${pkg.price?.toLocaleString()}
                      </p>
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                      <ul className="space-y-1">
                        {(pkg.features || []).map((feature: string, i: number) => (
                          <li key={i} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      default:
        return (
          <div key={block.id} className="py-8 px-4 bg-yellow-50 border border-yellow-200">
            <p className="text-center text-yellow-800">
              Unknown block type: {block.type}
            </p>
          </div>
        )
    }
  }

  // Sort blocks by order
  const sortedBlocks = [...(currentPage.blocks || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="min-h-screen bg-white">
      {/* Apply theme styles */}
      <style>
        {site.theme?.fontFamily && `
          body { font-family: ${site.theme.fontFamily}, sans-serif; }
        `}
      </style>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {site.brand?.logoUrl && (
                <img 
                  src={site.brand.logoUrl} 
                  alt={site.name} 
                  className="h-8 w-auto mr-3"
                />
              )}
              <span className="text-xl font-bold" style={{ color: site.theme?.primaryColor || '#3b82f6' }}>
                {site.name}
              </span>
            </div>
            
            {/* Simple navigation menu */}
            <div className="hidden md:flex space-x-8">
              {(site.pages || []).map((page) => (
                <a
                  key={page.id}
                  href={`#${page.path}`}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {sortedBlocks.map(renderBlock)}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}