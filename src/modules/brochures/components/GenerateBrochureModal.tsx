import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download,
  Share2,
  Eye,
  Loader2,
  X,
  Package,
  Image
} from 'lucide-react'
import { useBrochureStore } from '@/modules/brochures/store/useBrochureStore'
import { toPDF, toImage, toHTML } from '@/modules/brochures/utils/exporters'
import { useToast } from '@/hooks/use-toast'

interface GenerateBrochureModalProps {
  isOpen: boolean
  onClose: () => void
  inventoryItem: {
    id: string
    year?: number
    make?: string
    model?: string
    listingType: string
    salePrice?: number
    rentPrice?: number
    media?: {
      primaryPhoto?: string
      photos?: string[]
    }
    location?: {
      city?: string
      state?: string
    }
    [key: string]: any
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export function GenerateBrochureModal({ isOpen, onClose, inventoryItem }: GenerateBrochureModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBrochure, setGeneratedBrochure] = useState<string | null>(null)
  
  const { templates, isLoading } = useBrochureStore()
  const { toast } = useToast()
  
  // Filter templates based on inventory type
  const availableTemplates = templates.filter(template => 
    template.category === inventoryItem.listingType || template.category === 'universal'
  )

  const handleGenerateBrochure = async (format: 'pdf' | 'image' | 'html') => {
    if (!selectedTemplate) return
    
    setIsGenerating(true)
    try {
      // Create brochure data by merging template with inventory item
      const brochureData = {
        ...selectedTemplate,
        inventoryItem,
        title: `${inventoryItem.year || ''} ${inventoryItem.make || ''} ${inventoryItem.model || ''}`.trim(),
        price: inventoryItem.salePrice || inventoryItem.rentPrice || 0,
        location: inventoryItem.location ? `${inventoryItem.location.city || ''}, ${inventoryItem.location.state || ''}` : '',
        photos: inventoryItem.media?.photos || [],
        primaryPhoto: inventoryItem.media?.primaryPhoto || ''
      }
      
      let result: string
      switch (format) {
        case 'pdf':
          result = await toPDF(brochureData)
          break
        case 'image':
          result = await toImage(brochureData)
          break
        case 'html':
          result = await toHTML(brochureData)
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
      
      setGeneratedBrochure(result)
      
      toast({
        title: 'Brochure Generated',
        description: `Your ${format.toUpperCase()} brochure has been generated successfully.`
      })
    } catch (error) {
      console.error('Error generating brochure:', error)
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate brochure. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Brochure</DialogTitle>
          <DialogDescription>
            Create a marketing brochure for {inventoryItem.year || ''} {inventoryItem.make || ''} {inventoryItem.model || ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inventory Item Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  {inventoryItem.media?.primaryPhoto ? (
                    <img
                      src={inventoryItem.media.primaryPhoto}
                      alt={`${inventoryItem.year || ''} ${inventoryItem.make || ''} ${inventoryItem.model || ''}`.trim()}
                      className="w-24 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">
                      {inventoryItem.year || ''} {inventoryItem.make || ''} {inventoryItem.model || ''}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {inventoryItem.inventoryId || inventoryItem.id} • {inventoryItem.listingType === 'rv' ? 'RV' : 'Manufactured Home'}
                    </p>
                    <p className="text-sm font-medium">
                      {formatPrice(inventoryItem.salePrice || inventoryItem.rentPrice || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading templates...</span>
                  </div>
                ) : availableTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No templates available for this vehicle type</p>
                    <p className="text-sm">Create a template in the Brochures section first</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {availableTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generation Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            {selectedTemplate && !isLoading && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleGenerateBrochure('pdf')}
                  disabled={isGenerating}
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
                  onClick={() => handleGenerateBrochure('image')}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Image className="h-4 w-4 mr-2" />
                  )}
                  Image
                </Button>
                <Button
                  onClick={() => handleGenerateBrochure('html')}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  Share HTML
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}