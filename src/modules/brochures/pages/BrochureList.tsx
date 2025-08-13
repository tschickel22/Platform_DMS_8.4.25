/**
 * Brochure Builder - Brochure List Page
 * 
 * Main listing page for templates and brochures with tabs and actions.
 * Shows cards with metadata and provides CRUD operations.
 * 
 * Header Actions:
 * - Create Template: Navigate to template editor
 * - Import Branding: Load company branding
 * - Analytics: View usage statistics
 * 
 * Tabs:
 * - Templates: Editable brochure templates
 * - Brochures: Generated brochures from templates
 * 
 * Card Actions:
 * - Edit: Open template editor
 * - Duplicate: Create copy with "(Copy)" suffix
 * - Delete: Remove with confirmation
 * - Share: Open share modal
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  FileText, 
  Share2, 
  Copy, 
  Edit, 
  Trash2,
  BarChart3,
  Upload,
  Calendar,
  Eye
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useBrochureStore } from '../store/useBrochureStore'
import { getSummary } from '../utils/analytics'
import ShareBrochureModal from '../components/ShareBrochureModal'

/**
 * Template card component
 */
const TemplateCard: React.FC<{
  template: any
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}> = ({ template, onEdit, onDuplicate, onDelete }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-medium truncate">
            {template.name || 'Untitled Template'}
          </CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {template.theme}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {template.blocks?.length || 0} blocks
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    
    <CardContent className="pt-0">
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Updated {new Date(template.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <FileText className="w-3 h-3 mr-1" />
          Version {template.version || 1}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-3"
        onClick={onEdit}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Template
      </Button>
    </CardContent>
  </Card>
)

/**
 * Brochure card component
 */
const BrochureCard: React.FC<{
  brochure: any
  template: any
  onView: () => void
  onShare: () => void
  onDelete: () => void
}> = ({ brochure, template, onView, onShare, onDelete }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-medium truncate">
            {template?.name || 'Untitled Brochure'}
          </CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {template?.theme || 'unknown'}
            </Badge>
            {brochure.source && (
              <Badge variant="secondary" className="text-xs">
                {brochure.source.type}
              </Badge>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    
    <CardContent className="pt-0">
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Created {new Date(brochure.createdAt).toLocaleDateString()}
        </div>
        {brochure.publicId && (
          <div className="flex items-center">
            <Share2 className="w-3 h-3 mr-1" />
            Public link available
          </div>
        )}
      </div>
      
      <div className="flex space-x-2 mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onView}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </CardContent>
  </Card>
)

/**
 * Main brochure list page
 */
export const BrochureList: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { 
    listTemplates, 
    listBrochures, 
    duplicateTemplate, 
    deleteTemplate, 
    deleteBrochure,
    getTemplate 
  } = useBrochureStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [shareModal, setShareModal] = useState<{
    open: boolean
    brochure?: any
    template?: any
  }>({ open: false })

  // Get current tab from URL params
  const currentTab = searchParams.get('tab') || 'templates'

  // Get data
  const templates = listTemplates()
  const brochures = listBrochures()
  const analytics = getSummary()

  // Filter data based on search
  const filteredTemplates = templates.filter(template =>
    template.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredBrochures = brochures.filter(brochure => {
    const template = getTemplate(brochure.templateId)
    return template?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  // Template actions
  const handleCreateTemplate = () => {
    navigate('/brochures/templates/new')
  }

  const handleEditTemplate = (templateId: string) => {
    navigate(`/brochures/templates/${templateId}/edit`)
  }

  const handleDuplicateTemplate = (templateId: string) => {
    duplicateTemplate(templateId)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId)
    }
  }

  // Brochure actions
  const handleViewBrochure = (brochure: any) => {
    if (brochure.publicId) {
      navigate(`/b/${brochure.publicId}`)
    }
  }

  const handleShareBrochure = (brochure: any) => {
    const template = getTemplate(brochure.templateId)
    setShareModal({ open: true, brochure, template })
  }

  const handleDeleteBrochure = (brochureId: string) => {
    if (confirm('Are you sure you want to delete this brochure?')) {
      deleteBrochure(brochureId)
    }
  }

  // Header actions
  const handleImportBranding = () => {
    // TODO: Implement branding import
    alert('Branding import coming soon!')
  }

  const handleViewAnalytics = () => {
    setSearchParams({ tab: 'analytics' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brochures</h1>
          <p className="text-gray-600">
            Create and manage brochure templates and generated brochures
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleImportBranding}>
            <Upload className="w-4 h-4 mr-2" />
            Import Branding
          </Button>
          <Button variant="outline" onClick={handleViewAnalytics}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search templates and brochures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="templates">
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="brochures">
            Brochures ({brochures.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {filteredTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={() => handleEditTemplate(template.id)}
                  onDuplicate={() => handleDuplicateTemplate(template.id)}
                  onDelete={() => handleDeleteTemplate(template.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No templates found' : 'No templates yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first brochure template to get started'
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateTemplate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Brochures Tab */}
        <TabsContent value="brochures" className="space-y-4">
          {filteredBrochures.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBrochures.map((brochure) => {
                const template = getTemplate(brochure.templateId)
                return (
                  <BrochureCard
                    key={brochure.id}
                    brochure={brochure}
                    template={template}
                    onView={() => handleViewBrochure(brochure)}
                    onShare={() => handleShareBrochure(brochure)}
                    onDelete={() => handleDeleteBrochure(brochure.id)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Share2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No brochures found' : 'No brochures yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Generate brochures from your templates'
                }
              </p>
              {!searchQuery && templates.length > 0 && (
                <Button onClick={() => handleTabChange('templates')}>
                  View Templates
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalViews}</div>
                <p className="text-xs text-gray-600">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalShares}</div>
                <p className="text-xs text-gray-600">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalDownloads}</div>
                <p className="text-xs text-gray-600">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CTA Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.ctaClicks}</div>
                <p className="text-xs text-gray-600">All time</p>
              </CardContent>
            </Card>
          </div>

          {analytics.totalViews === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No analytics data yet</h3>
              <p className="text-gray-600">
                Share your brochures to start collecting analytics data
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Modal */}
      <ShareBrochureModal
        open={shareModal.open}
        onClose={() => setShareModal({ open: false })}
        brochure={shareModal.brochure}
        template={shareModal.template}
      />
    </div>
  )
}

export default BrochureList