import { useState, useEffect, useCallback } from 'react'
import { Vehicle, RVVehicle, MHVehicle, InventoryStats } from '../state/types'
import { normalizeVehicleData } from '../utils/adapters'

/* ----------------------------- utils & storage ----------------------------- */

const STORAGE_KEY = 'renter-insight-vehicles'

const genId = (): string => {
  try {
    // @ts-ignore - crypto may not exist in some environments
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch { /* ignore */ }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const readFromLocalStorage = (): Vehicle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Vehicle[]) : []
  } catch {
    return []
  }
}

const writeToLocalStorage = (data: Vehicle[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // non-fatal; storage might be unavailable
  }
}

/* --------------------------------- mocks ---------------------------------- */

// NOTE: changed `zip9` -> `zip` to match current MH field naming.
const mockInventoryData: Vehicle[] = [
  {
    id: '1',
    type: 'RV',
    status: 'Available',
    vehicleIdentificationNumber: '1FDXE45S8HDA12345',
    brand: 'Forest River',
    model: 'Cherokee',
    modelDate: 2023,
    mileage: 5000,
    bodyStyle: 'Travel Trailer',
    fuelType: 'None',
    vehicleTransmission: 'None',
    color: 'White',
    price: 45000,
    priceCurrency: 'USD',
    availability: 'Available',
    images: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
    description: 'Beautiful travel trailer perfect for family adventures',
    sellerName: 'RV World',
    sellerPhone: '555-0123',
    sellerEmail: 'sales@rvworld.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  } as RVVehicle,
  {
    id: '2',
    type: 'MH',
    status: 'Available',
    askingPrice: 85000,
    homeType: 'Single Wide',
    make: 'Clayton',
    model: 'The Edge',
    year: 2022,
    bedrooms: 3,
    bathrooms: 2,
    address1: '123 Mobile Home Park Dr',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    serialNumber: 'CLT123456789',
    width1: 16,
    length1: 80,
    color: 'Beige',
    description: 'Modern manufactured home in excellent condition',
    images: [],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  } as MHVehicle
]

/* ------------------------------ main hook ---------------------------------- */

export const useInventoryManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // initial load
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      setLoading(true)
      try {
        // 1) try local storage
        let data = readFromLocalStorage()

        // 2) else normalize mocks
        if (data.length === 0) {
          data = typeof normalizeVehicleData === 'function'
            ? normalizeVehicleData(mockInventoryData)
            : mockInventoryData
        }

        if (!mounted) return
        setVehicles(data)
        setError(null)
      } catch (err) {
        if (!mounted) return
        console.error('Error loading inventory:', err)
        setError('Failed to load inventory data')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => { mounted = false }
  }, [])

  // persist on change
  useEffect(() => {
    writeToLocalStorage(vehicles)
  }, [vehicles])

  /* ------------------------------- CRUD ops ------------------------------- */

  const addVehicle = useCallback(
    async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: genId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setVehicles(prev => [...prev, newVehicle])
      return newVehicle
    },
    []
  )

  const updateVehicle = useCallback(
    async (id: string, updates: Partial<Vehicle>) => {
      setVehicles(prev =>
        prev.map(v =>
          v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
        )
      )
    },
    []
  )

  const deleteVehicle = useCallback(
    async (id: string) => {
      setVehicles(prev => prev.filter(v => v.id !== id))
    },
    []
  )

  const importVehicles = useCallback(
    async (incoming: Vehicle[]) => {
      const withIds: Vehicle[] = incoming.map(v => ({
        ...v,
        id: v.id ?? genId(),
        createdAt: v.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      setVehicles(prev => [...prev, ...withIds])
      return withIds
    },
    []
  )

  /* -------------------------------- stats --------------------------------- */

  const getStats = useCallback((): InventoryStats => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'Available').length
    const reserved = vehicles.filter(v => v.status === 'Reserved').length
    const sold = vehicles.filter(v => v.status === 'Sold').length

    const totalValue = vehicles.reduce((sum, v) => {
      const value =
        // RV
        (v as any).price ??
        // MH
        (v as any).askingPrice ??
        0
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)

    return { total, available, reserved, sold, totalValue }
  }, [vehicles])

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const current = readFromLocalStorage()
      if (current.length > 0) {
        setVehicles(current)
      } else {
        const normalized = typeof normalizeVehicleData === 'function'
          ? normalizeVehicleData(mockInventoryData)
          : mockInventoryData
        setVehicles(normalized)
      }
    } catch (e) {
      setError('Failed to refresh inventory data')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    importVehicles,
    getStats,
    refreshData,
  }
}
