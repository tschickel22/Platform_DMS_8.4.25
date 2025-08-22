import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus,
  Home,
  Car,
  MapPin,
  DollarSign,
  Settings,
  Image as ImageIcon,
  Eye
} from 'lucide-react'
import { PropertyListing, ListingTemplate, TemplateField } from '../types'
import { usePropertyListings } from '../hooks/usePropertyListings'
import { propertyListingsService } from '../services/propertyListingsService'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ListingFormProps {
  mode: 'create' | 'edit'
}

export default function ListingForm({ mode }: ListingFormProps) {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { listings, createListing, updateListing } = usePropertyListings()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [templates, setTemplates] = useState<ListingTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ListingTemplate | null>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  
  const [formData, setFormData] = useState<Partial<PropertyListing>>({
    title: '',
    description: '',
    listingType: 'rv',
    offerType: 'for_sale',
    status: 'draft',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    condition: 'new',
    location: {
      city: '',
      state: '',
      postalCode: ''
    },
    media: {
      primaryPhoto: '',
      photos: []
    },
    features: {},
    isPublic: false
  })

  useEffect(() => {
    loadTemplates()
    if (mode === 'edit' && listingId) {
      loadListing()
    }
  }, [mode, listingId])

  useEffect(() => {
    // Auto-select template when listing type changes
    if (formData.listingType && templates.length > 0) {
      const defaultTemplate = templates.find(t => 
        t.listingType === formData.listingType && t.isDefault
      )
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate)
      }
    }
  }, [formData.listingType, templates])

  const loadTemplates = async () => {
    try {
      const templateData = await propertyListingsService.getTemplates()
      setTemplates(templateData)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const loadListing = async () => {
    if (!listingId) return
    
    try {
      setLoading(true)
      const listing = listings.find(l => l.id === listingId)
      if (listing) {
        setFormData(listing)
        
        // Find matching template
        const template = templates.find(t => t.listingType === listing.listingType)
        if (template) {
          setSelectedTemplate(template)
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load listing data.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      // Handle nested fields (e.g., 'location.city')
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        newData[parent as keyof PropertyListing] = {
          ...(newData[parent as keyof PropertyListing] as any),
          [child]: value
        }
      } else {
        newData[field as keyof PropertyListing] = value
      }
      
      return newData
    })
  }

  const handlePhotoUpload = async (files: FileList) => {
    try {
      setUploadingPhotos(true)
      const uploadPromises = Array.from(files).map(file => 
        propertyListingsService.uploadMedia(file)
      )
      
      const uploadedUrls = await Promise.all(uploadPromises)
      
      setFormData(prev => ({
        ...prev,
        media: {
          ...prev.media!,
          photos: [...(prev.media?.photos || []), ...uploadedUrls],
          primaryPhoto: prev.media?.primaryPhoto || uploadedUrls[0] || ''
        }
      }))
      
      toast({
        title: 'Photos Uploaded',
        description: `${uploadedUrls.length} photos uploaded successfully.`
      })
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload photos.',
        variant: 'destructive'
      })
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handleRemovePhoto = (photoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media!,
        photos: prev.media?.photos.filter(p => p !== photoUrl) || [],
        primaryPhoto: prev.media?.primaryPhoto === photoUrl 
          ? (prev.media?.photos.find(p => p !== photoUrl) || '')
          : prev.media?.primaryPhoto || ''
      }
    }))
  }

  const handleSetPrimaryPhoto = (photoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media!,
        primaryPhoto: photoUrl
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Validation
      if (!formData.title || !formData.make || !formData.model || !formData.location?.city) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive'
        })
        return
      }
      
      if (mode === 'create') {
        await createListing(formData as Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>)
        toast({
          title: 'Listing Created',
          description: 'Your property listing has been created successfully.'
        })
      } else if (listingId) {
        await updateListing(listingId, formData)
        toast({
          title: 'Listing Updated',
          description: 'Your changes have been saved successfully.'
        })
      }
      
      navigate('/property/listings')
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save listing. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    if (formData.id) {
      const url = `${window.location.origin}/public/demo/listing/${formData.id}`
      window.open(url, '_blank')
    }
  }

  const renderTemplateField = (field: TemplateField) => {
    const value = field.name.includes('.') 
      ? field.name.split('.').reduce((obj, key) => obj?.[key], formData as any)
      : formData[field.name as keyof PropertyListing]

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )
      
      case 'currency':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
            min={0}
            step={0.01}
          />
        )
      
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleInputChange(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={(checked) => handleInputChange(field.name, !!checked)}
            />
            <Label className="text-sm">{field.label}</Label>
          </div>
        )
      
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  const groupedFields = selectedTemplate?.fields.reduce((groups, field) => {
    if (!groups[field.section]) {
      groups[field.section] = []
    }
    groups[field.section].push(field)
    return groups
  }, {} as Record<string, TemplateField[]>) || {}

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
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
                  ? 'Add a new property to your inventory'
                  : 'Update listing information and settings'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'edit' && formData.id && (
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Listing'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential listing details and type selection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="listingType">Listing Type *</Label>
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
                  
                  <div>
                    <Label htmlFor="offerType">Offer Type *</Label>
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
                </div>

                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter listing title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the property..."
                    required
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
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
              </CardContent>
            </Card>

            {/* Template Fields */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>
                    Complete the details using the {selectedTemplate.name} template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={Object.keys(groupedFields)[0]} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      {Object.keys(groupedFields).slice(0, 4).map(section => (
                        <TabsTrigger key={section} value={section} className="text-xs">
                          {section}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {Object.entries(groupedFields).map(([section, fields]) => (
                      <TabsContent key={section} value={section} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {fields
                            .sort((a, b) => a.order - b.order)
                            .map(field => (
                              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <Label htmlFor={field.id}>
                                  {field.label}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                {renderTemplateField(field)}
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Photos
                </CardTitle>
                <CardDescription>
                  Upload and manage listing photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                    disabled={uploadingPhotos}
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploadingPhotos ? 'Uploading...' : 'Click to upload photos or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB each
                    </p>
                  </label>
                </div>

                {/* Photo Grid */}
                {formData.media?.photos && formData.media.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.media.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Primary Photo Badge */}
                        {photo === formData.media?.primaryPhoto && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                            Primary
                          </Badge>
                        )}
                        
                        {/* Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            {photo !== formData.media?.primaryPhoto && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSetPrimaryPhoto(photo)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemovePhoto(photo)}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Template</CardTitle>
                <CardDescription>
                  Choose a template for this listing type
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          {template.isDefault && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Default
                            </Badge>
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {selectedTemplate && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedTemplate.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice || ''}
                      onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                )}
                
                {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                  <div>
                    <Label htmlFor="rentPrice">Rent Price (monthly)</Label>
                    <Input
                      id="rentPrice"
                      type="number"
                      value={formData.rentPrice || ''}
                      onChange={(e) => handleInputChange('rentPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                )}
                
                {formData.listingType === 'manufactured_home' && (
                  <div>
                    <Label htmlFor="lotRent">Lot Rent (monthly)</Label>
                    <Input
                      id="lotRent"
                      type="number"
                      value={formData.lotRent || ''}
                      onChange={(e) => handleInputChange('lotRent', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.location?.city || ''}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.location?.state || ''}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    placeholder="Enter state"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.location?.postalCode || ''}
                    onChange={(e) => handleInputChange('location.postalCode', e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>
                  Control listing visibility and sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', !!checked)}
                  />
                  <Label htmlFor="isPublic">Make listing publicly visible</Label>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Public listings can be:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Shared via direct URL</li>
                    <li>Included in catalog exports</li>
                    <li>Syndicated to partner sites</li>
                    <li>Found via search engines</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.media?.primaryPhoto && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={formData.media.primaryPhoto}
                      alt={formData.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{formData.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.year} {formData.make} {formData.model}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {formData.salePrice && (
                          <p className="font-bold text-primary">
                            {formatCurrency(formData.salePrice)}
                          </p>
                        )}
                        {formData.rentPrice && (
                          <p className="font-semibold">
                            {formatCurrency(formData.rentPrice)}/mo
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formData.location?.city}, {formData.location?.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}