import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { FileText, Package, Image, CheckCircle } from 'lucide-react'
import { BrochureTemplate, GeneratedBrochure } from '../types'
import { useBrochureStore } from '../store/useBrochureStore'
import { mockInventory } from '@/mocks/inventoryMock'

interface GenerateBrochureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTemplate?: BrochureTemplate | null
  onSuccess: (brochure: GeneratedBrochure) => void
}

export function GenerateBrochureModal({ 
  open, 
  onOpenChange, 
  selectedTemplate, 
  onSuccess 
}: GenerateBrochureModalProps) {
  const { templates, generateBrochure } = useBrochureStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    templateId: selectedTemplate?.id || '',
    listingIds: [] as string[],
    customizations: {}
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setStep(1)
      setFormData({
        name: '',
        templateId: selectedTemplate?.id || '',
        listingIds: [],
        customizations: {}
      })
    }
  }, [open, selectedTemplate])

  const selectedTemplateData = templates.find(t => t.id === formData.templateId)
  
  // Filter inventory based on template type
  const availableListings = mockInventory.sampleVehicles.filter(vehicle => {
    if (!selectedTemplateData) return true
    if (selectedTemplateData.listingType === 'both') return true
    return vehicle.listingType === selectedTemplateData.listingType
  })

  const handleListingToggle = (listingId: string) => {
    setFormData(prev => ({
      ...prev,
      listingIds: prev.listingIds.includes(listingId)
        ? prev.listingIds.filter(id => id !== listingId)
        : [...prev.listingIds, listingId]
    }))
  }

  const handleGenerate = async () => {
    if (!formData.name || !formData.templateId || formData.listingIds.length === 0) {
      return
    }

    setIsGenerating(true)
    try {
      const brochure = await generateBrochure(formData)
      onSuccess(brochure)
    } catch (error) {
      console.error('Failed to generate brochure:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.templateId
      case 2:
        return formData.listingIds.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Brochure</DialogTitle>
          <DialogDescription>
            Step {step} of 3: Create a new brochure from a template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step 
                    ? 'bg-primary text-primary-foreground' 
                    : stepNum < step 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNum < step ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    stepNum < step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info & Template Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="brochureName">Brochure Name</Label>
                <Input
                  id="brochureName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Spring 2024 RV Collection"
                />
              </div>
              
              <div>
                <Label htmlFor="template">Select Template</Label>
                <Select
                  value={formData.templateId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, templateId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
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

              {selectedTemplateData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{selectedTemplateData.name}</CardTitle>
                    <CardDescription>{selectedTemplateData.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline">{selectedTemplateData.theme}</Badge>
                      <Badge variant="secondary">
                        {selectedTemplateData.listingType === 'rv' ? 'RV' : 
                         selectedTemplateData.listingType === 'manufactured_home' ? 'Manufactured Homes' : 'Both'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Listing Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Select Listings to Include</Label>
                <p className="text-sm text-muted-foreground">
                  Choose which inventory items to feature in this brochure
                </p>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {availableListings.map((listing) => (
                  <Card 
                    key={listing.id}
                    className={`cursor-pointer transition-all ${
                      formData.listingIds.includes(listing.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleListingToggle(listing.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={formData.listingIds.includes(listing.id)}
                          onChange={() => handleListingToggle(listing.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {listing.year} {listing.make} {listing.model}
                            </h4>
                            <Badge variant="outline">
                              {listing.listingType === 'rv' ? 'RV' : 'MH'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}</span>
                            <span>{listing.location?.city}, {listing.location?.state}</span>
                            {listing.bedrooms && <span>{listing.bedrooms}BR/{listing.bathrooms}BA</span>}
                            {listing.sleeps && <span>Sleeps {listing.sleeps}</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                Selected: {formData.listingIds.length} listing{formData.listingIds.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Step 3: Review & Generate */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Review & Generate</Label>
                <p className="text-sm text-muted-foreground">
                  Review your selections and generate the brochure
                </p>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Brochure Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium">{selectedTemplateData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listings:</span>
                      <span className="font-medium">{formData.listingIds.length} items</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Selected Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {formData.listingIds.map(listingId => {
                        const listing = availableListings.find(l => l.id === listingId)
                        return listing ? (
                          <div key={listingId} className="flex items-center justify-between text-sm">
                            <span>{listing.year} {listing.make} {listing.model}</span>
                            <span className="text-muted-foreground">
                              ${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}
                            </span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}
              disabled={isGenerating}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button
              onClick={() => step < 3 ? setStep(step + 1) : handleGenerate()}
              disabled={!isStepValid() || isGenerating}
            >
              {isGenerating ? 'Generating...' : step === 3 ? 'Generate Brochure' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}