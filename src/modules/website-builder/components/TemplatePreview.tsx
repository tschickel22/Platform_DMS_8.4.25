import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WebsiteTemplate, websiteTemplates } from '../utils/templates'

interface TemplatePreviewProps {
  template: WebsiteTemplate | null
  /** Optional controlled page index coming from TemplateSelector */
  pageIndex?: number
  onSelectTemplate?: (template: WebsiteTemplate) => void
}

// Tailwind-safe text alignment (avoid `text-${value}`)
const textAlignClass = (align?: string) => {
  switch (align) {
    case 'center': return 'text-center'
    case 'right': return 'text-right'
    default: return 'text-left'
  }
}

/**
 * NOTE: Dialog-free preview. The surrounding Dialog is owned by TemplateSelector.
 */
export function TemplatePreview({ template, pageIndex = 0 }: TemplatePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  // Keep internal index in sync with parent
  useEffect(() => {
    setCurrentPageIndex(Math.max(0, pageIndex || 0))
  }, [pageIndex])

  // Resolve full template from registry; fall back to incoming prop
  const fullTemplate: WebsiteTemplate | null = useMemo(() => {
    if (!template) return null
    const found = websiteTemplates.find((t) => t.id === template.id)
    return found ?? template
  }, [template])

  // Reset index whenever template changes
  useEffect(() => {
    setCurrentPageIndex(0)
  }, [fullTemplate?.id, fullTemplate?.pages?.length])

  if (!fullTemplate) {
    return <div className="p-6 text-sm text-muted-foreground">No template selected.</div>
  }

  const pages = Array.isArray(fullTemplate.pages) ? fullTemplate.pages : []
  const currentPage = pages[currentPageIndex]
  const primaryColor = fullTemplate.theme?.primaryColor ?? '#2563eb'
  const hasMultiplePages = pages.length > 1

  const nextPage = () => {
    if (!pages.length) return
    setCurrentPageIndex((prev) => (prev + 1) % pages.length)
  }
  const prevPage = () => {
    if (!pages.length) return
    setCurrentPageIndex((prev) => (prev - 1 + pages.length) % pages.length)
  }

  const renderBlock = (block: any, idx: number) => {
    const key = block?.order ?? idx
    switch (block?.type) {
      case 'hero': {
        const bg = block?.content?.backgroundImage
        return (
          <section key={key} className="relative bg-gray-900 text-white min-h-[400px] flex items-center">
            {bg && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${bg}')` }}
              >
                <div className="absolute inset-0 bg-black/50" />
              </div>
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
              {block?.content?.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{block.content.title}</h1>
              )}
              {block?.content?.subtitle && (
                <p className="text-xl md:text-2xl mb-8 text-gray-200">{block.content.subtitle}</p>
              )}
              {block?.content?.ctaText && (
                <button
                  className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  {block.content.ctaText}
                </button>
              )}
            </div>
          </section>
        )
      }

      case 'text': {
        const html = block?.content?.html ?? ''
        return (
          <section key={key} className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`prose prose-lg max-w-none ${textAlignClass(block?.content?.alignment)}`}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </section>
        )
      }

      case 'inventory': {
        const items = Array.isArray(block?.content?.items) ? block.content.items : []
        return (
          <section key={key} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {block?.content?.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item: any, i: number) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {item?.image && (
                      <img src={item.image} alt={item?.title ?? ''} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6">
                      {item?.title && <h3 className="text-xl font-semibold mb-2">{item.title}</h3>}
                      {typeof item?.price === 'number' && (
                        <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                          ${item.price.toLocaleString()}
                        </p>
                      )}
                      <div className="text-sm text-gray-600 space-y-1">
                        {item?.specs &&
                          Object.entries(item.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span>{String(value)}</span>
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
      }

      case 'landHome': {
        const pkgs = Array.isArray(block?.content?.packages) ? block.content.packages : []
        return (
          <section key={key} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {block?.content?.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pkgs.map((pkg: any, i: number) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {pkg?.image && (
                      <img src={pkg.image} alt={pkg?.title ?? ''} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-6">
                      {pkg?.title && <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>}
                      {typeof pkg?.price === 'number' && (
                        <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                          ${pkg.price.toLocaleString()}
                        </p>
                      )}
                      {pkg?.description && <p className="text-gray-600 mb-4">{pkg.description}</p>}
                      <ul className="space-y-1">
                        {(pkg?.features ?? []).map((feature: string, j: number) => (
                          <li key={j} className="flex items-center text-sm text-gray-600">
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
      }

      case 'cta': {
        return (
          <section key={key} className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {block?.content?.title && <h2 className="text-3xl font-bold mb-4">{block.content.title}</h2>}
              {block?.content?.description && (
                <p className="text-lg text-gray-600 mb-8">{block.content.description}</p>
              )}
              {block?.content?.buttonText && (
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
      }

      case 'contact': {
        return (
          <section key={key} className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {block?.content?.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  {block?.content?.description && (
                    <p className="text-lg text-gray-600 mb-6">{block.content.description}</p>
                  )}
                  <div className="space-y-4">
                    {block?.content?.phone && (
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Phone:</span>
                        <span className="text-blue-600">{block.content.phone}</span>
                      </div>
                    )}
                    {block?.content?.email && (
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        <span className="text-blue-600">{block.content.email}</span>
                      </div>
                    )}
                    {block?.content?.address && (
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
                    />
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
      }

      case 'gallery': {
        const images = Array.isArray(block?.content?.images) ? block.content.images : []
        return (
          <section key={key} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {block?.content?.title && (
                <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image: any, i: number) => (
                  <div key={i} className="relative group">
                    <img
                      src={image?.src}
                      alt={image?.alt ?? ''}
                      className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    {image?.caption && <p className="mt-2 text-sm text-gray-600">{image.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }

      default:
        return (
          <div key={key} className="py-8 px-4 bg-yellow-50 border border-yellow-200">
            <p className="text-center text-yellow-800">Unknown block type: {String(block?.type)}</p>
          </div>
        )
    }
  }

  // If there are no pages, keep the area useful
  if (!currentPage) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        This template doesn’t have any pages yet.
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Page tabs + pager */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Pages</span>
          <div className="flex flex-wrap gap-2">
            {pages.map((page, index) => (
              <button
                key={page.path ?? index}
                onClick={() => setCurrentPageIndex(index)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  index === currentPageIndex ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
                style={{ backgroundColor: index === currentPageIndex ? fullTemplate.theme?.primaryColor ?? '#2563eb' : 'transparent' }}
              >
                {page.title}
                <span className="ml-1 text-xs opacity-75">{page.path}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={!hasMultiplePages}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPageIndex + 1} of {pages.length || 1}
          </span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={!hasMultiplePages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mock top nav + page content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full bg-white">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <span className="text-xl font-bold" style={{ color: primaryColor }}>
                    Demo Dealership
                  </span>
                </div>
                <div className="flex gap-6">
                  {pages.map((page, index) => (
                    <button
                      key={page.path ?? index}
                      onClick={() => setCurrentPageIndex(index)}
                      className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                        index === currentPageIndex ? 'border-b-2' : ''
                      }`}
                      style={{ borderColor: index === currentPageIndex ? primaryColor : 'transparent' }}
                    >
                      {page.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <main>
            {(currentPage?.blocks ?? [])
              .slice()
              .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0))
              .map(renderBlock)}
          </main>
        </div>
      </div>
    </div>
  )
}

export default TemplatePreview
