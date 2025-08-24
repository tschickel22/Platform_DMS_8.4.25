import { useState, useEffect, useMemo } from 'react'
import { Vehicle, VehicleType, VehicleStatus } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { mockInventory } from '@/mocks/inventoryMock'

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load vehicles from localStorage on mount
  useEffect(() => {
    const loadVehicles = () => {
      try {
        setLoading(true)
        const savedVehicles = loadFromLocalStorage<Vehicle[]>('renter-insight-vehicles', [])
        
        // If no saved vehicles, use mock data
        if (savedVehicles.length === 0) {
          const mockVehicles = mockInventory.sampleVehicles.map(vehicle => ({
            id: vehicle.id,
            vin: vehicle.vin || `VIN${vehicle.id}`,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.listingType === 'rv' ? VehicleType.RV : VehicleType.SINGLE_WIDE,
            status: VehicleStatus.AVAILABLE,
            price: vehicle.salePrice || 0,
            cost: vehicle.salePrice ? vehicle.salePrice * 0.8 : 0,
            location: `${vehicle.location.city}, ${vehicle.location.state}`,
            features: Object.keys(vehicle.features || {}).filter(key => vehicle.features[key]),
            images: vehicle.media?.photos || [],
            customFields: {
              listingType: vehicle.listingType,
              condition: vehicle.condition,
              rentPrice: vehicle.rentPrice,
              offerType: vehicle.offerType,
              sleeps: vehicle.sleeps,
              slides: vehicle.slides,
              length: vehicle.length,
              bedrooms: vehicle.bedrooms,
              bathrooms: vehicle.bathrooms,
              dimensions: vehicle.dimensions,
              description: vehicle.description,
              searchResultsText: vehicle.searchResultsText
            },
            createdAt: new Date(vehicle.createdAt),
            updatedAt: new Date(vehicle.updatedAt)
          }))
          
          setVehicles(mockVehicles)
          saveToLocalStorage('renter-insight-vehicles', mockVehicles)
        } else {
          setVehicles(savedVehicles)
        }
        
        setError(null)
      } catch (err) {
        console.error('Error loading vehicles:', err)
        setError('Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    if (!loading && vehicles.length > 0) {
      saveToLocalStorage('renter-insight-vehicles', vehicles)
    }
  }, [vehicles, loading])

  // Create a new vehicle
  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> => {
    try {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setVehicles(prev => [newVehicle, ...prev])
      return newVehicle
    } catch (err) {
      console.error('Error creating vehicle:', err)
      throw new Error('Failed to create vehicle')
    }
  }

  // Update an existing vehicle
  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    try {
      const updatedVehicle = {
        ...updates,
        id: vehicleId,
        updatedAt: new Date()
      } as Vehicle

      setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, ...updatedVehicle } : v))
      
      const vehicle = vehicles.find(v => v.id === vehicleId)
      if (!vehicle) throw new Error('Vehicle not found')
      
      return { ...vehicle, ...updatedVehicle }
    } catch (err) {
      console.error('Error updating vehicle:', err)
      throw new Error('Failed to update vehicle')
    }
  }

  // Delete a vehicle
  const deleteVehicle = async (vehicleId: string): Promise<void> => {
    try {
      setVehicles(prev => prev.filter(v => v.id !== vehicleId))
    } catch (err) {
      console.error('Error deleting vehicle:', err)
      throw new Error('Failed to delete vehicle')
    }
  }

  // Get vehicle by ID
  const getVehicle = (vehicleId: string): Vehicle | undefined => {
    return vehicles.find(v => v.id === vehicleId)
  }

  // Filter vehicles by type
  const getVehiclesByType = (type: VehicleType): Vehicle[] => {
    return vehicles.filter(v => v.type === type)
  }

  // Filter vehicles by status
  const getVehiclesByStatus = (status: VehicleStatus): Vehicle[] => {
    return vehicles.filter(v => v.status === status)
  }

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalVehicles = vehicles.length
    const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length
    const soldVehicles = vehicles.filter(v => v.status === VehicleStatus.SOLD).length
    const reservedVehicles = vehicles.filter(v => v.status === VehicleStatus.RESERVED).length
    
    const totalValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0)
    const averagePrice = totalVehicles > 0 ? totalValue / totalVehicles : 0
    
    const vehiclesByType = vehicles.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1
      return acc
    }, {} as Record<VehicleType, number>)

    return {
      totalVehicles,
      availableVehicles,
      soldVehicles,
      reservedVehicles,
      totalValue,
      averagePrice,
      vehiclesByType
    }
  }, [vehicles])

  return {
    vehicles,
    loading,
    error,
    metrics,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    getVehiclesByType,
    getVehiclesByStatus
  }
}