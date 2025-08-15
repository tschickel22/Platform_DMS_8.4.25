import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Image } from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { mockInventory } from '@/mocks/inventoryMock'

interface GenerateBrochureModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function GenerateBrochureModal({ onClose, onSuccess }: GenerateBrochureModalProps) {
  const { templates, addBrochure } = useBrochureStore()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleListingToggle = (listingId: string) => {
    setSelectedListings(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const handleGenerate = async () => {
    if (!selectedTemplate || !title || selectedListings.length === 0) {
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate brochure generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const template = templates.find(t => t.id === selectedTemplate)
      const newBrochure = {
        id: `brochure-${Date.now()}`,
        templateId: selectedTemplate,
        templateName: template?.name || 'Unknown Template',
        title,
        description,
        listingIds: selectedListings,
        publicId: `pub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        isPublic: true,
        downloadCount: 0,
        shareCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      addBrochure(newBrochure)
      onSuccess()
    } catch (error) {
      console.error('Error generating brochure:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate New Brochure</DialogTitle>
          <DialogDescription>
            Create a marketing brochure from your property listings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Brochure Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Premium RV Collection - Winter 2024"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this brochure"
              />
            </div>

            <div>
              <Label htmlFor="template">Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Selection */}
          <div className="space-y-4">
            <div>
              <Label>Select Properties</Label>
              <p className="text-sm text-muted-foreground">
                Choose which properties to include in this brochure
              </p>
            </div>

            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {mockInventory.sampleVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedListings.includes(vehicle.id)}
                        onCheckedChange={() => handleListingToggle(vehicle.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium truncate">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {vehicle.listingType === 'rv' ? 'RV' : 'MH'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {vehicle.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            ${vehicle.salePrice?.toLocaleString() || 'Price on request'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vehicle.location?.city}, {vehicle.location?.state}
                          </span>
                        </div>
                      </div>
                      {vehicle.media?.primaryPhoto && (
                        <div className="flex-shrink-0">
                          <img
                            src={vehicle.media.primaryPhoto}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-16 h-12 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedListings.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{selectedListings.length} properties selected</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={!selectedTemplate || !title || selectedListings.length === 0 || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Brochure'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}