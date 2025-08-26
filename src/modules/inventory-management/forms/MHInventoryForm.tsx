import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Plus, Upload, Camera, Star } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

interface MHInventoryFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

type ImageFile = {
  id: string
  url: string
  isCover: boolean
  file?: File
}

export function MHInventoryForm({ onSubmit, onCancel, initialData }: MHInventoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    // Basic Information
    vin: initialData?.vin || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    serialNumber: initialData?.serialNumber || '',
    color: initialData?.color || '',
    
    // Mobile Home Specific
    homeType: initialData?.homeType || '',
    width: initialData?.width || '',
    length: initialData?.length || '',
    width2: initialData?.width2 || '',
    length2: initialData?.length2 || '',
    width3: initialData?.width3 || '',
    length3: initialData?.length3 || '',
    squareFootage: initialData?.squareFootage || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    
    // Address Details
    locationType: initialData?.locationType || '',
    communityKey: initialData?.communityKey || '',
    communityName: initialData?.communityName || '',
    address1: initialData?.address1 || '',
    address2: initialData?.address2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip9: initialData?.zip9 || '',
    countyName: initialData?.countyName || '',
    
    // Construction Details
    exteriorMaterial: initialData?.exteriorMaterial || '',
    roofMaterial: initialData?.roofMaterial || '',
    flooringType: initialData?.flooringType || '',
    insulationType: initialData?.insulationType || '',
    ceilingType: initialData?.ceilingType || '',
    wallType: initialData?.wallType || '',
    
    // Condition & Status
    condition: initialData?.condition || '',
    availability: initialData?.availability || '',
    location: initialData?.location || '',
    
    // Features & Amenities
    hasFireplace: initialData?.hasFireplace || false,
    hasDeck: initialData?.hasDeck || false,
    hasStorage: initialData?.hasStorage || false,
    hasCarport: initialData?.hasCarport || false,
    centralAir: initialData?.centralAir || false,
    garage: initialData?.garage || false,
    thermopane: initialData?.thermopane || false,
    gutters: initialData?.gutters || false,
    shutters: initialData?.shutters || false,
    patio: initialData?.patio || false,
    cathedralCeiling: initialData?.cathedralCeiling || false,
    ceilingFan: initialData?.ceilingFan || false,
    skylight: initialData?.skylight || false,
    walkinCloset: initialData?.walkinCloset || false,
    laundryRoom: initialData?.laundryRoom || false,
    pantry: initialData?.pantry || false,
    sunRoom: initialData?.sunRoom || false,
    basement: initialData?.basement || false,
    gardenTub: initialData?.gardenTub || false,
    garbageDisposal: initialData?.garbageDisposal || false,
    refrigerator: initialData?.refrigerator || false,
    microwave: initialData?.microwave || false,
    oven: initialData?.oven || false,
    dishwasher: initialData?.dishwasher || false,
    clothesWasher: initialData?.clothesWasher || false,
    clothesDryer: initialData?.clothesDryer || false,
    
    // Pricing & Terms
    msrp: initialData?.msrp || '',
    salePrice: initialData?.salePrice || '',
    cost: initialData?.cost || '',
    terms: initialData?.terms || '',
    utilities: initialData?.utilities || '',
    repo: initialData?.repo || false,
    packageType: initialData?.packageType || '',
    salePending: initialData?.salePending || false,
    
    // Features
    features: initialData?.features || [],
    
    // Description
    description: initialData?.description || '',
    
    // Images/Media Links
    photoURL: initialData?.photoURL || '',
    virtualTour: initialData?.virtualTour || '',
    salesPhoto: initialData?.salesPhoto || '',
    images: initialData?.images?.map((img: string, index: number) => ({
      id: `image-${index}`,
      url: img,
      isCover: index === 0,
      file: undefined,
    })) || []
  })

  const [newFeature, setNewFeature] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vin || !formData.make || !formData.model || !formData.year) {
      alert('Please fill in all required fields (VIN, Make, Model, Year)')
      return
    }
    
    onSubmit(formData)
  }

  // Image handling functions
  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isCover: false,
        file: file,
      }))

      setFormData(prev => {
        const updatedImages = [...prev.images, ...newImages]
        if (!updatedImages.some(img => img.isCover) && updatedImages.length > 0) {
          updatedImages[0].isCover = true
        }
        return { ...prev, images: updatedImages }
      })
    }
  }

  const handleRemoveImage = (id: string) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter(img => img.id !== id)
      if (prev.images.find(img => img.id === id)?.isCover && updatedImages.length > 0) {
        updatedImages[0].isCover = true
      }
      return { ...prev, images: updatedImages }
    })
  }

  const handleSetCoverImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isCover: img.id === id,
      })),
    }))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedImages = Array.from(formData.images)
    const [movedImage] = reorderedImages.splice(result.source.index, 1)
    reorderedImages.splice(result.destination.index, 0, movedImage)

    setFormData(prev => ({
      ...prev,
      images: reorderedImages,
    }))
  }

  // Dropdown options
  const makeOptions = [
    'Clayton', 'Champion', 'Fleetwood', 'Skyline', 'Palm Harbor', 'Cavco', 'Deer Valley',
    'Redman', 'Schult', 'Marlette', 'Liberty', 'Oakwood', 'Southern Energy', 'TRU',
    'Fairmont', 'Friendship', 'Homes of Merit', 'Kit', 'Legacy', 'Nobility'
  ]

  const homeTypeOptions = [
    'Single Wide', 'Double Wide', 'Triple Wide', 'Modular Home', 'Park Model', 
    'Tiny Home', 'Manufactured Home', 'Mobile Home'
  ]

  const bedroomOptions = ['1', '2', '3', '4', '5', '6+']
  const bathroomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4+']

  const exteriorMaterialOptions = [
    'Vinyl Siding', 'Fiber Cement', 'Wood Siding', 'Metal Siding', 'Brick', 
    'Stone', 'Stucco', 'Composite'
  ]

  const roofMaterialOptions = [
    'Asphalt Shingles', 'Metal Roofing', 'TPO', 'EPDM', 'Built-up Roofing', 'Tile'
  ]

  const flooringOptions = [
    'Carpet', 'Vinyl Plank', 'Laminate', 'Hardwood', 'Tile', 'Linoleum', 'Concrete'
  ]

  const insulationOptions = [
    'Fiberglass', 'Foam Board', 'Spray Foam', 'Cellulose', 'Mineral Wool', 'Reflective'
  ]

  const conditionOptions = [
    'New', 'Like New', 'Excellent', 'Good', 'Fair', 'Needs Work', 'Fixer Upper'
  ]

  const availabilityOptions = [
    'Available', 'Sold', 'Pending', 'On Hold', 'In Transit', 'Setup Required'
  ]

  const locationOptions = [
    'On Lot', 'In Transit', 'Factory', 'Customer Site', 'Storage', 'Display Model'
  ]

  const packageTypeOptions = [
    'Standard', 'Premium', 'Luxury', 'Basic', 'Custom'
  ]

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {initialData ? 'Edit Manufactured Home' : 'Add Manufactured Home'}
          </h1>
          <p className="text-muted-foreground">
            {initialData ? 'Update manufactured home information' : 'Add a new manufactured home to inventory'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update Home' : 'Add Home'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about the manufactured home</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN/HUD Label *</Label>
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                      placeholder="Enter VIN or HUD label number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="Enter serial number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Select value={formData.make || ''} onValueChange={(value) => handleInputChange('make', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {makeOptions.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Enter model"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                      placeholder="Enter year"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeType">Home Type *</Label>
                    <Select value={formData.homeType || ''} onValueChange={(value) => handleInputChange('homeType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select home type" />
                      </SelectTrigger>
                      <SelectContent>
                        {homeTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Enter color"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition || ''} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOptions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Address Details</CardTitle>
                <CardDescription>Information about where the manufactured home is located</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationType">Location Type</Label>
                    <Input
                      id="locationType"
                      value={formData.locationType}
                      onChange={(e) => handleInputChange('locationType', e.target.value)}
                      placeholder="e.g., Community"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communityKey">Community Key</Label>
                    <Input
                      id="communityKey"
                      value={formData.communityKey}
                      onChange={(e) => handleInputChange('communityKey', e.target.value)}
                      placeholder="e.g., 161"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communityName">Community Name</Label>
                    <Input
                      id="communityName"
                      value={formData.communityName}
                      onChange={(e) => handleInputChange('communityName', e.target.value)}
                      placeholder="e.g., Chateau Algoma Estates"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input
                      id="address1"
                      value={formData.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      placeholder="e.g., 12345 Maple Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={formData.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      placeholder="Enter second address line (if any)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g., Rockford"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state || ''} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateOptions.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip9">Zip Code</Label>
                    <Input
                      id="zip9"
                      value={formData.zip9}
                      onChange={(e) => handleInputChange('zip9', e.target.value)}
                      placeholder="e.g., 49341-4321"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countyName">County Name</Label>
                    <Input
                      id="countyName"
                      value={formData.countyName}
                      onChange={(e) => handleInputChange('countyName', e.target.value)}
                      placeholder="e.g., Kent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dimensions & Layout</CardTitle>
                <CardDescription>Physical dimensions and room layout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Primary Width (ft)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={formData.width}
                      onChange={(e) => handleInputChange('width', e.target.value)}
                      placeholder="Enter primary width in feet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Primary Length (ft)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                      placeholder="Enter primary length in feet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width2">Secondary Width (ft)</Label>
                    <Input
                      id="width2"
                      type="number"
                      value={formData.width2}
                      onChange={(e) => handleInputChange('width2', e.target.value)}
                      placeholder="Enter secondary width in feet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length2">Secondary Length (ft)</Label>
                    <Input
                      id="length2"
                      type="number"
                      value={formData.length2}
                      onChange={(e) => handleInputChange('length2', e.target.value)}
                      placeholder="Enter secondary length in feet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width3">Tertiary Width (ft)</Label>
                    <Input
                      id="width3"
                      type="number"
                      value={formData.width3}
                      onChange={(e) => handleInputChange('width3', e.target.value)}
                      placeholder="Enter tertiary width in feet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length3">Tertiary Length (ft)</Label>
                    <Input
                      id="length3"
                      type="number"
                      value={formData.length3}
                      onChange={(e) => handleInputChange('length3', e.target.value)}
                      placeholder="Enter tertiary length in feet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                      placeholder="Enter square footage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {bedroomOptions.map((count) => (
                          <SelectItem key={count} value={count}>
                            {count}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {bathroomOptions.map((count) => (
                          <SelectItem key={count} value={count}>
                            {count}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="construction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Construction Details</CardTitle>
                <CardDescription>Materials and construction specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exteriorMaterial">Exterior Material</Label>
                    <Select value={formData.exteriorMaterial} onValueChange={(value) => handleInputChange('exteriorMaterial', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exterior material" />
                      </SelectTrigger>
                      <SelectContent>
                        {exteriorMaterialOptions.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roofMaterial">Roof Material</Label>
                    <Select value={formData.roofMaterial || ''} onValueChange={(value) => handleInputChange('roofMaterial', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof material" />
                      </SelectTrigger>
                      <SelectContent>
                        {roofMaterialOptions.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flooringType">Flooring Type</Label>
                    <Select value={formData.flooringType || ''} onValueChange={(value) => handleInputChange('flooringType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flooring type" />
                      </SelectTrigger>
                      <SelectContent>
                        {flooringOptions.map((flooring) => (
                          <SelectItem key={flooring} value={flooring}>
                            {flooring}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insulationType">Insulation Type</Label>
                    <Select value={formData.insulationType} onValueChange={(value) => handleInputChange('insulationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insulation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {insulationOptions.map((insulation) => (
                          <SelectItem key={insulation} value={insulation}>
                            {insulation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceilingType">Ceiling Type</Label>
                    <Input
                      id="ceilingType"
                      value={formData.ceilingType}
                      onChange={(e) => handleInputChange('ceilingType', e.target.value)}
                      placeholder="e.g., Drywall"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallType">Wall Type</Label>
                    <Input
                      id="wallType"
                      value={formData.wallType}
                      onChange={(e) => handleInputChange('wallType', e.target.value)}
                      placeholder="e.g., Drywall"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
                <CardDescription>Select all applicable features and amenities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Structural Features */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Structural Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasFireplace"
                        checked={formData.hasFireplace}
                        onCheckedChange={(checked) => handleInputChange('hasFireplace', checked)}
                      />
                      <Label htmlFor="hasFireplace">Fireplace</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasDeck"
                        checked={formData.hasDeck}
                        onCheckedChange={(checked) => handleInputChange('hasDeck', checked)}
                      />
                      <Label htmlFor="hasDeck">Deck/Porch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasStorage"
                        checked={formData.hasStorage}
                        onCheckedChange={(checked) => handleInputChange('hasStorage', checked)}
                      />
                      <Label htmlFor="hasStorage">Storage Shed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasCarport"
                        checked={formData.hasCarport}
                        onCheckedChange={(checked) => handleInputChange('hasCarport', checked)}
                      />
                      <Label htmlFor="hasCarport">Carport</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="garage"
                        checked={formData.garage}
                        onCheckedChange={(checked) => handleInputChange('garage', checked)}
                      />
                      <Label htmlFor="garage">Garage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="patio"
                        checked={formData.patio}
                        onCheckedChange={(checked) => handleInputChange('patio', checked)}
                      />
                      <Label htmlFor="patio">Patio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sunRoom"
                        checked={formData.sunRoom}
                        onCheckedChange={(checked) => handleInputChange('sunRoom', checked)}
                      />
                      <Label htmlFor="sunRoom">Sun Room</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="basement"
                        checked={formData.basement}
                        onCheckedChange={(checked) => handleInputChange('basement', checked)}
                      />
                      <Label htmlFor="basement">Basement</Label>
                    </div>
                  </div>
                </div>

                {/* Interior Features */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Interior Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="centralAir"
                        checked={formData.centralAir}
                        onCheckedChange={(checked) => handleInputChange('centralAir', checked)}
                      />
                      <Label htmlFor="centralAir">Central Air</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cathedralCeiling"
                        checked={formData.cathedralCeiling}
                        onCheckedChange={(checked) => handleInputChange('cathedralCeiling', checked)}
                      />
                      <Label htmlFor="cathedralCeiling">Cathedral Ceiling</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ceilingFan"
                        checked={formData.ceilingFan}
                        onCheckedChange={(checked) => handleInputChange('ceilingFan', checked)}
                      />
                      <Label htmlFor="ceilingFan">Ceiling Fan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="skylight"
                        checked={formData.skylight}
                        onCheckedChange={(checked) => handleInputChange('skylight', checked)}
                      />
                      <Label htmlFor="skylight">Skylight</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="walkinCloset"
                        checked={formData.walkinCloset}
                        onCheckedChange={(checked) => handleInputChange('walkinCloset', checked)}
                      />
                      <Label htmlFor="walkinCloset">Walk-in Closet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="laundryRoom"
                        checked={formData.laundryRoom}
                        onCheckedChange={(checked) => handleInputChange('laundryRoom', checked)}
                      />
                      <Label htmlFor="laundryRoom">Laundry Room</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pantry"
                        checked={formData.pantry}
                        onCheckedChange={(checked) => handleInputChange('pantry', checked)}
                      />
                      <Label htmlFor="pantry">Pantry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gardenTub"
                        checked={formData.gardenTub}
                        onCheckedChange={(checked) => handleInputChange('gardenTub', checked)}
                      />
                      <Label htmlFor="gardenTub">Garden Tub</Label>
                    </div>
                  </div>
                </div>

                {/* Exterior Features */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Exterior Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thermopane"
                        checked={formData.thermopane}
                        onCheckedChange={(checked) => handleInputChange('thermopane', checked)}
                      />
                      <Label htmlFor="thermopane">Thermopane Windows</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gutters"
                        checked={formData.gutters}
                        onCheckedChange={(checked) => handleInputChange('gutters', checked)}
                      />
                      <Label htmlFor="gutters">Gutters</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shutters"
                        checked={formData.shutters}
                        onCheckedChange={(checked) => handleInputChange('shutters', checked)}
                      />
                      <Label htmlFor="shutters">Shutters</Label>
                    </div>
                  </div>
                </div>

                {/* Appliances */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Appliances</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="refrigerator"
                        checked={formData.refrigerator}
                        onCheckedChange={(checked) => handleInputChange('refrigerator', checked)}
                      />
                      <Label htmlFor="refrigerator">Refrigerator</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="microwave"
                        checked={formData.microwave}
                        onCheckedChange={(checked) => handleInputChange('microwave', checked)}
                      />
                      <Label htmlFor="microwave">Microwave</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="oven"
                        checked={formData.oven}
                        onCheckedChange={(checked) => handleInputChange('oven', checked)}
                      />
                      <Label htmlFor="oven">Oven</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dishwasher"
                        checked={formData.dishwasher}
                        onCheckedChange={(checked) => handleInputChange('dishwasher', checked)}
                      />
                      <Label htmlFor="dishwasher">Dishwasher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="clothesWasher"
                        checked={formData.clothesWasher}
                        onCheckedChange={(checked) => handleInputChange('clothesWasher', checked)}
                      />
                      <Label htmlFor="clothesWasher">Clothes Washer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="clothesDryer"
                        checked={formData.clothesDryer}
                        onCheckedChange={(checked) => handleInputChange('clothesDryer', checked)}
                      />
                      <Label htmlFor="clothesDryer">Clothes Dryer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="garbageDisposal"
                        checked={formData.garbageDisposal}
                        onCheckedChange={(checked) => handleInputChange('garbageDisposal', checked)}
                      />
                      <Label htmlFor="garbageDisposal">Garbage Disposal</Label>
                    </div>
                  </div>
                </div>

                {/* Pricing & Terms */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Pricing & Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="msrp">MSRP</Label>
                      <Input
                        id="msrp"
                        type="number"
                        value={formData.msrp}
                        onChange={(e) => handleInputChange('msrp', e.target.value)}
                        placeholder="Enter MSRP"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) => handleInputChange('salePrice', e.target.value)}
                        placeholder="Enter sale price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => handleInputChange('cost', e.target.value)}
                        placeholder="Enter cost"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utilities">Monthly Utilities</Label>
                      <Input
                        id="utilities"
                        type="number"
                        value={formData.utilities}
                        onChange={(e) => handleInputChange('utilities', e.target.value)}
                        placeholder="Enter estimated utilities"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packageType">Package Type</Label>
                      <Select value={formData.packageType || ''} onValueChange={(value) => handleInputChange('packageType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select package type" />
                        </SelectTrigger>
                        <SelectContent>
                          {packageTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="repo"
                        checked={formData.repo}
                        onCheckedChange={(checked) => handleInputChange('repo', checked)}
                      />
                      <Label htmlFor="repo">Repossessed Home</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="salePending"
                        checked={formData.salePending}
                        onCheckedChange={(checked) => handleInputChange('salePending', checked)}
                      />
                      <Label htmlFor="salePending">Sale Pending</Label>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="terms">Terms of Sale Description</Label>
                    <Textarea
                      id="terms"
                      value={formData.terms}
                      onChange={(e) => handleInputChange('terms', e.target.value)}
                      placeholder="Enter terms of sale description"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Additional Features */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Additional Features</h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Enter a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Description</h3>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter detailed description..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Images & Media</CardTitle>
                <CardDescription>Upload photos and add media links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Upload */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop images here, or click to select files
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={handleFileSelect}>
                      <Camera className="h-4 w-4 mr-2" />
                      Select Images
                    </Button>
                  </div>
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Uploaded Images</h3>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="images">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                          >
                            {formData.images.map((image, index) => (
                              <Draggable key={image.id} draggableId={image.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`relative group border rounded-lg overflow-hidden ${
                                      image.isCover ? 'border-2 border-primary' : 'border-gray-200'
                                    } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                  >
                                    <img
                                      src={image.url}
                                      alt={`Home Image ${index + 1}`}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      {image.isCover && (
                                        <Badge className="bg-primary text-primary-foreground">Cover</Badge>
                                      )}
                                      {!image.isCover && (
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          size="icon"
                                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => handleSetCoverImage(image.id)}
                                          title="Set as cover image"
                                        >
                                          <Star className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveImage(image.id)}
                                        title="Remove image"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}

                {/* Media Links */}
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">Media Links</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="photoURL">Photo URL</Label>
                      <Input
                        id="photoURL"
                        value={formData.photoURL}
                        onChange={(e) => handleInputChange('photoURL', e.target.value)}
                        placeholder="Enter URL for a photo of the home"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="virtualTour">Virtual Tour URL</Label>
                      <Input
                        id="virtualTour"
                        value={formData.virtualTour}
                        onChange={(e) => handleInputChange('virtualTour', e.target.value)}
                        placeholder="Enter URL for a virtual tour video"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salesPhoto">Sales Photo URL</Label>
                      <Input
                        id="salesPhoto"
                        value={formData.salesPhoto}
                        onChange={(e) => handleInputChange('salesPhoto', e.target.value)}
                        placeholder="Enter URL for sales agent/company logo photo"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update Home' : 'Add Home'}
          </Button>
        </div>
      </form>
    </div>
  )
}