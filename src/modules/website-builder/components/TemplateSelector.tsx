import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge' 
import { ArrowRight, Globe, Palette, Layout } from 'lucide-react'
import { SiteTemplate } from '../types'
import { getTemplates } from '../utils/templates'

interface TemplateSelectorProps {
  onSelectTemplate: (template: SiteTemplate) => void
  onCancel: () => void
}

export default function TemplateSelector({ onSelectTemplate, onCancel }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<SiteTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const templateData = await getTemplates()
      setTemplates(templateData)
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template: SiteTemplate) => {
    onSelectTemplate(template)
  }

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Loading templates...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to get started with your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary">
                      {template.category}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Preview */}
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Preview</p>
                    </div>
                  </div>

                  {/* Template Features */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Layout className="h-4 w-4 mr-2" />
                      {template.pages?.length || 0} pages
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Palette className="h-4 w-4 mr-2" />
                      Customizable theme
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => handleTemplateSelect(template)}
                      className="flex-1"
                    >
                      Use This Template
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}