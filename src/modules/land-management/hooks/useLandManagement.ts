import { useState, useEffect } from 'react'

// Mock data for land management
const mockLands = [
  {
    id: '1',
    name: 'Sunset Ridge Parcel A',
    location: 'Highway 287, Sunset Ridge Development',
    size: 2.5,
    price: 125000,
    status: 'available',
    type: 'Residential',
    description: 'Beautiful 2.5-acre residential parcel with mountain views. Perfect for custom home construction with utilities available at the road.',
    features: ['Mountain Views', 'Utilities Available', 'Paved Road Access'],
    zoning: 'R-1 Residential',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Commerce Center Lot 12',
    location: '1500 Industrial Blvd, Commerce District',
    size: 1.8,
    price: 280000,
    status: 'pending',
    type: 'Commercial',
    description: 'Prime commercial lot in established business district. High traffic area with excellent visibility and access to major highways.',
    features: ['High Traffic', 'Highway Access', 'Established Area'],
    zoning: 'C-2 Commercial',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    name: 'Riverside Agricultural Land',
    location: 'County Road 45, Rural District',
    size: 15.0,
    price: 450000,
    status: 'available',
    type: 'Agricultural',
    description: 'Expansive agricultural land with river frontage. Ideal for farming operations or rural development. Includes existing barn and well.',
    features: ['River Frontage', 'Existing Barn', 'Water Well'],
    zoning: 'AG Agricultural',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z'
  },
  {
    id: '4',
    name: 'Industrial Park Section B',
    location: '2200 Manufacturing Way, Industrial Zone',
    size: 5.2,
    price: 520000,
    status: 'sold',
    type: 'Industrial',
    description: 'Large industrial parcel with rail access and heavy utility infrastructure. Suitable for manufacturing or distribution facilities.',
    features: ['Rail Access', 'Heavy Utilities', 'Loading Docks'],
    zoning: 'I-1 Industrial',
    createdAt: '2023-12-20T11:20:00Z',
    updatedAt: '2024-01-18T13:30:00Z'
  },
  {
    id: '5',
    name: 'Hillcrest Residential Lot',
    location: '456 Hillcrest Drive, Suburban Heights',
    size: 0.75,
    price: 85000,
    status: 'reserved',
    type: 'Residential',
    description: 'Charming residential lot in established neighborhood. Level building site with mature trees and underground utilities.',
    features: ['Mature Trees', 'Underground Utilities', 'Level Site'],
    zoning: 'R-2 Residential',
    createdAt: '2024-01-12T08:15:00Z',
    updatedAt: '2024-01-22T14:45:00Z'
  }
]

export interface Land {
  id: string
  name: string
  location: string
  size: number
  price: number
  status: 'available' | 'pending' | 'sold' | 'reserved'
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural'
  description: string
  features: string[]
  zoning: string
  createdAt: string
  updatedAt: string
}

export function useLandManagement() {
  const [lands, setLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLands(mockLands)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const addLand = (landData: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLand: Land = {
      ...landData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setLands(prev => [newLand, ...prev])
    return newLand
  }

  const updateLand = (id: string, updates: Partial<Land>) => {
    setLands(prev => prev.map(land => 
      land.id === id 
        ? { ...land, ...updates, updatedAt: new Date().toISOString() }
        : land
    ))
  }

  const deleteLand = (id: string) => {
    setLands(prev => prev.filter(land => land.id !== id))
  }

  const getLandById = (id: string) => {
    return lands.find(land => land.id === id)
  }

  return {
    lands,
    loading,
    addLand,
    updateLand,
    deleteLand,
    getLandById
  }
}