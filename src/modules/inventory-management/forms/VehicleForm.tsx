import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Truck } from 'lucide-react'
import { Vehicle } from '@/types'
import { MHInventoryForm } from './MHInventoryForm'
import { RVInventoryForm } from './RVInventoryForm'

interface VehicleFormProps {
  vehicle?: Vehicle
  onSave: (vehicleData: Partial<Vehicle>) => void
  onCancel: () => void
}

export function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  const [selectedType, setSelectedType] = useState<'manufactured_home' | 'rv' | null>(
    vehicle ? (isManufacturedHome(vehicle) ? 'manufactured_home' : 'rv') : null
  )

  // Helper function to determine if vehicle is a manufactured home
  function isManufacturedHome(vehicle: Vehicle): boolean {
    const mhTypes = ['single_wide', 'double_wide', 'triple_wide', 'modular_home', 'park_model']
    return mhTypes.includes(vehicle.type.toLowerCase())
  }

  const handleTypeSelection = (type: 'manufactured_home' | 'rv') => {
    setSelectedType(type)
  }

  const handleFormSubmit = (formData: any) => {
    // Transform form data to Vehicle format
    const vehicleData: Partial<Vehicle> = {
      vin: formData.vin,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      type: selectedType === 'manufactured_home' ? 'single_wide' : 'rv', // Default types
      status: 'available',
      price: parseFloat(formData.salePrice) || 0,
      cost: parseFloat(formData.cost) || 0,
      location: formData.location || 'On Lot',
      features: formData.features || [],
      images: formData.images?.map((img: any) => img.url) || [],
      customFields: {
        ...formData,
        type: selectedType
      }
    }

    onSave(vehicleData)
  }

  // If editing existing vehicle, skip type selection
  if (vehicle) {
    const vehicleType = isManufacturedHome(vehicle) ? 'manufactured_home' : 'rv'
    
    return (
      <Dialog open={true} onOpenChange={() => onCancel()}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {vehicleType === 'manufactured_home' ? (
            <MHInventoryForm
              onSubmit={handleFormSubmit}
              onCancel={onCancel}
              initialData={vehicle.customFields || vehicle}
            />
          ) : (
            <RVInventoryForm
              onSubmit={handleFormSubmit}
              onCancel={onCancel}
              initialData={vehicle.customFields || vehicle}
            />
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        
        {!selectedType ? (
          <div className="space-y-6 p-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">What type of vehicle are you adding?</h2>
              <p className="text-muted-foreground">
                Select the type to show the appropriate form fields
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50"
                onClick={() => handleTypeSelection('manufactured_home')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <Home className="h-8 w-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Manufactured Home</CardTitle>
                  <CardDescription>
                    Single-wide, double-wide, triple-wide, modular homes, and park models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Bedrooms & bathrooms</p>
                    <p>• Square footage & dimensions</p>
                    <p>• Construction materials</p>
                    <p>• Home features & appliances</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50"
                onClick={() => handleTypeSelection('rv')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                    <Truck className="h-8 w-8 text-cyan-600" />
                  </div>
                  <CardTitle className="text-xl">RV / Recreational Vehicle</CardTitle>
                  <CardDescription>
                    Motorhomes, travel trailers, fifth wheels, and toy haulers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Sleeping capacity & slide-outs</p>
                    <p>• Length & vehicle specs</p>
                    <p>• Engine & transmission</p>
                    <p>• RV features & amenities</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {selectedType === 'manufactured_home' ? (
              <MHInventoryForm
                onSubmit={handleFormSubmit}
                onCancel={onCancel}
              />
            ) : (
              <RVInventoryForm
                onSubmit={handleFormSubmit}
                onCancel={onCancel}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}