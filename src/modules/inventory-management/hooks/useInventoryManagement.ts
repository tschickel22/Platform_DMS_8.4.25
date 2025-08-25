import { useState, useEffect } from 'react'
import { mockInventory } from '@/mocks/inventoryMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export interface Vehicle {
  id: string
  inventoryId: string
  listingType: 'rv' | 'manufactured_home'
  year?: number
  make?: string
  model?: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used'
  salePrice?: number
  rentPrice?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'available' | 'reserved' | 'sold' | 'service' | 'delivered'
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
  }
  description?: string
  searchResultsText?: string
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
    communityName?: string
  }
  features?: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load vehicles from localStorage or use mock data
  useEffect(() => {
    try {
      setLoading(true)
      const savedVehicles = loadFromLocalStorage<Vehicle[]>('renter-insight-inventory', [])
      
      if (savedVehicles.length === 0) {
        // Use mock data if no saved data
        setVehicles(mockInventory.sampleVehicles || [])
        saveToLocalStorage('renter-insight-inventory', mockInventory.sampleVehicles || [])
      } else {
        setVehicles(savedVehicles)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error loading inventory:', err)
      setError('Failed to load inventory data')
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    if (!loading && vehicles.length > 0) {
      saveToLocalStorage('renter-insight-inventory', vehicles)
    }
  }, [vehicles, loading])

  const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      inventoryId: `INV-${Date.now()}`,
      listingType: vehicleData.listingType || 'rv',
      condition: vehicleData.condition || 'new',
      offerType: vehicleData.offerType || 'for_sale',
      status: vehicleData.status || 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vehicleData
    }

    setVehicles(prev => [newVehicle, ...prev])
    return newVehicle
  }

  const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> => {
    const updatedVehicle = vehicles.find(v => v.id === id)
    if (!updatedVehicle) return null

    const updated = {
      ...updatedVehicle,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    setVehicles(prev => prev.map(v => v.id === id ? updated : v))
    return updated
  }

  const deleteVehicle = async (id: string): Promise<void> => {
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  const getVehiclesByType = (type: 'rv' | 'manufactured_home') => {
    return vehicles.filter(v => v.listingType === type)
  }

  const getVehiclesByStatus = (status: string) => {
    return vehicles.filter(v => v.status === status)
  }

  return {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesByType,
    getVehiclesByStatus
  }
}