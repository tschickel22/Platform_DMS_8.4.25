import { useState, useEffect } from 'react'

// Mock data for development
const mockVehicles = [
  {
    id: '1',
    type: 'RV',
    subType: 'Class A Motorhome',
    make: 'Winnebago',
    model: 'Adventurer',
    year: 2023,
    vin: '1FDEE3FL2KDA12345',
    price: 125000,
    status: 'Available',
    mileage: 1250,
    location: 'Lot A-1',
    features: ['Generator', 'Solar Panels', 'Slide-outs'],
    description: 'Luxury Class A motorhome with all amenities',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2', 
    type: 'Manufactured Home',
    subType: 'Double Wide',
    make: 'Clayton',
    model: 'The Steal II',
    year: 2023,
    vin: '2FDEE3FL2KDA67890',
    price: 85000,
    status: 'Available',
    location: 'Lot B-5',
    features: ['Central Air', 'Fireplace', 'Master Suite'],
    description: 'Beautiful double wide manufactured home',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'RV',
    subType: 'Travel Trailer',
    make: 'Airstream',
    model: 'Flying Cloud',
    year: 2022,
    vin: '3FDEE3FL2KDA11111',
    price: 95000,
    status: 'Sold',
    location: 'Lot C-3',
    features: ['Aluminum Construction', 'Premium Interior'],
    description: 'Classic Airstream travel trailer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Simulate loading
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const addVehicle = async (vehicleData) => {
    try {
      setLoading(true)
      const newVehicle = {
        ...vehicleData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setVehicles(prev => [...prev, newVehicle])
      setLoading(false)
      return newVehicle
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  const updateVehicle = async (id, vehicleData) => {
    try {
      setLoading(true)
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, ...vehicleData, updatedAt: new Date().toISOString() }
          : vehicle
      ))
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  const deleteVehicle = async (id) => {
    try {
      setLoading(true)
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  const updateVehicleStatus = async (id, status) => {
    try {
      setLoading(true)
      setVehicles(prev => prev.map(vehicle =>
        vehicle.id === id
          ? { ...vehicle, status, updatedAt: new Date().toISOString() }
          : vehicle
      ))
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleStatus
  }
}