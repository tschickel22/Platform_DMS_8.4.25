import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  FileText, 
  Download, 
  Share2, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Search,
  Filter,
  Calendar,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureTemplate, GeneratedBrochure } from '../types'
import { NewTemplateModal } from '../components/NewTemplateModal'
import { GenerateBrochureModal } from '../components/GenerateBrochureModal'
import { ShareBrochureModal } from '../components/ShareBrochureModal'
import { BrochureAnalytics } from '../components/BrochureAnalytics'

export function BrochureList() {
  const { 
    templates, 
    generatedBrochures, 
    deleteTemplate, 
    deleteBrochure,
    duplicateTemplate 
  } = useBrochureStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [showGenerateBrochure, setShowGenerateBrochure] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<BrochureTemplate | null>(null)
  const [selectedBrochure, setSelectedBrochure] = useState<GeneratedBrochure | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter brochures based on search
  const filteredBrochures = generatedBrochures.filter(brochure =>
    brochure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brochure.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(templateId)
    }
  }

  const handleDeleteBrochure = async (brochureId: string) => {
    if (confirm('Are you sure you want to delete this brochure?')) {
      await deleteBrochure(brochureId)
    }
  }

  const handleDuplicateTemplate = async (template: BrochureTemplate) => {
    await duplicateTemplate(template.id)
  }

  const handleGenerateFromTemplate = (template: BrochureTemplate) => {
    setSelectedTemplate(template)
    setShowGenerateBrochure(true)
  }

  const handleShareBrochure = (brochure: GeneratedBrochure) => {
    setSelectedBrochure(brochure)
    setShowShareModal(true)
  }

  const handleDownloadBrochure = (brochure: GeneratedBrochure) => {
    // Create a download link
    const link = document.createElement('a')
    link.href = brochure.pdfUrl
    link.download = `${brochure.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
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
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowNewTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates and brochures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Tabs for Templates and Generated Brochures */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="brochures">
            Generated Brochures ({generatedBrochures.length})
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm ? 'No templates match your search criteria.' : 'Get started by creating your first brochure template.'}
                </p>
                <Button onClick={() => setShowNewTemplate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                          <DropdownMenuItem onClick={() => handleGenerateFromTemplate(template)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Brochure
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {template.listingType === 'both' ? 'RV & MH' : template.listingType.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                        <span>{template.blocks.length} blocks</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleGenerateFromTemplate(template)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Generated Brochures Tab */}
        <TabsContent value="brochures" className="space-y-4">
          {filteredBrochures.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Brochures Generated</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm ? 'No brochures match your search criteria.' : 'Generate your first brochure from a template to get started.'}
                </p>
                <Button onClick={() => setShowGenerateBrochure(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Brochure
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBrochures.map((brochure) => (
                <Card key={brochure.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{brochure.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Template: {brochure.templateName}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(brochure.pdfUrl, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadBrochure(brochure)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareBrochure(brochure)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteBrochure(brochure.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {brochure.listingType === 'both' ? 'RV & MH' : brochure.listingType.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {brochure.listingCount} listing{brochure.listingCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Generated {new Date(brochure.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{brochure.analytics?.views || 0}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDownloadBrochure(brochure)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleShareBrochure(brochure)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showNewTemplate && (
        <NewTemplateModal
          onClose={() => setShowNewTemplate(false)}
          onSuccess={() => setShowNewTemplate(false)}
        />
      )}

      {showGenerateBrochure && (
        <GenerateBrochureModal
          template={selectedTemplate}
          onClose={() => {
            setShowGenerateBrochure(false)
            setSelectedTemplate(null)
          }}
          onSuccess={() => {
            setShowGenerateBrochure(false)
            setSelectedTemplate(null)
          }}
        />
      )}

      {selectedBrochure && showShareModal && (
        <ShareBrochureModal
          brochure={selectedBrochure}
          onClose={() => {
            setShowShareModal(false)
            setSelectedBrochure(null)
          }}
        />
      )}

      {showAnalytics && (
        <BrochureAnalytics
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  )
}