import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Home, DollarSign } from 'lucide-react'

export default function LandManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Land Management</h1>
        <p className="text-muted-foreground">
          Manage land inventory and home placement
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Add Land Parcel
            </CardTitle>
            <CardDescription>
              Register new land parcels for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Land
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Available Lots
            </CardTitle>
            <CardDescription>
              Ready for home placement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">lots available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Total Value
            </CardTitle>
            <CardDescription>
              Combined land inventory value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">inventory value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Land Inventory</CardTitle>
          <CardDescription>
            Manage your land parcels and development opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No land parcels registered yet</p>
            <p className="text-sm">Add land parcels to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}