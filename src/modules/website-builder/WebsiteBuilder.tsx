import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Plus, Settings } from 'lucide-react'

export default function WebsiteBuilder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Builder</h1>
        <p className="text-muted-foreground">
          Create and manage websites for your dealership
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Create New Website
            </CardTitle>
            <CardDescription>
              Build a professional website for your dealership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Start Building
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Website Settings
            </CardTitle>
            <CardDescription>
              Manage your website configuration and domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Manage Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}