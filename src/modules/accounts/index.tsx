import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export default function AccountsModule() {
  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">Accounts</h1>
        <p className="ri-page-description">
          Manage customer and business accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Account Management
          </CardTitle>
          <CardDescription>
            Account management features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Accounts module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}