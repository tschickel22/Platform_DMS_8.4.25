import { useState, useEffect, useCallback } from 'react'
import { Vehicle, RVVehicle, MHVehicle, InventoryStats } from '../state/types'
import { normalizeVehicleData } from '../utils/adapters'

// Mock data - in production this would come from an API
const mockInventoryData: Vehicle[] = [
  {
    id: '1',
    type: 'RV',
    status: 'Available',
    vehicleIdentificationNumber: '1FDXE45S8HDA12345',
    brand: 'Forest River',
    model: 'Cherokee',
    modelDate: 2023,
    mileage: 5000,
    bodyStyle: 'Travel Trailer',
    fuelType: 'None',
    vehicleTransmission: 'None',
    color: 'White',
    price: 45000,
    priceCurrency: 'USD',
    availability: 'Available',
    images: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
    description: 'Beautiful travel trailer perfect for family adventures',
    sellerName: 'RV World',
    sellerPhone: '555-0123',
    sellerEmail: 'sales@rvworld.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  } as RVVehicle,
  {
    id: '2',
    type: 'MH',
    status: 'Available',
    askingPrice: 85000,
    homeType: 'Single Wide',
    make: 'Clayton',
    model: 'The Edge',
    year: 2022,
    bedrooms: 3,
    bathrooms: 2,
    address1: '123 Mobile Home Park Dr',
    city: 'Austin',
    state: 'TX',
    zip9: '78701',
    serialNumber: 'CLT123456789',
    width1: 16,
    length1: 80,
    color: 'Beige',
    description: 'Modern manufactured home in excellent condition',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  } as MHVehicle
]

export const useInventoryManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // In production, this would be an API call
        const normalizedData = normalizeVehicleData(mockInventoryData)
        setVehicles(normalizedData)
        setError(null)
      } catch (err) {
        setError('Failed to load inventory data')
        console.error('Error loading inventory:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Add vehicle
  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setVehicles(prev => [...prev, newVehicle])
      return newVehicle
    } catch (err) {
      setError('Failed to add vehicle')
      throw err
    }
  }, [])

  // Update vehicle
  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    try {
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
          : vehicle
      ))
    } catch (err) {
      setError('Failed to update vehicle')
      throw err
    }
  }, [])

  // Delete vehicle
  const deleteVehicle = useCallback(async (id: string) => {
    try {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
    } catch (err) {
      setError('Failed to delete vehicle')
      throw err
    }
  }, [])

  // Bulk import vehicles
  const importVehicles = useCallback(async (newVehicles: Vehicle[]) => {
    try {
      const vehiclesWithIds = newVehicles.map(vehicle => ({
        ...vehicle,
        id: vehicle.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: vehicle.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      setVehicles(prev => [...prev, ...vehiclesWithIds])
      return vehiclesWithIds
    } catch (err) {
      setError('Failed to import vehicles')
      throw err
    }
  }, [])

  // Calculate stats
  const getStats = useCallback((): InventoryStats => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'Available').length
    const reserved = vehicles.filter(v => v.status === 'Reserved').length
    const sold = vehicles.filter(v => v.status === 'Sold').length
    
    const totalValue = vehicles.reduce((sum, vehicle) => {
      if (vehicle.type === 'RV') {
        return sum + (vehicle.price || 0)
      } else if (vehicle.type === 'MH') {
        return sum + (vehicle.askingPrice || 0)
      }
      return sum
    }, 0)

    return {
      total,
      available,
      reserved,
      sold,
      totalValue
    }
  }, [vehicles])

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    importVehicles,
    getStats,
    refreshData: () => {
      // Trigger data reload if needed
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}