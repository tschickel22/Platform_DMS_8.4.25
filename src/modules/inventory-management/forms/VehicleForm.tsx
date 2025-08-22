// forms/VehicleForm.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Vehicle, VehicleStatus } from '../state/types'

export interface VehicleFormProps {
  vehicle?: Vehicle
  onSave: (data: Partial<Vehicle>) => void
  onCancel: () => void
}

const STATUS_OPTIONS: VehicleStatus[] = ['Available', 'Reserved', 'Sold', 'Pending']

export function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  // very small subset for demo; extend to cover RV/MH forms as needed
  const [type, setType] = useState<Vehicle['type']>(vehicle?.type ?? 'RV')
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status ?? 'Available')
  const [brand, setBrand] = useState<string>((vehicle as any)?.brand ?? (vehicle as any)?.make ?? '')
  const [model, setModel] = useState<string>((vehicle as any)?.model ?? '')
  const [modelDate, setModelDate] = useState<string>(String((vehicle as any)?.modelDate ?? (vehicle as any)?.year ?? ''))
  const [price, setPrice] = useState<string>(String((vehicle as any)?.price ?? (vehicle as any)?.askingPrice ?? ''))
  const [location, setLocation] = useState<string>((vehicle as any)?.location ?? (vehicle as any)?.city ?? '')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const base: Partial<Vehicle> = {
      type,
      status,
      updatedAt: new Date().toISOString()
    } as Partial<Vehicle>

    const rvFields: Partial<Vehicle> = type === 'RV'
      ? {
          brand,
          model,
          modelDate: price ? Number(modelDate) : undefined,
          price: price ? Number(price) : undefined,
          location,
        } as any
      : {}

    const mhFields: Partial<Vehicle> = type === 'MH'
      ? {
          make: brand,
          model,
          year: modelDate ? Number(modelDate) : undefined,
          askingPrice: price ? Number(price) : undefined,
          city: location,
        } as any
      : {}

    onSave({ ...base, ...(type === 'RV' ? rvFields : mhFields) })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as Vehicle['type'])}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="RV">RV</SelectItem>
              <SelectItem value="MH">Manufactured Home</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as VehicleStatus)}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{type === 'RV' ? 'Brand' : 'Make'}</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>{type === 'RV' ? 'Model Year' : 'Year'}</Label>
          <Input value={modelDate} onChange={(e) => setModelDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Price</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Location / City</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
