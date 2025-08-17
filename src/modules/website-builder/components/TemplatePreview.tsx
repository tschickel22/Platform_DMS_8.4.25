import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { WebsiteTemplate } from '../utils/templates'

interface TemplatePreviewProps {
  template: WebsiteTemplate | null
  isOpen: boolean
  onClose: () => void
  onSelect?: (template: WebsiteTemplate) => void
  templates?: WebsiteTemplate[]
}

export function TemplatePreview({ 
  template, 
  isOpen, 
  onClose, 
  onSelect,
  templates = []
}: TemplatePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const [currentTemplateIndex, setCurrentTemplateIndex] = React.useState(0)

  React.useEffect(() => {
    if (template && templates.length > 0) {
      const index = templates.findIndex(t => t.id === template.id)
      setCurrentTemplateIndex(index >= 0 ? index : 0)
    }
  }, [template, templates])

  React.useEffect(() => {
    setCurrentPageIndex(0)
  }, [template])

  if (!template) return null

  const currentTemplate = templates[currentTemplateIndex] || template
  const currentPage = currentTemplate.pages[currentPageIndex]

  const nextTemplate = () => {
    if (currentTemplateIndex < templates.length - 1) {
      setCurrentTemplateIndex(prev => prev + 1)
    }
  }

  const prevTemplate = () => {
    if (currentTemplateIndex > 0) {
      setCurrentTemplateIndex(prev => prev - 1)
    }
  }

  const nextPage = () => {
    if (currentPageIndex < currentTemplate.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1)
    }
  }

  const handleSelect = () => {
    if (onSelect) {
      onSelect(currentTemplate)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Template Preview</DialogTitle>
        </DialogHeader>
        
        {/* Custom header with navigation */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">{currentTemplate.name}</h2>
            <span className="text-sm text-muted-foreground capitalize">
              {currentTemplate.category.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {templates.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTemplate}
                  disabled={currentTemplateIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentTemplateIndex + 1} of {templates.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTemplate}
                  disabled={currentTemplateIndex === templates.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar with pages */}
          <div className="w-64 border-r bg-muted/30 p-4">
            <h3 className="font-medium mb-4">Pages</h3>
            <div className="space-y-2">
              {currentTemplate.pages.map((page, index) => (
                <button
                  key={page.path}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                    index === currentPageIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-xs opacity-70">{page.path}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main preview area */}
          <div className="flex-1 overflow-auto">
            <div className="min-h-full bg-white">
              {/* Mock website header */}
              <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                      <div 
                        className="h-8 w-8 rounded flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: currentTemplate.theme.primaryColor }}
                      >
                        D
                      </div>
                      <span className="ml-2 font-semibold">Demo Dealership</span>
                    </div>
                    <div className="flex space-x-8">
                      {currentTemplate.pages.map((page, index) => (
                        <button
                          key={page.path}
                          onClick={() => setCurrentPageIndex(index)}
                          className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                            index === currentPageIndex ? 'border-b-2' : ''
                          }`}
                          style={{ 
                            borderColor: index === currentPageIndex ? currentTemplate.theme.primaryColor : 'transparent'
                          }}
                        >
                          {page.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Page content */}
              <div className="min-h-screen">
                {currentPage?.blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block, index) => (
                    <div key={index}>
                      {renderTemplateBlock(block, currentTemplate.theme.primaryColor)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="border-t p-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {currentTemplate.description}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {onSelect && (
              <Button onClick={handleSelect}>
                Use This Template
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function renderTemplateBlock(block: any, primaryColor: string) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="relative bg-gray-900 text-white">
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

    case 'landHome':
      return (
        <section className="py-16 bg-gray-50">
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

    case 'contact':
      return (
        <section className="py-16 bg-gray-50">
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
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    disabled
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    disabled
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    disabled
                  ></textarea>
                  <button 
                    className="w-full px-6 py-3 font-semibold rounded-md transition-colors"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                    disabled
                  >
                    Send Message
                  </button>
                </div>
              </div>
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
                    className="w-full h-64 object-cover rounded-lg shadow-md"
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
        <div className="py-8 px-4 bg-yellow-50 border border-yellow-200">
          <p className="text-center text-yellow-800">
            Unknown block type: {block.type}
          </p>
        </div>
      )
  }
}