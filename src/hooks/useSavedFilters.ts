import { useState, useEffect, useCallback } from 'react'
import { SavedFilter } from '@/types'
import { generateId } from '@/lib/utils'

export function useSavedFilters(module: 'accounts' | 'contacts') {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const storageKey = `renter-insight-saved-filters-${module}`

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setSavedFilters(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load saved filters:', error)
    }
  }, [storageKey])

  const saveFilters = useCallback((filters: SavedFilter[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters))
      setSavedFilters(filters)
    } catch (error) {
      console.error('Failed to save filters:', error)
    }
  }, [storageKey])

  const saveFilter = useCallback((name: string, filterConfig: Record<string, any>, isDefault: boolean = false) => {
    const newFilter: SavedFilter = {
      id: generateId(),
      name,
      module,
      filters: filterConfig,
      isDefault,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    let updatedFilters = [...savedFilters, newFilter]

    // If setting as default, remove default from others
    if (isDefault) {
      updatedFilters = updatedFilters.map(filter => ({
        ...filter,
        isDefault: filter.id === newFilter.id
      }))
    }

    saveFilters(updatedFilters)
  }, [savedFilters, saveFilters, module])

  const deleteFilter = useCallback((filterId: string) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== filterId)
    saveFilters(updatedFilters)
  }, [savedFilters, saveFilters])

  const setDefaultFilter = useCallback((filterId: string) => {
    const updatedFilters = savedFilters.map(filter => ({
      ...filter,
      isDefault: filter.id === filterId
    }))
    saveFilters(updatedFilters)
  }, [savedFilters, saveFilters])

  const getDefaultFilter = useCallback(() => {
    return savedFilters.find(filter => filter.isDefault)
  }, [savedFilters])

  return {
    savedFilters,
    saveFilter,
    deleteFilter,
    setDefaultFilter,
    getDefaultFilter
  }
}