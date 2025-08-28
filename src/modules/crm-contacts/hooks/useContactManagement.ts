import { useState, useEffect, useCallback } from 'react'
import { Contact, Note } from '@/types'
import { contactsMock } from '@/mocks/contactsMock'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

export function useContactManagement() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load contacts on mount and when tenant changes
  useEffect(() => {
    loadContacts()
  }, [tenant?.id])

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
    } catch (error) {
      console.error('Error deleting note from contact:', error)
      throw new Error('Failed to delete note')
    }
  }, [tenant?.id])

  // Search and filter functions
  const searchContacts = useCallback((searchTerm: string): Contact[] => {
    if (!searchTerm.trim()) return contacts
    
    const term = searchTerm.toLowerCase()
    return contacts.filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
      const email = contact.email?.toLowerCase() || ''
      const phone = contact.phone?.toLowerCase() || ''
      
      return fullName.includes(term) || 
             email.includes(term) || 
             phone.includes(term)
    })
  }, [contacts])

  const getContactsByAccount = useCallback((accountId: string): Contact[] => {
    return contacts.filter(contact => contact.accountId === accountId)
  }, [contacts])

  const getContactsByTag = useCallback((tag: string): Contact[] => {
    return contacts.filter(contact => 
      contact.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    )
  }, [contacts])

  return {
    contacts,
    loading,
    error,
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
    refreshContacts: loadContacts
  }
}