import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import { WebsiteTemplate, TemplatePageDefinition } from '../utils/templates'

interface TemplatePreviewProps {
  template: WebsiteTemplate
  onSelect: (template: WebsiteTemplate) => void
  onClose: () => void
}

export function TemplatePreview({ template, onSelect, onClose }: TemplatePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const currentPage = template.pages[currentPageIndex]

  const nextPage = () => {
    setCurrentPageIndex((prev) => (prev + 1) % template.pages.length)
  }

  const prevPage = () => {
    setCurrentPageIndex((prev) => (prev - 1 + template.pages.length) % template.pages.length)
  }

  const renderBlockPreview = (block: any) => {
    const primaryColor = template.theme.primaryColor

    switch (block.type) {
      case 'hero':
        return (
          <div 
            key={block.order}
            className="relative bg-gray-900 text-white p-8 rounded-lg mb-4"
            style={{
              backgroundImage: block.content.backgroundImage ? `url(${block.content.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {block.content.backgroundImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            )}
            <div className="relative text-center">
              {block.content.title && (
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  {block.content.title}
                </h1>
              )}
              {block.content.subtitle && (
                <p className="text-lg mb-6 text-gray-200">
                  {block.content.subtitle}
                </p>
              )}
              {block.content.ctaText && (
                <button 
                  className="px-6 py-2 font-semibold rounded-lg"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  {block.content.ctaText}
                </button>
              )}
            </div>
          </div>
        )

      case 'text':
        return (
          <div 
            key={block.order}
            className={`prose prose-sm max-w-none mb-4 ${block.content.alignment || 'text-left'}`}
            dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text || '' }}
          />
        )

      case 'inventory':
        return (
          <div key={block.order} className="mb-6">
            {block.content.title && (
              <h2 className="text-xl font-bold text-center mb-4">{block.content.title}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(block.content.items || []).slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="bg-white border rounded-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-lg font-bold" style={{ color: primaryColor }}>
                      ${item.price?.toLocaleString()}
                    </p>
                    <div className="text-xs text-gray-600 mt-2">
                      {item.specs && Object.entries(item.specs).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'landHome':
        return (
          <div key={block.order} className="mb-6">
            {block.content.title && (
              <h2 className="text-xl font-bold text-center mb-4">{block.content.title}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(block.content.packages || []).slice(0, 2).map((pkg: any, index: number) => (
                <div key={index} className="bg-white border rounded-lg overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{pkg.title}</h3>
                    <p className="text-lg font-bold" style={{ color: primaryColor }}>
                      ${pkg.price?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">{pkg.description}</p>
                    <ul className="text-xs space-y-1">
                      {(pkg.features || []).slice(0, 3).map((feature: string, i: number) => (
                        <li key={i} className="flex items-center">
                          <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'contact':
        return (
          <div key={block.order} className="bg-gray-50 p-6 rounded-lg mb-4">
            {block.content.title && (
              <h2 className="text-xl font-bold text-center mb-4">{block.content.title}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {block.content.phone && (
                  <div className="flex items-center text-sm">
                    <span className="font-semibold mr-2">Phone:</span>
                    <span>{block.content.phone}</span>
                  </div>
                )}
                {block.content.email && (
                  <div className="flex items-center text-sm">
                    <span className="font-semibold mr-2">Email:</span>
                    <span>{block.content.email}</span>
                  </div>
                )}
                {block.content.address && (
                  <div className="flex items-start text-sm">
                    <span className="font-semibold mr-2">Address:</span>
                    <span>{block.content.address}</span>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-3 py-2 text-sm border rounded"
                    disabled
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-3 py-2 text-sm border rounded"
                    disabled
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={3}
                    className="w-full px-3 py-2 text-sm border rounded"
                    disabled
                  ></textarea>
                  <button 
                    className="w-full px-4 py-2 text-sm font-semibold rounded"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                    disabled
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'cta':
        return (
          <div 
            key={block.order}
            className="text-center p-6 rounded-lg mb-4"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            {block.content.title && (
              <h2 className="text-xl font-bold mb-2">{block.content.title}</h2>
            )}
            {block.content.description && (
              <p className="text-gray-600 mb-4">{block.content.description}</p>
            )}
            {block.content.buttonText && (
              <button 
                className="px-6 py-2 font-semibold rounded-lg"
                style={{ backgroundColor: primaryColor, color: 'white' }}
              >
                {block.content.buttonText}
              </button>
            )}
          </div>
        )

      case 'gallery':
        return (
          <div key={block.order} className="mb-6">
            {block.content.title && (
              <h2 className="text-xl font-bold text-center mb-4">{block.content.title}</h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(block.content.images || []).slice(0, 6).map((image: any, index: number) => (
                <div key={index} className="relative">
                  <img 
                    src={image.src} 
                    alt={image.alt || ''} 
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div key={block.order} className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
            <p className="text-center text-yellow-800 text-sm">
              {block.type} block
            </p>
          </div>
        )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold">{template.name}</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {template.category.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={template.pages.length <= 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPageIndex + 1} of {template.pages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={template.pages.length <= 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Page Navigation Sidebar */}
          <div className="w-48 border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="font-semibold text-sm mb-3">Pages</h3>
            <div className="space-y-1">
              {template.pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    index === currentPageIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {page.title}
                  <div className="text-xs opacity-70">{page.path}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Mock Navigation */}
            <div className="bg-white border-b p-4 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm mr-3"
                    style={{ backgroundColor: template.theme.primaryColor }}
                  >
                    {template.name.charAt(0)}
                  </div>
                  <span className="font-semibold">Demo Dealership</span>
                </div>
                <div className="flex space-x-4 text-sm">
                  {template.pages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPageIndex(index)}
                      className={`px-2 py-1 rounded transition-colors ${
                        index === currentPageIndex
                          ? 'border-b-2'
                          : 'hover:text-gray-600'
                      }`}
                      style={{ 
                        borderColor: index === currentPageIndex ? template.theme.primaryColor : 'transparent'
                      }}
                    >
                      {page.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Content Preview */}
            <div className="p-6 bg-gray-50 min-h-96">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{currentPage.title}</h2>
                    <Badge variant="outline">{currentPage.path}</Badge>
                  </div>
                  
                  {/* Render page blocks */}
                  <div className="space-y-4">
                    {currentPage.blocks
                      .sort((a, b) => a.order - b.order)
                      .map(renderBlockPreview)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{template.description}</p>
            <p>Includes {template.pages.length} pages with full content</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSelect(template)}>
              Use This Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}