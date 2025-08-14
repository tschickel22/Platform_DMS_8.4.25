import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share2, FileText } from 'lucide-react'
import { BrochureErrorBoundary } from '../common/ErrorBoundary'

export function PublicBrochureView() {
  const { publicId } = useParams<{ publicId: string }>()

  return (
    <BrochureErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Property Brochure</h1>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Brochure Loading</h3>
                <p>Public brochure view for ID: {publicId}</p>
                <p className="text-sm mt-2">Full brochure rendering coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrochureErrorBoundary>
  )
}

export default PublicBrochureView