import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function ListingDetail() {
  const { listingId } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listing Details</h1>
          <p className="text-muted-foreground">
            Viewing listing: {listingId}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Listing Information
          </CardTitle>
          <CardDescription>
            Detailed view of the property listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Listing details will be displayed here</p>
            <p className="text-sm">Listing ID: {listingId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}