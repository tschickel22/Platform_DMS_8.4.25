import React from 'react'
import { Site, Page, Block } from '../types'

interface EditorCanvasProps {
  site: Site | null
  currentPage: Page | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onBlockSelect?: (block: Block) => void
  selectedBlockId?: string | null
}

export default function EditorCanvas({
  site,
  currentPage,
  previewMode,
  onBlockSelect,
  selectedBlockId
}: EditorCanvasProps) {
  if (!site || !currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-2">No page selected</div>
          <div className="text-sm text-gray-500">Select a page to start editing</div>
        </div>
      </div>
    )
  }

  const getCanvasWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm'
      case 'tablet':
        return 'max-w-2xl'
      default:
        return 'max-w-full'
    }
  }

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id
    const primaryColor = site.theme?.primaryColor || '#3b82f6'
    // Get theme colors for consistent styling
    const primaryColor = site?.theme?.primaryColor || '#3b82f6'
    const secondaryColor = site?.theme?.secondaryColor || '#64748b'
    

    const blockContent = (() => {
      switch (block.type) {
        case 'hero':
          return (
            <section className="relative bg-gray-900 text-white py-24">
              {block.content.backgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
              )}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <section className="py-16">
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
            <section className="py-16">
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
            <section className="py-16">
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
            <section className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
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
                  >
                    {block.content.buttonText}
                  </button>
                )}
              </div>
            </section>
          )

        case 'inventory':
          return (
            <section className="py-16">
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

        default:
          return (
            <div className="py-8 px-4 bg-yellow-50 border border-yellow-200">
              <p className="text-center text-yellow-800">
                Unknown block type: {block.type}
              </p>
            </div>
          )
      }
    })()

    return (
      <div
        key={block.id}
        className={`relative group cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'
        }`}
        onClick={() => onBlockSelect?.(block)}
      >
        {blockContent}
        
        {/* Edit overlay */}
        <div className={`absolute inset-0 bg-blue-500 bg-opacity-10 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="absolute top-2 left-2">
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              {block.type}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Sort blocks by order
  const sortedBlocks = [...(currentPage.blocks || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <div className={`mx-auto bg-white shadow-lg transition-all duration-300 ${getCanvasWidth()}`}>
          {/* Site Navigation Preview */}
          <nav className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {site.brand?.logoUrl ? (
                  <img src={site.brand.logoUrl} alt={site.name} className="h-8 w-auto" />
                ) : (
                  <span className="text-xl font-bold" style={{ color: site.theme?.primaryColor || '#3b82f6' }}>
                    {site.name}
                  </span>
                )}
              </div>
              <div className="flex space-x-6">
                {site.pages?.map(page => (
                  <a
                    key={page.id}
                    href="#"
                    className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                      page.id === currentPage.id ? 'border-b-2' : ''
          {/* Render actual block content based on type */}
          {block.type === 'hero' && (
            <section className="relative bg-gray-900 text-white py-24">
              {block.content?.backgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
              )}
              <div className="relative max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {block.content?.title || 'Welcome to Our Dealership'}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {block.content?.subtitle || 'Find your perfect RV or manufactured home'}
                </p>
                {block.content?.ctaText && (
                  <button 
                    className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    {block.content.ctaText}
                  </button>
                )}
              </div>
            </section>
          )}
          
          {block.type === 'text' && (
            <section className="py-16">
              <div className="max-w-4xl mx-auto px-4">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: block.content?.html || block.content?.text || '<h2>About Us</h2><p>We are a leading dealership specializing in RVs and manufactured homes.</p>' 
                  }}
                />
              </div>
            </section>
          )}
          
          {block.type === 'inventory' && (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                  {block.content?.title || 'Featured Inventory'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(block.content?.items || [
                    {
                      title: '2023 Forest River Cherokee',
                      price: 45000,
                      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
                      specs: { sleeps: 4, length: 28, slides: 1 }
                    },
                    {
                      title: '2023 Clayton The Edge',
                      price: 95000,
                      image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
                      specs: { bedrooms: 3, bathrooms: 2, sqft: 1450 }
                    }
                  ]).map((item: any, index: number) => (
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
          )}
          
          {block.type === 'cta' && (
            <section className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {block.content?.title || 'Ready to Find Your Perfect Home?'}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {block.content?.description || 'Contact us today to schedule a viewing or get more information about our inventory.'}
                </p>
                <button 
                  className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  {block.content?.buttonText || 'Contact Us Today'}
                </button>
              </div>
            </section>
          )}
          
          {!['hero', 'text', 'inventory', 'cta'].includes(block.type) && (
            <div className="min-h-[100px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-600 mb-1">
                  {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
                </div>
                <div className="text-sm text-gray-500">
                  Click to edit content
                </div>
                    {page.title}
            </div>
          </nav>

          {/* Page Content */}
          <main className="min-h-screen">
            {sortedBlocks.length > 0 ? (
              sortedBlocks.map(renderBlock)
            ) : (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                  <p className="text-gray-500">Add blocks to start building your page</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}