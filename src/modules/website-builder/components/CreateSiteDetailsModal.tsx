import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Template {
  id: string
  name: string
  description: string
  preview?: string
  category?: string
}

interface CreateSiteDetailsModalProps {
  isOpen: boolean
  selectedTemplate: Template
  onCancel: () => void
  onBackToTemplateSelection: () => void
  onCreateSite: (data: { name: string; slug: string; template: Template }) => void
}

export function CreateSiteDetailsModal({
  isOpen,
  selectedTemplate,
  onCancel,
  onBackToTemplateSelection,
  onCreateSite
}: CreateSiteDetailsModalProps) {
  const [siteName, setSiteName] = useState('')
  const [siteSlug, setSiteSlug] = useState('')

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setSiteName(value)
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setSiteSlug(slug)
  }

  const handleCreate = () => {
    if (!siteName.trim() || !siteSlug.trim()) {
      return
    }

    onCreateSite({
      name: siteName.trim(),
      slug: siteSlug.trim(),
      template: selectedTemplate
    })
  }

  const isValid = siteName.trim().length > 0 && siteSlug.trim().length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Website</DialogTitle>
          <DialogDescription>
            Enter the details for your new website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Template Preview */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground mb-2">Selected Template:</div>
              <div className="font-medium">{selectedTemplate.name}</div>
              <div className="text-sm text-muted-foreground">{selectedTemplate.description}</div>
            </CardContent>
          </Card>

          {/* Website Details Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Website Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Awesome Website"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="siteSlug">Website Address</Label>
              <Input
                id="siteSlug"
                value={siteSlug}
                onChange={(e) => setSiteSlug(e.target.value)}
                placeholder="my-awesome-website"
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Used in the website URL (letters, numbers, and hyphens only)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onBackToTemplateSelection}
            >
              Change Template
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!isValid}
              >
                Create Website
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSiteDetailsModal