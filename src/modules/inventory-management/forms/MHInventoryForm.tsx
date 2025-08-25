import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Upload, Home, Zap, Shield, Leaf, Archive, Smartphone, Accessibility } from 'lucide-react'

interface MHInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function MHInventoryForm({ initialData, onSubmit, onCancel }: MHInventoryFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    year: initialData?.year || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    serialNumber: initialData?.serialNumber || '',
    condition: initialData?.condition || 'new',
    
    // Pricing
    offerType: initialData?.offerType || 'for_sale',
    salePrice: initialData?.salePrice || '',
    rentPrice: initialData?.rentPrice || '',
    
    // Dimensions
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    squareFootage: initialData?.squareFootage || '',
    width: initialData?.width || '',
    length: initialData?.length || '',
    sections: initialData?.sections || '1',
    
    // Location
    city: initialData?.location?.city || '',
    state: initialData?.location?.state || '',
    postalCode: initialData?.location?.postalCode || '',
    communityName: initialData?.location?.communityName || '',
    
    // Structure
    roofType: initialData?.roofType || '',
    sidingType: initialData?.sidingType || '',
    foundationType: initialData?.foundationType || '',
    hvacType: initialData?.hvacType || '',
    
    // Features
    features: initialData?.features || {},
    
    // Media
    primaryPhoto: initialData?.media?.primaryPhoto || '',
    photos: initialData?.media?.photos || [],
    
    // Marketing
    description: initialData?.description || '',
    searchResultsText: initialData?.searchResultsText || '',
    keyFeatures: initialData?.keyFeatures || []
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [keyFeatureInput, setKeyFeatureInput] = useState('')

  useEffect(() => {
    // Initialize selected features from form data
    const features = Object.entries(formData.features)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key)
    setSelectedFeatures(features)
  }, [formData.features])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (featureKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: checked
      }
    }))
  }

  const handleAddKeyFeature = () => {
    if (keyFeatureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, keyFeatureInput.trim()]
      }))
      setKeyFeatureInput('')
    }
  }

  const handleRemoveKeyFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Transform data for submission
    const submitData = {
      ...formData,
      year: parseInt(formData.year) || undefined,
      bedrooms: parseInt(formData.bedrooms) || undefined,
      bathrooms: parseFloat(formData.bathrooms) || undefined,
      squareFootage: parseInt(formData.squareFootage) || undefined,
      width: parseInt(formData.width) || undefined,
      length: parseInt(formData.length) || undefined,
      sections: parseInt(formData.sections) || 1,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      rentPrice: formData.rentPrice ? parseFloat(formData.rentPrice) : undefined,
      location: {
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        communityName: formData.communityName
      },
      media: {
        primaryPhoto: formData.primaryPhoto,
        photos: formData.photos
      }
    }
    
    onSubmit(submitData)
  }

  // Feature categories with comprehensive options
  const featureCategories = [
    {
      id: 'standard',
      name: 'Standard Amenities',
      icon: Home,
      features: [
        { key: 'centralAir', label: 'Central Air Conditioning' },
        { key: 'fireplace', label: 'Fireplace' },
        { key: 'dishwasher', label: 'Dishwasher' },
        { key: 'washerDryer', label: 'Washer/Dryer Hookups' },
        { key: 'vaultedCeilings', label: 'Vaulted Ceilings' },
        { key: 'deck', label: 'Deck/Porch' },
        { key: 'shed', label: 'Storage Shed' },
        { key: 'garbageDisposal', label: 'Garbage Disposal' },
        { key: 'ceilingFans', label: 'Ceiling Fans' },
        { key: 'walkInCloset', label: 'Walk-in Closet' },
        { key: 'masterBathTub', label: 'Master Bath Tub' },
        { key: 'separateShower', label: 'Separate Shower' },
        { key: 'doubleSinks', label: 'Double Sinks' },
        { key: 'kitchenIsland', label: 'Kitchen Island' },
        { key: 'pantry', label: 'Pantry' },
        { key: 'laundryRoom', label: 'Dedicated Laundry Room' },
        { key: 'mudroom', label: 'Mudroom' },
        { key: 'frontPorch', label: 'Front Porch' },
        { key: 'backPorch', label: 'Back Porch' },
        { key: 'carport', label: 'Carport' },
        { key: 'garage', label: 'Garage' },
        { key: 'fencedYard', label: 'Fenced Yard' },
        { key: 'landscaping', label: 'Professional Landscaping' },
        { key: 'sprinklerSystem', label: 'Sprinkler System' },
        { key: 'outdoorLighting', label: 'Outdoor Lighting' }
      ]
    },
    {
      id: 'premium',
      name: 'Premium Upgrades',
      icon: Zap,
      features: [
        { key: 'graniteCounters', label: 'Granite Countertops' },
        { key: 'stainlessAppliances', label: 'Stainless Steel Appliances' },
        { key: 'hardwoodFloors', label: 'Hardwood Floors' },
        { key: 'tileFloors', label: 'Tile Floors' },
        { key: 'carpetFloors', label: 'Carpet Floors' },
        { key: 'laminateFloors', label: 'Laminate Floors' },
        { key: 'customCabinets', label: 'Custom Cabinetry' },
        { key: 'crownMolding', label: 'Crown Molding' },
        { key: 'chairRail', label: 'Chair Rail' },
        { key: 'wainscoting', label: 'Wainscoting' },
        { key: 'trayceiling', label: 'Tray Ceiling' },
        { key: 'cofferedCeiling', label: 'Coffered Ceiling' },
        { key: 'skylights', label: 'Skylights' },
        { key: 'bayWindows', label: 'Bay Windows' },
        { key: 'frenchDoors', label: 'French Doors' },
        { key: 'slidingDoors', label: 'Sliding Patio Doors' },
        { key: 'wetBar', label: 'Wet Bar' },
        { key: 'wineCooler', label: 'Wine Cooler' },
        { key: 'builtInEntertainment', label: 'Built-in Entertainment Center' },
        { key: 'customLighting', label: 'Custom Lighting Package' }
      ]
    },
    {
      id: 'safety',
      name: 'Safety & Security',
      icon: Shield,
      features: [
        { key: 'smokeDetectors', label: 'Smoke Detectors' },
        { key: 'carbonMonoxideDetector', label: 'Carbon Monoxide Detector' },
        { key: 'securitySystem', label: 'Security System' },
        { key: 'securityCameras', label: 'Security Cameras' },
        { key: 'motionLights', label: 'Motion Sensor Lights' },
        { key: 'deadbolts', label: 'Deadbolt Locks' },
        { key: 'windowLocks', label: 'Window Security Locks' },
        { key: 'fireExtinguisher', label: 'Fire Extinguisher' },
        { key: 'emergencyExits', label: 'Emergency Exit Windows' },
        { key: 'stormShelter', label: 'Storm Shelter/Safe Room' },
        { key: 'gfciOutlets', label: 'GFCI Outlets' },
        { key: 'surgeProtection', label: 'Whole House Surge Protection' },
        { key: 'backupGenerator', label: 'Backup Generator' },
        { key: 'floodVents', label: 'Flood Vents' },
        { key: 'hurricaneStraps', label: 'Hurricane Tie-downs' }
      ]
    },
    {
      id: 'energy',
      name: 'Energy Efficiency',
      icon: Leaf,
      features: [
        { key: 'energyStar', label: 'Energy Star Certified' },
        { key: 'solarPanels', label: 'Solar Panels' },
        { key: 'solarWaterHeater', label: 'Solar Water Heater' },
        { key: 'tanklessWaterHeater', label: 'Tankless Water Heater' },
        { key: 'programmableThermostat', label: 'Programmable Thermostat' },
        { key: 'doublePane', label: 'Double Pane Windows' },
        { key: 'triplePane', label: 'Triple Pane Windows' },
        { key: 'lowEWindows', label: 'Low-E Windows' },
        { key: 'extraInsulation', label: 'Extra Insulation' },
        { key: 'radiantBarrier', label: 'Radiant Barrier' },
        { key: 'energyEfficientAppliances', label: 'Energy Efficient Appliances' },
        { key: 'ledLighting', label: 'LED Lighting Package' },
        { key: 'smartThermostat', label: 'Smart Thermostat' },
        { key: 'heatPump', label: 'Heat Pump System' },
        { key: 'geothermal', label: 'Geothermal System' }
      ]
    },
    {
      id: 'storage',
      name: 'Storage Solutions',
      icon: Archive,
      features: [
        { key: 'walkInPantry', label: 'Walk-in Pantry' },
        { key: 'linen', label: 'Linen Closet' },
        { key: 'coatCloset', label: 'Coat Closet' },
        { key: 'hallCloset', label: 'Hall Closet' },
        { key: 'bedroomClosets', label: 'Bedroom Closets' },
        { key: 'masterCloset', label: 'Master Bedroom Closet' },
        { key: 'utilityCloset', label: 'Utility Closet' },
        { key: 'storageClosets', label: 'Additional Storage Closets' },
        { key: 'atticStorage', label: 'Attic Storage' },
        { key: 'underStairStorage', label: 'Under-stair Storage' },
        { key: 'builtInShelving', label: 'Built-in Shelving' },
        { key: 'kitchenCabinets', label: 'Extra Kitchen Cabinets' },
        { key: 'bathroomCabinets', label: 'Bathroom Cabinets' },
        { key: 'outsideStorage', label: 'Outside Storage' }
      ]
    },
    {
      id: 'technology',
      name: 'Technology Features',
      icon: Smartphone,
      features: [
        { key: 'smartHome', label: 'Smart Home Package' },
        { key: 'wifiPrewired', label: 'WiFi Pre-wired' },
        { key: 'cablePrewired', label: 'Cable/Internet Pre-wired' },
        { key: 'phonePrewired', label: 'Phone Pre-wired' },
        { key: 'securityPrewired', label: 'Security System Pre-wired' },
        { key: 'surround', label: 'Surround Sound Pre-wired' },
        { key: 'smartDoorbell', label: 'Smart Doorbell' },
        { key: 'smartLocks', label: 'Smart Door Locks' },
        { key: 'smartLighting', label: 'Smart Lighting Controls' },
        { key: 'smartAppliances', label: 'Smart Appliances' },
        { key: 'homeAutomation', label: 'Home Automation Hub' },
        { key: 'voiceControl', label: 'Voice Control Ready' },
        { key: 'usbOutlets', label: 'USB Charging Outlets' },
        { key: 'wirelessCharging', label: 'Wireless Charging Stations' },
        { key: 'fiberOptic', label: 'Fiber Optic Ready' }
      ]
    },
    {
      id: 'accessibility',
      name: 'Accessibility Features',
      icon: Accessibility,
      features: [
        { key: 'adaCompliant', label: 'ADA Compliant' },
        { key: 'wheelchairAccessible', label: 'Wheelchair Accessible' },
        { key: 'rampAccess', label: 'Ramp Access' },
        { key: 'wideHallways', label: 'Wide Hallways' },
        { key: 'wideDoorways', label: 'Wide Doorways' },
        { key: 'rollInShower', label: 'Roll-in Shower' },
        { key: 'grabBars', label: 'Grab Bars' },
        { key: 'lowerCounters', label: 'Lowered Countertops' },
        { key: 'lowerSwitches', label: 'Lowered Light Switches' },
        { key: 'leverHandles', label: 'Lever Door Handles' },
        { key: 'noStepEntry', label: 'No-step Entry' },
        { key: 'accessibleParking', label: 'Accessible Parking' },
        { key: 'visualAlerts', label: 'Visual Alert System' }
      ]
    }
  ]

  const getSelectedCount = (categoryId: string) => {
    const category = featureCategories.find(c => c.id === categoryId)
    if (!category) return 0
    return category.features.filter(f => formData.features[f.key]).length
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {initialData ? 'Edit Manufactured Home' : 'Add New Manufactured Home'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      placeholder="Clayton"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="The Edge"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="CLT123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="refurbished">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="offerType">Offer Type</Label>
                    <Select value={formData.offerType} onValueChange={(value) => handleInputChange('offerType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for_sale">For Sale</SelectItem>
                        <SelectItem value="for_rent">For Rent</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                      <div>
                        <Label htmlFor="salePrice">Sale Price</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          value={formData.salePrice}
                          onChange={(e) => handleInputChange('salePrice', e.target.value)}
                          placeholder="95000"
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
                          onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                          placeholder="1200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dimensions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="squareFootage">Square Footage</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        value={formData.squareFootage}
                        onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                        placeholder="1450"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sections">Sections</Label>
                      <Select value={formData.sections} onValueChange={(value) => handleInputChange('sections', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sections" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Single Wide</SelectItem>
                          <SelectItem value="2">Double Wide</SelectItem>
                          <SelectItem value="3">Triple Wide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="width">Width (ft)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        placeholder="28"
                      />
                    </div>
                    <div>
                      <Label htmlFor="length">Length (ft)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        placeholder="66"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Tampa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="FL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="33601"
                      />
                    </div>
                    <div>
                      <Label htmlFor="communityName">Community Name</Label>
                      <Input
                        id="communityName"
                        value={formData.communityName}
                        onChange={(e) => handleInputChange('communityName', e.target.value)}
                        placeholder="Sunset Palms Mobile Home Community"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Structure Tab */}
              <TabsContent value="structure" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roofType">Roof Type</Label>
                    <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shingle">Asphalt Shingle</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="tile">Tile</SelectItem>
                        <SelectItem value="rubber">Rubber Membrane</SelectItem>
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
                        <SelectItem value="vinyl">Vinyl</SelectItem>
                        <SelectItem value="fiber_cement">Fiber Cement</SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="brick">Brick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="foundationType">Foundation Type</Label>
                    <Select value={formData.foundationType} onValueChange={(value) => handleInputChange('foundationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select foundation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pier_beam">Pier & Beam</SelectItem>
                        <SelectItem value="concrete_slab">Concrete Slab</SelectItem>
                        <SelectItem value="crawl_space">Crawl Space</SelectItem>
                        <SelectItem value="basement">Basement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hvacType">HVAC Type</Label>
                    <Select value={formData.hvacType} onValueChange={(value) => handleInputChange('hvacType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HVAC type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central_air">Central Air & Heat</SelectItem>
                        <SelectItem value="heat_pump">Heat Pump</SelectItem>
                        <SelectItem value="window_units">Window Units</SelectItem>
                        <SelectItem value="mini_split">Mini Split System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <div className="space-y-6">
                  {featureCategories.map((category) => {
                    const Icon = category.icon
                    const selectedCount = getSelectedCount(category.id)
                    
                    return (
                      <Card key={category.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between text-base">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              {category.name}
                            </div>
                            {selectedCount > 0 && (
                              <Badge variant="secondary">
                                {selectedCount} selected
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-48">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
                              {category.features.map((feature) => (
                                <div key={feature.key} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={feature.key}
                                    checked={formData.features[feature.key] || false}
                                    onCheckedChange={(checked) => handleFeatureToggle(feature.key, checked as boolean)}
                                  />
                                  <Label htmlFor={feature.key} className="text-sm font-normal cursor-pointer">
                                    {feature.label}
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

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <div>
                  <Label htmlFor="primaryPhoto">Primary Photo URL</Label>
                  <Input
                    id="primaryPhoto"
                    value={formData.primaryPhoto}
                    onChange={(e) => handleInputChange('primaryPhoto', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                  {formData.primaryPhoto && (
                    <div className="mt-2">
                      <img 
                        src={formData.primaryPhoto} 
                        alt="Primary photo preview" 
                        className="w-32 h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Additional Photos</Label>
                  <div className="space-y-2">
                    {formData.photos.map((photo: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={photo}
                          onChange={(e) => {
                            const newPhotos = [...formData.photos]
                            newPhotos[index] = e.target.value
                            handleInputChange('photos', newPhotos)
                          }}
                          placeholder="https://example.com/photo.jpg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPhotos = formData.photos.filter((_: string, i: number) => i !== index)
                            handleInputChange('photos', newPhotos)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleInputChange('photos', [...formData.photos, ''])}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Marketing Tab */}
              <TabsContent value="marketing" className="space-y-6">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the manufactured home..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="searchResultsText">Search Results Text</Label>
                  <Input
                    id="searchResultsText"
                    value={formData.searchResultsText}
                    onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                    placeholder="2023 Clayton The Edge - 3BR/2BA Double-wide"
                  />
                </div>

                <div>
                  <Label>Key Features</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={keyFeatureInput}
                        onChange={(e) => setKeyFeatureInput(e.target.value)}
                        placeholder="Add a key feature..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddKeyFeature()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddKeyFeature}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.keyFeatures.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveKeyFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update Home' : 'Add Home'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}