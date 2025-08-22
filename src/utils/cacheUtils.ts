/**
 * Cache management utilities for clearing preview data
 */

export function clearListingPreviewCache(): void {
  try {
    // Clear all website builder preview cache
    const keysToRemove: string[] = []
    
    // Iterate through localStorage to find preview-related keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('wb2:preview:') ||
        key.startsWith('wb2:sites') ||
        key.startsWith('ri_catalog_v1') ||
        key.startsWith('renter-insight-') ||
        key.includes('listing') ||
        key.includes('property') ||
        key.includes('catalog')
      )) {
        keysToRemove.push(key)
      }
    }
    
    // Remove all identified cache keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`Cleared cache key: ${key}`)
    })
    
    // Clear sessionStorage preview data
    const sessionKeysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (
        key.startsWith('wb2:preview:') ||
        key.includes('listing') ||
        key.includes('property')
      )) {
        sessionKeysToRemove.push(key)
      }
    }
    
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key)
      console.log(`Cleared session cache key: ${key}`)
    })
    
    console.log(`Cache cleared: ${keysToRemove.length} localStorage keys, ${sessionKeysToRemove.length} sessionStorage keys`)
    
  } catch (error) {
    console.error('Failed to clear cache:', error)
  }
}

export function clearAllPreviewCache(): void {
  try {
    // Clear all preview-related data
    localStorage.clear()
    sessionStorage.clear()
    console.log('All cache cleared')
  } catch (error) {
    console.error('Failed to clear all cache:', error)
  }
}

export function refreshPageData(): void {
  // Force a page reload to ensure fresh data
  window.location.reload()
}