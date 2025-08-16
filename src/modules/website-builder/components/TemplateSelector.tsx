import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, FileText, Globe, Star } from 'lucide-react'
import { websiteTemplates, WebsiteTemplate } from '../utils/templates'
import { TemplatePreview } from './TemplatePreview'

interface TemplateSelectorProps {
  onSelectTemplate: (template: WebsiteTemplate) => void
  onStartBlank: () => void
}

export function TemplateSelector({ onSelectTemplate, onStartBlank }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null)

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
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={template.previewImage} 
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getCategoryColor(template.category)}>
                  <div className="flex items-center space-x-1">
                    {getCategoryIcon(template.category)}
                    <span className="capitalize">{template.category.replace('_', ' ')}</span>
                  </div>
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
                  {template.pages.map((page, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {page.title}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm"
                  className="flex-1"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onSelect={onSelectTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  )
}