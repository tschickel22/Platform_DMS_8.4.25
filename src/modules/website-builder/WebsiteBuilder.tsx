import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Globe, Edit, Trash2, ExternalLink } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Site } from './types'
import { useToast } from '@/hooks/use-toast'
import { TemplateSelector } from './components/TemplateSelector'
import { CreateSiteDetailsModal } from './components/CreateSiteDetailsModal'
import { logger } from '@/utils/logger'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export default function WebsiteBuilder() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      setLoading(true)
      const sitesData = await websiteService.getSites()
      setSites(sitesData)
    } catch (error) {
      handleError(error, 'loading sites')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWebsiteClick = () => {
    setShowTemplateSelector(true)
  }

  const handleTemplateSelected = (template: any) => {
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    setShowDetailsModal(true)
  }

  const handleBackToTemplateSelection = () => {
    setShowDetailsModal(false)
    setShowTemplateSelector(true)
  }

  const handleCancelSiteCreation = () => {
    setSelectedTemplate(null)
    setShowTemplateSelector(false)
    setShowDetailsModal(false)
  }

  const handleCreateSite = async (siteName: string, siteSlug: string) => {
    try {
      setLoading(true)
      
      // Create site with selected template
      const newSite = await websiteService.createSite({
        name: siteName.trim(),
        slug: siteSlug.trim(),
        pages: selectedTemplate?.pages || [{
          id: 'home',
          title: 'Home',
          path: '/',
          blocks: [],
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }],
        theme: selectedTemplate?.theme || {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          fontFamily: 'Inter'
        },
        nav: selectedTemplate?.nav,
        brand: selectedTemplate?.brand
      })

      logger.userAction('website_created', { 
        siteId: newSite.id, 
        siteName,
        templateId: selectedTemplate?.id 
      })
      
      toast({
        title: 'Success',
        description: 'Website created successfully!'
      })
      
      // Reset state
      setSelectedTemplate(null)
      setShowDetailsModal(false)
      
      // Refresh sites list
      await loadSites()
      
      // Navigate to editor
      navigate(`/platform/website-builder/${newSite.id}`)
      
    } catch (error) {
      handleError(error, 'create_site')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return
    }

    try {
      await websiteService.deleteSite(siteId)
      toast({
        title: 'Success',
        description: 'Website deleted successfully'
      })
      await loadSites()
    } catch (error) {
      handleError(error, 'deleting website')
    }
  }

  const handlePreviewSite = (site: Site) => {
    const previewUrl = `/s/${site.slug}/`
    window.open(previewUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Website Builder</h1>
            <p className="text-muted-foreground">Create and manage websites</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded"></div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground">
            Create and manage websites for the platform
          </p>
        </div>
        <Button
          onClick={handleCreateWebsiteClick}
          className="ml-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Website
        </Button>
      </div>

      {/* Sites Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Card key={site.id} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                  <CardDescription>
                    {site.domain || `${site.slug}.renterinsight.com`}
                  </CardDescription>
                </div>
                <Badge variant={site.published ? 'default' : 'secondary'}>
                  {site.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Site Preview */}
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
                
                {/* Site Stats */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{site.pages?.length || 0} pages</span>
                  <span>Updated {new Date(site.updatedAt).toLocaleDateString()}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/platform/website-builder/${site.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreviewSite(site)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteSite(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State */}
        {sites.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create your first website to get started with the website builder.
              </p>
              <Button onClick={handleCreateWebsiteClick}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Website
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Template Selector */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelected}
          onCancel={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Create Site Details Modal */}
      {showDetailsModal && selectedTemplate && (
        <CreateSiteDetailsModal
          selectedTemplate={selectedTemplate}
          onCreateSite={handleCreateSite}
          onBackToTemplateSelection={handleBackToTemplateSelection}
          onCancel={handleCancelSiteCreation}
        />
      )}
    </div>
  )
}

export { WebsiteBuilder }