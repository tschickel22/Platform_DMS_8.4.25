import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Share2, FileText, Image, Globe, Loader2, X } from 'lucide-react'
import { useBrochureStore } from '@/modules/brochures/store/useBrochureStore'
import { toPDF, toImage, toHTML } from '@/modules/brochures/utils/exporters'
import { useTenant } from '@/contexts/TenantContext'

interface GenerateBrochureModalProps {
  isOpen: boolean
  onClose: () => void
  inventoryItem: any
}

export function GenerateBrochureModal({ isOpen, onClose, inventoryItem }: GenerateBrochureModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { templates, isLoading } = useBrochureStore()
  const { tenant } = useTenant()

  // Safe branding object with fallbacks
  const branding = {
    primaryColor: tenant?.branding?.primaryColor || '#3b82f6',
    secondaryColor: tenant?.branding?.secondaryColor || '#64748b',
    fontFamily: tenant?.branding?.fontFamily || 'Inter',
    companyName: tenant?.name || 'Demo Company'
  }

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)

  const handleGenerate = async (format: 'pdf' | 'image' | 'html') => {
    if (!selectedTemplateId) return

    try {
      setIsGenerating(true)
      
      // Create brochure data by merging template with inventory item
      const brochureData = {
        template: selectedTemplate,
        inventory: inventoryItem,
        branding: branding
      }

      // Generate based on format
      switch (format) {
        case 'pdf':
          await toPDF(brochureData)
          break
        case 'image':
          await toImage(brochureData)
          break
        case 'html':
          await toHTML(brochureData)
          break
      }
    } catch (error) {
      console.error(`Error generating ${format} brochure:`, error)
      // You could add a toast notification here
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <DialogHeader>
          <DialogTitle>Generate Brochure</DialogTitle>
          <DialogDescription>
            Create a marketing brochure for {inventoryItem?.year} {inventoryItem?.make} {inventoryItem?.model}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inventory Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img
                  src={inventoryItem?.media?.primaryPhoto || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=200'}
                  alt={`${inventoryItem?.year} ${inventoryItem?.make} ${inventoryItem?.model}`}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">
                    {inventoryItem?.year} {inventoryItem?.make} {inventoryItem?.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {inventoryItem?.inventoryId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Price: ${(inventoryItem?.salePrice || inventoryItem?.rentPrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose Template</CardTitle>
              <CardDescription>
                Select a brochure template to use for this inventory item
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading templates...</span>
                </div>
              ) : templates.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-colors ${
                        selectedTemplateId === template.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedTemplateId(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-xs text-muted-foreground">
                          Suitable for: {template.suitableFor?.join(', ') || 'All types'}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Templates Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Create brochure templates first to generate brochures for inventory items.
                  </p>
                  <Button variant="outline" onClick={onClose}>
                    Go to Brochures
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation Actions */}
          {templates.length > 0 && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleGenerate('pdf')}
                  disabled={!selectedTemplateId || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleGenerate('image')}
                  disabled={!selectedTemplateId || isGenerating}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleGenerate('html')}
                  disabled={!selectedTemplateId || isGenerating}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  HTML
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleGenerate('pdf')}
                  disabled={!selectedTemplateId || isGenerating}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}