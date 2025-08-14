import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Share2, Eye } from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { toPDF, toImage, toHTML } from '../utils/exporters'
import { generateShareableUrl, trackShare } from '../utils/sharing'
import { useToast } from '@/hooks/use-toast'

interface GenerateBrochureModalProps {
  isOpen: boolean
  onClose: () => void
  inventoryItem: any
}

export function GenerateBrochureModal({ isOpen, onClose, inventoryItem }: GenerateBrochureModalProps) {
  const { templates } = useBrochureStore()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBrochure, setGeneratedBrochure] = useState<any>(null)
  const { toast } = useToast()

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)

  const handleGenerate = async () => {
    if (!selectedTemplate || !inventoryItem) return

    setIsGenerating(true)
    try {
      // Create brochure data by merging template with inventory item
      const brochureData = {
        id: `brochure-${Date.now()}`,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        inventoryItem,
        title: `${inventoryItem.year} ${inventoryItem.make} ${inventoryItem.model}`,
        description: inventoryItem.description || selectedTemplate.description,
        generatedAt: new Date().toISOString(),
        // Merge template content with inventory data
        content: {
          ...selectedTemplate.content,
          // Override with inventory-specific data
          hero: {
            ...selectedTemplate.content.hero,
            title: `${inventoryItem.year} ${inventoryItem.make} ${inventoryItem.model}`,
            subtitle: inventoryItem.description || '',
            backgroundImage: inventoryItem.media?.primaryPhoto || selectedTemplate.content.hero.backgroundImage
          },
          specs: {
            ...selectedTemplate.content.specs,
            // Add inventory-specific specs
            items: [
              { label: 'Year', value: inventoryItem.year?.toString() || 'N/A' },
              { label: 'Make', value: inventoryItem.make || 'N/A' },
              { label: 'Model', value: inventoryItem.model || 'N/A' },
              ...(inventoryItem.listingType === 'rv' ? [
                { label: 'Length', value: inventoryItem.length ? `${inventoryItem.length} ft` : 'N/A' },
                { label: 'Sleeps', value: inventoryItem.sleeps?.toString() || 'N/A' },
                { label: 'Slides', value: inventoryItem.slides?.toString() || 'N/A' }
              ] : []),
              ...(inventoryItem.listingType === 'manufactured_home' ? [
                { label: 'Bedrooms', value: inventoryItem.bedrooms?.toString() || 'N/A' },
                { label: 'Bathrooms', value: inventoryItem.bathrooms?.toString() || 'N/A' },
                { label: 'Square Feet', value: inventoryItem.dimensions?.squareFeet ? `${inventoryItem.dimensions.squareFeet} sq ft` : 'N/A' }
              ] : []),
              { label: 'VIN/Serial', value: inventoryItem.vin || inventoryItem.serialNumber || 'N/A' },
              { label: 'Condition', value: inventoryItem.condition || 'N/A' }
            ]
          },
          price: {
            ...selectedTemplate.content.price,
            salePrice: inventoryItem.salePrice,
            rentPrice: inventoryItem.rentPrice,
            showFinancing: true
          },
          gallery: {
            ...selectedTemplate.content.gallery,
            images: inventoryItem.media?.photos || [inventoryItem.media?.primaryPhoto].filter(Boolean) || []
          },
          features: {
            ...selectedTemplate.content.features,
            items: inventoryItem.features ? Object.entries(inventoryItem.features)
              .filter(([key, value]) => value === true)
              .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())) : []
          }
        }
      }

      setGeneratedBrochure(brochureData)
      
      toast({
        title: 'Brochure Generated',
        description: 'Your brochure has been generated successfully!'
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

  const handleDownload = async (format: 'pdf' | 'image' | 'html') => {
    if (!generatedBrochure) return

    try {
      const filename = `${generatedBrochure.title.replace(/[^a-zA-Z0-9]/g, '_')}_brochure`
      
      switch (format) {
        case 'pdf':
          await toPDF(generatedBrochure, filename)
          break
        case 'image':
          await toImage(generatedBrochure, filename)
          break
        case 'html':
          await toHTML(generatedBrochure, filename)
          break
      }

      trackShare('download', format, generatedBrochure.id)
      
      toast({
        title: 'Download Started',
        description: `Your ${format.toUpperCase()} brochure is downloading.`
      })
    } catch (error) {
      console.error('Error downloading brochure:', error)
      toast({
        title: 'Download Failed',
        description: 'Failed to download brochure. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleShare = async () => {
    if (!generatedBrochure) return

    try {
      const shareUrl = await generateShareableUrl(generatedBrochure)
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      
      trackShare('link', 'copy', generatedBrochure.id)
      
      toast({
        title: 'Share Link Copied',
        description: 'The brochure share link has been copied to your clipboard.'
      })
    } catch (error) {
      console.error('Error sharing brochure:', error)
      toast({
        title: 'Share Failed',
        description: 'Failed to generate share link. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleReset = () => {
    setGeneratedBrochure(null)
    setSelectedTemplateId('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Brochure</DialogTitle>
          <DialogDescription>
            Create a marketing brochure for {inventoryItem?.year} {inventoryItem?.make} {inventoryItem?.model}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inventory Item Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                {inventoryItem?.media?.primaryPhoto && (
                  <img 
                    src={inventoryItem.media.primaryPhoto} 
                    alt={`${inventoryItem.make} ${inventoryItem.model}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {inventoryItem?.year} {inventoryItem?.make} {inventoryItem?.model}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {inventoryItem?.listingType === 'rv' ? 'RV' : 'Manufactured Home'} • 
                    Stock: {inventoryItem?.inventoryId || inventoryItem?.id}
                  </p>
                  <div className="flex items-center space-x-2">
                    {inventoryItem?.salePrice && (
                      <Badge variant="outline">
                        Sale: ${inventoryItem.salePrice.toLocaleString()}
                      </Badge>
                    )}
                    {inventoryItem?.rentPrice && (
                      <Badge variant="outline">
                        Rent: ${inventoryItem.rentPrice.toLocaleString()}/mo
                      </Badge>
                    )}
                    <Badge variant={inventoryItem?.status === 'available' ? 'default' : 'secondary'}>
                      {inventoryItem?.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!generatedBrochure ? (
            <>
              {/* Template Selection */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Brochure Template
                  </label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Preview */}
                {selectedTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedTemplate.name}</CardTitle>
                      <CardDescription>{selectedTemplate.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Theme:</span> {selectedTemplate.theme}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {selectedTemplate.type}
                        </div>
                        <div>
                          <span className="font-medium">Layout:</span> {selectedTemplate.layout}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={!selectedTemplateId || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Brochure'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              {/* Generated Brochure Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Brochure Generated</span>
                  </CardTitle>
                  <CardDescription>
                    Your brochure for {generatedBrochure.title} is ready to download or share.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Download Options */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Download</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleDownload('pdf')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleDownload('image')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Image
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleDownload('html')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          HTML
                        </Button>
                      </div>
                    </div>

                    {/* Share Options */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Share</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Preview</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => {
                          // Open preview in new tab
                          const previewUrl = `/b/${generatedBrochure.id}`
                          window.open(previewUrl, '_blank')
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DialogFooter>
                <Button variant="outline" onClick={handleReset}>
                  Generate Another
                </Button>
                <Button onClick={onClose}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}