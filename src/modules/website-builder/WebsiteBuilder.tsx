import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Plus } from 'lucide-react'

export default function WebsiteBuilder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Website Builder</h1>
        <p className="text-muted-foreground">
          Create and manage websites for your dealership
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Builder
          </CardTitle>
          <CardDescription>
            Build professional websites for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No websites yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first website to get started
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}