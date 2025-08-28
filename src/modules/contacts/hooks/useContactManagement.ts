import { useState, useEffect, useMemo } from 'react'
import { Contact } from '@/types/index'
import { mockContacts } from '@/mocks/contactsMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load contacts from localStorage on mount
  useEffect(() => {
    try {
      const savedContacts = loadFromLocalStorage<Contact[]>('renter-insight-contacts', [])
      if (savedContacts.length > 0) {
        setContacts(savedContacts)
      } else {
        // Use mock data if no saved data exists
        setContacts(mockContacts.sampleContacts)
        saveToLocalStorage('renter-insight-contacts', mockContacts.sampleContacts)
      }
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError('Failed to load contacts')
      setContacts(mockContacts.sampleContacts)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      saveToLocalStorage('renter-insight-contacts', contacts)
    }
  }, [contacts])

  // Calculate contact metrics
  const metrics = useMemo(() => {
    const totalContacts = contacts.length
    const assignedContacts = contacts.filter(contact => contact.accountId).length
    const unassignedContacts = contacts.filter(contact => !contact.accountId).length

    // Calculate new contacts this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = contacts.filter(contact => new Date(contact.createdAt) >= thisMonth).length

    // Calculate contacts by department
    const contactsByDepartment = contacts.reduce((acc, contact) => {
      const dept = contact.department || 'Unspecified'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate contacts by title
    const contactsByTitle = contacts.reduce((acc, contact) => {
      const title = contact.title || 'Unspecified'
      acc[title] = (acc[title] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalContacts,
      assignedContacts,
      unassignedContacts,
      newThisMonth,
      contactsByDepartment,
      contactsByTitle
    }
  }, [contacts])

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id) || null
  }

  // Create a new contact
  const createContact = async (contactData: Partial<Contact>): Promise<Contact> => {
    setLoading(true)
    try {
      const newContact: Contact = {
        id: `cont-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        accountId: contactData.accountId || null,
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        email: contactData.email || '',
        phone: contactData.phone || '',
        title: contactData.title || '',
        department: contactData.department || '',
        notes: contactData.notes || '',
        tags: contactData.tags || [],
        customFields: contactData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user', // TODO: Get from auth context
        updatedBy: 'current-user'
      }

      setContacts(prev => [newContact, ...prev])
      return newContact
    } finally {
      setLoading(false)
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
    const contactIndex = contacts.findIndex(contact => contact.id === id)
    if (contactIndex === -1) return null

    const updatedContact = {
      ...contacts[contactIndex],
      ...updates,
      updatedAt: new Date()
    }

    const newContacts = [...contacts]
    newContacts[contactIndex] = updatedContact
    setContacts(newContacts)

    return updatedContact
  }

  // Delete a contact
  const deleteContact = async (contactId: string): Promise<void> => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId))
  }

  // Get contact by ID
  const getContact = (contactId: string): Contact | null => {
    return contacts.find(contact => contact.id === contactId) || null
  }

  // Get contacts by account ID
  const getContactsByAccount = (accountId: string): Contact[] => {
    return contacts.filter(contact => contact.accountId === accountId)
  }

  // Filter functions
  const filterContacts = (filters: {
    accountId?: string
    department?: string
    title?: string
    tags?: string[]
    searchTerm?: string
    hasAccount?: boolean
  }) => {
    return contacts.filter(contact => {
      if (filters.accountId && contact.accountId !== filters.accountId) return false
      if (filters.department && contact.department !== filters.department) return false
      if (filters.title && contact.title !== filters.title) return false
      if (filters.hasAccount !== undefined) {
        const hasAccount = !!contact.accountId
        if (hasAccount !== filters.hasAccount) return false
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => contact.tags.includes(tag))
        if (!hasMatchingTag) return false
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
        const matchesSearch = 
          fullName.includes(term) ||
          contact.email?.toLowerCase().includes(term) ||
          contact.phone?.includes(term) ||
          contact.title?.toLowerCase().includes(term) ||
          contact.department?.toLowerCase().includes(term) ||
          contact.tags.some(tag => tag.toLowerCase().includes(term))
        if (!matchesSearch) return false
      }
      return true
    })
  }

  // Get all unique tags
  const getAllTags = () => {
    const allTags = contacts.flatMap(contact => contact.tags)
    return [...new Set(allTags)].sort()
  }

  // Get all unique departments
  const getAllDepartments = () => {
    const allDepartments = contacts.map(contact => contact.department).filter(Boolean)
    return [...new Set(allDepartments)].sort()
  }

  // Get all unique titles
  const getAllTitles = () => {
    const allTitles = contacts.map(contact => contact.title).filter(Boolean)
    return [...new Set(allTitles)].sort()
  }

  return {
    contacts,
    loading,
    error,
    metrics,
    getContactById,
    getContactsByAccount,
    createContact,
    updateContact,
    deleteContact,
    getContact,
    getContactsByAccount,
    filterContacts,
    getAllTags,
    getAllDepartments,
    getAllTitles
  }
}