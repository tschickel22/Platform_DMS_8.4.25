// hooks/useInventoryManagement.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Vehicle, RVVehicle, MHVehicle, InventoryStats, VehicleStatus } from '../state/types'

// LocalStorage helpers
const STORAGE_KEY = 'ri_inventory__vehicles'

function loadFromStorage(): Vehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Vehicle[]
  } catch {
    return []
  }
}

function saveToStorage(vehicles: Vehicle[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles))
  } catch {
    // noop
  }
}

function ensureIds(vs: Partial<Vehicle>[]): Vehicle[] {
  const nowIso = new Date().toISOString()
  return vs.map((v) => ({
    id: (v as any).id ?? (Date.now().toString(36) + Math.random().toString(36).slice(2)),
    type: (v as any).type ?? 'RV',
    status: (v as any).status ?? 'Available',
    createdAt: (v as any).createdAt ?? nowIso,
    updatedAt: nowIso,
    ...(v as any),
  })) as Vehicle[]
}

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // initial load
  useEffect(() => {
    try {
      const existing = loadFromStorage()
      setVehicles(existing)
    } catch (e) {
      setError('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  // derived stats
  const stats: InventoryStats = useMemo(() => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'Available').length
    const reserved = vehicles.filter(v => v.status === 'Reserved' || (v as any).salePending === 'Yes').length
    const sold = vehicles.filter(v => v.status === 'Sold').length
    const totalValue = vehicles.reduce((sum, v) => {
      const price = (v as any).price ?? (v as any).askingPrice ?? 0
      return sum + (Number(price) || 0)
    }, 0)
    return { total, available, reserved, sold, totalValue }
  }, [vehicles])

  const getById = useCallback((id: string) => {
    return vehicles.find(v => v.id === id)
  }, [vehicles])

  const createVehicle = useCallback(async (data: Partial<Vehicle>) => {
    const [veh] = ensureIds([data])
    const next = [...vehicles, veh]
    setVehicles(next)
    saveToStorage(next)
    return veh
  }, [vehicles])

  const addVehicle = createVehicle // alias for compatibility

  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    const next = vehicles.map(v => v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } as Vehicle : v)
    setVehicles(next)
    saveToStorage(next)
    return next.find(v => v.id === id)!
  }, [vehicles])

  const updateVehicleStatus = useCallback(async (id: string, status: VehicleStatus) => {
    return updateVehicle(id, { status } as Partial<Vehicle>)
  }, [updateVehicle])

  const deleteVehicle = useCallback(async (id: string) => {
    const next = vehicles.filter(v => v.id !== id)
    setVehicles(next)
    saveToStorage(next)
  }, [vehicles])

  const importVehicles = useCallback(async (incoming: Vehicle[]) => {
    const withIds = ensureIds(incoming)
    const next = [...vehicles, ...withIds]
    setVehicles(next)
    saveToStorage(next)
  }, [vehicles])

  const getStats = useCallback(() => stats, [stats])

  const refreshData = useCallback(() => {
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
    getById,
    getStats,
    refreshData,
  }
}
