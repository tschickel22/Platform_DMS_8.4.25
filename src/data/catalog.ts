// src/data/catalog.ts
import { useMemo, useSyncExternalStore } from 'react'

/** ---------- Types ---------- */

export type ListingType = 'manufactured_home' | 'rv'
export type ListingStatus = 'active' | 'draft' | 'inactive'

export type LatLng = { lat?: number; lng?: number }
export type Location = { city?: string; state?: string; postalCode?: string; township?: string; schoolDistrict?: string } & LatLng
export type Media = { primaryPhoto?: string }

export type InventoryBase = {
  id: string
  type: ListingType
  year?: number
  make?: string
  model?: string
  location?: Location
  media?: Media
}

export type InventoryMH = InventoryBase & {
  type: 'manufactured_home'
  bedrooms?: number
  bathrooms?: number
  dimensions?: { squareFeet?: number }
}

export type InventoryRV = InventoryBase & {
  type: 'rv'
  sleeps?: number
  dimensions?: { length?: number }
  slides?: number
}

export type InventoryItem = InventoryMH | InventoryRV

export type Listing = {
  id: string
  inventoryId: string
  listingType: ListingType
  status: ListingStatus
  salePrice?: number
  rentPrice?: number
  description?: string
  /** inventory field overrides (never contains id/type) */
  overrides?: Partial<Omit<InventoryItem, 'id' | 'type'>>
  features?: string[]
  createdAt?: string
  updatedAt?: string

  /** Hidden/export-only meta (subset of the fields you provided) */
  exportMeta?: {
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
}

export type EffectiveListing = Listing &
  (InventoryItem & {
    hasOverrides?: boolean
  })

/** ---------- Store (localStorage + useSyncExternalStore) ---------- */

const LS_KEY = 'ri_catalog_v1'

type CatalogState = {
  inventory: InventoryItem[]
  listings: Listing[]
}

let state: CatalogState = load()

const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const notify = () => {
  for (const l of Array.from(listeners)) l()
}
function getSnapshot() {
  return state
}

function setState(mutator: (s: CatalogState) => CatalogState) {
  state = mutator(state)
  save(state)
  notify()
}

function save(s: CatalogState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  } catch {}
}

function load(): CatalogState {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  // seed a tiny sample inventory; no listings
  const seeded: CatalogState = {
    inventory: [
      {
        id: 'inv-mh-1',
        type: 'manufactured_home',
        year: 2020,
        make: 'Clayton',
        model: 'Everest',
        bedrooms: 3,
        bathrooms: 2,
        dimensions: { squareFeet: 1450 },
        location: { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
        media: { primaryPhoto: 'https://picsum.photos/800/450?mh' }
      },
      {
        id: 'inv-rv-1',
        type: 'rv',
        year: 2021,
        make: 'Jayco',
        model: 'Jay Flight',
        sleeps: 6,
        slides: 1,
        dimensions: { length: 28 },
        location: { city: 'Boise', state: 'ID', lat: 43.615, lng: -116.2023 },
        media: { primaryPhoto: 'https://picsum.photos/800/450?rv' }
      }
    ],
    listings: []
  }
  save(seeded)
  return seeded
}

/** ---------- Public API ---------- */

export function useCatalog() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // CRUD are stable lambdas that never set state during render
  const createListingForInventory = (inventoryId: string, patch?: Partial<Listing>) => {
    const inv = snap.inventory.find((i) => i.id === inventoryId)
    if (!inv) throw new Error('Inventory item not found')
    const now = new Date().toISOString()
    const newListing: Listing = {
      id: `lst_${Math.random().toString(36).slice(2, 9)}`,
      inventoryId,
      listingType: inv.type,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      ...patch
    }
    setState((s) => ({ ...s, listings: [newListing, ...s.listings] }))
    return newListing
  }

  const updateListing = (listingId: string, patch: Partial<Listing>) => {
    const now = new Date().toISOString()
    setState((s) => ({
      ...s,
      listings: s.listings.map((l) =>
        l.id === listingId ? { ...l, ...patch, updatedAt: now } : l
      )
    }))
  }

  const deleteListing = (listingId: string) => {
    setState((s) => ({ ...s, listings: s.listings.filter((l) => l.id !== listingId) }))
  }

  const pushOverridesToInventory = (listingId: string, fields: Partial<Omit<InventoryItem, 'id' | 'type'>>) => {
    setState((s) => {
      const listing = s.listings.find((l) => l.id === listingId)
      if (!listing) return s
      return {
        ...s,
        inventory: s.inventory.map((i) =>
          i.id === listing.inventoryId ? ({ ...i, ...fields } as InventoryItem) : i
        )
      }
    })
  }

  return {
    inventory: snap.inventory,
    listings: snap.listings,
    createListingForInventory,
    updateListing,
    deleteListing,
    pushOverridesToInventory
  }
}

export function useEffectiveListings(): EffectiveListing[] {
  const { inventory, listings } = useCatalog()
  return useMemo(() => {
    return listings.map((l) => {
      const inv = inventory.find((i) => i.id === l.inventoryId)
      const merged = mergeInventory(inv, l.overrides)
      return { ...l, ...merged, hasOverrides: !!l.overrides }
    })
  }, [inventory, listings])
}

export function averagePrice(list: Array<{ salePrice?: number; rentPrice?: number }>) {
  const arr = list.map((l) => (l.salePrice ?? l.rentPrice ?? 0)).filter((v) => v > 0)
  if (!arr.length) return 0
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
}

/** ---------- Helpers ---------- */

function mergeInventory(inv?: InventoryItem, overrides?: Listing['overrides']): InventoryItem {
  if (!inv) return { id: 'missing', type: 'manufactured_home' } as InventoryItem
  return overrides ? (deepMerge(inv, overrides) as InventoryItem) : inv
}

function deepMerge<T extends object, P extends object>(base: T, patch: P): T & P {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base }
  for (const [k, v] of Object.entries(patch)) {
    const cur = (out as any)[k]
    if (isObj(cur) && isObj(v)) out[k] = deepMerge(cur, v as any)
    else out[k] = v
  }
  return out
}
const isObj = (x: any) => x && typeof x === 'object' && !Array.isArray(x)

/** type-only helper for createListing callsites */
export type CreateFromInventory = (
  inventoryId: string,
  patch?: Partial<Listing>
) => Listing
export const createListingForInventory: CreateFromInventory = (() => {
  throw new Error('Call useCatalog().createListingForInventory inside a component')
}) as any
