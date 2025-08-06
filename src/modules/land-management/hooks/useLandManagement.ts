import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface Land {
  id: string
  name: string
  location: string
  size: number
  price: number
  type: string
  status: 'available' | 'pending' | 'sold' | 'reserved'
  description?: string
  amenities?: string[]
  zoning?: string
  utilities?: string
  access?: string
  soilType?: string
  waterRights?: string
  restrictions?: string
  createdAt: string
  updatedAt: string
}

const mockLands: Land[] = [
  {
    id: '1',
    name: 'Sunset Ridge Parcel A',
    location: 'Highway 287, Sunset Ridge Development',
    size: 2.5,
    price: 125000,
    status: 'available',
    type: 'Residential',
    description: 'Beautiful 2.5-acre residential lot with stunning mountain views. Perfect for building your dream home with plenty of space for gardens and outdoor activities.',
    amenities: ['Mountain Views', 'Mature Trees', 'Private Road', 'Underground Utilities'],
    zoning: 'R-1',
    utilities: 'Electric, Water, Sewer Available',
    access: 'Paved Road',
    soilType: 'Sandy Loam',
    waterRights: 'Municipal Water Available',
    restrictions: 'Single family residential only, minimum 2000 sq ft home',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Oak Creek Commercial',
    location: '1234 Main Street, Oak Creek Business District',
    size: 1.2,
    price: 280000,
    status: 'pending',
    type: 'Commercial',
    description: 'Prime commercial lot in the heart of Oak Creek business district. High traffic area with excellent visibility and access to major highways.',
    amenities: ['High Traffic', 'Corner Lot', 'Highway Access', 'City Water/Sewer'],
    zoning: 'C-2',
    utilities: 'All utilities available at street',
    access: 'Two street access points',
    soilType: 'Clay',
    waterRights: 'City water and sewer',
    restrictions: 'Commercial use only, height restrictions apply',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    name: 'Prairie Wind Farm',
    location: 'County Road 45, Prairie Wind Valley',
    size: 40.0,
    price: 320000,
    status: 'available',
    type: 'Agricultural',
    description: 'Expansive 40-acre agricultural land perfect for farming or ranching. Includes existing barn and well. Fertile soil with irrigation rights.',
    amenities: ['Existing Barn', 'Water Well', 'Irrigation Rights', 'Fenced Perimeter'],
    zoning: 'A-1',
    utilities: 'Electric available, well water',
    access: 'Gravel road access',
    soilType: 'Rich Black Soil',
    waterRights: 'Irrigation rights included',
    restrictions: 'Agricultural use, no residential development',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z'
  },
  {
    id: '4',
    name: 'Riverside Recreation',
    location: 'Riverside Drive, Willow Creek Area',
    size: 5.8,
    price: 95000,
    status: 'reserved',
    type: 'Recreational',
    description: 'Scenic recreational property along Willow Creek. Perfect for camping, fishing, and outdoor recreation. Includes creek frontage and mature forest.',
    amenities: ['Creek Frontage', 'Mature Forest', 'Wildlife', 'Fishing Rights'],
    zoning: 'REC-1',
    utilities: 'None available',
    access: 'Dirt road access',
    soilType: 'Rocky with creek bottom',
    waterRights: 'Creek access rights',
    restrictions: 'Recreational use only, no permanent structures',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-18T11:30:00Z'
  }
]

export function useLandManagement() {
  const [lands, setLands] = useState<Land[]>(mockLands)
  const { toast } = useToast()

  const addLand = async (landData: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newLand: Land = {
        ...landData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setLands(prev => [newLand, ...prev])
      
      toast({
        title: "Success",
        description: `${landData.name} has been added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add land parcel.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateLand = async (id: string, landData: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLands(prev => prev.map(land => 
        land.id === id 
          ? { ...land, ...landData, updatedAt: new Date().toISOString() }
          : land
      ))
      
      toast({
        title: "Success",
        description: `${landData.name} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update land parcel.",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteLand = async (id: string) => {
    try {
      const land = lands.find(l => l.id === id)
      setLands(prev => prev.filter(land => land.id !== id))
      
      toast({
        title: "Success",
        description: `${land?.name || 'Land parcel'} has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete land parcel.",
        variant: "destructive",
      })
      throw error
    }
  }

  const getLandById = (id: string): Land | undefined => {
    return lands.find(land => land.id === id)
  }

  const getLandsByStatus = (status: Land['status']): Land[] => {
    return lands.filter(land => land.status === status)
  }

  const getLandsByType = (type: string): Land[] => {
    return lands.filter(land => land.type === type)
  }

  const getTotalValue = (): number => {
    return lands.reduce((total, land) => total + land.price, 0)
  }

  const getAveragePrice = (): number => {
    if (lands.length === 0) return 0
    return getTotalValue() / lands.length
  }

  const getTotalAcreage = (): number => {
    return lands.reduce((total, land) => total + land.size, 0)
  }

  return {
    lands,
    addLand,
    updateLand,
    deleteLand,
    getLandById,
    getLandsByStatus,
    getLandsByType,
    getTotalValue,
    getAveragePrice,
    getTotalAcreage
  }
}