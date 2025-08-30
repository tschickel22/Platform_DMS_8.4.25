import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

export default function WarrantyMgmt() {
  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">Warranty Management</h1>
        <p className="ri-page-description">
          Manage warranty claims and manufacturer relationships
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Warranty Management
          </CardTitle>
          <CardDescription>
            Warranty management features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Warranty management module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}