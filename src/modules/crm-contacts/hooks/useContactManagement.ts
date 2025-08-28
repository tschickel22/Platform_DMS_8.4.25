import { useState, useEffect, useCallback } from 'react'
import { Contact } from '@/types'
import { contactsMock } from '@/mocks/contactsMock'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/utils/logger'

export function useContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { tenant } = useTenant()
  const { user } = useAuth()
  const { toast } = useToast()

  const tenantId = tenant?.id

  // Load contacts
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const contactsData = contactsMock.getContacts(tenantId)
      setContacts(contactsData || [])
      logger.debug('Contacts loaded', { count: contactsData?.length || 0, tenantId })
    } catch (err) {
      const errorMessage = 'Failed to load contacts'
      setError(errorMessage)
      logger.error('Error loading contacts', err, { tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [tenantId, toast])

  // Get contact by ID (null-safe)
  const getContactById = useCallback((id: string): Contact | null => {
    try {
      return contactsMock.getContact(id, tenantId)
    } catch (err) {
      logger.error('Error getting contact by ID', err, { contactId: id, tenantId })
      return null
    }
  }, [tenantId])

  // Create contact
  const createContact = useCallback(async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Promise<Contact | null> => {
    try {
      setLoading(true)
      const newContact = contactsMock.createContact(contactData, tenantId)
      await loadContacts() // Refresh list
      
      logger.userAction('contact_created', { contactId: newContact.id, tenantId })
      toast({
        title: 'Success',
        description: 'Contact created successfully'
      })
      
      return newContact
    } catch (err) {
      const errorMessage = 'Failed to create contact'
      logger.error('Error creating contact', err, { tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [tenantId, loadContacts, toast])

  // Update contact
  const updateContact = useCallback(async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
    try {
      setLoading(true)
      const updatedContact = contactsMock.updateContact(id, updates, tenantId)
      if (updatedContact) {
        await loadContacts() // Refresh list
        
        logger.userAction('contact_updated', { contactId: id, tenantId })
        toast({
          title: 'Success',
          description: 'Contact updated successfully'
        })
      }
      
      return updatedContact
    } catch (err) {
      const errorMessage = 'Failed to update contact'
      logger.error('Error updating contact', err, { contactId: id, tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [tenantId, loadContacts, toast])

  // Delete contact
  const deleteContact = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const success = contactsMock.deleteContact(id, tenantId)
      if (success) {
        await loadContacts() // Refresh list
        
        logger.userAction('contact_deleted', { contactId: id, tenantId })
        toast({
          title: 'Success',
          description: 'Contact deleted successfully'
        })
      }
      
      return success
    } catch (err) {
      const errorMessage = 'Failed to delete contact'
      logger.error('Error deleting contact', err, { contactId: id, tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [tenantId, loadContacts, toast])

  // Note management
  const addNote = useCallback(async (contactId: string, content: string): Promise<boolean> => {
    try {
      const createdBy = user?.name || 'Unknown User'
      const updatedContact = contactsMock.addNoteToContact(contactId, content, createdBy, tenantId)
      if (updatedContact) {
        await loadContacts() // Refresh to show new note
        
        logger.userAction('contact_note_added', { contactId, tenantId })
        toast({
          title: 'Success',
          description: 'Note added successfully'
        })
        return true
      }
      return false
    } catch (err) {
      logger.error('Error adding note to contact', err, { contactId, tenantId })
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive'
      })
      return false
    }
  }, [tenantId, user?.name, loadContacts, toast])

  const updateNote = useCallback(async (contactId: string, noteId: string, content: string): Promise<boolean> => {
    try {
      const updatedBy = user?.name || 'Unknown User'
      const updatedContact = contactsMock.updateNoteInContact(contactId, noteId, content, updatedBy, tenantId)
      if (updatedContact) {
        await loadContacts() // Refresh to show updated note
        
        logger.userAction('contact_note_updated', { contactId, noteId, tenantId })
        toast({
          title: 'Success',
          description: 'Note updated successfully'
        })
        return true
      }
      return false
    } catch (err) {
      logger.error('Error updating note in contact', err, { contactId, noteId, tenantId })
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive'
      })
      return false
    }
  }, [tenantId, user?.name, loadContacts, toast])

  const deleteNote = useCallback(async (contactId: string, noteId: string): Promise<boolean> => {
    try {
      const updatedContact = contactsMock.deleteNoteFromContact(contactId, noteId, tenantId)
      if (updatedContact) {
        await loadContacts() // Refresh to remove deleted note
        
        logger.userAction('contact_note_deleted', { contactId, noteId, tenantId })
        toast({
          title: 'Success',
          description: 'Note deleted successfully'
        })
        return true
      }
      return false
    } catch (err) {
      logger.error('Error deleting note from contact', err, { contactId, noteId, tenantId })
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive'
      })
      return false
    }
  }, [tenantId, loadContacts, toast])

  // Load contacts on mount and when tenant changes
  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  return {
    contacts,
    loading,
    error,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    addNote,
    updateNote,
    deleteNote,
    refresh: loadContacts
  }
}