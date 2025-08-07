import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { SyndicationPartnerConfiguration, ListingType, SyndicationPartnerFormData } from '@/types/listings'

interface SyndicationPartnerFormProps {
  partner?: SyndicationPartnerConfiguration | null
  onSubmit: (partner: SyndicationPartnerConfiguration) => void
  onCancel: () => void
}

const LISTING_TYPE_OPTIONS: { value: ListingType; label: string; description: string }[] = [
  { value: 'for_rent', label: 'For Rent', description: 'Rental properties' },
  { value: 'for_sale', label: 'For Sale', description: 'Properties for sale' },
  { value: 'manufactured_home', label: 'Manufactured Home', description: 'Mobile/manufactured homes' },
  { value: 'apartment', label: 'Apartment', description: 'Apartment units' },
  { value: 'house', label: 'House', description: 'Single-family houses' },
  { value: 'condo', label: 'Condo', description: 'Condominium units' },
  { value: 'storage', label: 'Storage', description: 'Storage units' },
  { value: 'rv', label: 'RV', description: 'RV/recreational vehicles' }
]

export function SyndicationPartnerForm({ partner, onSubmit, onCancel }: SyndicationPartnerFormProps) {
  const [formData, setFormData] = useState<SyndicationPartnerFormData>({
    name: '',
    listingTypes: [],
    leadEmail: '',
    exportFormat: 'XML'
  })
  const [errors, setErrors] = useState<Partial<SyndicationPartnerFormData>>({})
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        listingTypes: partner.listingTypes,
        leadEmail: partner.leadEmail,
        exportFormat: partner.exportFormat
      })
    }
  }, [partner])

  useEffect(() => {
    // Generate preview URL whenever form data changes
    if (formData.name && formData.listingTypes.length > 0 && formData.leadEmail) {
      const baseUrl = 'https://your-app.netlify.app/.netlify/functions/syndication-feed'
      const params = new URLSearchParams({
        partnerId: partner?.id || 'new',
        format: formData.exportFormat,
        listingTypes: formData.listingTypes.join(','),
        leadEmail: formData.leadEmail
      })
      setPreviewUrl(`${baseUrl}?${params.toString()}`)
    } else {
      setPreviewUrl('')
    }
  }, [formData, partner?.id])

  const validateForm = (): boolean => {
    const newErrors: Partial<SyndicationPartnerFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Partner name is required'
    }

    if (formData.listingTypes.length === 0) {
      newErrors.listingTypes = ['At least one listing type must be selected']
    }

    if (!formData.leadEmail.trim()) {
      newErrors.leadEmail = 'Lead email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) {
      newErrors.leadEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const partnerData: SyndicationPartnerConfiguration = {
      id: partner?.id || '',
      name: formData.name.trim(),
      listingTypes: formData.listingTypes,
      leadEmail: formData.leadEmail.trim(),
      exportFormat: formData.exportFormat,
      isActive: partner?.isActive ?? true,
      createdAt: partner?.createdAt,
      updatedAt: partner?.updatedAt
    }

    onSubmit(partnerData)
  }

  const handleListingTypeChange = (listingType: ListingType, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      listingTypes: checked
        ? [...prev.listingTypes, listingType]
        : prev.listingTypes.filter(type => type !== listingType)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Partner Name */}
      <div className="space-y-2">
        <Label htmlFor="partner-name">
          Partner Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="partner-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Zillow, MH Village, Apartments.com"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Listing Types */}
      <div className="space-y-3">
        <Label>
          Listing Types <span className="text-destructive">*</span>
        </Label>
        <div className="text-sm text-muted-foreground mb-3">
          Select which types of listings to include in the syndication feed
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LISTING_TYPE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <Checkbox
                id={`listing-type-${option.value}`}
                checked={formData.listingTypes.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleListingTypeChange(option.value, checked as boolean)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={`listing-type-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {errors.listingTypes && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.listingTypes[0]}
          </div>
        )}
      </div>

      {/* Lead Email */}
      <div className="space-y-2">
        <Label htmlFor="lead-email">
          Lead Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="lead-email"
          type="email"
          value={formData.leadEmail}
          onChange={(e) => setFormData(prev => ({ ...prev, leadEmail: e.target.value }))}
          placeholder="support+partner@notifications.renterinsight.com"
          className={errors.leadEmail ? 'border-destructive' : ''}
        />
        <div className="text-sm text-muted-foreground">
          This email will be included in the XML/JSON feed for lead notifications
        </div>
        {errors.leadEmail && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.leadEmail}
          </div>
        )}
      </div>

      {/* Export Format */}
      <div className="space-y-3">
        <Label>Export Format</Label>
        <RadioGroup
          value={formData.exportFormat}
          onValueChange={(value: 'XML' | 'JSON') => 
            setFormData(prev => ({ ...prev, exportFormat: value }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="XML" id="format-xml" />
            <Label htmlFor="format-xml">XML</Label>
            <Badge variant="outline" className="ml-2">Zillow Format</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="JSON" id="format-json" />
            <Label htmlFor="format-json">JSON</Label>
            <Badge variant="outline" className="ml-2">MH Village Format</Badge>
          </div>
        </RadioGroup>
      </div>

      {/* Preview URL */}
      {previewUrl && (
        <Card>
          <CardContent className="pt-4">
            <Label className="text-sm font-medium">Generated Export URL</Label>
            <div className="mt-2 p-3 bg-muted rounded-md">
              <code className="text-xs break-all">{previewUrl}</code>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              This URL will be generated after saving the partner configuration
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {partner ? 'Update Partner' : 'Create Partner'}
        </Button>
      </div>
    </form>
  )
}