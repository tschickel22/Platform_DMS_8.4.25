import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Plus, Globe, BarChart } from 'lucide-react'

export default function PropertyListings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property Listings</h1>
        <p className="text-muted-foreground">
          Manage property listings and marketing
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Create Listing
            </CardTitle>
            <CardDescription>
              Add new property listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Active Listings
            </CardTitle>
            <CardDescription>
              Currently published properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Performance
            </CardTitle>
            <CardDescription>
              Listing views and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">total views</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Listings Dashboard</CardTitle>
          <CardDescription>
            Manage all your property listings from one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No property listings created yet</p>
            <p className="text-sm">Create your first listing to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}