import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, X, Globe } from 'lucide-react'
import { SiteTemplate } from '../types'

interface CreateSiteDetailsModalProps {
  selectedTemplate: SiteTemplate
  onCreateSite: (siteData: { name: string; slug: string }) => Promise<void>
  onBackToTemplateSelection: () => void
  onCancel: () => void
  isCreating: boolean
}

export default function CreateSiteDetailsModal({
  selectedTemplate,
  onCreateSite,
  onBackToTemplateSelection,
  onCancel,
  isCreating
}: CreateSiteDetailsModalProps) {
  const [siteName, setSiteName] = useState('')
  const [siteSlug, setSiteSlug] = useState('')
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({})

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setSiteName(value)
    if (!siteSlug || siteSlug === generateSlug(siteName)) {
      setSiteSlug(generateSlug(value))
    }
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }))
    }
  }

  const handleSlugChange = (value: string) => {
    const cleanSlug = generateSlug(value)
    setSiteSlug(cleanSlug)
    // Clear slug error when user starts typing
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: undefined }))
    }
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const validateForm = (): boolean => {
    const newErrors: { name?: string; slug?: string } = {}

    if (!siteName.trim()) {
      newErrors.name = 'Website name is required'
    }

    if (!siteSlug.trim()) {
      newErrors.slug = 'Website address is required'
    } else if (!/^[a-z0-9-]+$/.test(siteSlug)) {
      newErrors.slug = 'Website address can only contain lowercase letters, numbers, and hyphens'
    } else if (siteSlug.length < 3) {
      newErrors.slug = 'Website address must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await onCreateSite({
      name: siteName.trim(),
      slug: siteSlug.trim()
    })
  }

  return (
    <Dialog open={true} onOpenChange={() => !isCreating && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Website</DialogTitle>
          <DialogDescription>
            Enter your website details to create your new site
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Template Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Template</CardTitle>
              <CardDescription>
                {selectedTemplate.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-24 bg-muted rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.pages?.length || 0} pages included
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Site Details Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Website Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Dealership Website"
                disabled={isCreating}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteSlug">Website Address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="siteSlug"
                  value={siteSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-dealership"
                  disabled={isCreating}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  .renterinsight.com
                </span>
              </div>
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be your website's address. You can set up a custom domain later.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBackToTemplateSelection}
                disabled={isCreating}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Template
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Website'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}