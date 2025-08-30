import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe } from 'lucide-react'

function WebsiteBuilderPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">Website Builder</h1>
        <p className="ri-page-description">
          Create and manage company websites
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Builder
          </CardTitle>
          <CardDescription>
            Website builder features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Website builder module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function WebsiteBuilderRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<WebsiteBuilderPlaceholder />} />
    </Routes>
  )
}

export function CompanyWebsiteRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<WebsiteBuilderPlaceholder />} />
    </Routes>
  )
}