import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MHInventoryFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  /** Optional company address source for the "Use company address" button */
  companyAddress?: Partial<{
    Address1: string
    Address2: string
    City: string
    State: string
    Zip: string
    CountyName: string
    Township: string
    SchoolDistrict: string
    Latitude: number | string
    Longitude: number | string
  }>
}

/** helpers */
const toInt = (v: any, d = 0) => {
  const n = typeof v === 'number' ? v : parseInt((v ?? '').toString(), 10)
  return Number.isFinite(n) ? n : d
}
const toNum = (v: any, d = 0) => {
  const n = typeof v === 'number' ? v : parseFloat((v ?? '').toString())
  return Number.isFinite(n) ? n : d
}
const splitLinesOrCSV = (s: string) =>
  (s || '')
    .split(/\r?\n|,/)
    .map(x => x.trim())
    .filter(Boolean)

/** small controlled Yes/No select */
function YesNoSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: 'Yes' | 'No'
  onChange: (v: 'Yes' | 'No') => void
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as 'Yes' | 'No')}>
        <SelectTrigger id={id}><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default function MHInventoryForm({
  initialData = {},
  onSubmit,
  onCancel,
  companyAddress,
}: MHInventoryFormProps) {
  /** seed state with table fields (falling back to common alternates) */
  const [form, setForm] = useState({
    // --- Listing / IDs --------------------------------------------------------
    SellerID: initialData.SellerID || initialData.stockNumber || '',
    CompanyID: initialData.CompanyID || initialData.companyId || '',

    // --- Pricing & Text -------------------------------------------------------
    AskingPrice: toInt(initialData.AskingPrice ?? initialData.askingPrice ?? initialData.price, 0), // Asking or Rental required (one of)
    RentalPrice: toInt(initialData.RentalPrice ?? initialData.rentPrice, 0),                         // Asking or Rental required (one of)
    Description: initialData.Description ?? initialData.description ?? '',
    Terms: initialData.Terms ?? '',

    // --- Location meta --------------------------------------------------------
    LocationType: initialData.LocationType || 'Community', // Community, DealerLot, Leased, PrivProp, Move
    CommunityKey: initialData.CommunityKey || '',
    CommunityName: initialData.CommunityName || initialData.communityName || '',

    // --- Address (NOT required per your request) ------------------------------
    Address1: initialData.Address1 || initialData.address1 || '',
    Address2: initialData.Address2 || initialData.address2 || '',
    City: initialData.City || initialData.city || '',
    State: initialData.State || initialData.state || '',
    Zip: initialData.Zip || initialData.Zip9 || initialData.postalCode || '', // renamed from Zip9 -> Zip
    CountyName: initialData.CountyName || '',
    Township: initialData.Township || '',
    SchoolDistrict: initialData.SchoolDistrict || '',
    Latitude: initialData.Latitude ?? initialData.location?.latitude ?? '',
    Longitude: initialData.Longitude ?? initialData.location?.longitude ?? '',

    // --- Home details ---------------------------------------------------------
    HomeType: initialData.HomeType || 'Mobile', // Mobile, Manufactured, Modular
    Make: initialData.Make || initialData.make || '',
    Model: initialData.Model || initialData.model || '',
    Year: toInt(initialData.Year ?? initialData.year ?? new Date().getFullYear()),
    Color: initialData.Color || '',
    Width1: toInt(initialData.Width1 ?? initialData.width_ft ?? 0),
    Length1: toInt(initialData.Length1 ?? initialData.length_ft ?? 0),
    Width2: toInt(initialData.Width2 ?? 0),
    Length2: toInt(initialData.Length2 ?? 0),
    Width3: toInt(initialData.Width3 ?? 0),
    Length3: toInt(initialData.Length3 ?? 0),
    Bedrooms: toInt(initialData.Bedrooms ?? initialData.bedrooms ?? 0),
    Bathrooms: toNum(initialData.Bathrooms ?? initialData.bathrooms ?? 0),
    RoofType: initialData.RoofType || 'Shingled', // Metal, Shingled
    SidingType: initialData.SidingType || 'Vinyl', // Metal, Vinyl, Wood, Other
    Garage: (initialData.Garage ?? 'No') as 'Yes' | 'No',
    Carport: (initialData.Carport ?? 'No') as 'Yes' | 'No',
    CentralAir: (initialData.CentralAir ?? 'No') as 'Yes' | 'No',
    Thermopane: (initialData.Thermopane ?? 'No') as 'Yes' | 'No',
    SerialNumber: initialData.SerialNumber || initialData.serialNumber || '',
    CeilingType: initialData.CeilingType || 'Drywall', // Drywall, Hard Panel, Soft Panel
    WallType: initialData.WallType || 'Drywall',       // Drywall, Panel, Paper
    Fireplace: (initialData.Fireplace ?? 'No') as 'Yes' | 'No',
    StorageShed: (initialData.StorageShed ?? 'No') as 'Yes' | 'No',
    Gutters: (initialData.Gutters ?? 'No') as 'Yes' | 'No',
    Shutters: (initialData.Shutters ?? 'No') as 'Yes' | 'No',
    Deck: (initialData.Deck ?? 'No') as 'Yes' | 'No',
    Patio: (initialData.Patio ?? 'No') as 'Yes' | 'No',
    CathedralCeiling: (initialData.CathedralCeiling ?? 'No') as 'Yes' | 'No',
    CeilingFan: (initialData.CeilingFan ?? 'No') as 'Yes' | 'No',
    Skylight: (initialData.Skylight ?? 'No') as 'Yes' | 'No',
    WalkinCloset: (initialData.WalkinCloset ?? 'No') as 'Yes' | 'No',
    LaundryRoom: (initialData.LaundryRoom ?? 'Yes') as 'Yes' | 'No',
    Pantry: (initialData.Pantry ?? 'No') as 'Yes' | 'No',
    SunRoom: (initialData.SunRoom ?? 'No') as 'Yes' | 'No',
    Basement: (initialData.Basement ?? 'No') as 'Yes' | 'No',
    GardenTub: (initialData.GardenTub ?? 'No') as 'Yes' | 'No',
    GarbageDisposal: (initialData.GarbageDisposal ?? 'No') as 'Yes' | 'No',
    Refrigerator: (initialData.Refrigerator ?? 'No') as 'Yes' | 'No',
    Microwave: (initialData.Microwave ?? 'No') as 'Yes' | 'No',
    Oven: (initialData.Oven ?? 'No') as 'Yes' | 'No',
    Dishwasher: (initialData.Dishwasher ?? 'No') as 'Yes' | 'No',
    ClothesWasher: (initialData.ClothesWasher ?? 'No') as 'Yes' | 'No',
    ClothesDryer: (initialData.ClothesDryer ?? 'No') as 'Yes' | 'No',
    LotRent: (initialData.LotRent ?? initialData.lotRent ?? '').toString(),
    Taxes: (initialData.Taxes ?? '').toString(),
    Utilities: (initialData.Utilities ?? '').toString(),

    // --- Seller / package -----------------------------------------------------
    SellerAccountKey: toInt(initialData.SellerAccountKey ?? 0),
    SellerFirstName: initialData.SellerFirstName || initialData.sellerFirstName || '',
    SellerLastName: initialData.SellerLastName || initialData.sellerLastName || '',
    SellerCompanyName: initialData.SellerCompanyName || initialData.sellerCompanyName || '',
    SellerPhone: initialData.SellerPhone || initialData.sellerPhone || '',
    SellerEmail: initialData.SellerEmail || initialData.sellerEmail || '',
    SellerFax: initialData.SellerFax || initialData.sellerFax || '',
    Repo: (initialData.Repo ?? 'No') as 'Yes' | 'No',
    PackageType: initialData.PackageType || 'Standard', // Standard, Featured, Premium
    SalePending: (initialData.SalePending ?? 'No') as 'Yes' | 'No',
    SoldPrice: toInt(initialData.SoldPrice ?? 0),

    // --- Extra public info ----------------------------------------------------
    SearchResultsText: initialData.SearchResultsText || '',
    SellerWebsite: initialData.SellerWebsite || '',
    SellerEmail2: initialData.SellerEmail2 || '',
    SellerEmail3: initialData.SellerEmail3 || '',
    SellerEmail4: initialData.SellerEmail4 || '',
    SellerPhone2: initialData.SellerPhone2 || '',

    // --- Media ----------------------------------------------------------------
    PhotoURLText:
      Array.isArray(initialData.PhotoURL)
        ? initialData.PhotoURL.join('\n')
        : (initialData.PhotoURL || ''), // CSV/newline, will normalize to array
    VirtualTour: initialData.VirtualTour || '',
    SalesPhoto: initialData.SalesPhoto || '',
  })

  const setF = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }))

  const useCompanyAddr = () => {
    const src = companyAddress || initialData.companyAddress || {}
    setForm(prev => ({
      ...prev,
      Address1: src.Address1 ?? prev.Address1,
      Address2: src.Address2 ?? prev.Address2,
      City: src.City ?? prev.City,
      State: src.State ?? prev.State,
      Zip: (src as any).Zip ?? prev.Zip, // Zip (not Zip9)
      CountyName: (src as any).CountyName ?? prev.CountyName,
      Township: (src as any).Township ?? prev.Township,
      SchoolDistrict: (src as any).SchoolDistrict ?? prev.SchoolDistrict,
      Latitude: (src as any).Latitude ?? prev.Latitude,
      Longitude: (src as any).Longitude ?? prev.Longitude,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure at least one of AskingPrice or RentalPrice is provided per spec note.
    if (!toInt(form.AskingPrice) && !toInt(form.RentalPrice)) {
      // soft guard – keep UX simple
      alert('Please enter AskingPrice or RentalPrice.')
      return
    }

    const payload = {
      // IDs
      SellerID: form.SellerID,
      CompanyID: form.CompanyID,

      // Pricing / text
      AskingPrice: toInt(form.AskingPrice),
      RentalPrice: toInt(form.RentalPrice),
      Description: form.Description,
      Terms: form.Terms,

      // Location meta
      LocationType: form.LocationType,   // Community, DealerLot, Leased, PrivProp, Move
      CommunityKey: form.CommunityKey,
      CommunityName: form.CommunityName,

      // Address (Zip not Zip9)
      Address1: form.Address1 || undefined,
      Address2: form.Address2 || undefined,
      City: form.City || undefined,
      State: form.State || undefined,
      Zip: form.Zip || undefined,
      CountyName: form.CountyName || undefined,
      Township: form.Township || undefined,
      SchoolDistrict: form.SchoolDistrict || undefined,
      Latitude: form.Latitude === '' ? undefined : toNum(form.Latitude),
      Longitude: form.Longitude === '' ? undefined : toNum(form.Longitude),

      // Home details
      HomeType: form.HomeType,           // Mobile, Manufactured, Modular
      Make: form.Make,
      Model: form.Model,
      Year: toInt(form.Year),
      Color: form.Color,
      Width1: toInt(form.Width1),
      Length1: toInt(form.Length1),
      Width2: toInt(form.Width2),
      Length2: toInt(form.Length2),
      Width3: toInt(form.Width3),
      Length3: toInt(form.Length3),
      Bedrooms: toInt(form.Bedrooms),
      Bathrooms: toNum(form.Bathrooms),
      RoofType: form.RoofType,           // Metal, Shingled
      SidingType: form.SidingType,       // Metal, Vinyl, Wood, Other
      Garage: form.Garage,
      Carport: form.Carport,
      CentralAir: form.CentralAir,
      Thermopane: form.Thermopane,
      SerialNumber: form.SerialNumber,
      CeilingType: form.CeilingType,     // Drywall, Hard Panel, Soft Panel
      WallType: form.WallType,           // Drywall, Panel, Paper
      Fireplace: form.Fireplace,
      StorageShed: form.StorageShed,
      Gutters: form.Gutters,
      Shutters: form.Shutters,
      Deck: form.Deck,
      Patio: form.Patio,
      CathedralCeiling: form.CathedralCeiling,
      CeilingFan: form.CeilingFan,
      Skylight: form.Skylight,
      WalkinCloset: form.WalkinCloset,
      LaundryRoom: form.LaundryRoom,
      Pantry: form.Pantry,
      SunRoom: form.SunRoom,
      Basement: form.Basement,
      GardenTub: form.GardenTub,
      GarbageDisposal: form.GarbageDisposal,
      Refrigerator: form.Refrigerator,
      Microwave: form.Microwave,
      Oven: form.Oven,
      Dishwasher: form.Dishwasher,
      ClothesWasher: form.ClothesWasher,
      ClothesDryer: form.ClothesDryer,
      LotRent: form.LotRent,
      Taxes: form.Taxes,
      Utilities: form.Utilities,

      // Seller / package
      SellerAccountKey: toInt(form.SellerAccountKey),
      SellerFirstName: form.SellerFirstName,
      SellerLastName: form.SellerLastName,
      SellerCompanyName: form.SellerCompanyName,
      SellerPhone: form.SellerPhone,
      SellerEmail: form.SellerEmail,
      SellerFax: form.SellerFax,
      Repo: form.Repo,
      PackageType: form.PackageType,     // Standard, Featured, Premium
      SalePending: form.SalePending,
      SoldPrice: toInt(form.SoldPrice),

      // Extra public info
      SearchResultsText: form.SearchResultsText,
      SellerWebsite: form.SellerWebsite,
      SellerEmail2: form.SellerEmail2,
      SellerEmail3: form.SellerEmail3,
      SellerEmail4: form.SellerEmail4,
      SellerPhone2: form.SellerPhone2,

      // Media
      PhotoURL: splitLinesOrCSV(form.PhotoURLText), // multiple allowed
      VirtualTour: form.VirtualTour,
      SalesPhoto: form.SalesPhoto,
    }

    await onSubmit(payload)
  }

  /** UI */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* IDs & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Listing Identifiers</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="SellerID">SellerID *</Label>
              <Input id="SellerID" value={form.SellerID} onChange={(e) => setF('SellerID', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="CompanyID">CompanyID</Label>
              <Input id="CompanyID" value={form.CompanyID} onChange={(e) => setF('CompanyID', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Notes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="AskingPrice">AskingPrice</Label>
                <Input id="AskingPrice" type="number" value={form.AskingPrice}
                  onChange={(e) => setF('AskingPrice', toInt(e.target.value))} min={0} />
              </div>
              <div>
                <Label htmlFor="RentalPrice">RentalPrice (monthly)</Label>
                <Input id="RentalPrice" type="number" value={form.RentalPrice}
                  onChange={(e) => setF('RentalPrice', toInt(e.target.value))} min={0} />
              </div>
            </div>
            <div>
              <Label htmlFor="Terms">Terms</Label>
              <Input id="Terms" value={form.Terms} onChange={(e) => setF('Terms', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent>
          <Textarea id="Description" rows={4} value={form.Description}
            onChange={(e) => setF('Description', e.target.value)}
            placeholder="This is a great looking home in excellent condition ..." />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="LocationType">LocationType</Label>
              <Select value={form.LocationType} onValueChange={(v) => setF('LocationType', v)}>
                <SelectTrigger id="LocationType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="DealerLot">DealerLot</SelectItem>
                  <SelectItem value="Leased">Leased</SelectItem>
                  <SelectItem value="PrivProp">PrivProp</SelectItem>
                  <SelectItem value="Move">Move</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="CommunityKey">CommunityKey</Label>
              <Input id="CommunityKey" value={form.CommunityKey} onChange={(e) => setF('CommunityKey', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="CommunityName">CommunityName</Label>
              <Input id="CommunityName" value={form.CommunityName} onChange={(e) => setF('CommunityName', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Address fields are optional.</div>
            <Button type="button" variant="outline" size="sm" onClick={useCompanyAddr}>
              Use company address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Address1">Address1</Label>
              <Input id="Address1" value={form.Address1} onChange={(e) => setF('Address1', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="Address2">Address2</Label>
              <Input id="Address2" value={form.Address2} onChange={(e) => setF('Address2', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="City">City</Label>
              <Input id="City" value={form.City} onChange={(e) => setF('City', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="State">State</Label>
              <Input id="State" value={form.State} onChange={(e) => setF('State', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="Zip">Zip</Label>
              <Input id="Zip" value={form.Zip} onChange={(e) => setF('Zip', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="CountyName">CountyName</Label>
              <Input id="CountyName" value={form.CountyName} onChange={(e) => setF('CountyName', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="Township">Township</Label>
              <Input id="Township" value={form.Township} onChange={(e) => setF('Township', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SchoolDistrict">SchoolDistrict</Label>
              <Input id="SchoolDistrict" value={form.SchoolDistrict} onChange={(e) => setF('SchoolDistrict', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="Latitude">Latitude</Label>
                <Input id="Latitude" value={form.Latitude} onChange={(e) => setF('Latitude', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="Longitude">Longitude</Label>
                <Input id="Longitude" value={form.Longitude} onChange={(e) => setF('Longitude', e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home details */}
      <Card>
        <CardHeader><CardTitle>Home Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="HomeType">HomeType</Label>
              <Select value={form.HomeType} onValueChange={(v) => setF('HomeType', v)}>
                <SelectTrigger id="HomeType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Manufactured">Manufactured</SelectItem>
                  <SelectItem value="Modular">Modular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="Make">Make *</Label>
              <Input id="Make" value={form.Make} onChange={(e) => setF('Make', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="Model">Model</Label>
              <Input id="Model" value={form.Model} onChange={(e) => setF('Model', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="Year">Year *</Label>
              <Input id="Year" type="number" min={1900} max={new Date().getFullYear() + 1}
                value={form.Year} onChange={(e) => setF('Year', toInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="Color">Color</Label>
              <Input id="Color" value={form.Color} onChange={(e) => setF('Color', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div><Label htmlFor="Width1">Width1 *</Label>
              <Input id="Width1" type="number" value={form.Width1} onChange={(e) => setF('Width1', toInt(e.target.value))} />
            </div>
            <div><Label htmlFor="Length1">Length1 *</Label>
              <Input id="Length1" type="number" value={form.Length1} onChange={(e) => setF('Length1', toInt(e.target.value))} />
            </div>
            <div><Label htmlFor="Width2">Width2</Label>
              <Input id="Width2" type="number" value={form.Width2} onChange={(e) => setF('Width2', toInt(e.target.value))} />
            </div>
            <div><Label htmlFor="Length2">Length2</Label>
              <Input id="Length2" type="number" value={form.Length2} onChange={(e) => setF('Length2', toInt(e.target.value))} />
            </div>
            <div><Label htmlFor="Width3">Width3</Label>
              <Input id="Width3" type="number" value={form.Width3} onChange={(e) => setF('Width3', toInt(e.target.value))} />
            </div>
            <div><Label htmlFor="Length3">Length3</Label>
              <Input id="Length3" type="number" value={form.Length3} onChange={(e) => setF('Length3', toInt(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="Bedrooms">Bedrooms *</Label>
              <Input id="Bedrooms" type="number" value={form.Bedrooms} onChange={(e) => setF('Bedrooms', toInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="Bathrooms">Bathrooms *</Label>
              <Input id="Bathrooms" type="number" step="0.5" value={form.Bathrooms} onChange={(e) => setF('Bathrooms', toNum(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="RoofType">RoofType</Label>
              <Select value={form.RoofType} onValueChange={(v) => setF('RoofType', v)}>
                <SelectTrigger id="RoofType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Shingled">Shingled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="SidingType">SidingType</Label>
              <Select value={form.SidingType} onValueChange={(v) => setF('SidingType', v)}>
                <SelectTrigger id="SidingType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Vinyl">Vinyl</SelectItem>
                  <SelectItem value="Wood">Wood</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="SerialNumber">SerialNumber</Label>
              <Input id="SerialNumber" value={form.SerialNumber} onChange={(e) => setF('SerialNumber', e.target.value)} />
            </div>
          </div>

          {/* Feature toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <YesNoSelect id="Garage" label="Garage" value={form.Garage} onChange={(v) => setF('Garage', v)} />
            <YesNoSelect id="Carport" label="Carport" value={form.Carport} onChange={(v) => setF('Carport', v)} />
            <YesNoSelect id="CentralAir" label="CentralAir" value={form.CentralAir} onChange={(v) => setF('CentralAir', v)} />
            <YesNoSelect id="Thermopane" label="Thermopane" value={form.Thermopane} onChange={(v) => setF('Thermopane', v)} />
            <div>
              <Label htmlFor="CeilingType">CeilingType</Label>
              <Select value={form.CeilingType} onValueChange={(v) => setF('CeilingType', v)}>
                <SelectTrigger id="CeilingType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drywall">Drywall</SelectItem>
                  <SelectItem value="Hard Panel">Hard Panel</SelectItem>
                  <SelectItem value="Soft Panel">Soft Panel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="WallType">WallType</Label>
              <Select value={form.WallType} onValueChange={(v) => setF('WallType', v)}>
                <SelectTrigger id="WallType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drywall">Drywall</SelectItem>
                  <SelectItem value="Panel">Panel</SelectItem>
                  <SelectItem value="Paper">Paper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <YesNoSelect id="Fireplace" label="Fireplace" value={form.Fireplace} onChange={(v) => setF('Fireplace', v)} />
            <YesNoSelect id="StorageShed" label="StorageShed" value={form.StorageShed} onChange={(v) => setF('StorageShed', v)} />
            <YesNoSelect id="Gutters" label="Gutters" value={form.Gutters} onChange={(v) => setF('Gutters', v)} />
            <YesNoSelect id="Shutters" label="Shutters" value={form.Shutters} onChange={(v) => setF('Shutters', v)} />
            <YesNoSelect id="Deck" label="Deck" value={form.Deck} onChange={(v) => setF('Deck', v)} />
            <YesNoSelect id="Patio" label="Patio" value={form.Patio} onChange={(v) => setF('Patio', v)} />
            <YesNoSelect id="CathedralCeiling" label="CathedralCeiling" value={form.CathedralCeiling} onChange={(v) => setF('CathedralCeiling', v)} />
            <YesNoSelect id="CeilingFan" label="CeilingFan" value={form.CeilingFan} onChange={(v) => setF('CeilingFan', v)} />
            <YesNoSelect id="Skylight" label="Skylight" value={form.Skylight} onChange={(v) => setF('Skylight', v)} />
            <YesNoSelect id="WalkinCloset" label="WalkinCloset" value={form.WalkinCloset} onChange={(v) => setF('WalkinCloset', v)} />
            <YesNoSelect id="LaundryRoom" label="LaundryRoom" value={form.LaundryRoom} onChange={(v) => setF('LaundryRoom', v)} />
            <YesNoSelect id="Pantry" label="Pantry" value={form.Pantry} onChange={(v) => setF('Pantry', v)} />
            <YesNoSelect id="SunRoom" label="SunRoom" value={form.SunRoom} onChange={(v) => setF('SunRoom', v)} />
            <YesNoSelect id="Basement" label="Basement" value={form.Basement} onChange={(v) => setF('Basement', v)} />
            <YesNoSelect id="GardenTub" label="GardenTub" value={form.GardenTub} onChange={(v) => setF('GardenTub', v)} />
            <YesNoSelect id="GarbageDisposal" label="GarbageDisposal" value={form.GarbageDisposal} onChange={(v) => setF('GarbageDisposal', v)} />
            <YesNoSelect id="Refrigerator" label="Refrigerator" value={form.Refrigerator} onChange={(v) => setF('Refrigerator', v)} />
            <YesNoSelect id="Microwave" label="Microwave" value={form.Microwave} onChange={(v) => setF('Microwave', v)} />
            <YesNoSelect id="Oven" label="Oven" value={form.Oven} onChange={(v) => setF('Oven', v)} />
            <YesNoSelect id="Dishwasher" label="Dishwasher" value={form.Dishwasher} onChange={(v) => setF('Dishwasher', v)} />
            <YesNoSelect id="ClothesWasher" label="ClothesWasher" value={form.ClothesWasher} onChange={(v) => setF('ClothesWasher', v)} />
            <YesNoSelect id="ClothesDryer" label="ClothesDryer" value={form.ClothesDryer} onChange={(v) => setF('ClothesDryer', v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="LotRent">LotRent</Label>
              <Input id="LotRent" value={form.LotRent} onChange={(e) => setF('LotRent', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="Taxes">Taxes</Label>
              <Input id="Taxes" value={form.Taxes} onChange={(e) => setF('Taxes', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="Utilities">Utilities</Label>
              <Input id="Utilities" value={form.Utilities} onChange={(e) => setF('Utilities', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seller / package */}
      <Card>
        <CardHeader><CardTitle>Seller & Package</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="SellerAccountKey">SellerAccountKey</Label>
              <Input id="SellerAccountKey" type="number" value={form.SellerAccountKey}
                onChange={(e) => setF('SellerAccountKey', toInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="PackageType">PackageType *</Label>
              <Select value={form.PackageType} onValueChange={(v) => setF('PackageType', v)}>
                <SelectTrigger id="PackageType"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <YesNoSelect id="Repo" label="Repo" value={form.Repo} onChange={(v) => setF('Repo', v)} />
            <YesNoSelect id="SalePending" label="SalePending" value={form.SalePending} onChange={(v) => setF('SalePending', v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="SellerFirstName">SellerFirstName *</Label>
              <Input id="SellerFirstName" value={form.SellerFirstName} onChange={(e) => setF('SellerFirstName', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SellerLastName">SellerLastName *</Label>
              <Input id="SellerLastName" value={form.SellerLastName} onChange={(e) => setF('SellerLastName', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SellerCompanyName">SellerCompanyName</Label>
              <Input id="SellerCompanyName" value={form.SellerCompanyName} onChange={(e) => setF('SellerCompanyName', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="SellerPhone">SellerPhone *</Label>
              <Input id="SellerPhone" value={form.SellerPhone} onChange={(e) => setF('SellerPhone', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SellerPhone2">SellerPhone2</Label>
              <Input id="SellerPhone2" value={form.SellerPhone2} onChange={(e) => setF('SellerPhone2', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SellerEmail">SellerEmail *</Label>
              <Input id="SellerEmail" type="email" value={form.SellerEmail} onChange={(e) => setF('SellerEmail', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SellerFax">SellerFax</Label>
              <Input id="SellerFax" value={form.SellerFax} onChange={(e) => setF('SellerFax', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="SoldPrice">SoldPrice</Label>
              <Input id="SoldPrice" type="number" value={form.SoldPrice}
                onChange={(e) => setF('SoldPrice', toInt(e.target.value))} />
            </div>
            <div className="md:col-span-3" />
          </div>
        </CardContent>
      </Card>

      {/* Public info & media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Public Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="SearchResultsText">SearchResultsText</Label>
              <Input id="SearchResultsText" value={form.SearchResultsText} onChange={(e) => setF('SearchResultsText', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SellerWebsite">SellerWebsite</Label>
              <Input id="SellerWebsite" value={form.SellerWebsite} onChange={(e) => setF('SellerWebsite', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="SellerEmail2">SellerEmail2</Label>
                <Input id="SellerEmail2" value={form.SellerEmail2} onChange={(e) => setF('SellerEmail2', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="SellerEmail3">SellerEmail3</Label>
                <Input id="SellerEmail3" value={form.SellerEmail3} onChange={(e) => setF('SellerEmail3', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="SellerEmail4">SellerEmail4</Label>
                <Input id="SellerEmail4" value={form.SellerEmail4} onChange={(e) => setF('SellerEmail4', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="PhotoURLText">PhotoURL (one per line or comma separated)</Label>
              <Textarea id="PhotoURLText" rows={5} value={form.PhotoURLText} onChange={(e) => setF('PhotoURLText', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="VirtualTour">VirtualTour</Label>
              <Input id="VirtualTour" value={form.VirtualTour} onChange={(e) => setF('VirtualTour', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="SalesPhoto">SalesPhoto</Label>
              <Input id="SalesPhoto" value={form.SalesPhoto} onChange={(e) => setF('SalesPhoto', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Home</Button>
      </div>
    </form>
  )
}
