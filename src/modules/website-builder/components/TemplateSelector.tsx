import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, FileText, Globe, Star, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { websiteTemplates, WebsiteTemplate } from '../utils/templates'
import { TemplatePreview } from './TemplatePreview'

interface TemplateSelectorProps {
  onSelectTemplate: (template: WebsiteTemplate) => void
  onStartBlank: () => void
}

export function TemplateSelector({ onSelectTemplate, onStartBlank }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewPageIndex, setPreviewPageIndex] = useState(0)

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'rv_dealer', label: 'RV Dealers' },
    { value: 'manufactured_home', label: 'Manufactured Homes' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'general', label: 'General' }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? websiteTemplates 
    : websiteTemplates.filter(template => template.category === selectedCategory)

  const handlePreview = (template: WebsiteTemplate) => {
    setPreviewTemplate(template)
    setPreviewPageIndex(0)
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setPreviewTemplate(null)
    setPreviewPageIndex(0)
  }

  const handleSelectFromPreview = () => {
    if (previewTemplate) {
      onSelectTemplate(previewTemplate)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rv_dealer':
        return <Globe className="h-5 w-5" />
      case 'manufactured_home':
        return <FileText className="h-5 w-5" />
      case 'luxury':
        return <Star className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rv_dealer':
        return 'bg-blue-100 text-blue-800'
      case 'manufactured_home':
        return 'bg-green-100 text-green-800'
      case 'luxury':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Choose a Template</h1>
          <p className="text-muted-foreground">
            Start with a professionally designed template or build from scratch
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start from Scratch Option */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg">Start from Scratch</CardTitle>
              <CardDescription>
                Build your website from a blank canvas with complete creative control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onStartBlank}
              >
                Start Blank
              </Button>
            </CardContent>
          </Card>

          {/* Template Cards */}
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
              <div className="relative">
                <img 
                  src={template.previewImage} 
                  alt={template.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getCategoryColor(template.category)}>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(template.category)}
                      <span className="capitalize">{template.category.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {template.pages.length} pages
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{template.pages.length} pages included</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: template.theme.primaryColor }}
                    ></div>
                    <span>{template.theme.fontFamily}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Page List */}
                <div>
                  <p className="text-sm font-medium mb-2">Included Pages:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.pages.slice(0, 4).map((page, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {page.title}
                      </Badge>
                    ))}
                    {template.pages.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.pages.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 group-hover:border-primary group-hover:text-primary"
                    onClick={() => handlePreview(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 group-hover:bg-primary group-hover:text-white"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-7xl w-full max-h-[95vh] p-0" onEscapeKeyDown={handleClosePreview}>
          <DialogHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">
                  {previewTemplate?.name} Preview
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Navigate through all pages to see the complete template
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSelectFromPreview}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClosePreview}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex h-[calc(95vh-120px)]">
            {/* Page Navigation Sidebar */}
            <div className="w-64 border-r bg-gray-50 p-4">
              <h3 className="font-semibold mb-3">Pages</h3>
              <div className="space-y-1">
                {previewTemplate?.pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewPageIndex(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      index === previewPageIndex
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
              
              {/* Page Navigation Controls */}
              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPageIndex(Math.max(0, previewPageIndex - 1))}
                  disabled={previewPageIndex === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPageIndex(Math.min((previewTemplate?.pages.length || 1) - 1, previewPageIndex + 1))}
                  disabled={previewPageIndex >= (previewTemplate?.pages.length || 1) - 1}
                  className="flex-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="flex-1 overflow-auto">
              {previewTemplate && (
                <TemplatePreview 
                  template={previewTemplate}
                  pageIndex={previewPageIndex}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


export default TemplateSelector