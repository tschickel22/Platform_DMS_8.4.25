import { useState, useEffect, useMemo } from 'react'
import { Vehicle, InventoryFilter, InventoryStats, VehicleFormData } from '../types'
import { mockInventory } from '@/mocks/inventoryMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load vehicles from localStorage or use mock data
  useEffect(() => {
    setLoading(true)
    try {
      const savedVehicles = loadFromLocalStorage<Vehicle[]>('renter-insight-inventory', [])
      
      if (savedVehicles.length > 0) {
        setVehicles(savedVehicles)
      } else {
        // Use mock data as initial seed
        const mockVehicles = mockInventory.sampleVehicles as Vehicle[]
        setVehicles(mockVehicles)
        saveToLocalStorage('renter-insight-inventory', mockVehicles)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error loading inventory:', err)
      setError('Failed to load inventory data')
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

  // Calculate inventory statistics
  const stats: InventoryStats = useMemo(() => {
    const totalUnits = vehicles.length
    const availableUnits = vehicles.filter(v => v.status === 'available').length
    const reservedUnits = vehicles.filter(v => v.status === 'reserved').length
    const soldUnits = vehicles.filter(v => v.status === 'sold').length
    const serviceUnits = vehicles.filter(v => v.status === 'service').length
    
    const availableVehicles = vehicles.filter(v => v.status === 'available')
    const totalValue = availableVehicles.reduce((sum, v) => sum + (v.salePrice || v.rentPrice || 0), 0)
    const averagePrice = availableVehicles.length > 0 ? totalValue / availableVehicles.length : 0
    
    const rvCount = vehicles.filter(v => v.listingType === 'rv').length
    const mhCount = vehicles.filter(v => v.listingType === 'manufactured_home').length

    return {
      totalUnits,
      availableUnits,
      reservedUnits,
      soldUnits,
      serviceUnits,
      totalValue,
      averagePrice,
      rvCount,
      mhCount
    }
  }, [vehicles])

  // Filter vehicles based on criteria
  const filterVehicles = (filter: InventoryFilter): Vehicle[] => {
    return vehicles.filter(vehicle => {
      // Search term filter
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase()
        const matchesSearch = 
          vehicle.make.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.inventoryId.toLowerCase().includes(searchLower) ||
          (vehicle.vin && vehicle.vin.toLowerCase().includes(searchLower)) ||
          (vehicle.serialNumber && vehicle.serialNumber.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Status filter
      if (filter.status !== 'all' && vehicle.status !== filter.status) {
        return false
      }

      // Type filter
      if (filter.type !== 'all' && vehicle.listingType !== filter.type) {
        return false
      }

      // Price range filter
      if (filter.priceRange.min || filter.priceRange.max) {
        const price = vehicle.salePrice || vehicle.rentPrice || 0
        if (filter.priceRange.min && price < filter.priceRange.min) return false
        if (filter.priceRange.max && price > filter.priceRange.max) return false
      }

      // Location filter
      if (filter.location?.city && !vehicle.location.city.toLowerCase().includes(filter.location.city.toLowerCase())) {
        return false
      }
      if (filter.location?.state && vehicle.location.state !== filter.location.state) {
        return false
      }

      return true
    })
  }

  // Get vehicle by ID
  const getVehicle = (id: string): Vehicle | undefined => {
    return vehicles.find(v => v.id === id)
  }

  // Create new vehicle
  const createVehicle = async (vehicleData: VehicleFormData): Promise<Vehicle> => {
    setLoading(true)
    try {
      const newVehicle: Vehicle = {
        id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        inventoryId: `INV-${vehicleData.listingType.toUpperCase()}-${String(vehicles.length + 1).padStart(3, '0')}`,
        ...vehicleData,
        dimensions: vehicleData.listingType === 'manufactured_home' ? {
          squareFeet: vehicleData.squareFeet,
          sections: vehicleData.sections
        } : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setVehicles(prev => [newVehicle, ...prev])
      
      toast({
        title: 'Vehicle Added',
        description: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} has been added to inventory`
      })

      return newVehicle
    } finally {
      setLoading(false)
    }
  }

  // Update existing vehicle
  const updateVehicle = async (id: string, updates: Partial<VehicleFormData>): Promise<Vehicle | null> => {
    const existingVehicle = vehicles.find(v => v.id === id)
    if (!existingVehicle) {
      toast({
        title: 'Error',
        description: 'Vehicle not found',
        variant: 'destructive'
      })
      return null
    }

    const updatedVehicle: Vehicle = {
      ...existingVehicle,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v))

    toast({
      title: 'Vehicle Updated',
      description: `${updatedVehicle.year} ${updatedVehicle.make} ${updatedVehicle.model} has been updated`
    })

    return updatedVehicle
  }

  // Delete vehicle
  const deleteVehicle = async (id: string): Promise<void> => {
    const vehicle = vehicles.find(v => v.id === id)
    if (!vehicle) {
      toast({
        title: 'Error',
        description: 'Vehicle not found',
        variant: 'destructive'
      })
      return
    }

    setVehicles(prev => prev.filter(v => v.id !== id))

    toast({
      title: 'Vehicle Deleted',
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been removed from inventory`
    })
  }

  // Bulk operations
  const bulkUpdateStatus = async (vehicleIds: string[], status: Vehicle['status']): Promise<void> => {
    setVehicles(prev => prev.map(v => 
      vehicleIds.includes(v.id) 
        ? { ...v, status, updatedAt: new Date().toISOString() }
        : v
    ))

    toast({
      title: 'Bulk Update Complete',
      description: `Updated status for ${vehicleIds.length} vehicles`
    })
  }

  const bulkDelete = async (vehicleIds: string[]): Promise<void> => {
    setVehicles(prev => prev.filter(v => !vehicleIds.includes(v.id)))

    toast({
      title: 'Bulk Delete Complete',
      description: `Removed ${vehicleIds.length} vehicles from inventory`
    })
  }

  // Export functions
  const exportToCSV = (): string => {
    const headers = [
      'ID', 'Type', 'Year', 'Make', 'Model', 'VIN/Serial', 'Condition',
      'Status', 'Sale Price', 'Rent Price', 'Location', 'Created'
    ]

    const rows = vehicles.map(v => [
      v.id,
      v.listingType,
      v.year,
      v.make,
      v.model,
      v.vin || v.serialNumber || '',
      v.condition,
      v.status,
      v.salePrice || '',
      v.rentPrice || '',
      `${v.location.city}, ${v.location.state}`,
      new Date(v.createdAt).toLocaleDateString()
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  return {
    vehicles,
    loading,
    error,
    stats,
    filterVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    bulkUpdateStatus,
    bulkDelete,
    exportToCSV
  }
}