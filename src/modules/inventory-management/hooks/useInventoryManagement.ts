import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export interface Vehicle {
  id: string
  listingType: 'rv' | 'manufactured_home'
  inventoryId: string
  year: number
  make: string
  model: string
  condition: 'new' | 'used' | 'refurbished'
  status: 'available' | 'pending' | 'sold' | 'service'
  offerType: 'for_sale' | 'for_rent' | 'both'
  salePrice?: number
  rentPrice?: number
  
  // RV specific
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  // MH specific
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
    squareFeet?: number
  }
  serialNumber?: string
  roofType?: string
  sidingType?: string
  foundationType?: string
  heatingType?: string
  coolingType?: string
  
  // Common
  description?: string
  searchResultsText?: string
  location?: {
    city?: string
    state?: string
    postalCode?: string
    communityName?: string
  }
  features?: any
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  keyFeatures?: string[]
  createdAt: string
  updatedAt: string
}

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const { toast } = useToast()

  // Load vehicles from localStorage on mount
  useEffect(() => {
    try {
      const savedVehicles = loadFromLocalStorage<Vehicle[]>('inventory-vehicles', [])
      setVehicles(savedVehicles)
    } catch (err) {
      setError('Failed to load inventory data')
      console.error('Error loading vehicles:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save vehicles to localStorage whenever vehicles change
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage('inventory-vehicles', vehicles)
    }
  }, [vehicles, loading])

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setVehicles(prev => [newVehicle, ...prev])
      
      toast({
        title: 'Success',
        description: `${vehicleData.listingType === 'rv' ? 'RV' : 'Manufactured Home'} added successfully`
      })

      return newVehicle
    } catch (err) {
      const errorMessage = 'Failed to add vehicle'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
          : vehicle
      ))

      toast({
        title: 'Success',
        description: 'Vehicle updated successfully'
      })
    } catch (err) {
      const errorMessage = 'Failed to update vehicle'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
      
      toast({
        title: 'Success',
        description: 'Vehicle deleted successfully'
      })
    } catch (err) {
      const errorMessage = 'Failed to delete vehicle'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const getVehiclesByType = (type: 'rv' | 'manufactured_home') => {
    return vehicles.filter(vehicle => vehicle.listingType === type)
  }

  const getVehiclesByStatus = (status: string) => {
    return vehicles.filter(vehicle => vehicle.status === status)
  }

  const searchVehicles = (term: string) => {
    if (!term) return vehicles
    
    const searchLower = term.toLowerCase()
    return vehicles.filter(vehicle => 
      vehicle.make?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.inventoryId?.toLowerCase().includes(searchLower) ||
      vehicle.year?.toString().includes(term)
    )
  }

  const getInventoryStats = () => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'available').length
    const pending = vehicles.filter(v => v.status === 'pending').length
    const sold = vehicles.filter(v => v.status === 'sold').length
    const rvCount = vehicles.filter(v => v.listingType === 'rv').length
    const mhCount = vehicles.filter(v => v.listingType === 'manufactured_home').length

    return {
      total,
      available,
      pending,
      sold,
      rvCount,
      mhCount
    }
  }

  return {
    vehicles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesByType,
    getVehiclesByStatus,
    searchVehicles,
    getInventoryStats
  }
}