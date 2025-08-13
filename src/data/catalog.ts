// src/data/catalog.ts
import { useSyncExternalStore, useMemo, useCallback } from 'react'

export type ListingType = 'manufactured_home' | 'rv'
export type Status = 'active' | 'draft' | 'inactive'

export interface InventoryItem {
  id: string
  year?: number
  make?: string
  model?: string
  location?: {
    city?: string
    state?: string
    lat?: number
    lng?: number
    township?: string
    schoolDistrict?: string
  }
  bedrooms?: number
  bathrooms?: number
  dimensions?: { squareFeet?: number; length?: number }
  sleeps?: number
  slides?: number
  media?: { primaryPhoto?: string }
  lotRent?: string | number
  taxes?: string | number
}

export interface ListingExportMeta {
  SellerID?: string
  CompanyID?: string
  RentalPrice?: number
  Township?: string
  SchoolDistrict?: string
  Latitude?: number
  Longitude?: number
  LotRent?: string
  Taxes?: string
  SellerAccountKey?: number
  SellerFirstName?: string
  SellerLastName?: string
  SellerCompanyName?: string
  SellerPhone?: string
  SellerEmail?: string
  SellerFax?: string
  SoldPrice?: number
  SearchResultsText?: string
  SellerWebsite?: string
  SellerEmail2?: string
  SellerEmail3?: string
  SellerEmail4?: string
  SellerPhone2?: string
}

export interface Listing {
  id: string
  inventoryId: string
  listingType: ListingType
  status: Status
  offerType?: 'sale' | 'rent'
  salePrice?: number
  rentPrice?: number
  description?: string
  hasOverrides?: boolean
  overrides?: Partial<InventoryItem>
  location?: InventoryItem['location']
  make?: string
  model?: string
  year?: number
  exportMeta?: ListingExportMeta
}

export interface CatalogStore {
  inventory: InventoryItem[]
  listings: Listing[]
}

const LS_KEY = 'ri_catalog_v1'
const EVT = 'ri_catalog_changed'

function defaultStore(): CatalogStore {
  return {
    inventory: [
    { id:'inv-1', year:2020, make:'Clayton', model:'Everest',
      location:{ city:'Austin', state:'TX' }, bedrooms:3, bathrooms:2, dimensions:{ squareFeet:1450 },
      media:{ primaryPhoto:'https://picsum.photos/seed/mh1/800/450' }, lotRent:'400', taxes:'50' },
    { id:'inv-2', year:2021, make:'Jayco', model:'Jay Flight',
      location:{ city:'Boise', state:'ID' }, sleeps:6, dimensions:{ length:28 }, slides:1,
      media:{ primaryPhoto:'https://picsum.photos/seed/rv1/800/450' } },
    ],
    listings: [],
  }
}

function readLS(): CatalogStore {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw)
    return { inventory: parsed.inventory ?? [], listings: parsed.listings ?? [] }
  } catch { return defaultStore() }
}

export function read(): CatalogStore { return readLS() }

function shallowEqual(a: any, b: any) {
  try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
}

function write(next: CatalogStore) {
  const prev = read()
  if (shallowEqual(prev, next)) return
  localStorage.setItem(LS_KEY, JSON.stringify(next))
  ;(typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (fn: Function) => Promise.resolve().then(() => fn()))(() =>
      dispatchEvent(new CustomEvent(EVT)))
}

function subscribe(fn: () => void) {
  let raf: number | null = null
  const handler = () => {
    if (raf != null) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => { raf = null; fn() })
  }
  addEventListener(EVT, handler)
  addEventListener('storage', handler)
  return () => {
    if (raf != null) cancelAnimationFrame(raf)
    removeEventListener(EVT, handler)
    removeEventListener('storage', handler)
  }
}

export function useCatalog() {
  const store = useSyncExternalStore(subscribe, read, read)

  const createListingForInventory = useCallback(
    (inventoryId: string, patch: Partial<Listing>) => {
      const inv = store.inventory.find(i => i.id === inventoryId)
      if (!inv) throw new Error('Inventory item not found')

      const lt = (patch.listingType as ListingType) ?? 'manufactured_home'
      if (lt === 'manufactured_home') {
        const merged = { ...inv, ...(patch.overrides || {}) }
        if (!merged.bedrooms || !merged.bathrooms || !merged.dimensions?.squareFeet) {
          throw new Error('Manufactured home requires bedrooms, bathrooms, and square feet')
        }
      }

      const id = crypto.randomUUID?.() ?? String(Date.now())
      const now: Listing = {
        id,
        inventoryId,
        listingType: lt,
        status: (patch.status as Status) ?? 'draft',
        offerType: patch.offerType ?? 'sale',
        salePrice: patch.salePrice,
        rentPrice: patch.rentPrice,
        description: patch.description,
        hasOverrides: !!patch.overrides,
        overrides: patch.overrides,
        exportMeta: patch.exportMeta,
        location: patch.location ?? inv.location,
        make: patch.make ?? inv.make,
        model: patch.model ?? inv.model,
        year: patch.year ?? inv.year,
      }

      write({ ...store, listings: [...store.listings, now] })
      return now
    },
    [store]
  )

  const updateListing = useCallback(
    (id: string, patch: Partial<Listing>) => {
      const next = {
        ...store,
        listings: store.listings.map(l =>
          l.id === id ? { ...l, ...patch, hasOverrides: !!patch.overrides || l.hasOverrides } : l
        ),
      }
      write(next)
    },
    [store]
  )

  const deleteListing = useCallback(
    (id: string) => {
      write({ ...store, listings: store.listings.filter(l => l.id !== id) })
    },
    [store]
  )

  const pushOverridesToInventory = useCallback(
    (listingId: string, fields: Array<keyof InventoryItem>) => {
      const l = store.listings.find(x => x.id === listingId)
      if (!l || !l.overrides) return
      const idx = store.inventory.findIndex(i => i.id === l.inventoryId)
      if (idx < 0) return
      const nextInv = { ...store.inventory[idx] }
      fields.forEach(k => { (nextInv as any)[k] = (l.overrides as any)[k] })
      write({ ...store, inventory: store.inventory.map((i, j) => j === idx ? nextInv : i) })
    },
    [store]
  )

  return { ...store, createListingForInventory, updateListing, deleteListing, pushOverridesToInventory }
}

export function useEffectiveListings() {
  const { listings, inventory } = useCatalog()
  return useMemo(() => {
    return listings.map(l => {
      const inv = inventory.find(i => i.id === l.inventoryId)
      const merged: any = { ...inv, ...(l.overrides || {}) }
      return {
        ...l,
        location: l.location ?? merged?.location,
        make: l.make ?? merged?.make,
        model: l.model ?? merged?.model,
        year: l.year ?? merged?.year,
        bedrooms: merged?.bedrooms,
        bathrooms: merged?.bathrooms,
        dimensions: merged?.dimensions,
        sleeps: merged?.sleeps,
        slides: merged?.slides,
        media: merged?.media,
      }
    })
  }, [listings, inventory])
}

// convenience selectors to keep older imports working
export function useInventory() {
  const { inventory } = useCatalog()
  return inventory
}
export function useListings() {
  const { listings } = useCatalog()
  return listings
}

export function averagePrice(list: Array<{ salePrice?: number; rentPrice?: number }>) {
  const arr = list.map(l => l.salePrice ?? l.rentPrice ?? 0).filter(v => v > 0)
  if (!arr.length) return 0
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
}