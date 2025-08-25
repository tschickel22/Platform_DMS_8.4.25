import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Upload, Camera, Star } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

/** ------- helpers to make array ops safe ------- */
const asArray = <T,>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : [])

/** ------- types ------- */
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

export default function MHInventoryForm({ onSubmit, onCancel, initialData }: MHInventoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<any>({
    // Basic Information
    vin: initialData?.vin ?? '',
    make: initialData?.make ?? '',
    model: initialData?.model ?? '',
    year: initialData?.year ?? new Date().getFullYear(),
    serialNumber: initialData?.serialNumber ?? 'MHF295739J',
    color: initialData?.color ?? 'Yellow',

    // Mobile Home Specific
    homeType: initialData?.homeType ?? 'Mobile',
    width: initialData?.width ?? 28,
    length: initialData?.length ?? 66,
    width2: initialData?.width2 ?? '',
    length2: initialData?.length2 ?? '',
    width3: initialData?.width3 ?? '',
    length3: initialData?.length3 ?? '',
    squareFootage: initialData?.squareFootage ?? '',
    bedrooms: initialData?.bedrooms ?? '3',
    bathrooms: initialData?.bathrooms ?? '3',

    // Construction Details
    exteriorMaterial: initialData?.exteriorMaterial ?? 'Vinyl',
    roofMaterial: initialData?.roofMaterial ?? 'Shingled',
    flooringType: initialData?.flooringType ?? '',
    insulationType: initialData?.insulationType ?? '',
    ceilingType: initialData?.ceilingType ?? 'Drywall',
    wallType: initialData?.wallType ?? 'Drywall',

    // Condition & Status
    condition: initialData?.condition ?? '',
    availability: initialData?.availability ?? '',
    location: initialData?.location ?? '',

    // Features & Amenities
    hasFireplace: initialData?.hasFireplace ?? true,
    hasDeck: initialData?.hasDeck ?? true,
    hasStorage: initialData?.hasStorage ?? false,
    hasCarport: initialData?.hasCarport ?? false,
    centralAir: initialData?.centralAir ?? true,
    garage: initialData?.garage ?? true,
    thermopane: initialData?.thermopane ?? false,
    gutters: initialData?.gutters ?? true,
    shutters: initialData?.shutters ?? true,
    patio: initialData?.patio ?? false,
    cathedralCeiling: initialData?.cathedralCeiling ?? true,
    ceilingFan: initialData?.ceilingFan ?? true,
    skylight: initialData?.skylight ?? true,
    walkinCloset: initialData?.walkinCloset ?? true,
    laundryRoom: initialData?.laundryRoom ?? true,
    pantry: initialData?.pantry ?? true,
    sunRoom: initialData?.sunRoom ?? true,
    basement: initialData?.basement ?? false,
    gardenTub: initialData?.gardenTub ?? true,
    garbageDisposal: initialData?.garbageDisposal ?? true,
    refrigerator: initialData?.refrigerator ?? false,
    microwave: initialData?.microwave ?? false,
    oven: initialData?.oven ?? false,
    dishwasher: initialData?.dishwasher ?? true,
    clothesWasher: initialData?.clothesWasher ?? false,
    clothesDryer: initialData?.clothesDryer ?? false,

    // Pricing & Terms
    msrp: initialData?.msrp ?? 10000,
    salePrice: initialData?.salePrice ?? '',
    cost: initialData?.cost ?? '',
    terms: initialData?.terms ?? 'Financing availabled ...',
    utilities: initialData?.utilities ?? 125,
    repo: initialData?.repo ?? false,
    packageType: initialData?.packageType ?? '',
    salePending: initialData?.salePending ?? false,

    // Additional Features
    features: asArray<string>(initialData?.features),

    // Description
    description: initialData?.description ?? 'This is a great looking home in excellent condition ...',

    // Media Links
    photoURL: initialData?.photoURL ?? 'http://www.seller.com/photo.php?key=13432',
    virtualTour: initialData?.virtualTour ?? 'https://www.youtube.com/watch?v=wTPR4f8QLEQ',
    salesPhoto: initialData?.salesPhoto ?? 'http://www.seller.com/photo.php?key=13432',

    // Images (normalize to ImageFile[])
    images: asArray<string>(initialData?.images).map((img, index) => ({
      id: `image-${index}`,
      url: String(img),
      isCover: index === 0,
    })) as ImageFile[],
  })

  const [newFeature, setNewFeature] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    const f = newFeature.trim()
    if (!f) return
    setFormData((prev: any) => ({
      ...prev,
      features: [...asArray(prev.features), f],
    }))
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      features: asArray(prev.features).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.vin || !formData.make || !formData.model || !formData.year) {
      alert('Please fill in all required fields (VIN, Make, Model, Year)')
      return
    }
    onSubmit({
      ...formData,
      features: asArray(formData.features),
      images: asArray<ImageFile>(formData.images),
    })
  }

  /** ---------- images ---------- */
  const handleFileSelect = () => fileInputRef.current?.click()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newImages: ImageFile[] = Array.from(files).map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      isCover: false,
      file,
    }))

    setFormData((prev: any) => {
      const existing = asArray<ImageFile>(prev.images)
      const updated = [...existing, ...newImages]
      if (!updated.some(i => i.isCover) && updated.length > 0) {
        updated[0].isCover = true
      }
      return { ...prev, images: updated }
    })
  }

  const handleRemoveImage = (id: string) => {
    setFormData((prev: any) => {
      const current = asArray<ImageFile>(prev.images)
      const updated = current.filter(img => img.id !== id)
      const removedWasCover = current.find(img => img.id === id)?.isCover
      if (removedWasCover && updated.length > 0) updated[0].isCover = true
      return { ...prev, images: updated }
    })
  }

  const handleSetCoverImage = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      images: asArray<ImageFile>(prev.images).map(img => ({ ...img, isCover: img.id === id })),
    }))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    setFormData((prev: any) => {
      const arr = [...asArray<ImageFile>(prev.images)]
      const [moved] = arr.splice(result.source.index, 1)
      arr.splice(result.destination!.index, 0, moved)
      return { ...prev, images: arr }
    })
  }

  /** ---------- options ---------- */
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
  const exteriorMaterialOptions = ['Vinyl Siding', 'Fiber Cement', 'Wood Siding', 'Metal Siding', 'Brick', 'Stone', 'Stucco', 'Composite']
  const roofMaterialOptions = ['Asphalt Shingles', 'Metal Roofing', 'TPO', 'EPDM', 'Built-up Roofing', 'Tile']
  const flooringOptions = ['Carpet', 'Vinyl Plank', 'Laminate', 'Hardwood', 'Tile', 'Linoleum', 'Concrete']
  const insulationOptions = ['Fiberglass', 'Foam Board', 'Spray Foam', 'Cellulose', 'Mineral Wool', 'Reflective']
  const conditionOptions = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Needs Work', 'Fixer Upper']
  const availabilityOptions = ['Available', 'Sold', 'Pending', 'On Hold', 'In Transit', 'Setup Required']
  const locationOptions = ['On Lot', 'In Transit', 'Factory', 'Customer Site', 'Storage', 'Display Model']
  const packageTypeOptions = ['Standard', 'Premium', 'Luxury', 'Basic', 'Custom']
  const stateOptions = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{initialData ? 'Edit Mobile Home' : 'Add Mobile Home'}</h1>
          <p className="text-muted-foreground">
            {initialData ? 'Update mobile home information' : 'Add a new mobile home to inventory'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>{initialData ? 'Update Home' : 'Add Home'}</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details about the mobile home</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN/HUD Label *</Label>
                <Input id="vin" value={formData.vin} onChange={(e) => handleInputChange('vin', e.target.value)} placeholder="Enter VIN or HUD label number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} placeholder="Enter serial number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Select value={formData.make || ''} onValueChange={(v) => handleInputChange('make', v)}>
                  <SelectTrigger><SelectValue placeholder="Select make" /></SelectTrigger>
                  <SelectContent>{makeOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input id="model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} placeholder="Enter model" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input id="year" type="number" value={formData.year} onChange={(e) => handleInputChange('year', parseInt(e.target.value))} placeholder="Enter year" min="1900" max={new Date().getFullYear() + 1} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeType">Home Type *</Label>
                <Select value={formData.homeType || ''} onValueChange={(v) => handleInputChange('homeType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select home type" /></SelectTrigger>
                  <SelectContent>{homeTypeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" value={formData.color} onChange={(e) => handleInputChange('color', e.target.value)} placeholder="Enter color" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Details */}
        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
            <CardDescription>Information about where the mobile home is sited</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationType">Location Type</Label>
                <Input id="locationType" value={formData.locationType} onChange={(e) => handleInputChange('locationType', e.target.value)} placeholder="e.g., Community" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityKey">Community Key</Label>
                <Input id="communityKey" value={formData.communityKey} onChange={(e) => handleInputChange('communityKey', e.target.value)} placeholder="e.g., 161" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityName">Community Name</Label>
                <Input id="communityName" value={formData.communityName} onChange={(e) => handleInputChange('communityName', e.target.value)} placeholder="e.g., Chateau Algoma Estates" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" value={formData.address1} onChange={(e) => handleInputChange('address1', e.target.value)} placeholder="e.g., 12345 Maple Street" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" value={formData.address2} onChange={(e) => handleInputChange('address2', e.target.value)} placeholder="Enter second address line (if any)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} placeholder="e.g., Rockford" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state || ''} onValueChange={(v) => handleInputChange('state', v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{stateOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip9">Zip Code</Label>
                <Input id="zip9" value={formData.zip9} onChange={(e) => handleInputChange('zip9', e.target.value)} placeholder="e.g., 493414321" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countyName">County Name</Label>
                <Input id="countyName" value={formData.countyName} onChange={(e) => handleInputChange('countyName', e.target.value)} placeholder="e.g., Kent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions & Layout */}
        <Card>
          <CardHeader><CardTitle>Dimensions & Layout</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Primary Width (ft)</Label>
                <Input id="width" type="number" value={formData.width} onChange={(e) => handleInputChange('width', parseFloat(e.target.value))} placeholder="Enter primary width in feet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Primary Length (ft)</Label>
                <Input id="length" type="number" value={formData.length} onChange={(e) => handleInputChange('length', parseFloat(e.target.value))} placeholder="Enter primary length in feet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width2">Secondary Width (ft)</Label>
                <Input id="width2" type="number" value={formData.width2} onChange={(e) => handleInputChange('width2', parseFloat(e.target.value))} placeholder="Enter secondary width in feet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length2">Secondary Length (ft)</Label>
                <Input id="length2" type="number" value={formData.length2} onChange={(e) => handleInputChange('length2', parseFloat(e.target.value))} placeholder="Enter secondary length in feet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width3">Tertiary Width (ft)</Label>
                <Input id="width3" type="number" value={formData.width3} onChange={(e) => handleInputChange('width3', parseFloat(e.target.value))} placeholder="Enter tertiary width in feet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length3">Tertiary Length (ft)</Label>
                <Input id="length3" type="number" value={formData.length3} onChange={(e) => handleInputChange('length3', parseFloat(e.target.value))} placeholder="Enter tertiary length in feet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input id="squareFootage" type="number" value={formData.squareFootage} onChange={(e) => handleInputChange('squareFootage', e.target.value)} placeholder="Enter square footage" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select value={formData.bedrooms} onValueChange={(v) => handleInputChange('bedrooms', v)}>
                  <SelectTrigger><SelectValue placeholder="Select bedrooms" /></SelectTrigger>
                  <SelectContent>{bedroomOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select value={formData.bathrooms} onValueChange={(v) => handleInputChange('bathrooms', v)}>
                  <SelectTrigger><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
                  <SelectContent>{bathroomOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Construction Details */}
        <Card>
          <CardHeader><CardTitle>Construction Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exteriorMaterial">Exterior Material</Label>
                <Select value={formData.exteriorMaterial} onValueChange={(v) => handleInputChange('exteriorMaterial', v)}>
                  <SelectTrigger><SelectValue placeholder="Select exterior material" /></SelectTrigger>
                  <SelectContent>{exteriorMaterialOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roofMaterial">Roof Material</Label>
                <Select value={formData.roofMaterial || ''} onValueChange={(v) => handleInputChange('roofMaterial', v)}>
                  <SelectTrigger><SelectValue placeholder="Select roof material" /></SelectTrigger>
                  <SelectContent>{roofMaterialOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="flooringType">Flooring Type</Label>
                <Select value={formData.flooringType || ''} onValueChange={(v) => handleInputChange('flooringType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select flooring type" /></SelectTrigger>
                  <SelectContent>{flooringOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insulationType">Insulation Type</Label>
                <Select value={formData.insulationType} onValueChange={(v) => handleInputChange('insulationType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select insulation type" /></SelectTrigger>
                  <SelectContent>{insulationOptions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ceilingType">Ceiling Type</Label>
                <Input id="ceilingType" value={formData.ceilingType} onChange={(e) => handleInputChange('ceilingType', e.target.value)} placeholder="e.g., Drywall" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallType">Wall Type</Label>
                <Input id="wallType" value={formData.wallType} onChange={(e) => handleInputChange('wallType', e.target.value)} placeholder="e.g., Drywall" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition & Status */}
        <Card>
          <CardHeader><CardTitle>Condition & Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition || ''} onValueChange={(v) => handleInputChange('condition', v)}>
                  <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                  <SelectContent>{conditionOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability || ''} onValueChange={(v) => handleInputChange('availability', v)}>
                  <SelectTrigger><SelectValue placeholder="Select availability" /></SelectTrigger>
                  <SelectContent>{availabilityOptions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(v) => handleInputChange('location', v)}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>{locationOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features & Amenities */}
        <Card>
          <CardHeader><CardTitle>Features & Amenities</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ['hasFireplace','Fireplace'],
                ['hasDeck','Deck/Porch'],
                ['hasStorage','Storage Shed'],
                ['hasCarport','Carport'],
                ['centralAir','Central Air'],
                ['garage','Garage'],
                ['thermopane','Thermopane Windows'],
                ['gutters','Gutters'],
                ['shutters','Shutters'],
                ['patio','Patio'],
                ['cathedralCeiling','Cathedral Ceiling'],
                ['ceilingFan','Ceiling Fan'],
                ['skylight','Skylight'],
                ['walkinCloset','Walk-in Closet'],
                ['laundryRoom','Laundry Room'],
                ['pantry','Pantry'],
                ['sunRoom','Sun Room'],
                ['basement','Basement'],
                ['gardenTub','Garden Tub'],
                ['garbageDisposal','Garbage Disposal'],
                ['refrigerator','Refrigerator'],
                ['microwave','Microwave'],
                ['oven','Oven'],
                ['dishwasher','Dishwasher'],
                ['clothesWasher','Clothes Washer'],
                ['clothesDryer','Clothes Dryer'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={String(key)}
                    checked={Boolean(formData[key as keyof typeof formData])}
                    onCheckedChange={(checked) => handleInputChange(String(key), !!checked)}
                  />
                  <Label htmlFor={String(key)}>{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Terms */}
        <Card>
          <CardHeader><CardTitle>Pricing & Terms</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="msrp">MSRP</Label>
                <Input id="msrp" type="number" value={formData.msrp} onChange={(e) => handleInputChange('msrp', e.target.value)} placeholder="Enter MSRP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input id="salePrice" type="number" value={formData.salePrice} onChange={(e) => handleInputChange('salePrice', e.target.value)} placeholder="Enter sale price" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input id="cost" type="number" value={formData.cost} onChange={(e) => handleInputChange('cost', e.target.value)} placeholder="Enter cost" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms of Sale Description</Label>
              <Textarea id="terms" rows={3} value={formData.terms} onChange={(e) => handleInputChange('terms', e.target.value)} placeholder="Enter terms of sale description" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utilities">Approx. Monthly Utilities</Label>
                <Input id="utilities" type="number" value={formData.utilities} onChange={(e) => handleInputChange('utilities', e.target.value)} placeholder="Enter estimated utilities" />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox id="repo" checked={formData.repo} onCheckedChange={(c) => handleInputChange('repo', !!c)} />
                <Label htmlFor="repo">Repossessed Home</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="packageType">Package Type</Label>
                <Select value={formData.packageType || ''} onValueChange={(v) => handleInputChange('packageType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select package type" /></SelectTrigger>
                  <SelectContent>{packageTypeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="salePending" checked={formData.salePending} onCheckedChange={(c) => handleInputChange('salePending', !!c)} />
                <Label htmlFor="salePending">Sale Pending</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Features */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Features</CardTitle>
            <CardDescription>Add any additional features or amenities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter a feature"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addFeature() }
                }}
              />
              <Button type="button" onClick={addFeature}><Plus className="h-4 w-4" /></Button>
            </div>

            {asArray<string>(formData.features).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {asArray<string>(formData.features).map((feature, index) => (
                  <Badge key={`${feature}-${index}`} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(index)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Enter detailed description..." />
          </CardContent>
        </Card>

        {/* Images & Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Images & Media</CardTitle>
            <CardDescription>Upload photos of the mobile home or link to external media</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop images here, or click to select files</p>
                <Button type="button" variant="outline" size="sm" onClick={handleFileSelect}>
                  <Camera className="h-4 w-4 mr-2" /> Select Images
                </Button>
              </div>
            </div>

            {asArray<ImageFile>(formData.images).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Images</h3>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="images">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {asArray<ImageFile>(formData.images).map((image, index) => (
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
                                <img src={image.url} alt={`Mobile Home Image ${index + 1}`} className="w-full h-32 object-cover" />
                                <div className="absolute top-2 right-2 flex gap-1">
                                  {image.isCover && <Badge className="bg-primary text-primary-foreground">Cover</Badge>}
                                  {!image.isCover && (
                                    <Button type="button" variant="secondary" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleSetCoverImage(image.id)} title="Set as cover image">
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

            <div className="space-y-2 mt-4">
              <Label htmlFor="photoURL">Photo URL</Label>
              <Input id="photoURL" value={formData.photoURL} onChange={(e) => handleInputChange('photoURL', e.target.value)} placeholder="Enter URL for a photo of the home" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="virtualTour">Virtual Tour URL</Label>
              <Input id="virtualTour" value={formData.virtualTour} onChange={(e) => handleInputChange('virtualTour', e.target.value)} placeholder="Enter URL for a virtual tour video" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesPhoto">Sales Photo URL</Label>
              <Input id="salesPhoto" value={formData.salesPhoto} onChange={(e) => handleInputChange('salesPhoto', e.target.value)} placeholder="Enter URL for sales agent/company logo photo" />
            </div>
          </CardContent>
        </Card>

        {/* Bottom actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{initialData ? 'Update Home' : 'Add Home'}</Button>
        </div>
      </form>
    </div>
  )
}
