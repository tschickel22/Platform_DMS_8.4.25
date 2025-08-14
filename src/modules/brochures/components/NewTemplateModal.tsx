import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Palette, Layout, Image } from 'lucide-react'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureTemplate, BrochureTheme } from '../types'

interface NewTemplateModalProps {
  onClose: () => void
  onSuccess: () => void
}

const predefinedThemes: BrochureTheme[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with bold typography',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    preview: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Elegant design with premium feel',
    primaryColor: '#1f2937',
    secondaryColor: '#d4af37',
    accentColor: '#ffffff',
    fontFamily: 'Playfair Display',
    preview: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Adventure',
    description: 'Nature-inspired design for RV and outdoor lifestyle',
    primaryColor: '#059669',
    secondaryColor: '#92400e',
    accentColor: '#fbbf24',
    fontFamily: 'Roboto',
    preview: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
  },
  {
    id: 'family',
    name: 'Family Friendly',
    description: 'Warm, welcoming design for family homes',
    primaryColor: '#dc2626',
    secondaryColor: '#7c3aed',
    accentColor: '#f97316',
    fontFamily: 'Open Sans',
    preview: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
  }
]

export function NewTemplateModal({ onClose, onSuccess }: NewTemplateModalProps) {
  const { createTemplate } = useBrochureStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    listingType: 'both' as 'rv' | 'manufactured_home' | 'both',
    selectedTheme: predefinedThemes[0]
  })
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const template: Omit<BrochureTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        listingType: formData.listingType,
        theme: formData.selectedTheme,
        blocks: [
          {
            id: 'hero',
            type: 'hero',
            title: 'Welcome to {{company_name}}',
            subtitle: 'Your trusted partner for quality homes and RVs',
            backgroundImage: formData.selectedTheme.preview,
            order: 0
          },
          {
            id: 'gallery',
            type: 'gallery',
            title: 'Featured Properties',
            showPrices: true,
            columns: 2,
            order: 1
          },
          {
            id: 'cta',
            type: 'cta',
            title: 'Ready to Find Your Perfect Home?',
            subtitle: 'Contact us today to schedule a viewing',
            buttonText: 'Contact Us',
            buttonUrl: '{{company_phone}}',
            order: 2
          }
        ],
        status: 'active'
      }

      await createTemplate(template)
      onSuccess()
    } catch (error) {
      console.error('Failed to create template:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Brochure Template</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Choose Theme' : 'Review & Create'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Premium RV Showcase"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this template is for..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="listingType">Listing Type</Label>
                <Select
                  value={formData.listingType}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, listingType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rv">RV Only</SelectItem>
                    <SelectItem value="manufactured_home">Manufactured Homes Only</SelectItem>
                    <SelectItem value="both">Both RV & Manufactured Homes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Choose Theme */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose a Theme</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a design theme that matches your brand
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {predefinedThemes.map((theme) => (
                  <Card 
                    key={theme.id}
                    className={`cursor-pointer transition-all ${
                      formData.selectedTheme.id === theme.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, selectedTheme: theme }))}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{theme.name}</CardTitle>
                        {formData.selectedTheme.id === theme.id && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {theme.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <img 
                          src={theme.preview} 
                          alt={theme.name}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: theme.secondaryColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span className="text-xs text-muted-foreground ml-2">
                            {theme.fontFamily}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Review Template</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review your template configuration before creating
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Template Name</Label>
                      <p className="text-sm text-muted-foreground">{formData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Listing Type</Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.listingType === 'both' ? 'RV & Manufactured Homes' : 
                         formData.listingType === 'rv' ? 'RV Only' : 'Manufactured Homes Only'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Selected Theme</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <img 
                          src={formData.selectedTheme.preview} 
                          alt={formData.selectedTheme.name}
                          className="w-16 h-12 object-cover rounded border"
                        />
                        <div>
                          <p className="text-sm font-medium">{formData.selectedTheme.name}</p>
                          <p className="text-xs text-muted-foreground">{formData.selectedTheme.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={step === 1 ? onClose : handleBack}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button 
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={
                (step === 1 && (!formData.name || !formData.description)) ||
                loading
              }
            >
              {loading ? 'Creating...' : step === 3 ? 'Create Template' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}