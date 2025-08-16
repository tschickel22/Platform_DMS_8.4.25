import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Globe, Edit, Trash2, ExternalLink } from 'lucide-react'
import { useSite } from './hooks/useSite'
import { siteTemplates } from './utils/templates'
import { Site } from './types'

interface WebsiteBuilderShellProps {
  mode: 'platform' | 'company'
}

export function WebsiteBuilderShell({ mode }: WebsiteBuilderShellProps) {
  const navigate = useNavigate()
  const { sites, loading, createSite, deleteSite } = useSite()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })

  const handleCreateSite = async () => {
    if (!formData.name.trim()) return

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
    
    let siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      slug,
      pages: [
        {
          title: 'Home',
          path: '/',
          blocks: [],
          isVisible: true,
          order: 0
        }
      ],
      nav: {
        manufacturersMenu: {
          enabled: false,
          label: 'Manufacturers',
          items: [],
          allowCustom: true
        }
      },
      seo: {
        siteDefaults: {
          title: formData.name
        },
        pages: {}
      },
      tracking: {}
    }

    // Apply template if selected
    if (selectedTemplate) {
      const template = siteTemplates.find(t => t.id === selectedTemplate)
      if (template) {
        siteData = {
          ...siteData,
          pages: template.pages.map((page, index) => ({
            ...page,
            id: `page-${Date.now()}-${index}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })),
          theme: template.theme,
          nav: template.nav
        }
      }
    }

    const newSite = await createSite(siteData)
    if (newSite) {
      setShowCreateDialog(false)
      setShowTemplateDialog(false)
      setFormData({ name: '', slug: '' })
      setSelectedTemplate('')
      navigate(`/${mode === 'platform' ? 'platform/website-builder' : 'company/settings/website'}/${newSite.id}`)
    }
  }

  const handleDeleteSite = async (site: Site) => {
    if (confirm(`Are you sure you want to delete "${site.name}"?`)) {
      await deleteSite(site.id)
    }
  }

  const openSite = (site: Site) => {
    navigate(`/${mode === 'platform' ? 'platform/website-builder' : 'company/settings/website'}/${site.id}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2" />
          <div className="h-4 bg-muted rounded w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === 'platform' ? 'Website Builder' : 'Website Editor'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'platform' 
              ? 'Create and manage websites for the platform'
              : 'Edit your company website'
            }
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="site-name">Website Name</Label>
                <Input
                  id="site-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Website"
                />
              </div>
              <div>
                <Label htmlFor="site-slug">Website Address</Label>
                <Input
                  id="site-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="my-awesome-website"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in the website URL (letters, numbers, and hyphens only)
                </p>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateDialog(true)}
                >
                  Choose Template
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSite}>
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first website to get started with the builder
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Website
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                  <Badge variant="outline">
                    {site.pages.length} pages
                  </Badge>
                </div>
                <CardDescription>
                  {site.slug}.renterinsight.com
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Updated {new Date(site.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`/s/${site.slug}/`, '_blank')
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openSite(site)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSite(site)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card 
              className={`cursor-pointer transition-colors ${
                selectedTemplate === '' ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
              }`}
              onClick={() => setSelectedTemplate('')}
            >
              <CardContent className="p-6 text-center">
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">Blank</span>
                </div>
                <h3 className="font-semibold">Start from Scratch</h3>
                <p className="text-sm text-muted-foreground">
                  Build your website from a blank canvas
                </p>
              </CardContent>
            </Card>
            
            {siteTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {template.category.replace('_', ' ')}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowTemplateDialog(false)}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}