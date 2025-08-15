import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function ListingPreviewsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Listing Previews & Share Links</h3>
        <p className="text-sm text-muted-foreground">
          This feature has been moved to Platform Admin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Moved</CardTitle>
          <CardDescription>
            Share links and listing previews are now managed in Platform Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              This feature is now available in Platform Admin → Syndication Settings
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/admin'}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Platform Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}