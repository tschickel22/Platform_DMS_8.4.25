import { useState, useEffect } from 'react'
import { mockInventory } from '@/mocks/inventoryMock'
import { useToast } from '@/hooks/use-toast'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface Vehicle {
  id: string
  listingType: 'rv' | 'manufactured_home'
  inventoryId: string
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used'
  salePrice?: number
  rentPrice?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'available' | 'pending' | 'sold' | 'service'
  bedrooms?: number
  bathrooms?: number
  sleeps?: number
  slides?: number
  length?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    sqft?: number
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
  const { toast } = useToast()

  // Load vehicles from localStorage or use mock data
  useEffect(() => {
    try {
      setLoading(true)
      const savedVehicles = loadFromLocalStorage<Vehicle[]>('renter-insight-inventory', [])
      
      if (savedVehicles.length > 0) {
        setVehicles(savedVehicles)
      } else {
        // Use mock data as fallback
        setVehicles(mockInventory.sampleVehicles)
        saveToLocalStorage('renter-insight-inventory', mockInventory.sampleVehicles)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error loading inventory:', err)
      setError('Failed to load inventory')
      // Fallback to mock data
      setVehicles(mockInventory.sampleVehicles)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    if (vehicles.length > 0) {
      saveToLocalStorage('renter-insight-inventory', vehicles)
    }
  }, [vehicles])

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      inventoryId: vehicleData.inventoryId || `INV-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setVehicles(prev => [newVehicle, ...prev])
    
    toast({
      title: 'Vehicle Added',
      description: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} has been added to inventory.`
    })

    return newVehicle
  }

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle | null> => {
    const existingVehicle = vehicles.find(v => v.id === vehicleId)
    if (!existingVehicle) {
      toast({
        title: 'Error',
        description: 'Vehicle not found.',
        variant: 'destructive'
      })
      return null
    }

    const updatedVehicle = {
      ...existingVehicle,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    setVehicles(prev => prev.map(v => v.id === vehicleId ? updatedVehicle : v))

    toast({
      title: 'Vehicle Updated',
      description: `${updatedVehicle.year} ${updatedVehicle.make} ${updatedVehicle.model} has been updated.`
    })

    return updatedVehicle
  }

  const deleteVehicle = async (vehicleId: string): Promise<void> => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return

    setVehicles(prev => prev.filter(v => v.id !== vehicleId))

    toast({
      title: 'Vehicle Deleted',
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been removed from inventory.`
    })
  }

  const getVehicleById = (vehicleId: string): Vehicle | null => {
    return vehicles.find(v => v.id === vehicleId) || null
  }

  const getVehiclesByType = (type: 'rv' | 'manufactured_home'): Vehicle[] => {
    return vehicles.filter(v => v.listingType === type)
  }

  const getVehiclesByStatus = (status: string): Vehicle[] => {
    return vehicles.filter(v => v.status === status)
  }

  const searchVehicles = (query: string): Vehicle[] => {
    const lowercaseQuery = query.toLowerCase()
    return vehicles.filter(v => 
      v.make.toLowerCase().includes(lowercaseQuery) ||
      v.model.toLowerCase().includes(lowercaseQuery) ||
      v.inventoryId.toLowerCase().includes(lowercaseQuery) ||
      (v.vin && v.vin.toLowerCase().includes(lowercaseQuery)) ||
      (v.description && v.description.toLowerCase().includes(lowercaseQuery))
    )
  }

  const getInventoryStats = () => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'available').length
    const pending = vehicles.filter(v => v.status === 'pending').length
    const sold = vehicles.filter(v => v.status === 'sold').length
    const totalValue = vehicles.reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)
    const avgPrice = total > 0 ? totalValue / total : 0

    return {
      total,
      available,
      pending,
      sold,
      totalValue,
      avgPrice,
      rvCount: vehicles.filter(v => v.listingType === 'rv').length,
      mhCount: vehicles.filter(v => v.listingType === 'manufactured_home').length
    }
  }

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    getVehiclesByType,
    getVehiclesByStatus,
    searchVehicles,
    getInventoryStats
  }
}