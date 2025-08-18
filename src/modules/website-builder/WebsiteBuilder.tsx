import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Globe, Edit, Trash2, Eye } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Site } from './types'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useToast } from '@/hooks/use-toast'
import TemplateSelector from './components/TemplateSelector'
import { CreateSiteDetailsModal } from './components/CreateSiteDetailsModal'

interface WebsiteBuilderProps {
  mode?: 'platform' | 'company'
}

export default function WebsiteBuilder({ mode = 'platform' }: WebsiteBuilderProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
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

  // NEW WORKFLOW HANDLERS
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

  const handleCancelWorkflow = () => {
    setSelectedTemplate(null)
    setShowTemplateSelector(false)
    setShowDetailsModal(false)
  }

  const handleCreateSite = async (siteData: { name: string; subdomain?: string; templateId: string; template?: any }) => {
    try {
      if (!selectedTemplate) {
        throw new Error('No template selected')
      }

      const newSite = await websiteService.createSite({
        name: siteData.name,
        slug: siteData.subdomain || siteData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        template: selectedTemplate,
        pages: selectedTemplate.pages || [],
        theme: selectedTemplate.theme,
        nav: selectedTemplate.nav,
        brand: selectedTemplate.brand
      })

      toast({
        title: 'Website Created',
        description: `${newSite.name} has been created successfully`
      })

      // Reset workflow state
      handleCancelWorkflow()
      
      // Reload sites and navigate to editor
      await loadSites()
      const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
      navigate(`${basePath}/${newSite.id}`)
    } catch (error) {
      handleError(error, 'creating website')
    }
  }

  const handleEditSite = (siteId: string) => {
    const basePath = mode === 'platform' ? '/platform/website-builder' : '/company/settings/website'
    navigate(`${basePath}/${siteId}`)
  }

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return

    try {
      await websiteService.deleteSite(siteId)
      toast({
        title: 'Website Deleted',
        description: 'The website has been deleted successfully'
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Website Builder</h1>
            <p className="text-muted-foreground">Create and manage websites for the platform</p>
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
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show template selector when requested
  if (showTemplateSelector) {
    return (
      <TemplateSelector
        onSelectTemplate={handleTemplateSelected}
        onCancel={handleCancelWorkflow}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'platform' ? 'Website Builder' : 'Company Website Editor'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'platform' 
              ? 'Create and manage websites for the platform'
              : 'Manage your company\'s public website'
            }
          </p>
        </div>
        <Button onClick={handleCreateWebsiteClick}>
          <Plus className="h-4 w-4 mr-2" />
          {mode === 'platform' ? 'Create Website' : 'Create Company Website'}
        </Button>
      </div>

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <Globe className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get started by creating your first website. Choose from our professional templates
              and customize to match your brand.
            </p>
            <Button onClick={handleCreateWebsiteClick}>
              <Plus className="h-4 w-4 mr-2" />
              {mode === 'platform' ? 'Create Your First Website' : 'Create Company Website'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{site.slug}.renterinsight.com</span>
                      {site.domain && (
                        <Badge variant="secondary" className="text-xs">
                          Custom Domain
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={site.isPublished ? 'default' : 'secondary'}>
                    {site.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {site.pages?.length || 0} pages • Updated {new Date(site.updatedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSite(site.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewSite(site)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSite(site.id)}
                      className="text-destructive hover:text-destructive"
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

      {/* Site Details Modal */}
      {showDetailsModal && selectedTemplate && (
        <CreateSiteDetailsModal
          template={selectedTemplate}
          onCreateSite={handleCreateSite}
          onBackToTemplates={handleBackToTemplateSelection}
          onCancel={handleCancelWorkflow}
        />
      )}
    </div>
  )
}

export { WebsiteBuilder }