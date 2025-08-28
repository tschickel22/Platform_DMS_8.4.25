import { useState, useEffect, useCallback } from 'react'
import { Contact, Note } from '@/types'
import { contactsMock } from '@/mocks/contactsMock'
import { useLocation } from 'react-router-dom'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

export function useContactManagement() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const location = useLocation()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Load contacts on mount and when tenant changes
  useEffect(() => {
    loadContacts()
  }, [tenant?.id])

  // Apply URL filters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const urlFilters: Record<string, any> = {}
    
    // Parse URL filters
    if (searchParams.get('filter') === 'recent') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      urlFilters.createdAfter = thirtyDaysAgo.toISOString()
    }
    
    if (searchParams.get('accountId')) {
      urlFilters.accountId = searchParams.get('accountId')
    }
    
    if (searchParams.get('hasAccount')) {
      urlFilters.hasAccount = searchParams.get('hasAccount') === 'true'
    }
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters)
    }
  }, [location.search])

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const contactsData = contactsMock.getContacts(tenant?.id)
      setContacts(contactsData)
    } catch (err) {
      console.error('Failed to load contacts:', err)
      setError('Failed to load contacts')
      toast({
        title: 'Error',
        description: 'Failed to load contacts. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [tenant?.id, toast])

  // Apply filters to contacts
  const filteredContacts = useCallback(() => {
    let filtered = [...contacts]
    
    if (filters.createdAfter) {
      const filterDate = new Date(filters.createdAfter)
      filtered = filtered.filter(contact => new Date(contact.createdAt) > filterDate)
    }
    
    if (filters.accountId) {
      filtered = filtered.filter(contact => contact.accountId === filters.accountId)
    }
    
    if (filters.hasAccount !== undefined) {
      filtered = filtered.filter(contact => 
        filters.hasAccount ? !!contact.accountId : !contact.accountId
      )
    }
    
    return filtered
  }, [contacts, filters])

  const getContact = useCallback((id: string): Contact | null => {
    try {
      return contactsMock.getContact(id, tenant?.id)
    } catch (error) {
      console.error('Error getting contact:', error)
      return null
    }
  }, [tenant?.id])

  const createContact = useCallback(async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Promise<Contact> => {
    try {
      setLoading(true)
      const newContact = contactsMock.createContact(contactData, tenant?.id)
      setContacts(prev => [newContact, ...prev])
      return newContact
    } catch (error) {
      console.error('Error creating contact:', error)
      throw new Error('Failed to create contact')
    } finally {
      setLoading(false)
    }
  }, [tenant?.id])

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
    try {
      setLoading(true)
      const updatedContact = contactsMock.updateContact(id, updates, tenant?.id)
      if (updatedContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === id ? updatedContact : contact
        ))
      }
      return updatedContact
    } catch (error) {
      console.error('Error updating contact:', error)
      throw new Error('Failed to update contact')
    } finally {
      setLoading(false)
    }
  }, [tenant?.id])

  const deleteContact = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      const success = contactsMock.deleteContact(id, tenant?.id)
      if (success) {
        setContacts(prev => prev.filter(contact => contact.id !== id))
      } else {
        throw new Error('Contact not found')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw new Error('Failed to delete contact')
    } finally {
      setLoading(false)
    }
  }, [tenant?.id])

  // Note management functions
  const addNoteToContact = useCallback(async (contactId: string, noteContent: string, createdBy: string): Promise<Contact | null> => {
    try {
      const updatedContact = contactsMock.addNoteToContact(contactId, noteContent, createdBy, tenant?.id)
      if (updatedContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId ? updatedContact : contact
        ))
      }
      return updatedContact
    } catch (error) {
      console.error('Error adding note to contact:', error)
      throw new Error('Failed to add note')
    }
  }, [tenant?.id])

  const updateNoteInContact = useCallback(async (contactId: string, noteId: string, newContent: string, updatedBy: string): Promise<Contact | null> => {
    try {
      const updatedContact = contactsMock.updateNoteInContact(contactId, noteId, newContent, updatedBy, tenant?.id)
      if (updatedContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId ? updatedContact : contact
        ))
      }
      return updatedContact
    } catch (error) {
      console.error('Error updating note in contact:', error)
      throw new Error('Failed to update note')
    }
  }, [tenant?.id])

  const deleteNoteFromContact = useCallback(async (contactId: string, noteId: string): Promise<Contact | null> => {
    try {
      const updatedContact = contactsMock.deleteNoteFromContact(contactId, noteId, tenant?.id)
      if (updatedContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId ? updatedContact : contact
        ))
      }
      return updatedContact
    } catch (err) {
      console.error('Error updating contact note:', err)
      setError('Failed to update note')
      return null
    }
  }, [tenant?.id])

  const searchContacts = useCallback((query: string) => {
    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    )
  }, [contacts])

  const getContactsByAccount = useCallback((accountId: string) => {
    return contacts.filter(contact => contact.accountId === accountId)
  }, [contacts])

  const getContactsByTag = useCallback((tag: string) => {
    return contacts.filter(contact => contact.tags?.includes(tag))
  }, [contacts])

  const bulkImport = useCallback(async (importData: any[]): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const tenantId = tenant?.id
      const existingContacts = contactsMock.getContacts(tenantId)
      
      // Process each import item
      const newContacts = importData.map(item => ({
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.email || '',
        phone: item.phone || '',
        accountId: item.accountId || undefined,
        title: item.title || '',
        department: item.department || '',
        preferredContactMethod: item.preferredContactMethod || 'email',
        tags: Array.isArray(item.tags) ? item.tags : 
              typeof item.tags === 'string' ? item.tags.split(';').filter(Boolean) : [],
        ownerId: 'user-1' // Default to current user
      }))
      
      // Create contacts in batch
      for (const contactData of newContacts) {
        contactsMock.createContact(contactData, tenantId)
      }
      
      // Refresh the contacts list
      const updatedContacts = contactsMock.getContacts(tenantId)
      setContacts(updatedContacts)
      
    } catch (err) {
      console.error('Bulk import error:', err)
      setError('Failed to import contacts')
      throw err
    } finally {
      setLoading(false)
    }
  }, [tenant?.id])

  return {
    contacts: filteredContacts(),
    allContacts: contacts,
    loading,
    error,
    filters,
    setFilters,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    addNoteToContact,
    updateNoteInContact,
    deleteNoteFromContact,
    searchContacts,
    getContactsByAccount,
    getContactsByTag,
    refreshContacts: loadContacts,
    bulkImport
  }
}