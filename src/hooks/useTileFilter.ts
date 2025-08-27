import { useState, useCallback } from 'react'

export type FilterValue = string | null

export interface UseTileFilterReturn {
  activeFilter: FilterValue
  setFilter: (filter: FilterValue) => void
  clearFilter: () => void
  isFilterActive: (filter: string) => boolean
}

/**
 * Reusable hook for managing tile-based filtering
 * Provides consistent state management for stat card filtering across modules
 */
export function useTileFilter(initialFilter: FilterValue = null): UseTileFilterReturn {
  const [activeFilter, setActiveFilter] = useState<FilterValue>(initialFilter)

  const setFilter = useCallback((filter: FilterValue) => {
    console.log(`TileFilter: Setting filter to "${filter}" (was "${activeFilter}")`)
    setActiveFilter(filter)
  }, [activeFilter])

  const clearFilter = useCallback(() => {
    console.log(`TileFilter: Clearing filter (was "${activeFilter}")`)
    setActiveFilter(null)
  }, [activeFilter])

  const isFilterActive = useCallback((filter: string) => {
    const isActive = activeFilter === filter
    console.log(`TileFilter: Checking if filter "${filter}" is active: ${isActive}`)
    return isActive
  }, [activeFilter])

  return {
    activeFilter,
    setFilter,
    clearFilter,
    isFilterActive
  }
}

/**
 * Helper function to create a tile click handler
 * Toggles the filter on/off when the same tile is clicked
 */
export function createTileClickHandler(
  filterId: string,
  activeFilter: FilterValue,
  setFilter: (filter: FilterValue) => void
) {
  return () => {
    if (activeFilter === filterId) {
      setFilter(null) // Clear filter if clicking the same tile
    } else {
      setFilter(filterId) // Set new filter
    }
  }
}

/**
 * Helper function to get filter display text
 */
export function getFilterDisplayText(
  filter: FilterValue,
  filterLabels: Record<string, string>
): string {
  if (!filter) return 'All'
  return filterLabels[filter] || filter
}