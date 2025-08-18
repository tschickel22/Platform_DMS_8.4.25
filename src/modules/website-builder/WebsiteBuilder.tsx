import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Globe, Settings, Eye } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Site, SiteTemplate } from './types'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/utils/logger'
import TemplateSelector from './components/TemplateSelector'
import CreateSiteDetailsModal from './components/CreateSiteDetailsModal'

export default function WebsiteBuilder() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<SiteTemplate | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [creating, setCreating] = useState(false)
  
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { toast } = useToast()

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
    logger.userAction('website_builder_create_clicked')
    setShowTemplateSelector(true)
  }

  const handleTemplateSelected = (template: SiteTemplate) => {
    logger.userAction('template_selected', { templateId: template.id })
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    setShowDetailsModal(true)
  }

  const handleTemplateSelectorCancel = () => {
    setShowTemplateSelector(false)
    setSelectedTemplate(null)
  }

  const handleDetailsModalCancel = () => {
    setShowDetailsModal(false)
    setSelectedTemplate(null)
  }

  const handleBackToTemplateSelection = () => {
    setShowDetailsModal(false)
    setShowTemplateSelector(true)
  }

  const handleCreateSite = async (siteData: { name: string; slug: string }) => {
    if (!selectedTemplate) return

    try {
      setCreating(true)
      logger.userAction('website_create_started', { 
        templateId: selectedTemplate.id,
        siteName: siteData.name,
        siteSlug: siteData.slug
      })

      const newSite = await websiteService.createSite({
        name: siteData.name,
        slug: siteData.slug,
        pages: selectedTemplate.pages || [],
        theme: selectedTemplate.theme,
        nav: selectedTemplate.nav,
        brand: selectedTemplate.brand,
        seo: selectedTemplate.seo,
        tracking: selectedTemplate.tracking
      })

      logger.userAction('website_created', { siteId: newSite.id })
      
      toast({
        title: 'Website Created',
        description: `${newSite.name} has been created successfully.`
      })

      // Reset state
      setShowDetailsModal(false)
      setSelectedTemplate(null)
      
      // Refresh sites list
      await loadSites()
      
      // Navigate to edit the new site
      navigate(`/platform/website-builder/sites/${newSite.id}/edit`)
      
    } catch (error) {
      logger.userAction('website_create_failed', { 
        templateId: selectedTemplate.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      handleError(error, 'creating website')
    } finally {
      setCreating(false)
    }
  }

  const handleEditSite = (siteId: string) => {
    navigate(`/platform/website-builder/sites/${siteId}/edit`)
  }

  const handlePreviewSite = (site: Site) => {
    const previewUrl = `/s/${site.slug}/`
    window.open(previewUrl, '_blank')
  }

  const handleSiteSettings = (siteId: string) => {
    navigate(`/platform/website-builder/sites/${siteId}/settings`)
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
          <h1 className="text-3xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground">
            Create and manage professional websites for your dealership
          </p>
        </div>
        <Button onClick={handleCreateWebsiteClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Website
        </Button>
      </div>

      {/* Sites Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Card key={site.id} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{site.name}</CardTitle>
              <CardDescription>
                {site.domain || `${site.slug}.renterinsight.com`}
              </CardDescription>
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
                    onClick={() => handleEditSite(site.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreviewSite(site)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSiteSettings(site.id)}
                  >
                    <Settings className="h-4 w-4" />
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

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelected}
          onCancel={handleTemplateSelectorCancel}
        />
      )}

      {/* Create Site Details Modal */}
      {showDetailsModal && selectedTemplate && (
        <CreateSiteDetailsModal
          selectedTemplate={selectedTemplate}
          onCreateSite={handleCreateSite}
          onBackToTemplateSelection={handleBackToTemplateSelection}
          onCancel={handleDetailsModalCancel}
          isCreating={creating}
        />
      )}
    </div>
  )
}

export { WebsiteBuilder }