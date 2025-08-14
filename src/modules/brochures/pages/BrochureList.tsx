import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Download, Share, Edit, Trash2 } from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureErrorBoundary } from '../common/ErrorBoundary'

export function BrochureList() {
  const { templates, loading, createTemplate, deleteTemplate } = useBrochureStore()

  const handleCreateTemplate = () => {
    createTemplate({
      name: 'New Brochure Template',
      description: 'A new brochure template',
      blocks: [],
      theme: {
        id: 'default',
        name: 'Default Theme',
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#10b981',
          background: '#ffffff',
          text: '#1f2937'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brochures</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <BrochureErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brochures</h1>
            <p className="text-muted-foreground">
              Create and manage marketing brochures for your listings
            </p>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Brochure
          </Button>
        </div>

        {templates.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No brochures yet</h3>
                <p className="mb-4">Create your first brochure template to get started</p>
                <Button onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Brochure
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BrochureErrorBoundary>
  )
}

export default BrochureList