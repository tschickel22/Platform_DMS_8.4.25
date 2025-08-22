// src/modules/inventory-management/hooks/useInventoryManagement.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Vehicle, RVVehicle, MHVehicle, InventoryStats, VehicleStatus } from '../state/types'

const STORAGE_KEY = 'ri_inventory__vehicles'

// First-run seed (only if storage is empty)
const seed: Vehicle[] = [
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
    zip9: '78701',
    serialNumber: 'CLT123456789',
    width1: 16,
    length1: 80,
    color: 'Beige',
    description: 'Modern manufactured home in excellent condition',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  } as MHVehicle
]

// ---- helpers ----
const load = (): Vehicle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Vehicle[]) : []
  } catch {
    return []
  }
}

const save = (v: Vehicle[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch {}
}

const ensureIds = (items: Partial<Vehicle>[]): Vehicle[] => {
  const now = new Date().toISOString()
  return items.map((v) => ({
    id: (v as any).id ?? (Date.now().toString(36) + Math.random().toString(36).slice(2, 9)),
    type: (v as any).type ?? 'RV',
    status: (v as any).status ?? 'Available',
    createdAt: (v as any).createdAt ?? now,
    updatedAt: now,
    ...(v as any),
  })) as Vehicle[]
}

const toStatusKey = (val: unknown): 'available' | 'reserved' | 'sold' | 'pending' | 'other' => {
  const s = String(val ?? '').toLowerCase()
  if (s.startsWith('avail')) return 'available'
  if (s.startsWith('reser')) return 'reserved'
  if (s.startsWith('sold')) return 'sold'
  if (s.startsWith('pend')) return 'pending'
  return 'other'
}

const getPrice = (v: any) => {
  const n = Number(v?.price ?? v?.askingPrice ?? 0)
  return Number.isFinite(n) ? n : 0
}

// ---- hook ----
export const useInventoryManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // init from storage; seed once if empty
  useEffect(() => {
    setLoading(true)
    try {
      const existing = load()
      if (existing.length > 0) {
        setVehicles(existing)
      } else {
        const seeded = ensureIds(seed)
        setVehicles(seeded)
        save(seeded)
      }
      setError(null)
    } catch (e) {
      setError('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }, [])

  // CRUD
  const createVehicle = useCallback(async (data: Partial<Vehicle>) => {
    const [veh] = ensureIds([data])
    const next = [...vehicles, veh]
    setVehicles(next)
    save(next)
    return veh
  }, [vehicles])

  // alias (some UIs call addVehicle)
  const addVehicle = createVehicle

  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    const next = vehicles.map(v => v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v)
    setVehicles(next)
    save(next)
    return next.find(v => v.id === id)!
  }, [vehicles])

  const updateVehicleStatus = useCallback(async (id: string, status: VehicleStatus | string) => {
    // accept enums or strings
    const statusVal = String(status)
    return updateVehicle(id, { status: statusVal } as Partial<Vehicle>)
  }, [updateVehicle])

  const deleteVehicle = useCallback(async (id: string) => {
    const next = vehicles.filter(v => v.id !== id)
    setVehicles(next)
    save(next)
  }, [vehicles])

  const importVehicles = useCallback(async (incoming: Partial<Vehicle>[]) => {
    const withIds = ensureIds(incoming)
    const next = [...vehicles, ...withIds]
    setVehicles(next)
    save(next)
    return withIds
  }, [vehicles])

  // stats
  const getStats = useCallback((): InventoryStats => {
    const total = vehicles.length
    let available = 0, reserved = 0, sold = 0, totalValue = 0
    for (const v of vehicles) {
      const k = toStatusKey((v as any).status)
      if (k === 'available') available++
      else if (k === 'reserved') reserved++
      else if (k === 'sold') sold++
      totalValue += getPrice(v)
    }
    return { total, available, reserved, sold, totalValue }
  }, [vehicles])

  const refreshData = useCallback(() => {
    // noop placeholder to match UI expectations
    setLoading(true)
    setTimeout(() => setLoading(false), 200)
  }, [])

  return {
    vehicles,
    loading,
    error,
    // CRUD
    createVehicle,
    addVehicle,
    updateVehicle,
    updateVehicleStatus,
    deleteVehicle,
    importVehicles,
    // utils
    getStats,
    refreshData,
  }
}
