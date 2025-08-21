import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, MapPin } from 'lucide-react'

export function PublicCatalogView() {
  const { companySlug, token } = useParams()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Property Catalog</h1>
          <p className="text-muted-foreground">
            Browse available properties from {companySlug}
          </p>
          {token && (
            <p className="text-xs text-muted-foreground mt-2">
              Viewing with token: {token}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Available Properties
            </CardTitle>
            <CardDescription>
              Public property catalog view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No properties available</p>
              <p className="text-sm">Check back later for new listings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}