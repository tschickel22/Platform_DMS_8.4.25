import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HardHat } from 'lucide-react'

export default function ContractorManagement() {
  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">Contractor Management</h1>
        <p className="ri-page-description">
          Manage contractors and service providers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardHat className="h-5 w-5" />
            Contractor Management
          </CardTitle>
          <CardDescription>
            Contractor management features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <HardHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Contractor management module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}