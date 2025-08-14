import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Share, 
  Edit, 
  Trash2,
  Eye,
  Copy,
  MoreHorizontal
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useBrochureStore } from '../store/useBrochureStore'
import { GenerateBrochureModal } from '../components/GenerateBrochureModal'
import { ShareBrochureModal } from '../components/ShareBrochureModal'
import { NewTemplateModal } from '../components/NewTemplateModal'
import { useNavigate } from 'react-router-dom'

export function BrochureList() {
  const navigate = useNavigate()
  const { templates, brochures, deleteTemplate, deleteBrochure } = useBrochureStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false)
  const [selectedBrochure, setSelectedBrochure] = useState<any>(null)

  // Filter templates and brochures based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBrochures = brochures.filter(brochure =>
    brochure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brochure.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditTemplate = (templateId: string) => {
    navigate(`/brochures/templates/${templateId}/edit`)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId)
    }
  }

  const handleDeleteBrochure = (brochureId: string) => {
    if (confirm('Are you sure you want to delete this brochure?')) {
      deleteBrochure(brochureId)
    }
  }

  const handleShareBrochure = (brochure: any) => {
    setSelectedBrochure(brochure)
    setShowShareModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brochures</h1>
          <p className="text-muted-foreground">
            Create and manage marketing brochures for your listings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowNewTemplateModal(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={() => setShowGenerateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Brochure
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brochures and templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Templates</h2>
          <Badge variant="secondary">{filteredTemplates.length} templates</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Template
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{template.theme}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.blocks.length} blocks
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditTemplate(template.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {searchTerm ? 'No templates match your search criteria.' : 'Create your first brochure template to get started.'}
                  </p>
                  <Button onClick={() => setShowNewTemplateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Generated Brochures Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generated Brochures</h2>
          <Badge variant="secondary">{filteredBrochures.length} brochures</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBrochures.map((brochure) => (
            <Card key={brochure.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{brochure.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {brochure.description || 'Generated brochure'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(`/b/${brochure.publicId}`, '_blank')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareBrochure(brochure)}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/b/${brochure.publicId}`)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteBrochure(brochure.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Template:</span>
                    <span>{brochure.templateName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Listings:</span>
                    <span>{brochure.listingIds.length} properties</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(brochure.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/b/${brochure.publicId}`, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleShareBrochure(brochure)}
                      className="flex-1"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBrochures.length === 0 && (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No brochures found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {searchTerm ? 'No brochures match your search criteria.' : 'Generate your first brochure from your property listings.'}
                  </p>
                  <Button onClick={() => setShowGenerateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Brochure
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showGenerateModal && (
        <GenerateBrochureModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false)
            // Refresh the list or show success message
          }}
        />
      )}

      {showShareModal && selectedBrochure && (
        <ShareBrochureModal
          brochure={selectedBrochure}
          onClose={() => {
            setShowShareModal(false)
            setSelectedBrochure(null)
          }}
        />
      )}

      {showNewTemplateModal && (
        <NewTemplateModal
          onClose={() => setShowNewTemplateModal(false)}
          onSuccess={(templateId) => {
            setShowNewTemplateModal(false)
            navigate(`/brochures/templates/${templateId}/edit`)
          }}
        />
      )}
    </div>
  )
}