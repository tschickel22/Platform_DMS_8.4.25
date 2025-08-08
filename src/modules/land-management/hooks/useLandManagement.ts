import { useState, useEffect } from 'react'

export interface LandProperty {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  acreage: number
  zoning: string
  status: 'available' | 'occupied' | 'development' | 'sold'
  purchasePrice: number
  currentValue: number
  purchaseDate: string
  propertyType: 'residential' | 'commercial' | 'industrial' | 'agricultural'
  utilities: string[]
  description: string
  images: string[]
  coordinates?: {
    lat: number
    lng: number
  }
  createdAt: string
  updatedAt: string
}

export interface LandStats {
  totalProperties: number
  totalValue: number
  availableProperties: number
  occupiedProperties: number
  developmentProperties: number
  soldProperties: number
  totalAcreage: number
  averageValuePerAcre: number
}

export interface LandActivity {
  id: string
  type: 'purchase' | 'sale' | 'development' | 'status_change' | 'valuation'
  propertyId: string
  propertyName: string
  description: string
  date: string
  amount?: number
}

// Mock data
const mockLandProperties: LandProperty[] = [
  {
    id: '1',
    name: 'Sunset Ridge Development',
    address: '1234 Country Road',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    acreage: 25.5,
    zoning: 'Residential',
    status: 'development',
    purchasePrice: 850000,
    currentValue: 1200000,
    purchaseDate: '2023-03-15',
    propertyType: 'residential',
    utilities: ['Water', 'Electric', 'Sewer', 'Gas'],
    description: 'Prime residential development land with city utilities and excellent access to major highways.',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
    ],
    coordinates: { lat: 30.2672, lng: -97.7431 },
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Industrial Park East',
    address: '5678 Industrial Blvd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    acreage: 45.0,
    zoning: 'Industrial',
    status: 'available',
    purchasePrice: 1200000,
    currentValue: 1500000,
    purchaseDate: '2022-08-20',
    propertyType: 'industrial',
    utilities: ['Water', 'Electric', 'Sewer'],
    description: 'Large industrial tract perfect for manufacturing or distribution facilities.',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    coordinates: { lat: 29.7604, lng: -95.3698 },
    createdAt: '2022-08-20T09:00:00Z',
    updatedAt: '2024-01-10T11:15:00Z'
  },
  {
    id: '3',
    name: 'Downtown Commercial Lot',
    address: '910 Main Street',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    acreage: 2.3,
    zoning: 'Commercial',
    status: 'occupied',
    purchasePrice: 2500000,
    currentValue: 3200000,
    purchaseDate: '2021-12-10',
    propertyType: 'commercial',
    utilities: ['Water', 'Electric', 'Sewer', 'Gas', 'Fiber'],
    description: 'Prime downtown commercial lot with high foot traffic and excellent visibility.',
    images: [
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'
    ],
    coordinates: { lat: 32.7767, lng: -96.7970 },
    createdAt: '2021-12-10T15:30:00Z',
    updatedAt: '2024-01-05T16:45:00Z'
  }
]

const mockLandActivity: LandActivity[] = [
  {
    id: '1',
    type: 'valuation',
    propertyId: '1',
    propertyName: 'Sunset Ridge Development',
    description: 'Property revaluation completed - increased by $150,000',
    date: '2024-01-15T14:30:00Z',
    amount: 1200000
  },
  {
    id: '2',
    type: 'status_change',
    propertyId: '2',
    propertyName: 'Industrial Park East',
    description: 'Status changed from development to available',
    date: '2024-01-10T11:15:00Z'
  },
  {
    id: '3',
    type: 'purchase',
    propertyId: '3',
    propertyName: 'Downtown Commercial Lot',
    description: 'New commercial property acquired',
    date: '2021-12-10T15:30:00Z',
    amount: 2500000
  }
]

export function useLandManagement() {
  const [properties, setProperties] = useState<LandProperty[]>(mockLandProperties)
  const [activity, setActivity] = useState<LandActivity[]>(mockLandActivity)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate stats from properties
  const stats: LandStats = {
    totalProperties: properties.length,
    totalValue: properties.reduce((sum, prop) => sum + prop.currentValue, 0),
    availableProperties: properties.filter(p => p.status === 'available').length,
    occupiedProperties: properties.filter(p => p.status === 'occupied').length,
    developmentProperties: properties.filter(p => p.status === 'development').length,
    soldProperties: properties.filter(p => p.status === 'sold').length,
    totalAcreage: properties.reduce((sum, prop) => sum + prop.acreage, 0),
    averageValuePerAcre: properties.length > 0 
      ? properties.reduce((sum, prop) => sum + (prop.currentValue / prop.acreage), 0) / properties.length 
      : 0
  }

  const addProperty = async (propertyData: Omit<LandProperty, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    try {
      const newProperty: LandProperty = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setProperties(prev => [...prev, newProperty])
      
      // Add activity
      const newActivity: LandActivity = {
        id: Date.now().toString(),
        type: 'purchase',
        propertyId: newProperty.id,
        propertyName: newProperty.name,
        description: `New property "${newProperty.name}" added to portfolio`,
        date: new Date().toISOString(),
        amount: newProperty.purchasePrice
      }
      setActivity(prev => [newActivity, ...prev])
    } catch (err) {
      setError('Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  const updateProperty = async (id: string, updates: Partial<LandProperty>) => {
    setLoading(true)
    try {
      setProperties(prev => prev.map(prop => 
        prop.id === id 
          ? { ...prop, ...updates, updatedAt: new Date().toISOString() }
          : prop
      ))
      
      const property = properties.find(p => p.id === id)
      if (property) {
        const newActivity: LandActivity = {
          id: Date.now().toString(),
          type: 'status_change',
          propertyId: id,
          propertyName: property.name,
          description: `Property "${property.name}" updated`,
          date: new Date().toISOString()
        }
        setActivity(prev => [newActivity, ...prev])
      }
    } catch (err) {
      setError('Failed to update property')
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (id: string) => {
    setLoading(true)
    try {
      const property = properties.find(p => p.id === id)
      setProperties(prev => prev.filter(prop => prop.id !== id))
      
      if (property) {
        const newActivity: LandActivity = {
          id: Date.now().toString(),
          type: 'sale',
          propertyId: id,
          propertyName: property.name,
          description: `Property "${property.name}" removed from portfolio`,
          date: new Date().toISOString()
        }
        setActivity(prev => [newActivity, ...prev])
      }
    } catch (err) {
      setError('Failed to delete property')
    } finally {
      setLoading(false)
    }
  }

  const getProperty = (id: string) => {
    return properties.find(prop => prop.id === id)
  }

  return {
    properties,
    stats,
    activity,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    getProperty
  }
}