// src/modules/inventory-management/hooks/useInventoryManagement.ts
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Vehicle, RVVehicle, MHVehicle, InventoryStats } from '../state/types'

/* =============================================================================
   Local helpers (no external dependencies)
============================================================================= */

const STORAGE_KEY = 'renter-insight-vehicles'

const genId = (): string => {
  try {
    // @ts-ignore crypto might not exist in all environments
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {}
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const readLS = (): Vehicle[] => {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Vehicle[]) : []
  } catch {
    return []
  }
}

const writeLS = (data: Vehicle[]) => {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Non-fatal: storage may be blocked
  }
}

/* =============================================================================
   Mock seed (kept small but valid). NOTE: MH uses `zip`, not `zip9`.
============================================================================= */

const SEED: Vehicle[] = [
  {
    id: 'rv-1',
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
    id: 'mh-1',
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

/* =============================================================================
   Filters/search state
============================================================================= */

type StatusFilter = 'ALL' | 'Available' | 'Reserved' | 'Sold'
type TypeFilter = 'ALL' | 'RV' | 'MH'

interface Filters {
  status: StatusFilter
  type: TypeFilter
}

/* =============================================================================
   Hook
============================================================================= */

export const useInventoryManagement = () => {
  // core data
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ui controls
  const [filters, setFilters] = useState<Filters>({ status: 'ALL', type: 'ALL' })
  const [search, setSearch] = useState<string>('')

  /* ------------------------------ initialization ----------------------------- */
  useEffect(() => {
    // deterministic init: localStorage -> seed
    try {
      const fromLS = readLS()
      setVehicles(fromLS.length ? fromLS : SEED)
      setError(null)
    } catch (e) {
      setError('Failed to load inventory data')
      // eslint-disable-next-line no-console
      console.error('Inventory init failed:', e)
      setVehicles(SEED)
    } finally {
      setLoading(false)
    }
  }, [])

  // persist changes
  useEffect(() => {
    writeLS(vehicles)
  }, [vehicles])

  /* --------------------------------- derived -------------------------------- */
  const filtered = useMemo(() => {
    let data = vehicles

    if (filters.type !== 'ALL') {
      data = data.filter(v => v.type === filters.type)
    }
    if (filters.status !== 'ALL') {
      data = data.filter(v => v.status === filters.status)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(v => {
        const haystack = [
          (v as any).vehicleIdentificationNumber,
          (v as any).serialNumber,
          (v as any).brand,
          (v as any).make,
          v.model,
          (v as any).homeType,
          (v as any).description,
          (v as any).address1,
          (v as any).city,
          (v as any).state
        ]
          .filter(Boolean)
          .map(String)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }
    return data
  }, [vehicles, filters, search])

  /* ---------------------------------- CRUD ---------------------------------- */

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
        prev.map(v => (v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v))
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
      const withIds = incoming.map(v => ({
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

  /* --------------------------------- stats ---------------------------------- */

  const getStats = useCallback((): InventoryStats => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'Available').length
    const reserved = vehicles.filter(v => v.status === 'Reserved').length
    const sold = vehicles.filter(v => v.status === 'Sold').length

    const totalValue = vehicles.reduce((sum, v) => {
      const value = (v as any).price ?? (v as any).askingPrice ?? 0
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)

    return { total, available, reserved, sold, totalValue }
  }, [vehicles])

  /* ------------------------------- utilities -------------------------------- */

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const current = readLS()
      setVehicles(current.length ? current : SEED)
      setError(null)
    } catch (e) {
      setVehicles(SEED)
      setError('Failed to refresh inventory data')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearAll = useCallback(() => {
    setVehicles([])
    writeLS([])
  }, [])

  const exportCSV = useCallback((): string => {
    // very basic CSV to help with quick exports
    const headers = [
      'id',
      'type',
      'status',
      'brand/make',
      'model',
      'year/modelDate',
      'vin/serial',
      'price/askingPrice',
      'city',
      'state'
    ]
    const rows = vehicles.map(v => {
      const brandOrMake = (v as any).brand ?? (v as any).make ?? ''
      const yearOrModelDate = (v as any).year ?? (v as any).modelDate ?? ''
      const vinOrSerial = (v as any).vehicleIdentificationNumber ?? (v as any).serialNumber ?? ''
      const priceOrAsking = (v as any).price ?? (v as any).askingPrice ?? ''
      const city = (v as any).city ?? ''
      const state = (v as any).state ?? ''
      return [
        v.id,
        v.type,
        v.status,
        brandOrMake,
        v.model ?? '',
        yearOrModelDate,
        vinOrSerial,
        priceOrAsking,
        city,
        state
      ]
        .map(x => `"${String(x).replace(/"/g, '""')}"`)
        .join(',')
    })
    return [headers.join(','), ...rows].join('\n')
  }, [vehicles])

  /* --------------------------------- return --------------------------------- */

  return {
    // data
    vehicles,
    filtered,
    loading,
    error,

    // controls
    filters,
    setFilters,
    search,
    setSearch,

    // actions
    addVehicle,
    updateVehicle,
    deleteVehicle,
    importVehicles,
    getStats,
    refreshData,
    clearAll,
    exportCSV
  }
}
