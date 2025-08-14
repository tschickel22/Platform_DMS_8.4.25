import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureTemplate } from '../types'

interface NewTemplateModalProps {
  onClose: () => void
  onSuccess: (templateId: string) => void
}

export function NewTemplateModal({ onClose, onSuccess }: NewTemplateModalProps) {
  const { themes, addTemplate } = useBrochureStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [templateType, setTemplateType] = useState('')

  const templateTypes = [
    { value: 'rv', label: 'RV Showcase', description: 'Template optimized for RV listings' },
    { value: 'mh', label: 'Manufactured Homes', description: 'Template for manufactured home catalogs' },
    { value: 'mixed', label: 'Mixed Properties', description: 'Template for both RV and manufactured homes' },
    { value: 'custom', label: 'Custom', description: 'Start with a blank template' }
  ]

  const handleCreate = () => {
    if (!name || !selectedTheme || !templateType) {
      return
    }

    const newTemplate: BrochureTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      theme: selectedTheme,
      blocks: getDefaultBlocks(templateType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addTemplate(newTemplate)
    onSuccess(newTemplate.id)
  }

  const getDefaultBlocks = (type: string) => {
    const baseBlocks = [
      {
        id: 'hero-default',
        type: 'hero' as const,
        config: {
          title: '{{company_name}} Collection',
          subtitle: 'Discover Quality Properties',
          backgroundImage: type === 'rv' 
            ? 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
            : 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
      },
      {
        id: 'gallery-default',
        type: 'gallery' as const,
        config: {
          title: 'Featured Properties',
          layout: 'grid',
          showPrices: true,
          showSpecs: true
        }
      },
      {
        id: 'cta-default',
        type: 'cta' as const,
        config: {
          title: 'Ready to Learn More?',
          subtitle: 'Contact us today to schedule a viewing',
          buttonText: 'Contact Us',
          buttonUrl: '{{contact_url}}'
        }
      }
    ]

    if (type === 'rv') {
      baseBlocks.splice(1, 0, {
        id: 'features-rv',
        type: 'features' as const,
        config: {
          title: 'Why Choose Our RVs',
          features: [
            'Quality Inspected Vehicles',
            'Financing Available',
            'Trade-Ins Welcome',
            'Service & Support'
          ]
        }
      })
    } else if (type === 'mh') {
      baseBlocks.splice(1, 0, {
        id: 'features-mh',
        type: 'features' as const,
        config: {
          title: 'Quality Manufactured Homes',
          features: [
            'Energy Efficient Design',
            'Modern Amenities',
            'Professional Installation',
            'Warranty Included'
          ]
        }
      })
    }

    return baseBlocks
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new brochure template for your marketing materials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Premium RV Showcase"
              />
            </div>
            
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this template"
              />
            </div>

            <div>
              <Label>Template Type</Label>
              <div className="grid gap-3 mt-2">
                {templateTypes.map((type) => (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      templateType === type.value ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setTemplateType(type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          templateType === type.value ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label>Theme</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span>{theme.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!name || !selectedTheme || !templateType}
            >
              Create Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}