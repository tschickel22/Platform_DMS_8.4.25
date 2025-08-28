import { useState, useEffect, useMemo } from 'react'
import type { Contact, Account } from '@/types'
import { mockAccounts } from '@/mocks/accountsMock'
import { mockContacts } from '@/mocks/contactsMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

const LS_KEY = 'renter-insight-contacts'

export function useContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load contacts on mount
  useEffect(() => {
    try {
      const saved = loadFromLocalStorage<Contact[]>(LS_KEY, [])
      if (saved && saved.length) {
        setContacts(saved)
      } else {
        setContacts(mockContacts.sampleContacts)
        saveToLocalStorage(LS_KEY, mockContacts.sampleContacts)
      }
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError('Failed to load contacts')
      setContacts(mockContacts.sampleContacts)
    } finally {
      setLoading(false)
    }
  }, [])

  // Persist on change
  useEffect(() => {
    try {
      saveToLocalStorage(LS_KEY, contacts)
    } catch (err) {
      console.error('Error saving contacts:', err)
    }
  }, [contacts])

  // Metrics
  const metrics = useMemo(() => {
    const totalContacts = contacts.length
    const assignedContacts = contacts.filter(c => !!c.accountId).length
    const unassignedContacts = totalContacts - assignedContacts

    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = contacts.filter(c => new Date(c.createdAt) >= thisMonth).length

    const contactsByDepartment = contacts.reduce<Record<string, number>>((acc, c) => {
      const k = c.department || 'Unspecified'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})

    const contactsByTitle = contacts.reduce<Record<string, number>>((acc, c) => {
      const k = c.title || 'Unspecified'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})

    return {
      totalContacts,
      assignedContacts,
      unassignedContacts,
      newThisMonth,
      contactsByDepartment,
      contactsByTitle,
    }
  }, [contacts])

  // Queries
  const getContactById = (id: string): Contact | null =>
    contacts.find(c => c.id === id) || null

  const getContact = (id: string): Contact | null => getContactById(id)

  const getContactsByAccount = (accountId: string): Contact[] =>
    contacts.filter(c => c.accountId === accountId)

  const getAccountForContact = (contact: Contact): Account | undefined =>
    mockAccounts.sampleAccounts.find(a => a.id === contact.accountId)

  // Mutations
  const createContact = async (data: Partial<Contact>): Promise<Contact> => {
    setLoading(true)
    try {
      const newContact: Contact = {
        id: `cont-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        accountId: data.accountId ?? null,
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        title: data.title ?? '',
        department: data.department ?? '',
        notes: data.notes ?? '',
        tags: data.tags ?? [],
        customFields: data.customFields ?? {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user',
        updatedBy: 'current-user',
      }
      setContacts(prev => [newContact, ...prev])
      return newContact
    } finally {
      setLoading(false)
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
    const idx = contacts.findIndex(c => c.id === id)
    if (idx === -1) return null

    const updated: Contact = {
      ...contacts[idx],
      ...updates,
      updatedAt: new Date(),
    }

    const next = [...contacts]
    next[idx] = updated
    setContacts(next)
    return updated
  }

  const deleteContact = async (id: string): Promise<void> => {
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  // Filtering helpers
  const filterContacts = (filters: {
    accountId?: string
    department?: string
    title?: string
    tags?: string[]
    searchTerm?: string
    hasAccount?: boolean
  }): Contact[] => {
    return contacts.filter(c => {
      if (filters.accountId && c.accountId !== filters.accountId) return false
      if (filters.department && c.department !== filters.department) return false
      if (filters.title && c.title !== filters.title) return false
      if (typeof filters.hasAccount === 'boolean') {
        if (!!c.accountId !== filters.hasAccount) return false
      }
      if (filters.tags?.length) {
        const has = filters.tags.some(t => c.tags.includes(t))
        if (!has) return false
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase()
        const matches =
          fullName.includes(term) ||
          (c.email ?? '').toLowerCase().includes(term) ||
          (c.phone ?? '').includes(term) ||
          (c.title ?? '').toLowerCase().includes(term) ||
          (c.department ?? '').toLowerCase().includes(term) ||
          c.tags.some(t => t.toLowerCase().includes(term))
        if (!matches) return false
      }
      return true
    })
  }

  const getAllTags = (): string[] =>
    [...new Set(contacts.flatMap(c => c.tags))].sort()

  const getAllDepartments = (): string[] =>
    [...new Set(contacts.map(c => c.department).filter(Boolean) as string[])].sort()

  const getAllTitles = (): string[] =>
    [...new Set(contacts.map(c => c.title).filter(Boolean) as string[])].sort()

  return {
    contacts,
    loading,
    error,
    metrics,
    // queries
    getContactById,
    getContact,
    getContactsByAccount,
    getAccountForContact,
    // mutations
    createContact,
    updateContact,
    deleteContact,
    // filters/helpers
    filterContacts,
    getAllTags,
    getAllDepartments,
    getAllTitles,
  }
}
