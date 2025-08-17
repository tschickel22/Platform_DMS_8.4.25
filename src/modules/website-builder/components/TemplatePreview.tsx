import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { rvDealerProfessionalTemplate } from '../utils/templates-data/rv-dealer-professional'
import { manufacturedHomeDealerTemplate } from '../utils/templates-data/manufactured-home-dealer'
import { luxuryRvDealerTemplate } from '../utils/templates-data/luxury-rv-dealer'
import { generalDealerTemplate } from '../utils/templates-data/general-dealer'
import { WebsiteTemplate, websiteTemplates } from '../utils/templates'

// Map template IDs to their imported data
const templateMap: Record<string, WebsiteTemplate> = {
  'rv-dealer-professional': rvDealerProfessionalTemplate,
  'manufactured-home-dealer': manufacturedHomeDealerTemplate,
  'luxury-rv-dealer': luxuryRvDealerTemplate,
  'general-dealer': generalDealerTemplate
}

// Map template IDs to their imported data
const templateMap: Record<string, WebsiteTemplate> = {
  'rv-dealer-professional': rvDealerProfessionalTemplate,
  'manufactured-home-dealer': manufacturedHomeDealerTemplate,
  'luxury-rv-dealer': luxuryRvDealerTemplate,
  'general-dealer': generalDealerTemplate
}

interface TemplatePreviewProps {
  template: WebsiteTemplate | null
  isOpen: boolean
  onClose: () => void
  onSelectTemplate?: (template: WebsiteTemplate) => void
}

export function TemplatePreview({ template, isOpen, onClose, onSelectTemplate }: TemplatePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  if (!template) return null

  // Get the full template data from the templates array
  const fullTemplate = websiteTemplates.find(t => t.id === template.id) || template
  // Get the full template data from the imported files
  const fullTemplate = templateMap[template.id] || template

  if (!currentPage) {
    return null
  }

  const nextPage = () => {
    setCurrentPageIndex((prev) => (prev + 1) % fullTemplate.pages.length)
  }

  const prevPage = () => {
    setCurrentPageIndex((prev) => (prev - 1 + fullTemplate.pages.length) % fullTemplate.pages.length)
  }

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'hero':
        return (
          <section key={block.order} className="relative bg-gray-900 text-white min-h-[400px] flex items-center">
            {block.content.backgroundImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${block.content.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
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
          </section>
        )

      case 'text':
        return (
          <section key={block.order} className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div 
                className={`prose prose-lg max-w-none text-${block.content.alignment || 'left'}`}
                dangerouslySetInnerHTML={{ __html: block.content.html || '' }}
              />
            </div>
          </section>
        )

      case 'inventory':
        return (
          <section key={block.order} className="py-16 bg-gray-50">
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
          <section key={block.order} className="py-16 bg-gray-50">
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

      case 'cta':
        return (
          <section key={block.order} className="py-16" style={{ backgroundColor: `${primaryColor}10` }}>
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

      case 'contact':
        return (
          <section key={block.order} className="py-16 bg-gray-50">
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
                        <span className="text-blue-600">{block.content.phone}</span>
                      </div>
                    )}
                    {block.content.email && (
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        <span className="text-blue-600">{block.content.email}</span>
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

      case 'gallery':
        return (
          <section key={block.order} className="py-16">
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

      default:
        return (
          <div key={block.order} className="py-8 px-4 bg-yellow-50 border border-yellow-200">
            <p className="text-center text-yellow-800">
              Unknown block type: {block.type}
            </p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {fullTemplate.name} Preview
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Navigate through all pages to see the complete template
              </p>
            </div>
            <Badge variant="outline" style={{ color: primaryColor, borderColor: primaryColor }}>
              {fullTemplate.category.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {onSelectTemplate && (
              <Button 
                onClick={() => onSelectTemplate(template)}
                style={{ backgroundColor: primaryColor, color: 'white' }}
              >
                Use This Template
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Pages</span>
            <div className="flex space-x-2">
              {fullTemplate.pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    index === currentPageIndex
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: index === currentPageIndex ? primaryColor : 'transparent'
                  }}
                >
                  {page.title}
                  <span className="ml-1 text-xs opacity-75">
                    {page.path}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={fullTemplate.pages.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPageIndex + 1} of {fullTemplate.pages.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={fullTemplate.pages.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Template Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-white">
            {/* Mock Navigation Bar */}
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <span className="text-xl font-bold" style={{ color: primaryColor }}>
                      Demo Dealership
                    </span>
                  </div>
                  <div className="flex space-x-8">
                    {fullTemplate.pages.map((page, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPageIndex(index)}
                        className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                          index === currentPageIndex ? 'border-b-2' : ''
                        }`}
                        style={{ 
                          borderColor: index === currentPageIndex ? primaryColor : 'transparent'
                        }}
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Page Content */}
            <main>
              {currentPage.blocks
                .sort((a, b) => a.order - b.order)
                .map(renderBlock)}
            </main>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}