// src/modules/property-listings/PropertyListings.tsx
import React, { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Building, Home, DollarSign, Search, MapPin, Bed, Bath, Square, Users, Ruler, Eye, Trash2, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'

import ListingTypeDialog from './components/ListingTypeDialog'
import InventoryPicker from './components/InventoryPicker'
import ListingForm from './components/ListingForm'

import { useCatalog, useEffectiveListings, averagePrice } from '@/data/catalog'
import type { Listing } from '@/data/catalog'
import { buildExportMeta } from './lib/exportMeta'

const priceText = (sale?: number, rent?: number) => sale ? `$${sale.toLocaleString()}`
  : rent ? `$${rent.toLocaleString()}/mo` : 'Price on request'
const statusBadge = (s?: string) => s === 'active' ? 'bg-green-500' : s === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
const typeBadge = (t?: string) => t === 'manufactured_home' ? 'bg-blue-500' : t === 'rv' ? 'bg-purple-500' : 'bg-gray-500'

function PropertyListingsDashboard() {
  const eff = useEffectiveListings()
  const { inventory, listings, createListingForInventory, updateListing, deleteListing, pushOverridesToInventory } = useCatalog()
  const { user } = useAuth()
  const { tenant } = useTenant()

  // Flow modals
  const [typeOpen, setTypeOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [pickedInvId, setPickedInvId] = useState<string | null>(null)
  const [editingListingId, setEditingListingId] = useState<string | null>(null)
  const [chosenType, setChosenType] = useState<'manufactured_home'|'rv'>('manufactured_home')

  const editingListing = listings.find(l => l.id === editingListingId) || null
  const editingInventory = editingListing ? inventory.find(i => i.id === editingListing.inventoryId)! : null
  const pickedInventory = pickedInvId ? inventory.find(i => i.id === pickedInvId)! : null

  // Filters
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'inactive'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'manufactured_home' | 'rv'>('all')
  const [priceFilter, setPriceFilter] = useState<'all'|'under100k'|'100k-300k'|'over300k'>('all')
  const [activeTile, setActiveTile] = useState<'all'|'active'|'premium'>('all')

  const stats = useMemo(() => ({
    total: eff.length,
    active: eff.filter(l => l.status === 'active').length,
    avgPrice: averagePrice(eff)
  }), [eff])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    const withinPrice = (s?: number, r?: number) => {
      const val = Number(s ?? r ?? 0)
      if (priceFilter === 'under100k') return val < 100_000
      if (priceFilter === '100k-300k') return val >= 100_000 && val <= 300_000
      if (priceFilter === 'over300k') return val > 300_000
      return true
    }
    return eff.filter(l => {
      const text = [l.description, l.location?.city, l.location?.state, l.make, l.model, l.year]
        .join(' ')
        .toLowerCase()
      const sOk = statusFilter === 'all' || l.status === statusFilter
      const tOk = typeFilter === 'all' || l.listingType === typeFilter
      return (!qq || text.includes(qq)) && sOk && tOk && withinPrice(l.salePrice, l.rentPrice)
    })
  }, [eff, q, statusFilter, typeFilter, priceFilter])

  // Tiles
  const activateAll = () => { setActiveTile('all'); setStatusFilter('all'); setPriceFilter('all') }
  const activateActive = () => { setActiveTile('active'); setStatusFilter('active'); setPriceFilter('all') }
  const activatePremium = () => { setActiveTile('premium'); setPriceFilter('over300k'); setStatusFilter('all') }

  // CRUD flow
  const startCreate = () => { setTypeOpen(true) }
  const handlePickType = (t: 'manufactured_home' | 'rv') => {
    setChosenType(t)
    setTypeOpen(false)
    setPickedInvId(null)
    setPickerOpen(true)
  }
  const handlePickInventory = (inventoryId: string) => {
    setPickedInvId(inventoryId)
    setPickerOpen(false)
    setFormOpen(true)
  }

  const saveCreate = (patch: Partial<Listing>) => {
    if (!pickedInvId) return
    // compute hidden export fields
    const inv = inventory.find(i => i.id === pickedInvId)
    const exportMeta = buildExportMeta({ tenant, user, inventory: inv, existing: undefined })
    // set RentalPrice for rent offers
    if (patch.offerType === 'rent' && patch.rentPrice && !exportMeta.RentalPrice) {
      exportMeta.RentalPrice = patch.rentPrice
    }
    try {
      createListingForInventory(pickedInvId, {
        listingType: chosenType,
        ...patch,
        exportMeta
      })
      setFormOpen(false)
      setPickedInvId(null)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to create listing')
    }
  }

  const saveEdit = (patch: Partial<Listing>) => {
    if (!editingListing) return
    // refresh hidden fields (don't show to user)
    const inv = inventory.find(i => i.id === editingListing.inventoryId)
    const exportMeta = buildExportMeta({
      tenant, user, inventory: inv, existing: editingListing.exportMeta
    })
    if (patch.offerType === 'rent' && patch.rentPrice) {
      exportMeta.RentalPrice = patch.rentPrice
    }
    try {
      updateListing(editingListing.id, { ...patch, exportMeta })
      setFormOpen(false)
      setEditingListingId(null)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to update listing')
    }
  }

  const remove = (id: string) => {
    if (!confirm('Delete this listing?')) return
    deleteListing(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">
            Create listings from existing inventory. Manufactured homes require bedrooms, bathrooms, and square feet.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={startCreate}><Plus className="h-4 w-4" /> Add New Listing</Button>
        </div>
      </div>

      {/* Stats (clickable) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card onClick={activateAll} role="button" tabIndex={0}
          className={cn('shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer', activeTile==='all' && 'ring-2 ring-blue-300')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Listings</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">All property listings</p>
          </CardContent>
        </Card>

        <Card onClick={activateActive} role="button" tabIndex={0}
          className={cn('shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer', activeTile==='active' && 'ring-2 ring-green-300')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.active}</div>
            <p className="text-xs text-green-600">Available now</p>
          </CardContent>
        </Card>

        <Card onClick={activatePremium} role="button" tabIndex={0}
          className={cn('shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer', activeTile==='premium' && 'ring-2 ring-yellow-300')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">${stats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-yellow-600">Click to view premium (&gt;$300k)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Find listings fast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search make/model/city/state…" value={q} onChange={e=>setQ(e.target.value)} className="pl-10" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Select value={statusFilter} onValueChange={(v)=>{ if (v !== statusFilter) { setStatusFilter(v as any); setActiveTile('all') }}}>
              <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(v)=>{ if (v !== typeFilter) { setTypeFilter(v as any); setActiveTile('all') }}}>
              <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={(v)=>{ if (v !== priceFilter) { setPriceFilter(v as any); setActiveTile('all') }}}>
              <SelectTrigger><SelectValue placeholder="All Prices" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100k">Under $100K</SelectItem>
                <SelectItem value="100k-300k">$100K – $300K</SelectItem>
                <SelectItem value="over300k">Over $300K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Count */}
      <div className="text-sm text-muted-foreground">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</div>

      {/* Grid */}
      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(l => (
            <Card key={l.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={l.media?.primaryPhoto || 'https://picsum.photos/800/450'} alt={l.model ?? l.make ?? 'Listing'} className="w-full h-48 object-cover" />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={`${statusBadge(l.status)} text-white`}>{l.status}</Badge>
                  <Badge className={`${typeBadge(l.listingType)} text-white`}>{l.listingType==='manufactured_home'?'MH':'RV'}</Badge>
                  {l.hasOverrides && <Badge variant="secondary">Overrides</Badge>}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">{priceText(l.salePrice, l.rentPrice)}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{[l.year, l.make, l.model].filter(Boolean).join(' ') || 'Untitled'}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {(l.location?.city || '—')}, {(l.location?.state || '')}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {l.listingType==='manufactured_home' ? (
                    <>
                      {l.bedrooms && <span className="flex items-center"><Bed className="h-4 w-4 mr-1" />{l.bedrooms}</span>}
                      {l.bathrooms && <span className="flex items-center"><Bath className="h-4 w-4 mr-1" />{l.bathrooms}</span>}
                      {l.dimensions?.squareFeet && <span className="flex items-center"><Square className="h-4 w-4 mr-1" />{l.dimensions.squareFeet} sq ft</span>}
                    </>
                  ) : (
                    <>
                      {l.sleeps && <span className="flex items-center"><Users className="h-4 w-4 mr-1" />Sleeps {l.sleeps}</span>}
                      {l.dimensions?.length && <span className="flex items-center"><Ruler className="h-4 w-4 mr-1" />{l.dimensions.length} ft</span>}
                      {l.slides && <span className="flex items-center">📐 {l.slides} slides</span>}
                    </>
                  )}
                </div>
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={()=>{ setEditingListingId(l.id); setFormOpen(true) }}>
                    <Eye className="h-4 w-4 mr-1" /> View / Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={()=>remove(l.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-12 text-center">
          <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <div className="font-semibold mb-2">No listings yet</div>
          <Button onClick={startCreate}><Plus className="h-4 w-4 mr-2" />Add New Listing</Button>
        </CardContent></Card>
      )}

      {/* Modals */}
      <ListingTypeDialog open={typeOpen} onOpenChange={setTypeOpen} onPick={handlePickType} />

      <InventoryPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={handlePickInventory} listingType={chosenType} />

      <Dialog open={formOpen} onOpenChange={(open)=>{ if (!open){ setFormOpen(false); setEditingListingId(null); setPickedInvId(null) }}}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>{editingListing ? 'Edit Listing' : 'Add Listing'}</DialogTitle></DialogHeader>
          {editingListing && editingInventory && (
            <ListingForm
              inventoryItem={editingInventory}
              listing={editingListing}
              onCancel={()=>{ setFormOpen(false); setEditingListingId(null) }}
              onSave={saveEdit}
              onPushToInventory={(fields)=>pushOverridesToInventory(editingListing.id, fields)}
            />
          )}
          {!editingListing && pickedInventory && (
            <ListingForm
              inventoryItem={pickedInventory}
              onCancel={()=>{ setFormOpen(false); setPickedInvId(null) }}
              onSave={saveCreate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsDashboard />} />
      <Route path="*" element={<PropertyListingsDashboard />} />
    </Routes>
  )
}