import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { mockInventory } from '@/mocks/inventoryMock'

export interface InventoryVehicle {
  id: string
  listingType: 'rv' | 'manufactured_home'
  inventoryId: string
  year: number
  make: string
  model: string
  condition: 'new' | 'used' | 'certified'
  status: 'available' | 'reserved' | 'sold' | 'service' | 'delivered'
  salePrice?: number
  rentPrice?: number
  cost?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  
  // RV specific
  vin?: string
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  // Manufactured Home specific
  serialNumber?: string
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    sqft?: number
  }
  
  location?: {
    city: string
    state: string
    postalCode?: string
    address?: string
    communityName?: string
    lotNumber?: string
  }
  
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  
  description?: string
  searchResultsText?: string
  features?: any
  
  createdAt: string
  updatedAt: string
}

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<InventoryVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load vehicles from localStorage on mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedVehicles = loadFromLocalStorage<InventoryVehicle[]>('renter-insight-inventory', [])
      
      // If no saved vehicles, use mock data
      if (savedVehicles.length === 0) {
        const mockVehicles = mockInventory.sampleVehicles.map(vehicle => ({
          ...vehicle,
          createdAt: vehicle.createdAt || new Date().toISOString(),
          updatedAt: vehicle.updatedAt || new Date().toISOString()
        }))
        setVehicles(mockVehicles)
        saveToLocalStorage('renter-insight-inventory', mockVehicles)
      } else {
        setVehicles(savedVehicles)
      }
      
      setError(null)
    } catch (err) {
      console.error('Failed to load inventory:', err)
      setError('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Save vehicles to localStorage whenever vehicles change
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage('renter-insight-inventory', vehicles)
    }
  }, [vehicles, loading])

  const addVehicle = async (vehicleData: Partial<InventoryVehicle>): Promise<InventoryVehicle> => {
    const newVehicle: InventoryVehicle = {
      id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      listingType: vehicleData.listingType || 'rv',
      inventoryId: vehicleData.inventoryId || `INV-${Date.now()}`,
      year: vehicleData.year || new Date().getFullYear(),
      make: vehicleData.make || '',
      model: vehicleData.model || '',
      condition: vehicleData.condition || 'new',
      status: vehicleData.status || 'available',
      offerType: vehicleData.offerType || 'for_sale',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vehicleData
    }

    setVehicles(prev => [newVehicle, ...prev])
    return newVehicle
  }

  const updateVehicle = async (id: string, updates: Partial<InventoryVehicle>): Promise<InventoryVehicle | null> => {
    const updatedVehicle = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id 
        ? { ...vehicle, ...updatedVehicle }
        : vehicle
    ))

    const vehicle = vehicles.find(v => v.id === id)
    return vehicle ? { ...vehicle, ...updatedVehicle } : null
  }

  const deleteVehicle = async (id: string): Promise<void> => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
  }

  const getVehiclesByType = (type: 'rv' | 'manufactured_home') => {
    return vehicles.filter(vehicle => vehicle.listingType === type)
  }

  const getVehiclesByStatus = (status: string) => {
    return vehicles.filter(vehicle => vehicle.status === status)
  }

  const searchVehicles = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return vehicles.filter(vehicle =>
      vehicle.make.toLowerCase().includes(lowercaseQuery) ||
      vehicle.model.toLowerCase().includes(lowercaseQuery) ||
      vehicle.inventoryId.toLowerCase().includes(lowercaseQuery) ||
      vehicle.description?.toLowerCase().includes(lowercaseQuery)
    )
  }

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesByType,
    getVehiclesByStatus,
    searchVehicles
  }
}