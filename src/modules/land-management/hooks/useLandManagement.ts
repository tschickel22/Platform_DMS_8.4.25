import { useState, useEffect, useCallback } from 'react'
import { Land, LandStatus } from '@/types'

// Mock data for development
const mockLandData: Land[] = [
  {
    id: '1',
    address: {
      street: '123 Oak Ridge Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    zoning: 'Residential',
    status: LandStatus.AVAILABLE,
    size: 2.5,
    sizeUnit: 'acres',
    price: 125000,
    cost: 95000,
    description: 'Beautiful wooded lot with mature oak trees',
    notes: 'Perfect for custom home construction',
    images: [
      'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    ],
    utilities: {
      water: true,
      sewer: true,
      electric: true,
      gas: false,
      internet: true
    },
    features: ['Wooded', 'Level', 'Corner Lot'],
    restrictions: ['No mobile homes', 'Minimum 2000 sq ft home'],
    taxInfo: {
      annualTaxes: 2400,
      assessedValue: 110000,
      lastAssessment: '2024-01-01'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    address: {
      street: '456 Pine Valley Road',
      city: 'Cedar Park',
      state: 'TX',
      zipCode: '78613',
      country: 'USA',
      coordinates: { lat: 30.5052, lng: -97.8203 }
    },
    zoning: 'Commercial',
    status: LandStatus.UNDER_CONTRACT,
    size: 1.2,
    sizeUnit: 'acres',
    price: 350000,
    cost: 280000,
    description: 'Prime commercial lot on busy street',
    notes: 'High traffic area, great for retail',
    images: [
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg'
    ],
    utilities: {
      water: true,
      sewer: true,
      electric: true,
      gas: true,
      internet: true
    },
    features: ['High Traffic', 'Corner Lot', 'Signage Rights'],
    restrictions: ['Commercial use only'],
    taxInfo: {
      annualTaxes: 8500,
      assessedValue: 320000,
      lastAssessment: '2024-01-01'
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    createdBy: 'admin',
    updatedBy: 'john.doe'
  },
  {
    id: '3',
    address: {
      street: '789 Hill Country Lane',
      city: 'Dripping Springs',
      state: 'TX',
      zipCode: '78620',
      country: 'USA',
      coordinates: { lat: 30.1896, lng: -98.0877 }
    },
    zoning: 'Agricultural',
    status: LandStatus.AVAILABLE,
    size: 10,
    sizeUnit: 'acres',
    price: 450000,
    cost: 380000,
    description: 'Rolling hills with creek frontage',
    notes: 'Perfect for ranch or agricultural use',
    images: [
      'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg',
      'https://images.pexels.com/photos/1172675/pexels-photo-1172675.jpeg'
    ],
    utilities: {
      water: false,
      sewer: false,
      electric: true,
      gas: false,
      internet: false
    },
    features: ['Creek Frontage', 'Rolling Hills', 'Mature Trees'],
    restrictions: ['Agricultural use', 'No subdivision'],
    taxInfo: {
      annualTaxes: 3200,
      assessedValue: 400000,
      lastAssessment: '2024-01-01'
    },
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
]

const STORAGE_KEY = 'renter-insight-land-data'

export function useLandManagement() {
  const [lands, setLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setLands(JSON.parse(stored))
      } else {
        // Initialize with mock data
        setLands(mockLandData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLandData))
      }
    } catch (err) {
      console.error('Error loading land data:', err)
      setError('Failed to load land data')
      setLands(mockLandData)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save data to localStorage whenever lands change
  const saveToStorage = useCallback((newLands: Land[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLands))
    } catch (err) {
      console.error('Error saving land data:', err)
      setError('Failed to save land data')
    }
  }, [])

  // Get all land records
  const getLandRecords = useCallback(() => {
    return lands
  }, [lands])

  // Get land by ID
  const getLandById = useCallback((id: string) => {
    return lands.find(land => land.id === id)
  }, [lands])

  // Create new land record
  const createLand = useCallback((landData: Omit<Land, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    try {
      const newLand: Land = {
        ...landData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user', // In real app, get from auth context
        updatedBy: 'current-user'
      }

      const newLands = [...lands, newLand]
      setLands(newLands)
      saveToStorage(newLands)
      setError(null)
      return newLand
    } catch (err) {
      console.error('Error creating land:', err)
      setError('Failed to create land record')
      throw err
    }
  }, [lands, saveToStorage])

  // Update existing land record
  const updateLand = useCallback((id: string, updates: Partial<Omit<Land, 'id' | 'createdAt' | 'createdBy'>>) => {
    try {
      const newLands = lands.map(land => 
        land.id === id 
          ? { 
              ...land, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              updatedBy: 'current-user' // In real app, get from auth context
            }
          : land
      )

      setLands(newLands)
      saveToStorage(newLands)
      setError(null)
      return newLands.find(land => land.id === id)
    } catch (err) {
      console.error('Error updating land:', err)
      setError('Failed to update land record')
      throw err
    }
  }, [lands, saveToStorage])

  // Delete land record
  const deleteLand = useCallback((id: string) => {
    try {
      const newLands = lands.filter(land => land.id !== id)
      setLands(newLands)
      saveToStorage(newLands)
      setError(null)
      return true
    } catch (err) {
      console.error('Error deleting land:', err)
      setError('Failed to delete land record')
      throw err
    }
  }, [lands, saveToStorage])

  // Search and filter lands
  const searchLands = useCallback((query: string, filters?: {
    status?: LandStatus
    zoning?: string
    minPrice?: number
    maxPrice?: number
    minSize?: number
    maxSize?: number
  }) => {
    let filtered = lands

    // Text search
    if (query) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(land => 
        land.address.street.toLowerCase().includes(searchLower) ||
        land.address.city.toLowerCase().includes(searchLower) ||
        land.description?.toLowerCase().includes(searchLower) ||
        land.zoning.toLowerCase().includes(searchLower)
      )
    }

    // Apply filters
    if (filters) {
      if (filters.status) {
        filtered = filtered.filter(land => land.status === filters.status)
      }
      if (filters.zoning) {
        filtered = filtered.filter(land => land.zoning === filters.zoning)
      }
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(land => land.price >= filters.minPrice!)
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(land => land.price <= filters.maxPrice!)
      }
      if (filters.minSize !== undefined) {
        filtered = filtered.filter(land => land.size >= filters.minSize!)
      }
      if (filters.maxSize !== undefined) {
        filtered = filtered.filter(land => land.size <= filters.maxSize!)
      }
    }

    return filtered
  }, [lands])

  // Get available lands for quotes
  const getAvailableLands = useCallback(() => {
    return lands.filter(land => land.status === LandStatus.AVAILABLE)
  }, [lands])

  // Calculate price per unit
  const getPricePerUnit = useCallback((land: Land) => {
    return land.price / land.size
  }, [])

  // Get unique zoning types
  const getZoningTypes = useCallback(() => {
    const zones = new Set(lands.map(land => land.zoning))
    return Array.from(zones).sort()
  }, [lands])

  return {
    // Data
    lands,
    loading,
    error,

    // CRUD operations
    getLandRecords,
    getLandById,
    createLand,
    updateLand,
    deleteLand,

    // Search and filter
    searchLands,
    getAvailableLands,

    // Utilities
    getPricePerUnit,
    getZoningTypes
  }
}