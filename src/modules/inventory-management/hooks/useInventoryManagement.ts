import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export interface InventoryItem {
  id: string
  listingType: 'manufactured_home' | 'rv'
  inventoryId: string
  year: number
  make: string
  model: string
  condition: string
  salePrice?: number
  rentPrice?: number
  cost?: number
  offerType: string
  status: string
  description?: string
  searchResultsText?: string
  media: {
    primaryPhoto?: string
    photos: string[]
  }
  location: {
    city: string
    state: string
    postalCode?: string
    communityName?: string
  }
  features: Record<string, boolean>
  customFields?: Record<string, any>
  createdAt: string
  updatedAt: string
  
  // MH specific fields
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
  }
  serialNumber?: string
  
  // RV specific fields
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  vin?: string
}

const STORAGE_KEY = 'renter-insight-inventory'

export function useInventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load inventory from localStorage on mount
  useEffect(() => {
    try {
      const savedInventory = loadFromLocalStorage<InventoryItem[]>(STORAGE_KEY, [])
      setInventory(savedInventory)
    } catch (err) {
      console.error('Failed to load inventory:', err)
      setError('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage(STORAGE_KEY, inventory)
    }
  }, [inventory, loading])

  // Add new inventory item
  const addInventoryItem = async (itemData: Partial<InventoryItem>): Promise<InventoryItem> => {
    try {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        listingType: itemData.listingType || 'manufactured_home',
        inventoryId: itemData.inventoryId || '',
        year: itemData.year || new Date().getFullYear(),
        make: itemData.make || '',
        model: itemData.model || '',
        condition: itemData.condition || 'new',
        salePrice: itemData.salePrice,
        rentPrice: itemData.rentPrice,
        cost: itemData.cost,
        offerType: itemData.offerType || 'for_sale',
        status: itemData.status || 'available',
        description: itemData.description || '',
        searchResultsText: itemData.searchResultsText || '',
        media: {
          primaryPhoto: itemData.media?.primaryPhoto || '',
          photos: itemData.media?.photos || []
        },
        location: {
          city: itemData.location?.city || '',
          state: itemData.location?.state || '',
          postalCode: itemData.location?.postalCode || '',
          communityName: itemData.location?.communityName || ''
        },
        features: itemData.features || {},
        customFields: itemData.customFields || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // MH specific fields
        bedrooms: itemData.bedrooms,
        bathrooms: itemData.bathrooms,
        dimensions: itemData.dimensions,
        serialNumber: itemData.serialNumber,
        
        // RV specific fields
        sleeps: itemData.sleeps,
        slides: itemData.slides,
        length: itemData.length,
        fuelType: itemData.fuelType,
        engine: itemData.engine,
        transmission: itemData.transmission,
        odometerMiles: itemData.odometerMiles,
        vin: itemData.vin
      }

      setInventory(prev => [newItem, ...prev])
      
      toast({
        title: 'Success',
        description: `${itemData.listingType === 'rv' ? 'RV' : 'Manufactured Home'} added successfully`
      })

      return newItem
    } catch (err) {
      console.error('Failed to add inventory item:', err)
      toast({
        title: 'Error',
        description: 'Failed to add inventory item',
        variant: 'destructive'
      })
      throw err
    }
  }

  // Update existing inventory item
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> => {
    try {
      const existingItem = inventory.find(item => item.id === id)
      if (!existingItem) {
        throw new Error('Inventory item not found')
      }

      const updatedItem: InventoryItem = {
        ...existingItem,
        ...updates,
        // Ensure nested objects are properly merged
        media: {
          ...existingItem.media,
          ...(updates.media || {})
        },
        location: {
          ...existingItem.location,
          ...(updates.location || {})
        },
        features: {
          ...existingItem.features,
          ...(updates.features || {})
        },
        dimensions: {
          ...existingItem.dimensions,
          ...(updates.dimensions || {})
        },
        customFields: {
          ...existingItem.customFields,
          ...(updates.customFields || {})
        },
        updatedAt: new Date().toISOString()
      }

      setInventory(prev => prev.map(item => item.id === id ? updatedItem : item))
      
      toast({
        title: 'Success',
        description: `${updatedItem.listingType === 'rv' ? 'RV' : 'Manufactured Home'} updated successfully`
      })

      return updatedItem
    } catch (err) {
      console.error('Failed to update inventory item:', err)
      toast({
        title: 'Error',
        description: 'Failed to update inventory item',
        variant: 'destructive'
      })
      throw err
    }
  }

  // Delete inventory item
  const deleteInventoryItem = async (id: string): Promise<void> => {
    try {
      const item = inventory.find(item => item.id === id)
      if (!item) {
        throw new Error('Inventory item not found')
      }

      setInventory(prev => prev.filter(item => item.id !== id))
      
      toast({
        title: 'Success',
        description: `${item.listingType === 'rv' ? 'RV' : 'Manufactured Home'} deleted successfully`
      })
    } catch (err) {
      console.error('Failed to delete inventory item:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete inventory item',
        variant: 'destructive'
      })
      throw err
    }
  }

  // Get inventory by type
  const getInventoryByType = (type: 'manufactured_home' | 'rv') => {
    return inventory.filter(item => item.listingType === type)
  }

  // Get inventory by status
  const getInventoryByStatus = (status: string) => {
    return inventory.filter(item => item.status === status)
  }

  // Search inventory
  const searchInventory = (searchTerm: string) => {
    if (!searchTerm.trim()) return inventory
    
    const term = searchTerm.toLowerCase()
    return inventory.filter(item => 
      item.inventoryId.toLowerCase().includes(term) ||
      item.make.toLowerCase().includes(term) ||
      item.model.toLowerCase().includes(term) ||
      item.location.city.toLowerCase().includes(term) ||
      item.location.state.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    )
  }

  // Get inventory statistics
  const getInventoryStats = () => {
    const total = inventory.length
    const available = inventory.filter(item => item.status === 'available').length
    const sold = inventory.filter(item => item.status === 'sold').length
    const reserved = inventory.filter(item => item.status === 'reserved').length
    
    const totalValue = inventory
      .filter(item => item.salePrice)
      .reduce((sum, item) => sum + (item.salePrice || 0), 0)
    
    const averagePrice = total > 0 ? totalValue / total : 0

    return {
      total,
      available,
      sold,
      reserved,
      totalValue,
      averagePrice
    }
  }

  return {
    inventory,
    loading,
    error,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryByType,
    getInventoryByStatus,
    searchInventory,
    getInventoryStats
  }
}