import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  BarChart3,
  Palette,
  Settings
} from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { NewTemplateModal } from '../components/NewTemplateModal'
import { GenerateBrochureModal } from '../components/GenerateBrochureModal'
import { ShareBrochureModal } from '../components/ShareBrochureModal'
import { BrochureAnalytics } from '../components/BrochureAnalytics'
import { BrochureTemplate, GeneratedBrochure } from '../types'
import { useToast } from '@/hooks/use-toast'

export function BrochureList() {
  const { 
    templates, 
    brochures, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    generateBrochure,
    deleteBrochure,
    shareBrochure
  } = useBrochureStore()
  
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<BrochureTemplate | null>(null)
  const [selectedBrochure, setSelectedBrochure] = useState<GeneratedBrochure | null>(null)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [showGenerate, setShowGenerate] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Filter templates and brochures based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBrochures = brochures.filter(brochure =>
    brochure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brochure.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTemplate = async (template: BrochureTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"? This action cannot be undone.`)) {
      await deleteTemplate(template.id)
      toast({
        title: 'Template Deleted',
        description: `"${template.name}" has been deleted successfully.`
      })
    }
  }

  const handleDeleteBrochure = async (brochure: GeneratedBrochure) => {
    if (window.confirm(`Are you sure you want to delete "${brochure.name}"?`)) {
      await deleteBrochure(brochure.id)
      toast({
        title: 'Brochure Deleted',
        description: `"${brochure.name}" has been deleted successfully.`
      })
    }
  }

  const handleDuplicateTemplate = async (template: BrochureTemplate) => {
    const duplicated = await createTemplate({
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined
    })
    toast({
      title: 'Template Duplicated',
      description: `Created a copy of "${template.name}".`
    })
  }

  const handleDownloadBrochure = (brochure: GeneratedBrochure) => {
    // Create a download link for the PDF
    const link = document.createElement('a')
    link.href = brochure.pdfUrl
    link.download = `${brochure.name}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Download Started',
      description: `Downloading "${brochure.name}".`
    })
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
        <div className="relative flex-1 max-w-sm">
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">
            <Palette className="h-4 w-4 mr-2" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="brochures">
            <FileText className="h-4 w-4 mr-2" />
            Generated Brochures ({brochures.length})
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <Palette className="h-12 w-12 text-muted-foreground/50 mb-4" />
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedTemplate(template)
                            setShowGenerate(true)
                          }}>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Brochure
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTemplate(template)}
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Theme:</span>
                        <Badge variant="outline">{template.theme}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">
                          {template.listingType === 'rv' ? 'RV' : 'Manufactured Home'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-muted-foreground">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setShowGenerate(true)
                          }}
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
                <Button 
                  onClick={() => setShowGenerate(true)}
                  disabled={templates.length === 0}
                >
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
                        <CardTitle className="text-lg">{brochure.name}</CardTitle>
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
                          <DropdownMenuItem onClick={() => handleDownloadBrochure(brochure)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedBrochure(brochure)
                            setShowShare(true)
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteBrochure(brochure)}
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Listings:</span>
                        <Badge variant="outline">{brochure.listingIds.length} items</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Views:</span>
                        <span className="font-medium">{brochure.analytics.views}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Downloads:</span>
                        <span className="font-medium">{brochure.analytics.downloads}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Generated:</span>
                        <span className="text-muted-foreground">
                          {new Date(brochure.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadBrochure(brochure)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedBrochure(brochure)
                            setShowShare(true)
                          }}
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
      <NewTemplateModal
        open={showNewTemplate}
        onOpenChange={setShowNewTemplate}
        onSuccess={(template) => {
          setShowNewTemplate(false)
          toast({
            title: 'Template Created',
            description: `"${template.name}" has been created successfully.`
          })
        }}
      />

      <GenerateBrochureModal
        open={showGenerate}
        onOpenChange={setShowGenerate}
        selectedTemplate={selectedTemplate}
        onSuccess={(brochure) => {
          setShowGenerate(false)
          setSelectedTemplate(null)
          toast({
            title: 'Brochure Generated',
            description: `"${brochure.name}" has been generated successfully.`
          })
        }}
      />

      <ShareBrochureModal
        open={showShare}
        onOpenChange={setShowShare}
        brochure={selectedBrochure}
        onClose={() => {
          setShowShare(false)
          setSelectedBrochure(null)
        }}
      />

      <BrochureAnalytics
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
      />
    </div>
  )
}