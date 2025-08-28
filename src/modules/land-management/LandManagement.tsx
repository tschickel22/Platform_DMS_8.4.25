import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export default function LandManagement() {
  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">Land Management</h1>
        <p className="ri-page-description">
          Manage land inventory and lot assignments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Land Management
          </CardTitle>
          <CardDescription>
            Land management features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Land management module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}