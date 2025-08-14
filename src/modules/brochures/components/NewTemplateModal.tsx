import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, FileText, Settings, Eye } from 'lucide-react'
import { BrochureTemplate, BrochureTheme, ListingType } from '../types'
import { useBrochureStore } from '../store/useBrochureStore'

interface NewTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (template: BrochureTemplate) => void
}

const themes: Array<{ value: BrochureTheme; label: string; description: string; colors: { primary: string; secondary: string } }> = [
  {
    value: 'modern',
    label: 'Modern',
    description: 'Clean, contemporary design with bold typography',
    colors: { primary: '#3b82f6', secondary: '#64748b' }
  },
  {
    value: 'luxury',
    label: 'Luxury',
    description: 'Elegant design with premium feel',
    colors: { primary: '#059669', secondary: '#374151' }
  },
  {
    value: 'outdoor',
    label: 'Outdoor Adventure',
    description: 'Nature-inspired design for outdoor enthusiasts',
    colors: { primary: '#dc2626', secondary: '#92400e' }
  },
  {
    value: 'family',
    label: 'Family Friendly',
    description: 'Warm, welcoming design for families',
    colors: { primary: '#7c3aed', secondary: '#1f2937' }
  }
]

export function NewTemplateModal({ open, onOpenChange, onSuccess }: NewTemplateModalProps) {
  const { createTemplate } = useBrochureStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: 'modern' as BrochureTheme,
    listingType: 'both' as ListingType,
    layout: {
      coverPage: true,
      tableOfContents: false,
      listingPages: true,
      contactPage: true
    },
    content: {
      coverTitle: '',
      coverSubtitle: '',
      companyDescription: '',
      contactInfo: {
        phone: '',
        email: '',
        website: '',
        address: ''
      }
    }
  })

  const selectedTheme = themes.find(t => t.value === formData.theme)

  const handleSubmit = async () => {
    try {
      const template = await createTemplate({
        ...formData,
        design: {
          primaryColor: selectedTheme?.colors.primary || '#3b82f6',
          secondaryColor: selectedTheme?.colors.secondary || '#64748b',
          fontFamily: 'Inter',
          logoPosition: 'top-left'
        }
      })
      onSuccess(template)
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.description.trim()
      case 2:
        return true // Theme selection is always valid
      case 3:
        return formData.content.coverTitle.trim()
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Step {step} of 3: Create a new brochure template
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
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    stepNum < step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
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
                  onValueChange={(value: ListingType) => setFormData(prev => ({ ...prev, listingType: value }))}
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

          {/* Step 2: Theme Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Choose a Theme</Label>
                <div className="grid gap-3 mt-2">
                  {themes.map((theme) => (
                    <Card 
                      key={theme.value}
                      className={`cursor-pointer transition-all ${
                        formData.theme === theme.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.value }))}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{theme.label}</CardTitle>
                            <CardDescription className="text-sm">
                              {theme.description}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Content Setup */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="coverTitle">Cover Title</Label>
                <Input
                  id="coverTitle"
                  value={formData.content.coverTitle}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    content: { ...prev.content, coverTitle: e.target.value }
                  }))}
                  placeholder="e.g., Premium RV Collection"
                />
              </div>
              <div>
                <Label htmlFor="coverSubtitle">Cover Subtitle</Label>
                <Input
                  id="coverSubtitle"
                  value={formData.content.coverSubtitle}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    content: { ...prev.content, coverSubtitle: e.target.value }
                  }))}
                  placeholder="e.g., Discover Your Next Adventure"
                />
              </div>
              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={formData.content.companyDescription}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    content: { ...prev.content, companyDescription: e.target.value }
                  }))}
                  placeholder="Brief description of your company..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.content.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        contactInfo: { ...prev.content.contactInfo, phone: e.target.value }
                      }
                    }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.content.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        contactInfo: { ...prev.content.contactInfo, email: e.target.value }
                      }
                    }))}
                    placeholder="sales@company.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button
              onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
              disabled={!isStepValid()}
            >
              {step === 3 ? 'Create Template' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}