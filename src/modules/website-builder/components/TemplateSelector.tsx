import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Palette } from 'lucide-react'
import { getWebsiteTemplates, WebsiteTemplate } from '../utils/templates'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface TemplateSelectorProps {
  onSelectTemplate: (template: WebsiteTemplate) => void
  onCancel: () => void
}

export default function TemplateSelector({ onSelectTemplate, onCancel }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null)
  const { handleError } = useErrorHandler()

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true)
        const templateData = await getWebsiteTemplates()
        setTemplates(templateData)
      } catch (error) {
        handleError(error, 'loading templates')
        // Provide fallback templates if loading fails
        setTemplates([
          {
            id: 'blank',
            name: 'Blank Template',
            description: 'Start with a clean slate',
            category: 'Basic',
            preview: '',
            theme: {
              primaryColor: '#3b82f6',
              secondaryColor: '#64748b',
              fontFamily: 'Inter'
            },
            pages: [
              {
                id: 'home',
                title: 'Home',
                path: '/',
                blocks: [],
                isVisible: true,
                order: 0
              }
            ],
            nav: {
              manufacturersMenu: {
                enabled: false,
                label: 'Manufacturers',
                items: []
              }
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [handleError])

  const handleUseTemplate = (template: WebsiteTemplate) => {
    try {
      // Validate template before using
      if (!template || !template.id) {
        throw new Error('Invalid template selected')
      }

      // Ensure template has required properties
      const validatedTemplate: WebsiteTemplate = {
        id: template.id,
        name: template.name || 'Untitled Template',
        description: template.description || '',
        category: template.category || 'General',
        preview: template.preview || '',
        theme: template.theme || {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          fontFamily: 'Inter'
        },
        pages: template.pages || [
          {
            id: 'home',
            title: 'Home',
            path: '/',
            blocks: [],
            isVisible: true,
            order: 0
          }
        ],
        nav: template.nav || {
          manufacturersMenu: {
            enabled: false,
            label: 'Manufacturers',
            items: []
          }
        }
      }

      onSelectTemplate(validatedTemplate)
    } catch (error) {
      handleError(error, 'selecting template')
    }
  }

  const handlePreviewTemplate = (template: WebsiteTemplate) => {
    try {
      setSelectedTemplate(template)
      // In a real implementation, this might open a preview modal
      console.log('Preview template:', template.name)
    } catch (error) {
      handleError(error, 'previewing template')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Choose a Template</h1>
            <p className="text-muted-foreground">Select a template to get started with your website</p>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Choose a Template</h1>
          <p className="text-muted-foreground">Select a template to get started with your website</p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Template Preview */}
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                {template.preview ? (
                  <img 
                    src={template.preview} 
                    alt={`${template.name} preview`}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Palette className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Template Preview</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1 group-hover:bg-primary group-hover:text-white"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePreviewTemplate(template)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start Blank Option */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Palette className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Start from Scratch</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create a completely custom website without any pre-built template
          </p>
          <Button 
            variant="outline"
            onClick={() => handleUseTemplate({
              id: 'blank',
              name: 'Blank Template',
              description: 'Start with a clean slate',
              category: 'Basic',
              preview: '',
              theme: {
                primaryColor: '#3b82f6',
                secondaryColor: '#64748b',
                fontFamily: 'Inter'
              },
              pages: [
                {
                  id: 'home',
                  title: 'Home',
                  path: '/',
                  blocks: [],
                  isVisible: true,
                  order: 0
                }
              ],
              nav: {
                manufacturersMenu: {
                  enabled: false,
                  label: 'Manufacturers',
                  items: []
                }
              }
            })}
          >
            Start Blank
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}