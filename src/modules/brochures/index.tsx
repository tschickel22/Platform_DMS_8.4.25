import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'

export function BrochureList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brochures</h1>
        <p className="text-muted-foreground">
          Create and manage marketing brochures
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Brochures
          </CardTitle>
          <CardDescription>
            Design professional brochures for your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No brochures yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first brochure to get started
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Brochure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function BrochureTemplateEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brochure Template Editor</h1>
        <p className="text-muted-foreground">
          Design and customize brochure templates
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Brochure template editor coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PublicBrochureView() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Brochure View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Public brochure view coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}