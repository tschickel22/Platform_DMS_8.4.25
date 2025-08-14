import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Image, Filter, Download } from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureTemplate } from '../types'
import { mockInventory } from '@/mocks/inventoryMock'

interface GenerateBrochureModalProps {
  template?: BrochureTemplate | null
  onClose: () => void
  onSuccess: () => void
}

export function GenerateBrochureModal({ template, onClose, onSuccess }: GenerateBrochureModalProps) {
  const { templates, generateBrochure } = useBrochureStore()
  const [selectedTemplate, setSelectedTemplate] = useState<BrochureTemplate | null>(template || null)
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [brochureTitle, setBrochureTitle] = useState('')
  const [loading, setLoading] = useState(false)

  // Get available listings based on template type
  const availableListings = selectedTemplate 
    ? mockInventory.sampleVehicles.filter(vehicle => 
        selectedTemplate.listingType === 'both' || 
        vehicle.listingType === selectedTemplate.listingType
      )
    : []

  const handleListingToggle = (listingId: string) => {
    setSelectedListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const handleSelectAll = () => {
    if (selectedListings.length === availableListings.length) {
      setSelectedListings([])
    } else {
      setSelectedListings(availableListings.map(listing => listing.id))
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate || selectedListings.length === 0) return

    setLoading(true)
    try {
      await generateBrochure({
        templateId: selectedTemplate.id,
        title: brochureTitle || `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        listingIds: selectedListings
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to generate brochure:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Brochure</DialogTitle>
          <DialogDescription>
            Select a template and listings to create a marketing brochure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Template</Label>
              <Select
                value={selectedTemplate?.id || ''}
                onValueChange={(value) => {
                  const template = templates.find(t => t.id === value)
                  setSelectedTemplate(template || null)
                  setSelectedListings([]) // Reset selections when template changes
                }}
              >
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

            {selectedTemplate && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-12 rounded border bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${selectedTemplate.theme.preview})`,
                        backgroundColor: selectedTemplate.theme.primaryColor 
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{selectedTemplate.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedTemplate.theme.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedTemplate.blocks.length} blocks
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Brochure Title */}
          <div>
            <Label htmlFor="title">Brochure Title</Label>
            <Input
              id="title"
              value={brochureTitle}
              onChange={(e) => setBrochureTitle(e.target.value)}
              placeholder={`${selectedTemplate?.name || 'Brochure'} - ${new Date().toLocaleDateString()}`}
            />
          </div>

          {/* Listing Selection */}
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select Listings ({selectedListings.length} of {availableListings.length})</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedListings.length === availableListings.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {availableListings.map((listing) => (
                  <Card 
                    key={listing.id}
                    className={`cursor-pointer transition-all ${
                      selectedListings.includes(listing.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => handleListingToggle(listing.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => handleListingToggle(listing.id)}
                        />
                        <img 
                          src={listing.media?.primaryPhoto || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=100&h=75'}
                          alt={listing.searchResultsText}
                          className="w-16 h-12 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {listing.year} {listing.make} {listing.model}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {listing.location?.city}, {listing.location?.state}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                            </Badge>
                            <span className="text-xs font-medium">
                              ${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {availableListings.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <Image className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No listings available for this template type
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <Button 
              onClick={handleGenerate}
              disabled={!selectedTemplate || selectedListings.length === 0 || loading}
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Brochure
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}