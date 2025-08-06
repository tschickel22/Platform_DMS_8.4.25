import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

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
    description: 'Beautiful 2.5-acre residential lot with mountain views and utilities available.',
    amenities: ['Water', 'Electric', 'Sewer'],
    zoning: 'R-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Oak Valley Commercial Plot',
    location: '1250 Oak Valley Road, Business District',
    size: 1.2,
    price: 250000,
    status: 'pending',
    type: 'Commercial',
    description: 'Prime commercial location with high traffic visibility and easy highway access.',
    amenities: ['Water', 'Electric', 'Gas', 'Fiber'],
    zoning: 'C-2',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    name: 'Pine Creek Ranch Land',
    location: 'County Road 45, Pine Creek Area',
    size: 15.0,
    price: 180000,
    status: 'available',
    type: 'Agricultural',
    description: 'Large agricultural parcel perfect for ranching or farming with creek frontage.',
    amenities: ['Well Water', 'Electric'],
    zoning: 'AG',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z'
  },
  {
    id: '4',
    name: 'Lakeside Development Lot',
    location: 'Lakeside Drive, Waterfront Community',
    size: 0.75,
    price: 95000,
    status: 'sold',
    type: 'Residential',
    description: 'Waterfront residential lot in exclusive lakeside community with private beach access.',
    amenities: ['Water', 'Electric', 'Sewer', 'Cable'],
    zoning: 'R-2',
    createdAt: '2023-12-20T11:20:00Z',
    updatedAt: '2024-01-25T13:30:00Z'
  }
]

export function useLandManagement() {
  const [lands, setLands] = useState(mockLands)
  const { toast } = useToast()

  const addLand = async (landData) => {
    try {
      const newLand = {
        ...landData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setLands(prev => [...prev, newLand])
      
      toast({
        title: "Success",
        description: "Land parcel added successfully",
      })
      
      return newLand
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add land parcel",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateLand = async (id, landData) => {
    try {
      const updatedLand = {
        ...landData,
        id,
        updatedAt: new Date().toISOString()
      }
      
      setLands(prev => prev.map(land => 
        land.id === id ? updatedLand : land
      ))
      
      toast({
        title: "Success",
        description: "Land parcel updated successfully",
      })
      
      return updatedLand
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update land parcel",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteLand = async (id) => {
    try {
      setLands(prev => prev.filter(land => land.id !== id))
      
      toast({
        title: "Success",
        description: "Land parcel deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete land parcel",
        variant: "destructive",
      })
      throw error
    }
  }

  const getLandById = (id) => {
    return lands.find(land => land.id === id)
  }

  const getLandsByStatus = (status) => {
    return lands.filter(land => land.status === status)
  }

  const getLandsByType = (type) => {
    return lands.filter(land => land.type === type)
  }

  return {
    lands,
    addLand,
    updateLand,
    deleteLand,
    getLandById,
    getLandsByStatus,
    getLandsByType
  }
}