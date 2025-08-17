import React, { useState } from 'react'
import { WebsiteTemplate, websiteTemplates } from '../utils/templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: WebsiteTemplate) => void
}

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const handleTemplateSelect = (template: WebsiteTemplate) => {
    setSelectedTemplate(template)
    setCurrentPageIndex(0)
  }

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedTemplate(null)
    setCurrentPageIndex(0)
    onClose()
  }

  const nextPage = () => {
    if (selectedTemplate && currentPageIndex < selectedTemplate.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const currentPage = selectedTemplate?.pages[currentPageIndex]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {selectedTemplate ? selectedTemplate.name : 'Choose a Template'}
              </DialogTitle>
              {selectedTemplate && (
                <p className="text-muted-foreground mt-1">
                  {selectedTemplate.description}
                </p>
              )}
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!selectedTemplate ? (
            // Template selection view
            <div className="p-6 h-full overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websiteTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        <img 
                          src={template.previewImage} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Template preview view
            <div className="flex h-full">
              {/* Left sidebar - Pages list */}
              <div className="w-64 border-r bg-muted/30 p-4">
                <h3 className="font-semibold mb-4">Pages</h3>
                <div className="space-y-2">
                  {selectedTemplate.pages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPageIndex(index)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        index === currentPageIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm opacity-70">{page.path}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main preview area */}
              <div className="flex-1 flex flex-col">
                {/* Preview header */}
                <div className="border-b p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Templates
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        {currentPageIndex + 1} of {selectedTemplate.pages.length}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPageIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPageIndex === selectedTemplate.pages.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preview content */}
                <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                  <div className="bg-white rounded-lg shadow-sm min-h-full">
                    {currentPage && (
                      <div className="p-8">
                        <h1 className="text-3xl font-bold mb-6" style={{ color: selectedTemplate.theme.primaryColor }}>
                          {currentPage.title}
                        </h1>
                        <div className="space-y-8">
                          {currentPage.blocks
                            .sort((a, b) => a.order - b.order)
                            .map((block, blockIndex) => (
                              <div key={blockIndex} className="border-l-4 border-gray-200 pl-4">
                                <div className="text-sm font-medium text-gray-500 mb-2">
                                  {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
                                </div>
                                {block.type === 'hero' && (
                                  <div className="bg-gray-900 text-white p-8 rounded-lg">
                                    <h2 className="text-4xl font-bold mb-4">{block.content.title}</h2>
                                    {block.content.subtitle && (
                                      <p className="text-xl mb-6">{block.content.subtitle}</p>
                                    )}
                                    {block.content.ctaText && (
                                      <button 
                                        className="px-6 py-3 rounded-lg font-semibold"
                                        style={{ backgroundColor: selectedTemplate.theme.primaryColor }}
                                      >
                                        {block.content.ctaText}
                                      </button>
                                    )}
                                  </div>
                                )}
                                {block.type === 'text' && (
                                  <div 
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: block.content.html }}
                                  />
                                )}
                                {block.type === 'inventory' && (
                                  <div>
                                    <h3 className="text-2xl font-bold mb-6">{block.content.title}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {block.content.items?.slice(0, 3).map((item: any, itemIndex: number) => (
                                        <div key={itemIndex} className="border rounded-lg overflow-hidden">
                                          <img 
                                            src={item.image} 
                                            alt={item.title}
                                            className="w-full h-32 object-cover"
                                          />
                                          <div className="p-4">
                                            <h4 className="font-semibold">{item.title}</h4>
                                            <p className="text-lg font-bold" style={{ color: selectedTemplate.theme.primaryColor }}>
                                              ${item.price?.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {block.type === 'cta' && (
                                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                                    <h3 className="text-2xl font-bold mb-4">{block.content.title}</h3>
                                    <p className="text-gray-600 mb-6">{block.content.description}</p>
                                    <button 
                                      className="px-8 py-3 rounded-lg font-semibold text-white"
                                      style={{ backgroundColor: selectedTemplate.theme.primaryColor }}
                                    >
                                      {block.content.buttonText}
                                    </button>
                                  </div>
                                )}
                                {block.type === 'contact' && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                      <h3 className="text-2xl font-bold mb-4">{block.content.title}</h3>
                                      <p className="text-gray-600 mb-6">{block.content.description}</p>
                                      <div className="space-y-2">
                                        <p><strong>Phone:</strong> {block.content.phone}</p>
                                        <p><strong>Email:</strong> {block.content.email}</p>
                                        <p><strong>Address:</strong> {block.content.address}</p>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                      <h4 className="font-semibold mb-4">Contact Form</h4>
                                      <div className="space-y-3">
                                        <input 
                                          type="text" 
                                          placeholder="Your Name" 
                                          className="w-full p-2 border rounded"
                                          disabled
                                        />
                                        <input 
                                          type="email" 
                                          placeholder="Your Email" 
                                          className="w-full p-2 border rounded"
                                          disabled
                                        />
                                        <textarea 
                                          placeholder="Your Message" 
                                          rows={3}
                                          className="w-full p-2 border rounded"
                                          disabled
                                        />
                                        <button 
                                          className="w-full p-2 rounded font-semibold text-white"
                                          style={{ backgroundColor: selectedTemplate.theme.primaryColor }}
                                          disabled
                                        >
                                          Send Message
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="border-t p-4 bg-background">
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection}>
                      Use This Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}