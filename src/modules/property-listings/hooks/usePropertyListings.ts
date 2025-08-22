import { useState, useEffect, useCallback } from 'react'
import { PropertyListing, ListingTemplate, SyndicationPartner } from '../types'
import { propertyListingsService } from '../services/propertyListingsService'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useToast } from '@/hooks/use-toast'

export function usePropertyListings() {
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [templates, setTemplates] = useState<ListingTemplate[]>([])
  const [partners, setPartners] = useState<SyndicationPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const { handleError } = useErrorHandler()
  const { toast } = useToast()

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [listingsData, templatesData, partnersData] = await Promise.all([
        propertyListingsService.getListings(),
        propertyListingsService.getTemplates(),
        propertyListingsService.getSyndicationPartners()
      ])
      
      setListings(listingsData)
      setTemplates(templatesData)
      setPartners(partnersData)
    } catch (error) {
      handleError(error, 'loading property listings data')
    } finally {
      setLoading(false)
    }
  }

  // Listings operations
  const createListing = useCallback(async (listingData: Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSaving(true)
      const newListing = await propertyListingsService.createListing(listingData)
      setListings(prev => [newListing, ...prev])
      
      toast({
        title: 'Success',
        description: 'Listing created successfully'
      })
      
      return newListing
    } catch (error) {
      handleError(error, 'creating listing')
      throw error
    } finally {
      setSaving(false)
    }
  }, [handleError, toast])

  const updateListing = useCallback(async (id: string, updates: Partial<PropertyListing>) => {
    try {
      setSaving(true)
      const updatedListing = await propertyListingsService.updateListing(id, updates)
      setListings(prev => prev.map(listing => 
        listing.id === id ? updatedListing : listing
      ))
      
      toast({
        title: 'Success',
        description: 'Listing updated successfully'
      })
      
      return updatedListing
    } catch (error) {
      handleError(error, 'updating listing')
      throw error
    } finally {
      setSaving(false)
    }
  }, [handleError, toast])

  const deleteListing = useCallback(async (id: string) => {
    try {
      await propertyListingsService.deleteListing(id)
      setListings(prev => prev.filter(listing => listing.id !== id))
      
      toast({
        title: 'Success',
        description: 'Listing deleted successfully'
      })
    } catch (error) {
      handleError(error, 'deleting listing')
      throw error
    }
  }, [handleError, toast])

  // Template operations
  const createTemplate = useCallback(async (templateData: Omit<ListingTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTemplate = await propertyListingsService.createTemplate(templateData)
      setTemplates(prev => [newTemplate, ...prev])
      
      toast({
        title: 'Success',
        description: 'Template created successfully'
      })
      
      return newTemplate
    } catch (error) {
      handleError(error, 'creating template')
      throw error
    }
  }, [handleError, toast])

  // Media operations
  const uploadMedia = useCallback(async (file: File) => {
    try {
      const result = await propertyListingsService.uploadMedia(file)
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      })
      
      return result
    } catch (error) {
      handleError(error, 'uploading image')
      throw error
    }
  }, [handleError, toast])

  // Export operations
  const exportListings = useCallback(async (partnerId: string, listingIds: string[]) => {
    try {
      const result = await propertyListingsService.exportListings(partnerId, listingIds)
      
      if (result.success) {
        toast({
          title: 'Export Successful',
          description: result.message
        })
      } else {
        toast({
          title: 'Export Failed',
          description: result.message,
          variant: 'destructive'
        })
      }
      
      return result
    } catch (error) {
      handleError(error, 'exporting listings')
      throw error
    }
  }, [handleError, toast])

  // Filtering and search
  const filterListings = useCallback((filters: {
    search?: string
    listingType?: string
    status?: string
    priceRange?: { min?: number; max?: number }
  }) => {
    return listings.filter(listing => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableText = `${listing.title} ${listing.make} ${listing.model} ${listing.description}`.toLowerCase()
        if (!searchableText.includes(searchLower)) return false
      }
      
      // Type filter
      if (filters.listingType && listing.listingType !== filters.listingType) return false
      
      // Status filter
      if (filters.status && listing.status !== filters.status) return false
      
      // Price range filter
      if (filters.priceRange) {
        const price = listing.salePrice || listing.rentPrice || 0
        if (filters.priceRange.min && price < filters.priceRange.min) return false
        if (filters.priceRange.max && price > filters.priceRange.max) return false
      }
      
      return true
    })
  }, [listings])

  return {
    // Data
    listings,
    templates,
    partners,
    loading,
    saving,
    
    // Operations
    createListing,
    updateListing,
    deleteListing,
    createTemplate,
    uploadMedia,
    exportListings,
    filterListings,
    
    // Utilities
    refresh: loadData
  }
}