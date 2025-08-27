import { useState, useEffect, useCallback } from 'react'
import { Contact, Note } from '@/types'
import contactsMock from '@/mocks/contactsMock'
import { useAuth } from '@/contexts/AuthContext'

export function useContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchContacts = useCallback(() => {
    setLoading(true)
    try {
      const fetchedContacts = contactsMock.getContacts()
      setContacts(fetchedContacts)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch contacts:', err)
      setError('Failed to load contacts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const getContactById = useCallback((id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id)
  }, [contacts])

  const createContact = useCallback((newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Contact | undefined => {
    try {
      const createdContact = contactsMock.createContact(newContact)
      setContacts(prev => [...prev, createdContact])
      setError(null)
      return createdContact
    } catch (err) {
      console.error('Failed to create contact:', err)
      setError('Failed to create contact.')
      return undefined
    }
  }, [])

  const updateContact = useCallback((id: string, updates: Partial<Contact>): Contact | undefined => {
    try {
      const updatedContact = contactsMock.updateContact(id, updates)
      if (updatedContact) {
        setContacts(prev => prev.map(con => con.id === id ? updatedContact : con))
        setError(null)
        return updatedContact
      }
      setError('Contact not found for update.')
      return undefined
    } catch (err) {
      console.error('Failed to update contact:', err)
      setError('Failed to update contact.')
      return undefined
    }
  }, [])

  const deleteContact = useCallback((id: string): boolean => {
    try {
      const success = contactsMock.deleteContact(id)
      if (success) {
        setContacts(prev => prev.filter(con => con.id !== id))
        setError(null)
        return true
      }
      setError('Contact not found for deletion.')
      return false
    } catch (err) {
      console.error('Failed to delete contact:', err)
      setError('Failed to delete contact.')
      return false
    }
  }, [])

  const addNoteToContact = useCallback((contactId: string, content: string): Note | undefined => {
    const createdBy = user?.name || 'Unknown User'
    try {
      const updatedContact = contactsMock.addNoteToContact(contactId, content, createdBy)
      if (updatedContact) {
        setContacts(prev => prev.map(con => con.id === contactId ? updatedContact : con))
        setError(null)
        return updatedContact.notes[updatedContact.notes.length - 1]
      }
      setError('Contact not found to add note.')
      return undefined
    } catch (err) {
      console.error('Failed to add note to contact:', err)
      setError('Failed to add note.')
      return undefined
    }
  }, [user])

  const updateNoteInContact = useCallback((contactId: string, noteId: string, newContent: string): Note | undefined => {
    try {
      const updatedContact = contactsMock.updateNoteInContact(contactId, noteId, newContent)
      if (updatedContact) {
        setContacts(prev => prev.map(con => con.id === contactId ? updatedContact : con))
        setError(null)
        return updatedContact.notes.find(note => note.id === noteId)
      }
      setError('Contact or note not found for update.')
      return undefined
    } catch (err) {
      console.error('Failed to update note in contact:', err)
      setError('Failed to update note.')
      return undefined
    }
  }, [])

  const deleteNoteFromContact = useCallback((contactId: string, noteId: string): boolean => {
    try {
      const updatedContact = contactsMock.deleteNoteFromContact(contactId, noteId)
      if (updatedContact) {
        setContacts(prev => prev.map(con => con.id === contactId ? updatedContact : con))
        setError(null)
        return true
      }
      setError('Contact or note not found for deletion.')
      return false
    } catch (err) {
      console.error('Failed to delete note from contact:', err)
      setError('Failed to delete note.')
      return false
    }
  }, [])

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    addNoteToContact,
    updateNoteInContact,
    deleteNoteFromContact
  }
}