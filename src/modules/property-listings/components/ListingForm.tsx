import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InventoryItem, Listing } from '@/data/catalog'

type Props = {
  inventoryItem: InventoryItem
  listing?: Listing
  onSave: (patch: Partial<Listing>) => void
  onCancel: () => void
  onPushToInventory?: (fields: Array<keyof InventoryItem>) => void
}

export default function ListingForm({ inventoryItem, listing, onSave, onCancel, onPushToInventory }: Props) {
  const isMH = (listing?.listingType ?? 'manufactured_home') === 'manufactured_home'

  // basic fields
  const [status, setStatus] = React.useState<Listing['status']>(listing?.status ?? 'draft')
  const [offerType, setOfferType] = React.useState<Listing['offerType']>(listing?.offerType ?? 'sale')
  const [salePrice, setSalePrice] = React.useState<number | undefined>(listing?.salePrice)
  const [rentPrice, setRentPrice] = React.useState<number | undefined>(listing?.rentPrice)
  const [description, setDescription] = React.useState(listing?.description ?? '')

  // overrides (for MH/RV attributes)
  const [bedrooms, setBedrooms] = React.useState<number | undefined>(listing?.overrides?.bedrooms)
  const [bathrooms, setBathrooms] = React.useState<number | undefined>(listing?.overrides?.bathrooms)
  const [sqft, setSqft] = React.useState<number | undefined>(listing?.overrides?.dimensions?.squareFeet)
  const [sleeps, setSleeps] = React.useState<number | undefined>(listing?.overrides?.sleeps)
  const [lengthFt, setLengthFt] = React.useState<number | undefined>(listing?.overrides?.dimensions?.length)

  const merged = React.useMemo(() => {
    const dim = {
      squareFeet: sqft ?? inventoryItem?.dimensions?.squareFeet,
      length: lengthFt ?? inventoryItem?.dimensions?.length,
    }
    return {
      bedrooms: bedrooms ?? inventoryItem?.bedrooms,
      bathrooms: bathrooms ?? inventoryItem?.bathrooms,
      dimensions: (dim.squareFeet || dim.length) ? dim : undefined,
      sleeps: sleeps ?? inventoryItem?.sleeps,
    }
  }, [inventoryItem, bedrooms, bathrooms, sqft, sleeps, lengthFt])

  const canSave = React.useMemo(() => {
    if (isMH) {
      const okBeds = !!(merged.bedrooms)
      const okBaths = !!(merged.bathrooms)
      const okSqft = !!(merged.dimensions?.squareFeet)
      return okBeds && okBaths && okSqft
    }
    return true
  }, [isMH, merged])

  const onSubmit = () => {
    const overrides: Listing['overrides'] = {
      ...(bedrooms != null ? { bedrooms } : {}),
      ...(bathrooms != null ? { bathrooms } : {}),
      ...(sleeps != null ? { sleeps } : {}),
      ...((sqft != null || lengthFt != null) ? { dimensions: { squareFeet: sqft, length: lengthFt } } : {}),
    }
    onSave({
      status,
      offerType,
      salePrice: offerType === 'sale' ? salePrice : undefined,
      rentPrice: offerType === 'rent' ? rentPrice : undefined,
      description,
      overrides: Object.keys(overrides).length ? overrides : undefined,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Basic details</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Inventory</div>
            <div className="text-sm">
              {[inventoryItem.year, inventoryItem.make, inventoryItem.model].filter(Boolean).join(' ')}
              <div className="text-muted-foreground">{inventoryItem.location?.city}, {inventoryItem.location?.state}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Status</div>
            <Select value={status} onValueChange={(v)=>setStatus(v as any)}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Offer type</div>
            <Select value={offerType} onValueChange={(v)=>setOfferType(v as any)}>
              <SelectTrigger><SelectValue placeholder="Offer type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {offerType === 'sale' ? (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Sale price</div>
              <Input inputMode="numeric" value={salePrice ?? ''} onChange={(e)=>setSalePrice(Number(e.target.value || 0))} />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Rent price</div>
              <Input inputMode="numeric" value={rentPrice ?? ''} onChange={(e)=>setRentPrice(Number(e.target.value || 0))} />
            </div>
          )}

          <div className="sm:col-span-2 space-y-2">
            <div className="text-xs text-muted-foreground">Description</div>
            <Textarea rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Custom features (overrides)</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {isMH ? (
            <>
              <div>
                <div className="text-xs text-muted-foreground">Bedrooms (required)</div>
                <Input inputMode="numeric" value={bedrooms ?? ''} onChange={(e)=>setBedrooms(Number(e.target.value || 0))} placeholder={String(inventoryItem.bedrooms ?? '')} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Bathrooms (required)</div>
                <Input inputMode="numeric" value={bathrooms ?? ''} onChange={(e)=>setBathrooms(Number(e.target.value || 0))} placeholder={String(inventoryItem.bathrooms ?? '')} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Square feet (required)</div>
                <Input inputMode="numeric" value={sqft ?? ''} onChange={(e)=>setSqft(Number(e.target.value || 0))} placeholder={String(inventoryItem.dimensions?.squareFeet ?? '')} />
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-xs text-muted-foreground">Sleeps</div>
                <Input inputMode="numeric" value={sleeps ?? ''} onChange={(e)=>setSleeps(Number(e.target.value || 0))} placeholder={String(inventoryItem.sleeps ?? '')} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Length (ft)</div>
                <Input inputMode="numeric" value={lengthFt ?? ''} onChange={(e)=>setLengthFt(Number(e.target.value || 0))} placeholder={String(inventoryItem.dimensions?.length ?? '')} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        {onPushToInventory && listing?.id && (
          <Button type="button" variant="outline" onClick={()=>{
            const fields: Array<keyof InventoryItem> = []
            if (bedrooms != null) fields.push('bedrooms')
            if (bathrooms != null) fields.push('bathrooms')
            if (sqft != null || lengthFt != null) fields.push('dimensions')
            if (sleeps != null) fields.push('sleeps')
            onPushToInventory(fields)
          }}>
            Push overrides to inventory
          </Button>
        )}
        <div className="ml-auto flex gap-2">
        {/* Custom Features (Overrides) Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Custom features (overrides)</h3>
              <p className="text-sm text-muted-foreground">
                Override inventory values for this listing only
              </p>
            </div>
            {listing && onPushToInventory && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const overrideFields = Object.keys(formData).filter(key => 
                    formData[key] !== inventoryItem[key] && formData[key] !== ''
                  );
                  if (overrideFields.length > 0) {
                    onPushToInventory(overrideFields);
                  }
                }}
              >
                Push selected fields back to inventory
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {isMH && (
              <>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                    placeholder={inventoryItem.bedrooms?.toString() || '0'}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) || 0 }))}
                    placeholder={inventoryItem.bathrooms?.toString() || '0'}
                  />
                </div>
                <div>
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    min="0"
                    value={formData.dimensions?.squareFeet || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, squareFeet: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder={inventoryItem.dimensions?.squareFeet?.toString() || '0'}
                  />
                </div>
              </>
            )}

            {isRV && (
              <>
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    type="number"
                    min="0"
                    value={formData.sleeps || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, sleeps: parseInt(e.target.value) || 0 }))}
                    placeholder={inventoryItem.sleeps?.toString() || '0'}
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.dimensions?.length || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder={inventoryItem.dimensions?.length?.toString() || '0'}
                  />
                </div>
                <div>
                  <Label htmlFor="slides">Slides</Label>
                  <Input
                    id="slides"
                    type="number"
                    min="0"
                    value={formData.slides || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, slides: parseInt(e.target.value) || 0 }))}
                    placeholder={inventoryItem.slides?.toString() || '0'}
                  />
                </div>
              </>
            )}
          </div>
        </div>

          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="button" disabled={!canSave} onClick={onSubmit}>Save</Button>
        </div>
      </div>
    </div>
  )
}