import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Home, 
  Zap, 
  Droplets, 
  Thermometer, 
  Shield, 
  Palette, 
  Wrench,
  MapPin,
  DollarSign,
  FileText,
  Camera,
  Plus,
  X,
  Package
} from 'lucide-react'

interface AddEditHomeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
  mode: 'add' | 'edit'
}

export default function AddEditHomeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  mode 
}: AddEditHomeModalProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    year: initialData?.year || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    serialNumber: initialData?.serialNumber || '',
    condition: initialData?.condition || 'new',
    
    // Pricing
    salePrice: initialData?.salePrice || '',
    rentPrice: initialData?.rentPrice || '',
    cost: initialData?.cost || '',
    offerType: initialData?.offerType || 'for_sale',
    
    // Dimensions & Layout
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
    lotNumber: initialData?.location?.lotNumber || '',
    
    // Features - organized by category
    amenities: initialData?.features?.amenities || [],
    upgrades: initialData?.features?.upgrades || [],
    safetyFeatures: initialData?.features?.safetyFeatures || [],
    energyFeatures: initialData?.features?.energyFeatures || [],
    accessibilityFeatures: initialData?.features?.accessibilityFeatures || [],
    storageFeatures: initialData?.features?.storageFeatures || [],
    technologyFeatures: initialData?.features?.technologyFeatures || [],
    
    // Systems
    roofType: initialData?.features?.roofType || '',
    sidingType: initialData?.features?.sidingType || '',
    foundationType: initialData?.features?.foundationType || '',
    heatingType: initialData?.features?.heatingType || '',
    coolingType: initialData?.features?.coolingType || '',
    
    // Marketing
    description: initialData?.description || '',
    searchResultsText: initialData?.searchResultsText || '',
    keyFeatures: initialData?.keyFeatures || [],
    
    // Media
    primaryPhoto: initialData?.media?.primaryPhoto || '',
    photos: initialData?.media?.photos || [],
    
    // Status
    status: initialData?.status || 'available'
  })

  const [activeTab, setActiveTab] = useState('basic')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Transform form data to match expected structure
    const submitData = {
      ...formData,
      listingType: 'manufactured_home',
      location: {
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        communityName: formData.communityName,
        lotNumber: formData.lotNumber
      },
      dimensions: {
        width_ft: parseInt(formData.width) || 0,
        length_ft: parseInt(formData.length) || 0,
        sections: parseInt(formData.sections) || 1,
        squareFootage: parseInt(formData.squareFootage) || 0
      },
      features: {
        amenities: formData.amenities,
        upgrades: formData.upgrades,
        safetyFeatures: formData.safetyFeatures,
        energyFeatures: formData.energyFeatures,
        accessibilityFeatures: formData.accessibilityFeatures,
        storageFeatures: formData.storageFeatures,
        technologyFeatures: formData.technologyFeatures,
        roofType: formData.roofType,
        sidingType: formData.sidingType,
        foundationType: formData.foundationType,
        heatingType: formData.heatingType,
        coolingType: formData.coolingType
      },
      media: {
        primaryPhoto: formData.primaryPhoto,
        photos: formData.photos
      }
    }
    
    onSubmit(submitData)
    onClose()
  }

  // Comprehensive feature options
  const featureOptions = {
    amenities: [
      'Central Air', 'Fireplace', 'Dishwasher', 'Washer/Dryer Hookup', 'Washer/Dryer Included',
      'Vaulted Ceilings', 'Walk-in Closet', 'Master Suite', 'Open Floor Plan', 'Island Kitchen',
      'Pantry', 'Linen Closet', 'Utility Room', 'Mudroom', 'Home Office', 'Bonus Room',
      'Covered Parking', 'Storage Shed', 'Deck', 'Patio', 'Landscaping', 'Sprinkler System',
      'Ceiling Fans', 'Bay Windows', 'French Doors', 'Skylights', 'Built-in Shelving'
    ],
    upgrades: [
      'Premium Flooring', 'Granite Countertops', 'Stainless Steel Appliances', 'Custom Cabinets',
      'Crown Molding', 'Chair Rail', 'Wainscoting', 'Coffered Ceilings', 'Recessed Lighting',
      'Smart Home Features', 'Security System', 'Whole House Generator', 'Solar Panels',
      'Energy Star Appliances', 'Low-E Windows', 'Upgraded HVAC', 'Tankless Water Heater',
      'Hardwood Floors', 'Tile Backsplash', 'Quartz Countertops', 'Soft Close Cabinets'
    ],
    safety: [
      'Smoke Detectors', 'Carbon Monoxide Detectors', 'Fire Extinguisher', 'Security System',
      'Deadbolt Locks', 'Window Locks', 'Motion Lights', 'Emergency Exits', 'GFCI Outlets',
      'Whole House Surge Protection', 'Storm Shutters', 'Safe Room', 'Security Cameras',
      'Alarm System', 'Fire Sprinklers', 'Emergency Lighting', 'Backup Power'
    ],
    energy: [
      'Energy Star Appliances', 'LED Lighting', 'Programmable Thermostat', 'High Efficiency HVAC',
      'Insulated Windows', 'Extra Insulation', 'Solar Ready', 'Solar Panels', 'Energy Recovery Ventilator',
      'Smart Thermostat', 'Energy Star Certification', 'Low-E Windows', 'Radiant Barrier',
      'High Efficiency Water Heater', 'Energy Star HVAC', 'Smart Electrical Panel'
    ],
    accessibility: [
      'Wheelchair Accessible', 'Ramp Access', 'Wide Doorways', 'Accessible Bathroom', 'Grab Bars',
      'Lower Countertops', 'Accessible Light Switches', 'Roll-in Shower', 'Accessible Parking',
      'Lever Door Handles', 'Visual Alarms', 'Accessible Kitchen', 'Zero-step Entry'
    ],
    storage: [
      'Walk-in Closets', 'Linen Closets', 'Pantry', 'Utility Room', 'Attic Storage',
      'Under-stair Storage', 'Built-in Shelving', 'Storage Shed', 'Garage', 'Carport',
      'Basement Storage', 'Closet Organizers', 'Built-in Wardrobes', 'Storage Bench'
    ],
    technology: [
      'Pre-wired for Cable/Internet', 'Smart Home Ready', 'Security System Pre-wire',
      'Surround Sound Pre-wire', 'USB Outlets', 'Smart Thermostat', 'Smart Doorbell',
      'WiFi Extenders', 'Ethernet Wiring', 'Fiber Optic Ready', 'Smart Lighting',
      'Home Automation Hub', 'Smart Locks', 'Video Doorbell', 'Whole Home Audio'
    ],
    structural: {
      roofTypes: ['Gable', 'Hip', 'Shed', 'Gambrel', 'Metal', 'Shingle', 'Membrane'],
      sidingTypes: ['Vinyl', 'Fiber Cement', 'Wood', 'Metal', 'Brick', 'Stone', 'Composite'],
      foundationTypes: ['Concrete Slab', 'Crawl Space', 'Basement', 'Pier & Beam', 'Permanent Foundation'],
      heatingTypes: ['Central Heat', 'Heat Pump', 'Baseboard', 'Radiant Floor', 'Ductless Mini-Split'],
      coolingTypes: ['Central Air', 'Heat Pump', 'Window Units', 'Ductless Mini-Split']
    }
  }

  const CheckboxGroup = ({ 
    title, 
    options, 
    field, 
    icon: Icon,
    maxHeight = 'max-h-48'
  }: { 
    title: string
    options: string[]
    field: string
    icon: React.ComponentType<any>
    maxHeight?: string
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`${maxHeight} pr-4`}>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field}-${option}`}
                  checked={formData[field].includes(option)}
                  onCheckedChange={() => handleArrayToggle(field, option)}
                />
                <Label htmlFor={`${field}-${option}`} className="text-sm font-normal leading-tight">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        {formData[field].length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground mb-2">
              Selected ({formData[field].length}):
            </div>
            <div className="flex flex-wrap gap-1">
              {formData[field].slice(0, 3).map((item: string) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
              {formData[field].length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{formData[field].length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit' : 'Add'} Manufactured Home
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Basic Details */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Basic Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="year" className="text-sm">Year</Label>
                              <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleInputChange('year', e.target.value)}
                                placeholder="2024"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="condition" className="text-sm">Condition</Label>
                              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                                <SelectTrigger className="h-9">
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
                          
                          <div>
                            <Label htmlFor="make" className="text-sm">Manufacturer</Label>
                            <Input
                              id="make"
                              value={formData.make}
                              onChange={(e) => handleInputChange('make', e.target.value)}
                              placeholder="Clayton, Champion, Fleetwood..."
                              className="h-9"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="model" className="text-sm">Model</Label>
                            <Input
                              id="model"
                              value={formData.model}
                              onChange={(e) => handleInputChange('model', e.target.value)}
                              placeholder="The Edge, Titan, Berkshire..."
                              className="h-9"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="serialNumber" className="text-sm">Serial Number</Label>
                            <Input
                              id="serialNumber"
                              value={formData.serialNumber}
                              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                              placeholder="Serial/HUD number"
                              className="h-9"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Dimensions */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Dimensions & Layout</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="bedrooms" className="text-sm">Bedrooms</Label>
                              <Input
                                id="bedrooms"
                                type="number"
                                value={formData.bedrooms}
                                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                                placeholder="3"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bathrooms" className="text-sm">Bathrooms</Label>
                              <Input
                                id="bathrooms"
                                type="number"
                                step="0.5"
                                value={formData.bathrooms}
                                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                                placeholder="2"
                                className="h-9"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="squareFootage" className="text-sm">Square Footage</Label>
                            <Input
                              id="squareFootage"
                              type="number"
                              value={formData.squareFootage}
                              onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                              placeholder="1450"
                              className="h-9"
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label htmlFor="width" className="text-sm">Width (ft)</Label>
                              <Input
                                id="width"
                                type="number"
                                value={formData.width}
                                onChange={(e) => handleInputChange('width', e.target.value)}
                                placeholder="28"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="length" className="text-sm">Length (ft)</Label>
                              <Input
                                id="length"
                                type="number"
                                value={formData.length}
                                onChange={(e) => handleInputChange('length', e.target.value)}
                                placeholder="66"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sections" className="text-sm">Sections</Label>
                              <Select value={formData.sections} onValueChange={(value) => handleInputChange('sections', value)}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Single Wide</SelectItem>
                                  <SelectItem value="2">Double Wide</SelectItem>
                                  <SelectItem value="3">Triple Wide</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Pricing */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Pricing
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label htmlFor="offerType" className="text-sm">Offer Type</Label>
                            <Select value={formData.offerType} onValueChange={(value) => handleInputChange('offerType', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="for_sale">For Sale</SelectItem>
                                <SelectItem value="for_rent">For Rent</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                            <div>
                              <Label htmlFor="salePrice" className="text-sm">Sale Price</Label>
                              <Input
                                id="salePrice"
                                type="number"
                                value={formData.salePrice}
                                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                                placeholder="125000"
                                className="h-9"
                              />
                            </div>
                          )}
                          
                          {(formData.offerType === 'for_rent' || formData.offerType === 'both') && (
                            <div>
                              <Label htmlFor="rentPrice" className="text-sm">Monthly Rent</Label>
                              <Input
                                id="rentPrice"
                                type="number"
                                value={formData.rentPrice}
                                onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                                placeholder="1200"
                                className="h-9"
                              />
                            </div>
                          )}
                          
                          <div>
                            <Label htmlFor="status" className="text-sm">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="rented">Rented</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Location */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="city" className="text-sm">City</Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="Austin"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state" className="text-sm">State</Label>
                              <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                placeholder="TX"
                                className="h-9"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="communityName" className="text-sm">Community Name</Label>
                            <Input
                              id="communityName"
                              value={formData.communityName}
                              onChange={(e) => handleInputChange('communityName', e.target.value)}
                              placeholder="Sunset Palms Mobile Home Community"
                              className="h-9"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="postalCode" className="text-sm">Postal Code</Label>
                              <Input
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                placeholder="78701"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lotNumber" className="text-sm">Lot Number</Label>
                              <Input
                                id="lotNumber"
                                value={formData.lotNumber}
                                onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                                placeholder="42"
                                className="h-9"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Structure Tab */}
                  <TabsContent value="structure" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Structural Elements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label htmlFor="roofType" className="text-sm">Roof Type</Label>
                            <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select roof type" />
                              </SelectTrigger>
                              <SelectContent>
                                {featureOptions.structural.roofTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="sidingType" className="text-sm">Siding Type</Label>
                            <Select value={formData.sidingType} onValueChange={(value) => handleInputChange('sidingType', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select siding type" />
                              </SelectTrigger>
                              <SelectContent>
                                {featureOptions.structural.sidingTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="foundationType" className="text-sm">Foundation Type</Label>
                            <Select value={formData.foundationType} onValueChange={(value) => handleInputChange('foundationType', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select foundation type" />
                              </SelectTrigger>
                              <SelectContent>
                                {featureOptions.structural.foundationTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Thermometer className="h-4 w-4" />
                            HVAC System
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label htmlFor="heatingType" className="text-sm">Heating Type</Label>
                            <Select value={formData.heatingType} onValueChange={(value) => handleInputChange('heatingType', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select heating type" />
                              </SelectTrigger>
                              <SelectContent>
                                {featureOptions.structural.heatingTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="coolingType" className="text-sm">Cooling Type</Label>
                            <Select value={formData.coolingType} onValueChange={(value) => handleInputChange('coolingType', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select cooling type" />
                              </SelectTrigger>
                              <SelectContent>
                                {featureOptions.structural.coolingTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Features Tab */}
                  <TabsContent value="features" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <CheckboxGroup
                        title="Standard Amenities"
                        options={featureOptions.amenities}
                        field="amenities"
                        icon={Home}
                        maxHeight="max-h-40"
                      />
                      
                      <CheckboxGroup
                        title="Premium Upgrades"
                        options={featureOptions.upgrades}
                        field="upgrades"
                        icon={Palette}
                        maxHeight="max-h-40"
                      />
                      
                      <CheckboxGroup
                        title="Safety & Security"
                        options={featureOptions.safety}
                        field="safetyFeatures"
                        icon={Shield}
                        maxHeight="max-h-40"
                      />
                      
                      <CheckboxGroup
                        title="Energy Efficiency"
                        options={featureOptions.energy}
                        field="energyFeatures"
                        icon={Zap}
                        maxHeight="max-h-40"
                      />
                      
                      <CheckboxGroup
                        title="Storage Solutions"
                        options={featureOptions.storage}
                        field="storageFeatures"
                        icon={Package}
                        maxHeight="max-h-40"
                      />
                      
                      <CheckboxGroup
                        title="Technology & Smart Features"
                        options={featureOptions.technology}
                        field="technologyFeatures"
                        icon={Wrench}
                        maxHeight="max-h-40"
                      />
                    </div>

                    {/* Accessibility Features */}
                    <CheckboxGroup
                      title="Accessibility Features"
                      options={featureOptions.accessibility}
                      field="accessibilityFeatures"
                      icon={Shield}
                      maxHeight="max-h-32"
                    />
                  </TabsContent>

                  {/* Media Tab */}
                  <TabsContent value="media" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Primary Photo */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Primary Photo
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Main photo for listings and search results
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Input
                              value={formData.primaryPhoto}
                              onChange={(e) => handleInputChange('primaryPhoto', e.target.value)}
                              placeholder="Enter image URL"
                              className="h-9"
                            />
                            {formData.primaryPhoto && (
                              <div className="relative">
                                <img 
                                  src={formData.primaryPhoto} 
                                  alt="Primary photo preview" 
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Additional Photos */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Additional Photos</CardTitle>
                          <CardDescription className="text-sm">
                            Interior, exterior, and detail photos
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter image URL"
                                className="h-9"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.target as HTMLInputElement
                                    if (input.value) {
                                      handleInputChange('photos', [...formData.photos, input.value])
                                      input.value = ''
                                    }
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                                  if (input?.value) {
                                    handleInputChange('photos', [...formData.photos, input.value])
                                    input.value = ''
                                  }
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {formData.photos.length > 0 && (
                              <div className="grid grid-cols-3 gap-2">
                                {formData.photos.map((url: string, index: number) => (
                                  <div key={index} className="relative group">
                                    <img 
                                      src={url} 
                                      alt={`Photo ${index + 1}`} 
                                      className="w-full h-16 object-cover rounded-md"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-0.5 right-0.5 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => {
                                        const newPhotos = formData.photos.filter((_: any, i: number) => i !== index)
                                        handleInputChange('photos', newPhotos)
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Marketing Tab */}
                  <TabsContent value="marketing" className="mt-0 space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Marketing Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="description" className="text-sm">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Detailed description highlighting key features and benefits..."
                            rows={4}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="searchResultsText" className="text-sm">Search Results Text</Label>
                          <Input
                            id="searchResultsText"
                            value={formData.searchResultsText}
                            onChange={(e) => handleInputChange('searchResultsText', e.target.value)}
                            placeholder="Brief text for search results and listings"
                            className="h-9"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm">Key Features (for marketing highlights)</Label>
                          <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md min-h-[60px]">
                            {formData.keyFeatures.map((feature: string, index: number) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {feature}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => {
                                    const newFeatures = formData.keyFeatures.filter((_: any, i: number) => i !== index)
                                    handleInputChange('keyFeatures', newFeatures)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const feature = prompt('Enter key feature:')
                                if (feature) {
                                  handleInputChange('keyFeatures', [...formData.keyFeatures, feature])
                                }
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Add key selling points that will be highlighted in marketing materials
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </ScrollArea>
              </div>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'edit' ? 'Update' : 'Create'} Home
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}