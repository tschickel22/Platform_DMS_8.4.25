import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrochureErrorBoundary } from '../common/ErrorBoundary'

export function BrochureTemplateEditor() {
  const navigate = useNavigate()

  return (
    <BrochureErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/brochures')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brochures
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Brochure Template Editor</h1>
              <p className="text-muted-foreground">
                Create and customize brochure templates
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Block Library */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Block Library</CardTitle>
                <CardDescription>
                  Drag blocks to build your brochure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <p className="font-medium">Hero Section</p>
                    <p className="text-sm text-muted-foreground">Title and main image</p>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <p className="font-medium">Photo Gallery</p>
                    <p className="text-sm text-muted-foreground">Image showcase</p>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <p className="font-medium">Specifications</p>
                    <p className="text-sm text-muted-foreground">Technical details</p>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <p className="font-medium">Pricing</p>
                    <p className="text-sm text-muted-foreground">Price and financing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Template Canvas</CardTitle>
                <CardDescription>
                  Design your brochure layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium mb-2">Start Building Your Brochure</p>
                    <p>Drag blocks from the library to begin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BrochureErrorBoundary>
  )
}

export default BrochureTemplateEditor