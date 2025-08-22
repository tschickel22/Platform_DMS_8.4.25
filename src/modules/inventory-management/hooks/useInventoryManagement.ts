import { useState, useEffect } from 'react'
import { VehicleInventory, RVInventory, ManufacturedHomeInventory } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { mockInventory } from '@/mocks/inventoryMock'

const STORAGE_KEY = 'renter-insight-inventory'

export function useInventoryManagement() {
  const [inventory, setInventory] = useState<VehicleInventory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load inventory from localStorage on mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedInventory = loadFromLocalStorage<VehicleInventory[]>(STORAGE_KEY, [])
      
      // If no saved inventory, use mock data
      if (savedInventory.length === 0) {
        const mockData = mockInventory.sampleVehicles.map(vehicle => ({
          ...vehicle,
          id: vehicle.id || `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: vehicle.createdAt || new Date().toISOString(),
          updatedAt: vehicle.updatedAt || new Date().toISOString()
        }))
        setInventory(mockData)
        saveToLocalStorage(STORAGE_KEY, mockData)
      } else {
        setInventory(savedInventory)
      }
      
      setError(null)
    } catch (err) {
      console.error('Failed to load inventory:', err)
      setError('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    if (!loading && inventory.length > 0) {
      saveToLocalStorage(STORAGE_KEY, inventory)
    }
  }, [inventory, loading])

  const createVehicle = async (vehicleData: Omit<VehicleInventory, 'id' | 'createdAt' | 'updatedAt'>): Promise<VehicleInventory> => {
    try {
      const newVehicle: VehicleInventory = {
        ...vehicleData,
        id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setInventory(prev => [newVehicle, ...prev])
      return newVehicle
    } catch (error) {
      console.error('Failed to create vehicle:', error)
      throw new Error('Failed to create vehicle')
    }
  }

  const updateVehicle = async (id: string, updates: Partial<VehicleInventory>): Promise<VehicleInventory> => {
    try {
      const updatedVehicle = {
        ...updates,
        id,
        updatedAt: new Date().toISOString()
      } as VehicleInventory

      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedVehicle } : item
      ))

      return updatedVehicle
    } catch (error) {
      console.error('Failed to update vehicle:', error)
      throw new Error('Failed to update vehicle')
    }
  }

  const deleteVehicle = async (id: string): Promise<void> => {
    try {
      setInventory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete vehicle:', error)
      throw new Error('Failed to delete vehicle')
    }
  }

  const getVehicle = (id: string): VehicleInventory | null => {
    return inventory.find(item => item.id === id) || null
  }

  const getVehiclesByType = (type: 'rv' | 'manufactured_home'): VehicleInventory[] => {
    return inventory.filter(item => item.listingType === type)
  }

  const getVehiclesByStatus = (status: string): VehicleInventory[] => {
    return inventory.filter(item => item.status === status)
  }

  const searchVehicles = (query: string): VehicleInventory[] => {
    const lowercaseQuery = query.toLowerCase()
    return inventory.filter(item =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.make.toLowerCase().includes(lowercaseQuery) ||
      item.model.toLowerCase().includes(lowercaseQuery) ||
      item.inventoryId?.toLowerCase().includes(lowercaseQuery) ||
      item.vin?.toLowerCase().includes(lowercaseQuery)
    )
  }

  const exportInventory = async (items: VehicleInventory[], format: 'csv' | 'json' | 'xml'): Promise<void> => {
    try {
      let content = ''
      let filename = `inventory-export-${new Date().toISOString().split('T')[0]}`
      let mimeType = 'text/plain'

      switch (format) {
        case 'csv':
          const headers = [
            'ID', 'Title', 'Type', 'Year', 'Make', 'Model', 'VIN', 'Status',
            'Sale Price', 'Rent Price', 'City', 'State', 'Created'
          ]
          const rows = items.map(item => [
            item.id,
            item.title,
            item.listingType,
            item.year,
            item.make,
            item.model,
            item.vin || '',
            item.status,
            item.salePrice || '',
            item.rentPrice || '',
            item.location.city,
            item.location.state,
            item.createdAt
          ])
          content = [headers, ...rows].map(row => row.join(',')).join('\n')
          filename += '.csv'
          mimeType = 'text/csv'
          break

        case 'json':
          content = JSON.stringify(items, null, 2)
          filename += '.json'
          mimeType = 'application/json'
          break

        case 'xml':
          content = `<?xml version="1.0" encoding="UTF-8"?>
<inventory>
${items.map(item => `  <item>
    <id>${item.id}</id>
    <title>${item.title}</title>
    <type>${item.listingType}</type>
    <year>${item.year}</year>
    <make>${item.make}</make>
    <model>${item.model}</model>
    <status>${item.status}</status>
    <salePrice>${item.salePrice || ''}</salePrice>
    <rentPrice>${item.rentPrice || ''}</rentPrice>
    <location>
      <city>${item.location.city}</city>
      <state>${item.location.state}</state>
    </location>
  </item>`).join('\n')}
</inventory>`
          filename += '.xml'
          mimeType = 'application/xml'
          break
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export inventory:', error)
      throw new Error('Failed to export inventory')
    }
  }

  const importInventory = async (file: File): Promise<void> => {
    try {
      const text = await file.text()
      let importedData: any[] = []

      if (file.name.endsWith('.json')) {
        importedData = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        importedData = lines.slice(1).map(line => {
          const values = line.split(',')
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim()
          })
          return obj
        })
      }

      // Convert imported data to VehicleInventory format
      const newInventory: VehicleInventory[] = importedData.map(item => ({
        id: item.id || `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        listingType: item.listingType || item.type || 'rv',
        inventoryId: item.inventoryId || item.ID,
        title: item.title || `${item.year} ${item.make} ${item.model}`,
        year: parseInt(item.year) || new Date().getFullYear(),
        make: item.make || '',
        model: item.model || '',
        vin: item.vin || item.VIN,
        condition: item.condition || 'used',
        status: item.status || 'available',
        salePrice: parseFloat(item.salePrice) || undefined,
        rentPrice: parseFloat(item.rentPrice) || undefined,
        offerType: item.offerType || 'for_sale',
        description: item.description || '',
        location: {
          city: item.city || item['location.city'] || '',
          state: item.state || item['location.state'] || '',
          postalCode: item.postalCode || item['location.postalCode'] || ''
        },
        media: {
          primaryPhoto: item.primaryPhoto || '',
          photos: []
        },
        features: {},
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))

      setInventory(prev => [...newInventory, ...prev])
    } catch (error) {
      console.error('Failed to import inventory:', error)
      throw new Error('Failed to import inventory')
    }
  }

  return {
    inventory,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    getVehiclesByType,
    getVehiclesByStatus,
    searchVehicles,
    exportInventory,
    importInventory
  }
}