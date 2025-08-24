import { useState, useEffect } from 'react'
import { Vehicle, VehicleStatus } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { mockInventory } from '@/mocks/inventoryMock'

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load vehicles from localStorage on mount
  useEffect(() => {
    try {
      const savedVehicles = loadFromLocalStorage<Vehicle[]>('renter-insight-vehicles', [])
      
      // If no saved vehicles, use mock data
      if (savedVehicles.length === 0) {
        const mockVehicles = mockInventory.sampleVehicles.map((vehicle: any) => ({
          id: vehicle.id,
          vin: vehicle.vin || vehicle.serialNumber || '',
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.listingType === 'rv' ? 'rv' : 'manufactured_home',
          status: vehicle.status || 'available',
          price: vehicle.salePrice || vehicle.rentPrice || 0,
          cost: vehicle.cost || 0,
          location: vehicle.location?.city || '',
          features: vehicle.features ? Object.keys(vehicle.features).filter(key => vehicle.features[key]) : [],
          images: vehicle.media?.photos || [],
          customFields: {},
          createdAt: new Date(vehicle.createdAt || Date.now()),
          updatedAt: new Date(vehicle.updatedAt || Date.now())
        }))
        
        setVehicles(mockVehicles)
        saveToLocalStorage('renter-insight-vehicles', mockVehicles)
      } else {
        setVehicles(savedVehicles)
      }
    } catch (err) {
      console.error('Error loading vehicles:', err)
      setError('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }, [])

  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    if (vehicles.length > 0) {
      saveToLocalStorage('renter-insight-vehicles', vehicles)
    }
  }, [vehicles])

  const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vin: vehicleData.vin || '',
      make: vehicleData.make || '',
      model: vehicleData.model || '',
      year: vehicleData.year || new Date().getFullYear(),
      type: vehicleData.type || 'manufactured_home',
      status: vehicleData.status || 'available',
      price: vehicleData.price || 0,
      cost: vehicleData.cost || 0,
      location: vehicleData.location || '',
      features: vehicleData.features || [],
      images: vehicleData.images || [],
      customFields: vehicleData.customFields || {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setVehicles(prev => [newVehicle, ...prev])
    return newVehicle
  }

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle | null> => {
    const existingVehicle = vehicles.find(v => v.id === vehicleId)
    if (!existingVehicle) return null

    const updatedVehicle = {
      ...existingVehicle,
      ...updates,
      updatedAt: new Date()
    }

    setVehicles(prev => prev.map(v => v.id === vehicleId ? updatedVehicle : v))
    return updatedVehicle
  }

  const updateVehicleStatus = async (vehicleId: string, status: VehicleStatus): Promise<void> => {
    await updateVehicle(vehicleId, { status })
  }

  const deleteVehicle = async (vehicleId: string): Promise<void> => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId))
  }

  const getVehicleById = (vehicleId: string): Vehicle | null => {
    return vehicles.find(v => v.id === vehicleId) || null
  }

  const getVehiclesByStatus = (status: VehicleStatus): Vehicle[] => {
    return vehicles.filter(v => v.status === status)
  }

  const getVehiclesByType = (type: string): Vehicle[] => {
    return vehicles.filter(v => v.type === type)
  }

  return {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    deleteVehicle,
    getVehicleById,
    getVehiclesByStatus,
    getVehiclesByType
  }
}