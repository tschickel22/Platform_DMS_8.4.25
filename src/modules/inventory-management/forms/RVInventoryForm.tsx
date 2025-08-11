import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Upload, Camera, Star } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

interface RVInventoryFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

// Define the type for an image object
type ImageFile = {
  id: string; // Unique ID for react-beautiful-dnd
  url: string; // URL for preview (blob URL for files, or actual URL for existing)
  isCover: boolean;
  file?: File; // The actual File object if it's a newly uploaded file
};

function RVInventoryForm({ onSubmit, onCancel, initialData }: RVInventoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Basic Information
    vin: initialData?.vin || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    mileage: initialData?.mileage || '',
    mileageUnit: initialData?.mileageUnit || 'SMI', // New field, Sample Data
    bodyStyle: initialData?.bodyStyle || '',
    
    // Vehicle Details
    fuelType: initialData?.fuelType || '',
    transmission: initialData?.transmission || '',
    exteriorColor: initialData?.exteriorColor || '',
    interiorColor: initialData?.interiorColor || '',
    vehicleInteriorType: initialData?.vehicleInteriorType || 'Cloth', // New field, Sample Data
    condition: initialData?.condition || '',
    availability: initialData?.availability || '',
    vehicleConfiguration: initialData?.vehicleConfiguration || '26T', // New field, Sample Data
    
    // RV Specific
    rvType: initialData?.rvType || '',
    length: initialData?.length || '',
    slideOuts: initialData?.slideOuts || '',
    sleeps: initialData?.sleeps || '',
    awning: initialData?.awning || false,
    generator: initialData?.generator || false,
    numberOfDoors: initialData?.numberOfDoors || '', // New field
    seatingCapacity: initialData?.seatingCapacity || '', // New field
    
    // Pricing
    msrp: initialData?.msrp || '',
    salePrice: initialData?.salePrice || '',
    priceCurrency: initialData?.priceCurrency || 'USD', // New field, Sample Data
    cost: initialData?.cost || '',
    
    // Features
    features: initialData?.features || [],
    
    // Description
    description: initialData?.description || '',
    
    // Seller Information
    sellerName: initialData?.sellerName || 'Renter Insight', // New field, Sample Data
    sellerPhone: initialData?.sellerPhone || '+1-303-555-1234', // New field, Sample Data
    sellerAddressStreet: initialData?.sellerAddressStreet || '1234 Main St', // New field, Sample Data
    sellerAddressCity: initialData?.sellerAddressCity || 'Denver', // New field, Sample Data
    sellerAddressState: initialData?.sellerAddressState || 'CO', // New field, Sample Data
    sellerAddressZip: initialData?.sellerAddressZip || '80202', // New field, Sample Data

    // Images & Videos
    listingUrl: initialData?.listingUrl || 'https://example.com/rv-listing', // New field, Sample Data
    images: initialData?.images?.map((img: string, index: number) => ({
      id: `image-${index}`,
      url: img,
      isCover: index === 0, // First image is cover by default
      file: undefined,
    })) || [],
    videos: initialData?.videos || [], // New field for video URLs
  })

  const [newFeature, setNewFeature] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')

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

  const addVideo = () => {
    if (newVideoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, newVideoUrl.trim()]
      }))
      setNewVideoUrl('')
    }
  }

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation - check if required fields are filled
    if (!formData.vin || !formData.make || !formData.model || !formData.year) {
      alert('Please fill in all required fields (VIN, Make, Model, Year)')
      return
    }
    
    // Only submit if we have valid data
    onSubmit(formData)
  }

  // Image handling functions
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
        id: `file-${Date.now()}-${index}`, // Unique ID for dnd
        url: URL.createObjectURL(file),
        isCover: false, // Will be set to cover if it's the first image
        file: file,
      }));

      setFormData(prev => {
        const updatedImages = [...prev.images, ...newImages];
        // If no cover image exists, set the first image as cover
        if (!updatedImages.some(img => img.isCover) && updatedImages.length > 0) {
          updatedImages[0].isCover = true;
        }
        return { ...prev, images: updatedImages };
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter(img => img.id !== id);
      // If the removed image was the cover, set the first remaining image as cover
      if (prev.images.find(img => img.id === id)?.isCover && updatedImages.length > 0) {
        updatedImages[0].isCover = true;
      }
      return { ...prev, images: updatedImages };
    });
  };

  const handleSetCoverImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isCover: img.id === id,
      })),
    }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedImages = Array.from(formData.images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setFormData(prev => ({
      ...prev,
      images: reorderedImages,
    }));
  };

  // Dropdown options
  const makeOptions = [
    'Winnebago', 'Thor', 'Forest River', 'Jayco', 'Coachmen', 'Keystone', 'Heartland', 
    'Grand Design', 'Newmar', 'Tiffin', 'Holiday Rambler', 'Fleetwood', 'Dutchmen', 
    'Prime Time', 'Palomino', 'Gulf Stream', 'Cruiser RV', 'KZ', 'Northwood', 'Lance'
  ]

  const bodyStyleOptions = [
    'Class A Motorhome', 'Class B Motorhome', 'Class C Motorhome', 'Travel Trailer', 
    'Fifth Wheel', 'Toy Hauler', 'Pop-up Camper', 'Truck Camper', 'Park Model', 
    'Destination Trailer', 'Hybrid Trailer', 'Teardrop Trailer'
  ]

  const rvTypeOptions = [
    'Motorhome', 'Travel Trailer', 'Fifth Wheel', 'Toy Hauler', 'Pop-up', 'Truck Camper'
  ]

  const fuelTypeOptions = [
    'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Propane'
  ]

  const transmissionOptions = [
    'Automatic', 'Manual', 'CVT', '6-Speed Automatic', '8-Speed Automatic', '10-Speed Automatic'
  ]

  const conditionOptions = [
    'New', 'Used - Excellent', 'Used - Good', 'Used - Fair', 'Certified Pre-Owned', 'Damaged'
  ]

  const availabilityOptions = [
    'Available', 'Sold', 'Pending', 'On Hold', 'In Transit', 'Service Required'
  ]

  const slideOutOptions = [
    '0', '1', '2', '3', '4', '5+'
  ]

  const sleepsOptions = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'
  ]

  const priceCurrencyOptions = [
    'USD', 'CAD', 'EUR', 'GBP'
  ]

  const mileageUnitOptions = [
    'SMI', 'KMI' // Statute Miles, Kilometers
  ]

  const vehicleInteriorTypeOptions = [
    'Cloth', 'Leather', 'Vinyl', 'Fabric'
  ]

  const doorOptions = [
    '2', '3', '4', '5+'
  ]

  const stateOptions = [ // Options for State
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {initialData ? 'Edit RV' : 'Add RV'}
          </h1>
          <p className="text-muted-foreground">
            {initialData ? 'Update RV information' : 'Add a new RV to inventory'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update RV' : 'Add RV'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about the RV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN *</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="Enter VIN number"
                  required
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
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="Enter mileage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileageUnit">Mileage Unit</Label>
                <Select value={formData.mileageUnit || ''} onValueChange={(value) => handleInputChange('mileageUnit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {mileageUnitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyStyle">Body Style *</Label>
                <Select value={formData.bodyStyle || ''} onValueChange={(value) => handleInputChange('bodyStyle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body style" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyStyleOptions.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleConfiguration">Vehicle Configuration</Label>
                <Input
                  id="vehicleConfiguration"
                  value={formData.vehicleConfiguration}
                  onChange={(e) => handleInputChange('vehicleConfiguration', e.target.value)}
                  placeholder="e.g., 26T"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select value={formData.fuelType || ''} onValueChange={(value) => handleInputChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypeOptions.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={formData.transmission || ''} onValueChange={(value) => handleInputChange('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionOptions.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exteriorColor">Exterior Color</Label>
                <Input
                  id="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                  placeholder="Enter exterior color"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interiorColor">Interior Color</Label>
                <Input
                  id="interiorColor"
                  value={formData.interiorColor}
                  onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                  placeholder="Enter interior color"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleInteriorType">Interior Type</Label>
                <Select value={formData.vehicleInteriorType || ''} onValueChange={(value) => handleInputChange('vehicleInteriorType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interior type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleInteriorTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability || ''} onValueChange={(value) => handleInputChange('availability', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RV Specific Details */}
        <Card>
          <CardHeader>
            <CardTitle>RV Specific Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rvType">RV Type</Label>
                <Select value={formData.rvType || ''} onValueChange={(value) => handleInputChange('rvType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select RV type" />
                  </SelectTrigger>
                  <SelectContent>
                    {rvTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  placeholder="Enter length in feet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slideOuts">Slide Outs</Label>
                <Select value={formData.slideOuts || ''} onValueChange={(value) => handleInputChange('slideOuts', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of slide outs" />
                  </SelectTrigger>
                  <SelectContent>
                    {slideOutOptions.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleeps">Sleeps</Label>
                <Select value={formData.sleeps || ''} onValueChange={(value) => handleInputChange('sleeps', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sleeping capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {sleepsOptions.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfDoors">Number of Doors</Label>
                <Select value={formData.numberOfDoors || ''} onValueChange={(value) => handleInputChange('numberOfDoors', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of doors" />
                  </SelectTrigger>
                  <SelectContent>
                    {doorOptions.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                <Input
                  id="seatingCapacity"
                  type="number"
                  value={formData.seatingCapacity}
                  onChange={(e) => handleInputChange('seatingCapacity', e.target.value)}
                  placeholder="Enter seating capacity"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="priceCurrency">Currency</Label>
                <Select value={formData.priceCurrency || ''} onValueChange={(value) => handleInputChange('priceCurrency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceCurrencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>
          </CardContent>
        </Card>

        {/* Seller Information */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellerName">Seller Name</Label>
                <Input
                  id="sellerName"
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                  placeholder="Enter seller name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerPhone">Seller Phone</Label>
                <Input
                  id="sellerPhone"
                  type="tel"
                  value={formData.sellerPhone}
                  onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                  placeholder="Enter seller phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerAddressStreet">Seller Address (Street)</Label>
                <Input
                  id="sellerAddressStreet"
                  value={formData.sellerAddressStreet}
                  onChange={(e) => handleInputChange('sellerAddressStreet', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerAddressCity">Seller Address (City)</Label>
                <Input
                  id="sellerAddressCity"
                  value={formData.sellerAddressCity}
                  onChange={(e) => handleInputChange('sellerAddressCity', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerAddressState">Seller Address (State)</Label>
                <Select value={formData.sellerAddressState || ''} onValueChange={(value) => handleInputChange('sellerAddressState', value)}>
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
                <Label htmlFor="sellerAddressZip">Seller Address (Zip)</Label>
                <Input
                  id="sellerAddressZip"
                  value={formData.sellerAddressZip}
                  onChange={(e) => handleInputChange('sellerAddressZip', e.target.value)}
                  placeholder="Enter zip code"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Add key features and amenities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
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
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter detailed description..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Images & Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Images & Videos</CardTitle>
            <CardDescription>
              Upload photos and link to videos of the RV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="listingUrl">Listing URL</Label>
              <Input
                id="listingUrl"
                type="url"
                value={formData.listingUrl}
                onChange={(e) => handleInputChange('listingUrl', e.target.value)}
                placeholder="Enter the main listing URL"
              />
            </div>

            {/* Image Upload and Management */}
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
                                  alt={`RV Image ${index + 1}`}
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

            {/* Video URLs */}
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold mb-2">Video URLs</h3>
              <div className="flex gap-2">
                <Input
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="Enter video URL (e.g., YouTube)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVideo())}
                />
                <Button type="button" onClick={addVideo}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.videos.length > 0 && (
                <div className="space-y-2">
                  {formData.videos.map((video: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <a href={video} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-blue-600 hover:underline">
                        {video}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeVideo(index)}
                        title="Remove video"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action buttons at the bottom */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update RV' : 'Add RV'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RVInventoryForm
export { RVInventoryForm }
