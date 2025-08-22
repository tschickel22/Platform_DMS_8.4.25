import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, X, Save, Eye } from 'lucide-react'
import { PropertyListing, ListingTemplate, TemplateField } from '../types'
import { usePropertyListings } from '../hooks/usePropertyListings'
import { useDropzone } from 'react-dropzone'

interface ListingFormProps {
  mode: 'create' | 'edit'
}

export default function ListingForm({ mode }: ListingFormProps) {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const { listings, templates, createListing, updateListing, uploadMedia, loading } = usePropertyListings()
  
  const [formData, setFormData] = useState<Partial<PropertyListing>>({
    listingType: 'rv',
    offerType: 'for_sale',
    status: 'draft',
    condition: 'used',
    location: { city: '', state: '' },
    media: { primaryPhoto: '', photos: [] },
    features: {}
  })
  
  const [selectedTemplate, setSelectedTemplate] = useState<ListingTemplate | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load existing listing for edit mode
  useEffect(() => {
    if (mode === 'edit' && listingId) {
      const listing = listings.find(l => l.id === listingId)
      if (listing) {
        setFormData(listing)
        // Find matching template
        const template = templates.find(t => t.listingType === listing.listingType && t.isDefault)
        setSelectedTemplate(template || null)
      }
    }
  }, [mode, listingId, listings, templates])

  // Set default template when listing type changes
  useEffect(() => {
    if (formData.listingType) {
      const defaultTemplate = templates.find(t => 
        t.listingType === formData.listingType && t.isDefault
      )
      setSelectedTemplate(defaultTemplate || null)
    }
  }, [formData.listingType, templates])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      // Handle nested fields like location.city
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof PropertyListing] as any),
            [child]: value
          }
        }
      }
      
      return { ...prev, [field]: value }
    })
  }

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return
    
    try {
      setUploading(true)
      const uploadPromises = files.map(file => uploadMedia(file))
      const results = await Promise.all(uploadPromises)
      
      const newPhotos = results.map(result => result.url)
      const currentPhotos = formData.media?.photos || []
      
      setFormData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          primaryPhoto: prev.media?.primaryPhoto || newPhotos[0] || '',
          photos: [...currentPhotos, ...newPhotos]
        }
      }))
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  })

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        photos: prev.media?.photos?.filter((_, i) => i !== index) || []
      }
    }))
  }

  const setPrimaryPhoto = (url: string) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        primaryPhoto: url
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      // Validate required fields
      if (!formData.title || !formData.year || !formData.make || !formData.model) {
        throw new Error('Please fill in all required fields')
      }
      
      const listingData = {
        ...formData,
        createdBy: 'current-user', // Replace with actual user ID
        updatedBy: 'current-user'
      } as Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>
      
      if (mode === 'create') {
        await createListing(listingData)
      } else if (listingId) {
        await updateListing(listingId, listingData)
      }
      
      navigate('/property/listings')
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const renderTemplateField = (field: TemplateField) => {
    const value = field.name.includes('.') 
      ? field.name.split('.').reduce((obj, key) => obj?.[key], formData)
      : formData[field.name as keyof PropertyListing]

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              value={value || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        )
      
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value || ''}
              onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
              min={field.validation?.min}
              max={field.validation?.max}
              required={field.required}
            />
          </div>
        )
      
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
            />
          </div>
        )
      
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Group template fields by section
  const fieldsBySection = selectedTemplate?.fields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = []
    }
    acc[field.section].push(field)
    return acc
  }, {} as Record<string, TemplateField[]>) || {}

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/property/listings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'Create New Listing' : 'Edit Listing'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'create' 
                  ? 'Add a new property listing to your inventory'
                  : 'Update listing information and details'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/property/listings')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Listing'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Type & Template</CardTitle>
              <CardDescription>
                Choose the type of property and template to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(value) => handleInputChange('listingType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rv">RV</SelectItem>
                      <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select
                    value={selectedTemplate?.id || ''}
                    onValueChange={(value) => {
                      const template = templates.find(t => t.id === value)
                      setSelectedTemplate(template || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter(t => t.listingType === formData.listingType)
                        .map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Fields */}
          {selectedTemplate && (
            <Tabs defaultValue={Object.keys(fieldsBySection)[0]} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                {Object.keys(fieldsBySection).map(section => (
                  <TabsTrigger key={section} value={section} className="text-xs">
                    {section}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(fieldsBySection).map(([section, fields]) => (
                <TabsContent key={section} value={section}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{section}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields
                          .sort((a, b) => a.order - b.order)
                          .map(renderTemplateField)}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Photos & Media</CardTitle>
              <CardDescription>
                Upload photos of the property. The first photo will be used as the primary image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {uploading ? 'Uploading...' : 'Drag & drop images here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPEG, PNG, WebP (max 5MB each)
                </p>
              </div>

              {/* Photo Gallery */}
              {formData.media?.photos && formData.media.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.media.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      
                      {/* Primary Photo Badge */}
                      {photo === formData.media?.primaryPhoto && (
                        <Badge className="absolute top-2 left-2 text-xs">
                          Primary
                        </Badge>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          {photo !== formData.media?.primaryPhoto && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setPrimaryPhoto(photo)}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removePhoto(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Offer Type</Label>
                  <Select
                    value={formData.offerType}
                    onValueChange={(value) => handleInputChange('offerType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for_sale">For Sale</SelectItem>
                      <SelectItem value="for_rent">For Rent</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleInputChange('condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}