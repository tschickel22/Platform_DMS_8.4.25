import { useState, useEffect } from 'react'
import { PropertyListing, ListingTemplate, SyndicationPartner } from '../types'
import { propertyListingsService } from '../services/propertyListingsService'
import { useToast } from '@/hooks/use-toast'

export function usePropertyListings() {
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [templates, setTemplates] = useState<ListingTemplate[]>([])
  const [partners, setPartners] = useState<SyndicationPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [listingsData, templatesData, partnersData] = await Promise.all([
        propertyListingsService.getListings(),
        propertyListingsService.getTemplates(),
        propertyListingsService.getSyndicationPartners()
      ])
      
      setListings(listingsData)
      setTemplates(templatesData)
      setPartners(partnersData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createListing = async (listingData: Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newListing = await propertyListingsService.createListing(listingData)
      setListings(prev => [newListing, ...prev])
      return newListing
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create listing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const updateListing = async (id: string, updates: Partial<PropertyListing>) => {
    try {
      const updatedListing = await propertyListingsService.updateListing(id, updates)
      setListings(prev => prev.map(listing => 
        listing.id === id ? updatedListing : listing
      ))
      return updatedListing
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update listing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const deleteListing = async (id: string) => {
    try {
      await propertyListingsService.deleteListing(id)
      setListings(prev => prev.filter(listing => listing.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete listing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const duplicateListing = async (id: string) => {
    try {
      const duplicated = await propertyListingsService.duplicateListing(id)
      setListings(prev => [duplicated, ...prev])
      return duplicated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate listing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const publishListing = async (id: string) => {
    try {
      const updatedListing = await propertyListingsService.updateListing(id, {
        status: 'active',
        isPublic: true,
        publishedAt: new Date().toISOString()
      })
      
      setListings(prev => prev.map(listing => 
        listing.id === id ? updatedListing : listing
      ))
      
      toast({
        title: 'Listing Published',
        description: 'Your listing is now live and publicly visible.'
      })
      
      return updatedListing
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish listing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const unpublishListing = async (id: string) => {
    try {
      const updatedListing = await propertyListingsService.updateListing(id, {
        status: 'draft',
        isPublic: false
      })
      
      setListings(prev => prev.map(listing => 
        listing.id === id ? updatedListing : listing
      ))
      
      toast({
        title: 'Listing Unpublished',
        description: 'Your listing is no longer publicly visible.'
      })
      
      return updatedListing
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unpublish listing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const syncToPartner = async (partnerId: string, listingIds: string[]) => {
    try {
      const result = await propertyListingsService.syncToPartner(partnerId, listingIds)
      
      toast({
        title: result.success ? 'Sync Complete' : 'Sync Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      })
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync listings'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const trackView = async (listingId: string, source: string = 'direct') => {
    try {
      await propertyListingsService.trackView(listingId, source)
      
      // Update local state
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, viewCount: (listing.viewCount || 0) + 1 }
          : listing
      ))
    } catch (err) {
      console.error('Failed to track view:', err)
    }
  }

  // Filter helpers
  const getListingsByStatus = (status: string) => {
    return listings.filter(listing => listing.status === status)
  }

  const getListingsByType = (type: string) => {
    return listings.filter(listing => listing.listingType === type)
  }

  const getPublicListings = () => {
    return listings.filter(listing => listing.isPublic && listing.status === 'active')
  }

  const searchListings = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return listings.filter(listing =>
      listing.title.toLowerCase().includes(lowercaseQuery) ||
      listing.description.toLowerCase().includes(lowercaseQuery) ||
      listing.make.toLowerCase().includes(lowercaseQuery) ||
      listing.model.toLowerCase().includes(lowercaseQuery) ||
      listing.location.city.toLowerCase().includes(lowercaseQuery) ||
      listing.location.state.toLowerCase().includes(lowercaseQuery)
    )
  }

  return {
    // Data
    listings,
    templates,
    partners,
    loading,
    error,
    
    // Actions
    createListing,
    updateListing,
    deleteListing,
    duplicateListing,
    publishListing,
    unpublishListing,
    syncToPartner,
    trackView,
    
    // Helpers
    getListingsByStatus,
    getListingsByType,
    getPublicListings,
    searchListings,
    
    // Refresh
    refresh: loadData
  }
}