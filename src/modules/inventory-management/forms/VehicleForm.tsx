import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Car, Home } from 'lucide-react'
import { VehicleInventory, RVInventory, ManufacturedHomeInventory } from '../types'
import MHInventoryForm from './MHInventoryForm'
import RVInventoryForm from './RVInventoryForm'

interface VehicleFormProps {
  initialData?: Partial<VehicleInventory>
  onSave: (data: VehicleInventory) => Promise<void>
  onCancel: () => void
  mode: 'create' | 'edit'
}

export default function VehicleForm({ initialData, onSave, onCancel, mode }: VehicleFormProps) {
  const [vehicleType, setVehicleType] = useState<'rv' | 'manufactured_home' | null>(
    initialData?.listingType || null
  )

  // If we have initial data, render the appropriate form directly
  if (initialData && initialData.listingType) {
    if (initialData.listingType === 'rv') {
      return (
        <RVInventoryForm
          initialData={initialData as Partial<RVInventory>}
          onSave={onSave}
          onCancel={onCancel}
          mode={mode}
        />
      )
    } else if (initialData.listingType === 'manufactured_home') {
      return (
        <MHInventoryForm
          initialData={initialData as Partial<ManufacturedHomeInventory>}
          onSave={onSave}
          onCancel={onCancel}
          mode={mode}
        />
      )
    }
  }

  // For create mode, show type selection first
  if (!vehicleType) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Inventory Item</h1>
              <p className="text-muted-foreground">
                Choose the type of inventory item you want to add
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => setVehicleType('rv')}
            >
              <CardHeader className="text-center">
                <Car className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>RV / Recreational Vehicle</CardTitle>
                <CardDescription>
                  Travel trailers, motorhomes, fifth wheels, toy haulers, and other recreational vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Travel Trailers & Fifth Wheels</p>
                  <p>• Class A, B, C Motorhomes</p>
                  <p>• Toy Haulers & Pop-ups</p>
                  <p>• Truck Campers</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => setVehicleType('manufactured_home')}
            >
              <CardHeader className="text-center">
                <Home className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>Manufactured Home</CardTitle>
                <CardDescription>
                  Single-wide, double-wide, triple-wide, and modular homes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Single-wide Homes</p>
                  <p>• Double-wide Homes</p>
                  <p>• Triple-wide Homes</p>
                  <p>• Park Models & Modular</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Render the appropriate form based on selected type
  if (vehicleType === 'rv') {
    return (
      <RVInventoryForm
        initialData={{ listingType: 'rv', ...initialData } as Partial<RVInventory>}
        onSave={onSave}
        onCancel={onCancel}
        mode={mode}
      />
    )
  } else if (vehicleType === 'manufactured_home') {
    return (
      <MHInventoryForm
        initialData={{ listingType: 'manufactured_home', ...initialData } as Partial<ManufacturedHomeInventory>}
        onSave={onSave}
        onCancel={onCancel}
        mode={mode}
      />
    )
  }

  return null
}