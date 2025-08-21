import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PublicListingView() {
  const { companySlug, listingId } = useParams()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Property Details
            </CardTitle>
            <CardDescription>
              Viewing property from {companySlug}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Property details will be displayed here</p>
              <p className="text-sm">Listing ID: {listingId}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}