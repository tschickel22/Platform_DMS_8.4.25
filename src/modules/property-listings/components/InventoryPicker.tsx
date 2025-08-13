import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCatalog } from '@/data/catalog'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onPick: (inventoryId: string) => void
  listingType: 'manufactured_home' | 'rv'
}

export default function InventoryPicker({ open, onOpenChange, onPick, listingType }: Props) {
  const { inventory, listings } = useCatalog();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const t = listingType
    const matchesType = (i: any) =>
      t === 'manufactured_home'
        ? (i.bedrooms || i.bathrooms || i?.dimensions?.squareFeet)
        : (i.sleeps || i?.dimensions?.length)
    const qq = search.trim().toLowerCase()
    return inventory
      .filter(matchesType)
      .filter(i =>
        !qq ||
        [i.year, i.make, i.model, i?.location?.city, i?.location?.state]
          .join(' ')
          .toLowerCase()
          .includes(qq)
      )
  }, [inventory, search, listingType])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Select inventory</DialogTitle></DialogHeader>

        <div className="mb-3">
          <Input placeholder="Search inventory..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>

        {filtered.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((i) => (
              <Card key={i.id} className="overflow-hidden">
                <img src={i.media?.primaryPhoto || 'https://picsum.photos/seed/inv/600/320'} className="w-full h-32 object-cover" />
                <CardContent className="p-3">
                  <div className="font-medium">
                    {[i.year, i.make, i.model].filter(Boolean).join(' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i.location?.city}, {i.location?.state}
                  </div>
                  <Button className="mt-2 w-full" onClick={()=>onPick(i.id)}>Use this</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <div className="font-semibold mb-2">No inventory available</div>
            <p className="text-sm text-muted-foreground mb-4">Add inventory items first to create listings</p>
            <Button onClick={() => {
              onOpenChange(false);
              navigate('/inventory');
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Inventory
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}