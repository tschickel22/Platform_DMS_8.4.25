import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Home, 
  Zap, 
  Shield, 
  Leaf, 
  Archive, 
  Smartphone, 
  Accessibility,
  X,
  Upload,
  Eye
} from 'lucide-react'

interface MHInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function MHInventoryForm({ initialData, onSubmit, onCancel }: MHInventoryFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    inventoryId: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    serialNumber: '',
    condition: 'new',
    
    // Pricing
    offerType: 'both',
    salePrice: 0,
    rentPrice: 0,
    
    // Dimensions
    bedrooms: 2,
    bathrooms: 1,
    dimensions: {
      width_ft: 14,
      length_ft: 60,
      sections: 1,
      squareFeet: 840
    },
    
    // Location
    location: {
      city: '',
      state: '',
      postalCode: '',
      communityName: ''
    },
    
    // Structure
    roofType: '',
    sidingType: '',
    foundationType: '',
    heatingType: '',
    coolingType: '',
    
    // Features
    features: {
      standardAmenities: [],
      premiumUpgrades: [],
      safetyFeatures: [],
      energyEfficiency: [],
      storage: [],
      technology: [],
      accessibility: []
    },
    
    // Media
    media: {
      primaryPhoto: '',
      photos: []
    },
    
    // Marketing
    description: '',
    searchResultsText: '',
    keyFeatures: [],
    
    // Status
    status: 'available',
    
    ...initialData
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [keyFeatures, setKeyFeatures] = useState<string[]>([])

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
      
      // Flatten all feature categories into selectedFeatures
      const allFeatures = Object.values(initialData.features || {}).flat()
      setSelectedFeatures(allFeatures)
      setKeyFeatures(initialData.keyFeatures || [])
    }
  }, [initialData])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const handleFeatureToggle = (feature: string, category: string) => {
    setFormData(prev => {
      const currentFeatures = prev.features[category] || []
      const isSelected = currentFeatures.includes(feature)
      
      return {
        ...prev,
        features: {
          ...prev.features,
          [category]: isSelected
            ? currentFeatures.filter(f => f !== feature)
            : [...currentFeatures, feature]
        }
      }
    })
  }

  const handleKeyFeatureAdd = (feature: string) => {
    if (feature && !keyFeatures.includes(feature)) {
      setKeyFeatures(prev => [...prev, feature])
    }
  }

  const handleKeyFeatureRemove = (feature: string) => {
    setKeyFeatures(prev => prev.filter(f => f !== feature))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (formData.media.primaryPhoto) {
          setFormData(prev => ({
            ...prev,
            media: {
              ...prev.media,
              photos: [...prev.media.photos, result]
            }
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            media: {
              ...prev.media,
              primaryPhoto: result
            }
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      keyFeatures,
      listingType: 'manufactured_home'
    }
    
    onSubmit(submitData)
  }

  // Feature categories with comprehensive options
  const featureCategories = {
    standardAmenities: {
      icon: Home,
      label: 'Standard Amenities',
      options: [
        'Central Air Conditioning',
        'Central Heating',
        'Dishwasher',
        'Garbage Disposal',
        'Microwave',
        'Refrigerator',
        'Range/Oven',
        'Washer/Dryer Hookups',
        'Washer/Dryer Included',
        'Ceiling Fans',
        'Window Treatments',
        'Carpet',
        'Vinyl Flooring',
        'Laminate Flooring',
        'Kitchen Island',
        'Breakfast Bar',
        'Pantry',
        'Linen Closet',
        'Master Bedroom Suite',
        'Walk-in Closet',
        'Garden Tub',
        'Separate Shower',
        'Double Vanity',
        'Covered Porch',
        'Deck/Patio'
      ]
    },
    premiumUpgrades: {
      icon: Zap,
      label: 'Premium Upgrades',
      options: [
        'Granite Countertops',
        'Stainless Steel Appliances',
        'Hardwood Flooring',
        'Tile Flooring',
        'Vaulted Ceilings',
        'Tray Ceilings',
        'Crown Molding',
        'Chair Rail',
        'Wainscoting',
        'Fireplace',
        'Jetted Tub',
        'Tile Shower',
        'Upgraded Fixtures',
        'Pendant Lighting',
        'Under Cabinet Lighting',
        'Upgraded Cabinets',
        'Soft Close Drawers',
        'Pull-out Shelves',
        'Wine Rack',
        'Built-in Entertainment Center'
      ]
    },
    safetyFeatures: {
      icon: Shield,
      label: 'Safety & Security',
      options: [
        'Smoke Detectors',
        'Carbon Monoxide Detector',
        'Fire Extinguisher',
        'Security System',
        'Deadbolt Locks',
        'Window Locks',
        'Motion Sensor Lights',
        'Exterior Lighting',
        'Peephole',
        'Security Doors',
        'Storm Doors',
        'Storm Windows',
        'Safe Room',
        'Emergency Exit',
        'First Aid Kit'
      ]
    },
    energyEfficiency: {
      icon: Leaf,
      label: 'Energy Efficiency',
      options: [
        'Energy Star Certified',
        'Energy Star Appliances',
        'Low-E Windows',
        'Insulated Windows',
        'Extra Insulation',
        'Programmable Thermostat',
        'Smart Thermostat',
        'LED Lighting',
        'Solar Panels',
        'Solar Water Heater',
        'Tankless Water Heater',
        'High Efficiency HVAC',
        'Heat Pump',
        'Radiant Barrier',
        'Weather Stripping'
      ]
    },
    storage: {
      icon: Archive,
      label: 'Storage Solutions',
      options: [
        'Walk-in Closets',
        'Bedroom Closets',
        'Hall Closet',
        'Coat Closet',
        'Pantry',
        'Linen Closet',
        'Utility Room',
        'Storage Shed',
        'Attic Storage',
        'Under-stair Storage',
        'Built-in Storage',
        'Garage',
        'Carport',
        'Workshop'
      ]
    },
    technology: {
      icon: Smartphone,
      label: 'Technology Features',
      options: [
        'Smart Home Ready',
        'Pre-wired for Internet',
        'Cable/Satellite Ready',
        'Surround Sound Pre-wire',
        'Security System Pre-wire',
        'Phone Jacks',
        'USB Outlets',
        'Smart Switches',
        'Smart Outlets',
        'Whole House Audio',
        'Intercom System',
        'Video Doorbell Ready',
        'Home Automation Hub',
        'Wi-Fi Extender Ready',
        'Electric Vehicle Charging'
      ]
    },
    accessibility: {
      icon: Accessibility,
      label: 'Accessibility Features',
      options: [
        'ADA Compliant',
        'Wheelchair Accessible',
        'Ramp Access',
        'Wide Doorways',
        'Accessible Bathroom',
        'Roll-in Shower',
        'Grab Bars',
        'Lowered Counters',
        'Accessible Light Switches',
        'Accessible Outlets',
        'Visual Alerts',
        'Hearing Loop Ready',
        'Braille Signage Ready'
      ]
    }
  }

  const roofTypes = [
    'Gable', 'Hip', 'Shed', 'Gambrel', 'Mansard', 'Flat', 'Metal', 'Shingle', 'Tile', 'Rubber'
  ]

  const sidingTypes = [
    'Vinyl', 'Fiber Cement', 'Wood', 'Metal', 'Brick', 'Stone', 'Stucco', 'Composite'
  ]

  const foundationTypes = [
    'Concrete Slab', 'Crawl Space', 'Basement', 'Pier & Beam', 'Block', 'Permanent'
  ]

  const heatingTypes = [
    'Central Gas', 'Central Electric', 'Heat Pump', 'Baseboard', 'Radiant', 'Geothermal'
  ]

  const coolingTypes = [
    'Central Air', 'Heat Pump', 'Window Units', 'Ductless Mini-Split', 'Evaporative'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inventoryId">Inventory ID</Label>
                  <Input
                    id="inventoryId"
                    value={formData.inventoryId}
                    onChange={(e) => handleInputChange('inventoryId', e.target.value)}
                    placeholder="INV-MH-001"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    min="1970"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="Clayton, Champion, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="The Edge, Titan, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="Serial/HUD number"
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
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

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="offerType">Offer Type</Label>
                <Select value={formData.offerType} onValueChange={(value) => handleInputChange('offerType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_sale">For Sale Only</SelectItem>
                    <SelectItem value="for_rent">For Rent Only</SelectItem>
                    <SelectItem value="both">Both Sale & Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                )}
                {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                  <div>
                    <Label htmlFor="rentPrice">Monthly Rent</Label>
                    <Input
                      id="rentPrice"
                      type="number"
                      value={formData.rentPrice}
                      onChange={(e) => handleInputChange('rentPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimensions & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    min="1"
                    max="6"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                    min="1"
                    max="4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.dimensions.width_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'width_ft', parseInt(e.target.value) || 0)}
                    placeholder="14, 16, 28, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.dimensions.length_ft}
                    onChange={(e) => handleNestedChange('dimensions', 'length_ft', parseInt(e.target.value) || 0)}
                    placeholder="60, 70, 80, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="sections">Sections</Label>
                  <Select 
                    value={formData.dimensions.sections.toString()} 
                    onValueChange={(value) => handleNestedChange('dimensions', 'sections', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Single-wide</SelectItem>
                      <SelectItem value="2">Double-wide</SelectItem>
                      <SelectItem value="3">Triple-wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  type="number"
                  value={formData.dimensions.squareFeet}
                  onChange={(e) => handleNestedChange('dimensions', 'squareFeet', parseInt(e.target.value) || 0)}
                  placeholder="Calculated automatically or enter manually"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                    placeholder="City name"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.location.state}
                    onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                    placeholder="State abbreviation"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.location.postalCode}
                    onChange={(e) => handleNestedChange('location', 'postalCode', e.target.value)}
                    placeholder="ZIP code"
                  />
                </div>
                <div>
                  <Label htmlFor="communityName">Community Name</Label>
                  <Input
                    id="communityName"
                    value={formData.location.communityName}
                    onChange={(e) => handleNestedChange('location', 'communityName', e.target.value)}
                    placeholder="Mobile home park/community"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Structural Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roofType">Roof Type</Label>
                  <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select roof type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roofTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sidingType">Siding Type</Label>
                  <Select value={formData.sidingType} onValueChange={(value) => handleInputChange('sidingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select siding type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sidingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="foundationType">Foundation Type</Label>
                <Select value={formData.foundationType} onValueChange={(value) => handleInputChange('foundationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select foundation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {foundationTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HVAC System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heatingType">Heating Type</Label>
                  <Select value={formData.heatingType} onValueChange={(value) => handleInputChange('heatingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select heating type" />
                    </SelectTrigger>
                    <SelectContent>
                      {heatingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="coolingType">Cooling Type</Label>
                  <Select value={formData.coolingType} onValueChange={(value) => handleInputChange('coolingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cooling type" />
                    </SelectTrigger>
                    <SelectContent>
                      {coolingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(featureCategories).map(([categoryKey, category]) => {
              const IconComponent = category.icon
              const categoryFeatures = formData.features[categoryKey] || []
              
              return (
                <Card key={categoryKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {category.label}
                      {categoryFeatures.length > 0 && (
                        <Badge variant="secondary">
                          {categoryFeatures.length} selected
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="grid grid-cols-2 gap-2">
                        {category.options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${categoryKey}-${option}`}
                              checked={categoryFeatures.includes(option)}
                              onCheckedChange={() => handleFeatureToggle(option, categoryKey)}
                            />
                            <Label 
                              htmlFor={`${categoryKey}-${option}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryPhoto">Primary Photo</Label>
                <div className="mt-2">
                  {formData.media.primaryPhoto ? (
                    <div className="relative">
                      <img 
                        src={formData.media.primaryPhoto} 
                        alt="Primary" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleNestedChange('media', 'primaryPhoto', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload primary photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Additional Photos</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {formData.media.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => {
                          const newPhotos = formData.media.photos.filter((_, i) => i !== index)
                          handleNestedChange('media', 'photos', newPhotos)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the manufactured home..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="searchResultsText">Search Results Text</Label>
                <Input
                  id="searchResultsText"
                  value={formData.searchResultsText}
                  onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                  placeholder="Brief text for search results"
                />
              </div>

              <div>
                <Label>Key Features for Marketing</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {keyFeatures.map((feature) => (
                      <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => handleKeyFeatureRemove(feature)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add key feature..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleKeyFeatureAdd(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Manufactured Home
        </Button>
      </div>
    </form>
  )
}