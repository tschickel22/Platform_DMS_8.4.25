import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLandManagement } from '../hooks/useLandManagement'
import { Land, LandStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Plus, X, Upload, Image, MapPin, DollarSign, Ruler, FileText, Zap, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LandFormData {
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  zoning: string
  status: LandStatus
  size: number
  sizeUnit: string
  price: number
  cost: number
  description: string
  notes: string
  images: string[]
  utilities: {
    water: boolean
    sewer: boolean
    electric: boolean
    gas: boolean
    internet: boolean
  }
  features: string[]
  restrictions: string[]
  taxInfo: {
    annualTaxes: number
    assessedValue: number
    lastAssessment: string
  }
}

const initialFormData: LandFormData = {
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  },
  zoning: '',
  status: LandStatus.AVAILABLE,
  size: 0,
  sizeUnit: 'acres',
  price: 0,
  cost: 0,
  description: '',
  notes: '',
  images: [],
  utilities: {
    water: false,
    sewer: false,
    electric: false,
    gas: false,
    internet: false
  },
  features: [],
  restrictions: [],
  taxInfo: {
    annualTaxes: 0,
    assessedValue: 0,
    lastAssessment: new Date().toISOString().split('T')[0]
  }
}

export function LandForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getLandById, createLand, updateLand } = useLandManagement()
  
  const [formData, setFormData] = useState<LandFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [newRestriction, setNewRestriction] = useState('')

  const isEditing = Boolean(id)

  // Debug log for component render
  console.log('🔄 LandForm render:', {
    formData: {
      features: formData.features,
      restrictions: formData.restrictions,
      images: formData.images
    },
    newFeature,
    newRestriction,
    isEditing
  })
  // Load existing land data if editing
  useEffect(() => {
    console.log('📥 useEffect triggered:', { id, isEditing })
    if (isEditing && id) {
      const land = getLandById(id)
      console.log('🏞️ Loaded land data:', land)
      if (land) {
        setFormData({
          address: land.address,
          zoning: land.zoning,
          status: land.status,
          size: land.size,
          sizeUnit: land.sizeUnit,
          price: land.price,
          cost: land.cost,
          description: land.description || '',
          notes: land.notes || '',
          images: land.images || [],
          utilities: land.utilities || initialFormData.utilities,
          features: land.features || [],
          restrictions: land.restrictions || [],
          taxInfo: land.taxInfo || initialFormData.taxInfo
        })
      } else {
        toast({
          title: "Error",
          description: "Land record not found",
          variant: "destructive"
        })
        navigate('/land')
      }
    }
  }, [id, isEditing, getLandById, navigate, toast])

  const handleInputChange = (field: string, value: any) => {
    console.log('📝 handleInputChange:', { field, value })
    setFormData(prev => {
      const keys = field.split('.')
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value }
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof LandFormData],
            [keys[1]]: value
          }
        }
      }
      return prev
    })
  }

  const addFeature = () => {
    console.log('🔧 addFeature called with newFeature:', newFeature)
    const trimmedFeature = newFeature.trim()
    console.log('🔧 trimmedFeature:', trimmedFeature)
    
    if (trimmedFeature) {
      console.log('🔧 Adding feature to formData.features:', formData.features)
      console.log('🎯 addFeature called:', { newFeature, currentFeatures: formData.features })
      console.log('✅ Adding feature:', newFeature.trim())
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, trimmedFeature]
      }))
      setNewFeature('')
      console.log('🔧 Feature added, newFeature cleared')
      console.log('🔄 Feature added, clearing input')
    } else {
      console.log('❌ Feature not added - empty or whitespace only')
    }
  }

  const removeFeature = (index: number) => {
    console.log('🗑️ removeFeature called:', { index, currentFeatures: formData.features })
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
    console.log('✅ Feature removed at index:', index)
  }

  const addRestriction = () => {
    console.log('🔧 addRestriction called with newRestriction:', newRestriction)
    const trimmedRestriction = newRestriction.trim()
    console.log('🔧 trimmedRestriction:', trimmedRestriction)
    
    if (trimmedRestriction) {
      console.log('🔧 Adding restriction to formData.restrictions:', formData.restrictions)
      console.log('🚫 addRestriction called:', { newRestriction, currentRestrictions: formData.restrictions })
      console.log('✅ Adding restriction:', newRestriction.trim())
      setFormData(prev => ({
        ...prev,
        restrictions: [...prev.restrictions, trimmedRestriction]
      }))
      setNewRestriction('')
      console.log('🔧 Restriction added, newRestriction cleared')
      console.log('🔄 Restriction added, clearing input')
    } else {
      console.log('❌ Restriction not added - empty or whitespace only')
    }
  }

  const removeRestriction = (index: number) => {
    console.log('🗑️ removeRestriction called:', { index, currentRestrictions: formData.restrictions })
    setFormData(prev => ({
      ...prev,
      restrictions: prev.restrictions.filter((_, i) => i !== index)
    }))
    console.log('✅ Restriction removed at index:', index)
  }

  // Enhanced handlers that get current input values
  const handleAddFeature = () => {
    console.log('🎯 handleAddFeature called')
    addFeature()
  }

  const handleAddRestriction = () => {
    console.log('🎯 handleAddRestriction called')
    addRestriction()
  }

  const handleFeatureKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('⌨️ Feature key pressed:', e.key)
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('⌨️ Enter pressed for feature, current value:', newFeature)
      addFeature()
    }
  }

  const handleRestrictionKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('⌨️ Restriction key pressed:', e.key)
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('⌨️ Enter pressed for restriction, current value:', newRestriction)
      addRestriction()
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 handleImageUpload called:', { files: event.target.files })
    const files = event.target.files
    if (files) {
      console.log('📁 Processing files:', files.length)
      // Convert files to URLs (in a real app, you'd upload to a server)
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      console.log('🖼️ Created image URLs:', newImages)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
      console.log('✅ Images added to formData')
    } else {
      console.log('❌ No files selected')
    }
  }

  const removeImage = (index: number) => {
    console.log('🗑️ removeImage called:', { index, currentImages: formData.images })
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    console.log('✅ Image removed at index:', index)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📤 Form submitted with data:', formData)
    setLoading(true)

    try {
      if (isEditing && id) {
        await updateLand(id, formData)
        toast({
          title: "Success",
          description: "Land record updated successfully"
        })
      } else {
        await createLand(formData)
        toast({
          title: "Success",
          description: "Land record created successfully"
        })
      }
      navigate('/land')
    } catch (error) {
      console.error('❌ Form submission error:', error)
      toast({
        title: "Error",
        description: "Failed to save land record",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/land')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Land List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Land Record' : 'Add New Land'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update land information' : 'Create a new land record'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="Austin"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  placeholder="TX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  placeholder="78701"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  placeholder="USA"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zoning">Zoning *</Label>
                <Input
                  id="zoning"
                  value={formData.zoning}
                  onChange={(e) => handleInputChange('zoning', e.target.value)}
                  placeholder="Residential, Commercial, Agricultural"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LandStatus.AVAILABLE}>Available</SelectItem>
                    <SelectItem value={LandStatus.UNDER_CONTRACT}>Under Contract</SelectItem>
                    <SelectItem value={LandStatus.SOLD}>Sold</SelectItem>
                    <SelectItem value={LandStatus.RESERVED}>Reserved</SelectItem>
                    <SelectItem value={LandStatus.OFF_MARKET}>Off Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', parseFloat(e.target.value) || 0)}
                  placeholder="2.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sizeUnit">Size Unit</Label>
                <Select value={formData.sizeUnit} onValueChange={(value) => handleInputChange('sizeUnit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="square feet">Square Feet</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="square meters">Square Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Beautiful wooded lot with mature oak trees..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Internal notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a feature (e.g., Wooded, Level, Corner Lot)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleFeatureKeyPress}
              />
              <Button type="button" onClick={handleAddFeature} size="sm">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Restrictions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a restriction (e.g., No mobile homes, Minimum 2000 sq ft)"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                onKeyPress={handleRestrictionKeyPress}
              />
              <Button type="button" onClick={handleAddRestriction} size="sm">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            {formData.restrictions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.restrictions.map((restriction, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{restriction}</span>
                    <button
                      type="button"
                      onClick={() => removeRestriction(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  console.log('📸 Upload button clicked')
                  document.getElementById('image-upload')?.click()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Land image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {formData.images.length === 0 && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No images uploaded yet</p>
                <p className="text-sm text-muted-foreground">Click "Upload Images" to add photos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/land')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? 'Update Land' : 'Create Land'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LandForm