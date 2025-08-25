import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  X
} from 'lucide-react'

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
    
    // Structural Features
    roofType: initialData?.features?.roofType || '',
    sidingType: initialData?.features?.sidingType || '',
    foundationType: initialData?.features?.foundationType || '',
    insulationType: initialData?.features?.insulationType || '',
    windowType: initialData?.features?.windowType || '',
    
    // Electrical Features
    electricalPanel: initialData?.features?.electricalPanel || '',
    outlets: initialData?.features?.outlets || '',
    lighting: initialData?.features?.lighting || '',
    
    // Plumbing Features
    plumbingType: initialData?.features?.plumbingType || '',
    waterHeaterType: initialData?.features?.waterHeaterType || '',
    waterHeaterSize: initialData?.features?.waterHeaterSize || '',
    
    // HVAC Features
    heatingType: initialData?.features?.heatingType || '',
    coolingType: initialData?.features?.coolingType || '',
    ductworkType: initialData?.features?.ductworkType || '',
    
    // Kitchen Features
    kitchenAppliances: initialData?.features?.kitchenAppliances || [],
    counterTopType: initialData?.features?.counterTopType || '',
    cabinetType: initialData?.features?.cabinetType || '',
    
    // Bathroom Features
    bathroomFixtures: initialData?.features?.bathroomFixtures || [],
    vanityType: initialData?.features?.vanityType || '',
    
    // Flooring
    flooringTypes: initialData?.features?.flooringTypes || [],
    
    // Interior Features
    ceilingHeight: initialData?.features?.ceilingHeight || '',
    ceilingType: initialData?.features?.ceilingType || '',
    
    // Exterior Features
    porchType: initialData?.features?.porchType || '',
    deckSize: initialData?.features?.deckSize || '',
    
    // Amenities & Upgrades
    amenities: initialData?.features?.amenities || [],
    upgrades: initialData?.features?.upgrades || [],
    
    // Safety & Compliance
    safetyFeatures: initialData?.features?.safetyFeatures || [],
    certifications: initialData?.features?.certifications || [],
    
    // Energy Efficiency
    energyFeatures: initialData?.features?.energyFeatures || [],
    energyRating: initialData?.features?.energyRating || '',
    
    // Accessibility
    accessibilityFeatures: initialData?.features?.accessibilityFeatures || [],
    
    // Storage
    storageFeatures: initialData?.features?.storageFeatures || [],
    
    // Technology
    technologyFeatures: initialData?.features?.technologyFeatures || [],
    
    // Warranty & Service
    warrantyInfo: initialData?.features?.warrantyInfo || '',
    serviceHistory: initialData?.features?.serviceHistory || '',
    
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
        // Structural
        roofType: formData.roofType,
        sidingType: formData.sidingType,
        foundationType: formData.foundationType,
        insulationType: formData.insulationType,
        windowType: formData.windowType,
        
        // Systems
        electricalPanel: formData.electricalPanel,
        outlets: formData.outlets,
        lighting: formData.lighting,
        plumbingType: formData.plumbingType,
        waterHeaterType: formData.waterHeaterType,
        waterHeaterSize: formData.waterHeaterSize,
        heatingType: formData.heatingType,
        coolingType: formData.coolingType,
        ductworkType: formData.ductworkType,
        
        // Interior
        kitchenAppliances: formData.kitchenAppliances,
        counterTopType: formData.counterTopType,
        cabinetType: formData.cabinetType,
        bathroomFixtures: formData.bathroomFixtures,
        vanityType: formData.vanityType,
        flooringTypes: formData.flooringTypes,
        ceilingHeight: formData.ceilingHeight,
        ceilingType: formData.ceilingType,
        
        // Exterior
        porchType: formData.porchType,
        deckSize: formData.deckSize,
        
        // Features & Amenities
        amenities: formData.amenities,
        upgrades: formData.upgrades,
        safetyFeatures: formData.safetyFeatures,
        certifications: formData.certifications,
        energyFeatures: formData.energyFeatures,
        energyRating: formData.energyRating,
        accessibilityFeatures: formData.accessibilityFeatures,
        storageFeatures: formData.storageFeatures,
        technologyFeatures: formData.technologyFeatures,
        
        // Service
        warrantyInfo: formData.warrantyInfo,
        serviceHistory: formData.serviceHistory
      },
      media: {
        primaryPhoto: formData.primaryPhoto,
        photos: formData.photos
      }
    }
    
    onSubmit(submitData)
  }

  // Feature options organized by category
  const featureOptions = {
    structural: {
      roofTypes: ['Gable', 'Hip', 'Shed', 'Gambrel', 'Metal', 'Shingle', 'Membrane'],
      sidingTypes: ['Vinyl', 'Fiber Cement', 'Wood', 'Metal', 'Brick', 'Stone', 'Composite'],
      foundationTypes: ['Concrete Slab', 'Crawl Space', 'Basement', 'Pier & Beam', 'Permanent Foundation'],
      insulationTypes: ['Fiberglass', 'Foam', 'Cellulose', 'Spray Foam', 'Radiant Barrier'],
      windowTypes: ['Single Pane', 'Double Pane', 'Triple Pane', 'Low-E', 'Vinyl', 'Wood', 'Aluminum']
    },
    electrical: {
      panels: ['100 Amp', '150 Amp', '200 Amp', 'Upgraded Panel'],
      outlets: ['Standard', 'GFCI Protected', 'USB Outlets', 'Smart Outlets'],
      lighting: ['LED Throughout', 'Recessed Lighting', 'Ceiling Fans', 'Under Cabinet', 'Exterior Lighting']
    },
    plumbing: {
      types: ['PEX', 'Copper', 'CPVC', 'PVC'],
      waterHeaterTypes: ['Electric', 'Gas', 'Tankless', 'Heat Pump'],
      waterHeaterSizes: ['30 Gallon', '40 Gallon', '50 Gallon', '80 Gallon', 'Tankless']
    },
    hvac: {
      heatingTypes: ['Central Heat', 'Heat Pump', 'Baseboard', 'Radiant Floor', 'Ductless Mini-Split'],
      coolingTypes: ['Central Air', 'Heat Pump', 'Window Units', 'Ductless Mini-Split'],
      ductworkTypes: ['Traditional Ducts', 'Flexible Ducts', 'Ductless System']
    },
    kitchen: {
      appliances: ['Refrigerator', 'Range/Oven', 'Microwave', 'Dishwasher', 'Garbage Disposal', 'Ice Maker', 'Wine Cooler'],
      counterTops: ['Laminate', 'Granite', 'Quartz', 'Marble', 'Butcher Block', 'Concrete', 'Tile'],
      cabinets: ['Standard', 'Soft Close', 'Pull-Out Drawers', 'Lazy Susan', 'Crown Molding', 'Under Cabinet Lighting']
    },
    bathroom: {
      fixtures: ['Standard Tub', 'Garden Tub', 'Walk-in Shower', 'Dual Vanity', 'Linen Closet', 'Exhaust Fan'],
      vanityTypes: ['Single Vanity', 'Double Vanity', 'Floating Vanity', 'Traditional Vanity']
    },
    flooring: {
      types: ['Carpet', 'Hardwood', 'Laminate', 'Vinyl Plank', 'Tile', 'Linoleum', 'Concrete']
    },
    interior: {
      ceilingHeights: ['8 ft', '9 ft', '10 ft', 'Vaulted', 'Cathedral'],
      ceilingTypes: ['Flat', 'Textured', 'Coffered', 'Tray', 'Vaulted', 'Exposed Beam']
    },
    exterior: {
      porchTypes: ['None', 'Front Porch', 'Wrap Around', 'Covered Porch', 'Screened Porch'],
      deckSizes: ['None', 'Small (8x10)', 'Medium (12x16)', 'Large (16x20)', 'Custom Size']
    },
    amenities: [
      'Central Air', 'Fireplace', 'Dishwasher', 'Washer/Dryer Hookup', 'Washer/Dryer Included',
      'Vaulted Ceilings', 'Walk-in Closet', 'Master Suite', 'Open Floor Plan', 'Island Kitchen',
      'Pantry', 'Linen Closet', 'Utility Room', 'Mudroom', 'Home Office', 'Bonus Room',
      'Covered Parking', 'Storage Shed', 'Deck', 'Patio', 'Landscaping', 'Sprinkler System'
    ],
    upgrades: [
      'Premium Flooring', 'Granite Countertops', 'Stainless Steel Appliances', 'Custom Cabinets',
      'Crown Molding', 'Chair Rail', 'Wainscoting', 'Coffered Ceilings', 'Recessed Lighting',
      'Smart Home Features', 'Security System', 'Whole House Generator', 'Solar Panels',
      'Energy Star Appliances', 'Low-E Windows', 'Upgraded HVAC', 'Tankless Water Heater'
    ],
    safety: [
      'Smoke Detectors', 'Carbon Monoxide Detectors', 'Fire Extinguisher', 'Security System',
      'Deadbolt Locks', 'Window Locks', 'Motion Lights', 'Emergency Exits', 'GFCI Outlets',
      'Whole House Surge Protection', 'Storm Shutters', 'Safe Room'
    ],
    certifications: [
      'Energy Star Certified', 'HUD Approved', 'IRC Compliant', 'Local Building Code',
      'Wind Zone Rated', 'Seismic Zone Rated', 'Flood Zone Compliant', 'ADA Compliant'
    ],
    energy: [
      'Energy Star Appliances', 'LED Lighting', 'Programmable Thermostat', 'High Efficiency HVAC',
      'Insulated Windows', 'Extra Insulation', 'Solar Ready', 'Solar Panels', 'Energy Recovery Ventilator'
    ],
    accessibility: [
      'Wheelchair Accessible', 'Ramp Access', 'Wide Doorways', 'Accessible Bathroom', 'Grab Bars',
      'Lower Countertops', 'Accessible Light Switches', 'Roll-in Shower', 'Accessible Parking'
    ],
    storage: [
      'Walk-in Closets', 'Linen Closets', 'Pantry', 'Utility Room', 'Attic Storage',
      'Under-stair Storage', 'Built-in Shelving', 'Storage Shed', 'Garage', 'Carport'
    ],
    technology: [
      'Pre-wired for Cable/Internet', 'Smart Home Ready', 'Security System Pre-wire',
      'Surround Sound Pre-wire', 'USB Outlets', 'Smart Thermostat', 'Smart Doorbell',
      'WiFi Extenders', 'Ethernet Wiring', 'Fiber Optic Ready'
    ]
  }

  const [selectedImages, setSelectedImages] = useState<string[]>(formData.photos)

  const handleImageAdd = (url: string) => {
    setSelectedImages(prev => [...prev, url])
    handleInputChange('photos', [...selectedImages, url])
  }

  const handleImageRemove = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    handleInputChange('photos', newImages)
  }

  const CheckboxGroup = ({ 
    title, 
    options, 
    field, 
    icon: Icon 
  }: { 
    title: string
    options: string[]
    field: string
    icon: React.ComponentType<any>
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${field}-${option}`}
                checked={formData[field].includes(option)}
                onCheckedChange={() => handleArrayToggle(field, option)}
              />
              <Label htmlFor={`${field}-${option}`} className="text-sm font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
        {formData[field].length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-1">
              {formData[field].map((item: string) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {initialData ? 'Edit' : 'Add'} Manufactured Home
        </h1>
        <p className="text-muted-foreground">
          Complete all sections to create a comprehensive listing
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="systems">Systems</TabsTrigger>
            <TabsTrigger value="interior">Interior</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </Tabs>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Basic Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        placeholder="2024"
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
                  
                  <div>
                    <Label htmlFor="make">Manufacturer</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      placeholder="Clayton, Champion, Fleetwood..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="The Edge, Titan, Berkshire..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="Serial/HUD number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="offerType">Offer Type</Label>
                    <Select value={formData.offerType} onValueChange={(value) => handleInputChange('offerType', value)}>
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
                  
                  {(formData.offerType === 'for_sale' || formData.offerType === 'both') && (
                    <div>
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) => handleInputChange('salePrice', e.target.value)}
                        placeholder="125000"
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
                  
                  <div>
                    <Label htmlFor="cost">Cost Basis</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      placeholder="Internal cost"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
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

              {/* Dimensions & Layout */}
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
                  
                  <div className="grid grid-cols-3 gap-4">
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
                    <div>
                      <Label htmlFor="sections">Sections</Label>
                      <Select value={formData.sections} onValueChange={(value) => handleInputChange('sections', value)}>
                        <SelectTrigger>
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

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Austin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="TX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="78701"
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
                  
                  <div>
                    <Label htmlFor="lotNumber">Lot Number</Label>
                    <Input
                      id="lotNumber"
                      value={formData.lotNumber}
                      onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                      placeholder="42"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Roof & Exterior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roofType">Roof Type</Label>
                    <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="sidingType">Siding Type</Label>
                    <Select value={formData.sidingType} onValueChange={(value) => handleInputChange('sidingType', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="porchType">Porch Type</Label>
                    <Select value={formData.porchType} onValueChange={(value) => handleInputChange('porchType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select porch type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.exterior.porchTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="deckSize">Deck Size</Label>
                    <Select value={formData.deckSize} onValueChange={(value) => handleInputChange('deckSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deck size" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.exterior.deckSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Foundation & Insulation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="foundationType">Foundation Type</Label>
                    <Select value={formData.foundationType} onValueChange={(value) => handleInputChange('foundationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select foundation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.structural.foundationTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="insulationType">Insulation Type</Label>
                    <Select value={formData.insulationType} onValueChange={(value) => handleInputChange('insulationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insulation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.structural.insulationTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="windowType">Window Type</Label>
                    <Select value={formData.windowType} onValueChange={(value) => handleInputChange('windowType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select window type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.structural.windowTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Systems Tab */}
          <TabsContent value="systems" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Electrical */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Electrical System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="electricalPanel">Electrical Panel</Label>
                    <Select value={formData.electricalPanel} onValueChange={(value) => handleInputChange('electricalPanel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select panel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.electrical.panels.map(panel => (
                          <SelectItem key={panel} value={panel}>{panel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="outlets">Outlet Features</Label>
                    <Select value={formData.outlets} onValueChange={(value) => handleInputChange('outlets', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outlet features" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.electrical.outlets.map(outlet => (
                          <SelectItem key={outlet} value={outlet}>{outlet}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="lighting">Lighting Features</Label>
                    <Select value={formData.lighting} onValueChange={(value) => handleInputChange('lighting', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lighting features" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.electrical.lighting.map(light => (
                          <SelectItem key={light} value={light}>{light}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Plumbing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Plumbing System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="plumbingType">Plumbing Type</Label>
                    <Select value={formData.plumbingType} onValueChange={(value) => handleInputChange('plumbingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plumbing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.plumbing.types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="waterHeaterType">Water Heater Type</Label>
                    <Select value={formData.waterHeaterType} onValueChange={(value) => handleInputChange('waterHeaterType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select water heater type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.plumbing.waterHeaterTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="waterHeaterSize">Water Heater Size</Label>
                    <Select value={formData.waterHeaterSize} onValueChange={(value) => handleInputChange('waterHeaterSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select water heater size" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.plumbing.waterHeaterSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* HVAC */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    HVAC System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="heatingType">Heating Type</Label>
                    <Select value={formData.heatingType} onValueChange={(value) => handleInputChange('heatingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heating type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.hvac.heatingTypes.map(type => (
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
                        {featureOptions.hvac.coolingTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ductworkType">Ductwork Type</Label>
                    <Select value={formData.ductworkType} onValueChange={(value) => handleInputChange('ductworkType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ductwork type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.hvac.ductworkTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interior Tab */}
          <TabsContent value="interior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kitchen */}
              <Card>
                <CardHeader>
                  <CardTitle>Kitchen Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Kitchen Appliances</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                      {featureOptions.kitchen.appliances.map((appliance) => (
                        <div key={appliance} className="flex items-center space-x-2">
                          <Checkbox
                            id={`appliance-${appliance}`}
                            checked={formData.kitchenAppliances.includes(appliance)}
                            onCheckedChange={() => handleArrayToggle('kitchenAppliances', appliance)}
                          />
                          <Label htmlFor={`appliance-${appliance}`} className="text-sm">
                            {appliance}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="counterTopType">Counter Top Type</Label>
                    <Select value={formData.counterTopType} onValueChange={(value) => handleInputChange('counterTopType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select counter top type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.kitchen.counterTops.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cabinetType">Cabinet Features</Label>
                    <Select value={formData.cabinetType} onValueChange={(value) => handleInputChange('cabinetType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cabinet features" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.kitchen.cabinets.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Bathroom */}
              <Card>
                <CardHeader>
                  <CardTitle>Bathroom Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Bathroom Fixtures</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                      {featureOptions.bathroom.fixtures.map((fixture) => (
                        <div key={fixture} className="flex items-center space-x-2">
                          <Checkbox
                            id={`fixture-${fixture}`}
                            checked={formData.bathroomFixtures.includes(fixture)}
                            onCheckedChange={() => handleArrayToggle('bathroomFixtures', fixture)}
                          />
                          <Label htmlFor={`fixture-${fixture}`} className="text-sm">
                            {fixture}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="vanityType">Vanity Type</Label>
                    <Select value={formData.vanityType} onValueChange={(value) => handleInputChange('vanityType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vanity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.bathroom.vanityTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Flooring & Ceilings */}
              <Card>
                <CardHeader>
                  <CardTitle>Flooring & Ceilings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Flooring Types</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                      {featureOptions.flooring.types.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`flooring-${type}`}
                            checked={formData.flooringTypes.includes(type)}
                            onCheckedChange={() => handleArrayToggle('flooringTypes', type)}
                          />
                          <Label htmlFor={`flooring-${type}`} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="ceilingHeight">Ceiling Height</Label>
                    <Select value={formData.ceilingHeight} onValueChange={(value) => handleInputChange('ceilingHeight', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ceiling height" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.interior.ceilingHeights.map(height => (
                          <SelectItem key={height} value={height}>{height}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ceilingType">Ceiling Type</Label>
                    <Select value={formData.ceilingType} onValueChange={(value) => handleInputChange('ceilingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ceiling type" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureOptions.interior.ceilingTypes.map(type => (
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
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CheckboxGroup
                title="Amenities & Comfort"
                options={featureOptions.amenities}
                field="amenities"
                icon={Home}
              />
              
              <CheckboxGroup
                title="Premium Upgrades"
                options={featureOptions.upgrades}
                field="upgrades"
                icon={Palette}
              />
              
              <CheckboxGroup
                title="Safety Features"
                options={featureOptions.safety}
                field="safetyFeatures"
                icon={Shield}
              />
              
              <CheckboxGroup
                title="Energy Efficiency"
                options={featureOptions.energy}
                field="energyFeatures"
                icon={Zap}
              />
              
              <CheckboxGroup
                title="Storage Solutions"
                options={featureOptions.storage}
                field="storageFeatures"
                icon={Package}
              />
              
              <CheckboxGroup
                title="Technology Features"
                options={featureOptions.technology}
                field="technologyFeatures"
                icon={Wrench}
              />
              
              <CheckboxGroup
                title="Accessibility Features"
                options={featureOptions.accessibility}
                field="accessibilityFeatures"
                icon={Shield}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Certifications & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {featureOptions.certifications.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cert-${cert}`}
                          checked={formData.certifications.includes(cert)}
                          onCheckedChange={() => handleArrayToggle('certifications', cert)}
                        />
                        <Label htmlFor={`cert-${cert}`} className="text-sm font-normal">
                          {cert}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.energyRating} onValueChange={(value) => handleInputChange('energyRating', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+ (Highest Efficiency)</SelectItem>
                      <SelectItem value="A">A (High Efficiency)</SelectItem>
                      <SelectItem value="B">B (Good Efficiency)</SelectItem>
                      <SelectItem value="C">C (Standard Efficiency)</SelectItem>
                      <SelectItem value="D">D (Below Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warranty Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.warrantyInfo}
                    onChange={(e) => handleInputChange('warrantyInfo', e.target.value)}
                    placeholder="Warranty details, coverage, and terms..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Photo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Primary Photo
                  </CardTitle>
                  <CardDescription>
                    Main photo that will be displayed in listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      value={formData.primaryPhoto}
                      onChange={(e) => handleInputChange('primaryPhoto', e.target.value)}
                      placeholder="Enter image URL or upload"
                    />
                    {formData.primaryPhoto && (
                      <div className="relative">
                        <img 
                          src={formData.primaryPhoto} 
                          alt="Primary photo preview" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Photos</CardTitle>
                  <CardDescription>
                    Add multiple photos to showcase the home
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter image URL"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            if (input.value) {
                              handleImageAdd(input.value)
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                          if (input?.value) {
                            handleImageAdd(input.value)
                            input.value = ''
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Photo ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleImageRemove(index)}
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

              {/* Marketing Content */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Marketing & Description
                  </CardTitle>
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
                      placeholder="Brief text for search results and listings"
                    />
                  </div>
                  
                  <div>
                    <Label>Key Features (for marketing)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
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
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Create'} Manufactured Home
          </Button>
        </div>
      </form>
    </div>
  )
}