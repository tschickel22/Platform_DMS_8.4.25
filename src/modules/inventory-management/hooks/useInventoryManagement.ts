import { useState, useEffect, useMemo } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export interface InventoryItem {
  id: string
  listingType: 'manufactured_home' | 'rv'
  inventoryId: string
  year: number
  make: string
  model: string
  vin?: string
  serialNumber?: string
  condition: 'new' | 'used' | 'refurbished'
  salePrice: number
  rentPrice?: number
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'available' | 'reserved' | 'sold' | 'service'
  
  // Manufactured Home specific
  bedrooms?: number
  bathrooms?: number
  dimensions?: {
    width_ft?: number
    length_ft?: number
    sections?: number
  }
  
  // RV specific
  sleeps?: number
  slides?: number
  length?: number
  fuelType?: string
  engine?: string
  transmission?: string
  odometerMiles?: number
  
  description?: string
  searchResultsText?: string
  location?: {
    city?: string
    state?: string
    postalCode?: string
    communityName?: string
  }
  features?: Record<string, boolean>
  media?: {
    primaryPhoto?: string
    photos?: string[]
  }
  createdAt: string
  updatedAt: string
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

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem: InventoryItem = {
        ...itemData,
        id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setInventory(prev => [newItem, ...prev])
      
      toast({
        title: 'Success',
        description: 'Inventory item added successfully'
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

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      setInventory(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      ))

      toast({
        title: 'Success',
        description: 'Inventory item updated successfully'
      })
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

  const deleteInventoryItem = async (id: string) => {
    try {
      setInventory(prev => prev.filter(item => item.id !== id))
      
      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully'
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

  const getInventoryByType = (type: 'manufactured_home' | 'rv') => {
    return inventory.filter(item => item.listingType === type)
  }

  const searchInventory = (searchTerm: string) => {
    const term = searchTerm.toLowerCase()
    return inventory.filter(item => 
      item.make.toLowerCase().includes(term) ||
      item.model.toLowerCase().includes(term) ||
      item.inventoryId.toLowerCase().includes(term) ||
      item.year.toString().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      (item.location?.city && item.location.city.toLowerCase().includes(term))
    )
  }

  const getInventoryStats = () => {
    const total = inventory.length
    const available = inventory.filter(item => item.status === 'available').length
    const reserved = inventory.filter(item => item.status === 'reserved').length
    const sold = inventory.filter(item => item.status === 'sold').length
    const totalValue = inventory.reduce((sum, item) => sum + (item.salePrice || 0), 0)
    const averagePrice = total > 0 ? totalValue / total : 0

    return {
      total,
      available,
      reserved,
      sold,
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
    searchInventory,
    getInventoryStats
  }
}