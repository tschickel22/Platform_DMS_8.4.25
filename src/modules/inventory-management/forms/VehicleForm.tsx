import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Vehicle, VehicleStatus } from '@/types'

export interface VehicleFormProps {
  vehicle?: Vehicle
  onSave: (data: Partial<Vehicle>) => void
  onCancel: () => void
}

// Named export to match: import { VehicleForm } from './forms/VehicleForm'
export function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  // Use safe defaults; keep this lightweight and self-contained
  const [vin, setVin] = useState<string>(vehicle?.vin || '')
  const [make, setMake] = useState<string>(vehicle?.make || '')
  const [model, setModel] = useState<string>(vehicle?.model || '')
  const [year, setYear] = useState<number>(vehicle?.year ?? new Date().getFullYear())
  const [price, setPrice] = useState<number>(vehicle?.price ?? 0)
  const [location, setLocation] = useState<string>(vehicle?.location || '')
  const [status, setStatus] = useState<VehicleStatus>(
    (vehicle?.status as VehicleStatus) ?? (Object.values(VehicleStatus)[0] as VehicleStatus)
  )

  const handleSave = () => {
    onSave({
      id: vehicle?.id, // preserve if editing
      vin,
      make,
      model,
      year,
      price,
      location,
      status,
    })
  }

  // Derive status options from enum to avoid drift across branches
  const statusOptions = (Object.values(VehicleStatus) as string[])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" value={vin} onChange={(e) => setVin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={String(status)}
                onValueChange={(v) => setStatus(v as VehicleStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}