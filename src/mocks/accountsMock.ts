import { Account, Note } from '@/types'
import { generateId } from '@/lib/utils'
import { useTenant } from '@/contexts/TenantContext'

// Generate tenant-specific storage key
const getStorageKey = (tenantId?: string) => {
  return `mockAccounts_${tenantId || 'default'}`
}

const generateSampleAccounts = (): Account[] => [
  {
    id: 'acc-001',
    name: 'RV World Inc.',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 111-2222',
    email: 'info@rvworld.com',
    website: 'www.rvworld.com',
    industry: 'RV Dealership',
    status: 'Active',
    ownerId: 'user-1',
    tags: ['Dealer', 'High Volume'],
    notes: [
      { 
        id: generateId(), 
        content: 'Initial contact made via website form.', 
        createdAt: '2024-07-01T10:00:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-07-01T10:00:00Z'
      },
      { 
        id: generateId(), 
        content: 'Follow-up call scheduled for next week.', 
        createdAt: '2024-07-02T14:30:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-07-02T14:30:00Z'
      }
    ],
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2024-07-02T14:30:00Z'
  },
  {
    id: 'acc-002',
    name: 'Mobile Home Solutions',
    address: '456 Oak Ave, Smallville, USA',
    phone: '(555) 333-4444',
    email: 'sales@mhsolutions.com',
    website: 'www.mhsolutions.com',
    industry: 'Manufactured Home Dealer',
    status: 'Active',
    ownerId: 'user-2',
    tags: ['MH Specialist'],
    notes: [
      { 
        id: generateId(), 
        content: 'Client interested in bulk purchase of land-home packages.', 
        createdAt: '2024-06-20T09:00:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-06-20T09:00:00Z'
      }
    ],
    createdAt: '2024-06-15T11:00:00Z',
    updatedAt: '2024-06-20T09:00:00Z'
  },
  {
    id: 'acc-003',
    name: 'Adventure RV Rentals',
    address: '789 Pine Ln, Big City, USA',
    phone: '(555) 555-6666',
    email: 'rentals@adventurerv.com',
    website: 'www.adventurerv.com',
    industry: 'RV Rental',
    status: 'Active',
    ownerId: 'user-1',
    tags: ['Rental', 'Fleet'],
    notes: [],
    createdAt: '2024-05-10T13:00:00Z',
    updatedAt: '2024-05-10T13:00:00Z'
  },
  {
    id: 'acc-004',
    name: 'Sunset Mobile Home Community',
    address: '321 Community Dr, Riverside, CA',
    phone: '(555) 777-8888',
    email: 'manager@sunsetmhc.com',
    website: 'www.sunsetmhc.com',
    industry: 'Mobile Home Park',
    status: 'Active',
    ownerId: 'user-2',
    tags: ['Community', 'Property Management'],
    notes: [
      { 
        id: generateId(), 
        content: 'Large community with 200+ lots, interested in bulk home purchases.', 
        createdAt: '2024-06-01T15:30:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-06-01T15:30:00Z'
      }
    ],
    createdAt: '2024-06-01T15:00:00Z',
    updatedAt: '2024-06-01T15:30:00Z'
  }
]

export const accountsMock = {
  getAccounts: (tenantId?: string): Account[] => {
    try {
      const storageKey = getStorageKey(tenantId)
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Seed with sample data if empty
      const sampleData = generateSampleAccounts()
      localStorage.setItem(storageKey, JSON.stringify(sampleData))
      return sampleData
    } catch (error) {
      console.error('Error loading accounts from localStorage:', error)
      return generateSampleAccounts()
    }
  },

  getAccount: (id: string, tenantId?: string): Account | null => {
    try {
      const accounts = accountsMock.getAccounts(tenantId)
      return accounts.find(account => account.id === id) || null
    } catch (error) {
      console.error('Error getting account:', error)
      return null
    }
  },

  createAccount: (newAccount: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'notes'>, tenantId?: string): Account => {
    const accounts = accountsMock.getAccounts(tenantId)
    const account: Account = {
      id: generateId(),
      ...newAccount,
      tags: newAccount.tags || [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    accounts.push(account)
    localStorage.setItem(getStorageKey(tenantId), JSON.stringify(accounts))
    return account
  },

  updateAccount: (id: string, updates: Partial<Account>, tenantId?: string): Account | null => {
    try {
      let accounts = accountsMock.getAccounts(tenantId)
    const index = accounts.findIndex(account => account.id === id)
      if (index === -1) return null

    const updatedAccount = {
      ...accounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    accounts[index] = updatedAccount
      localStorage.setItem(getStorageKey(tenantId), JSON.stringify(accounts))
    return updatedAccount
    } catch (error) {
      console.error('Error updating account:', error)
      return null
    }
  },

  deleteAccount: (id: string, tenantId?: string): boolean => {
    try {
      let accounts = accountsMock.getAccounts(tenantId)
    const initialLength = accounts.length
    accounts = accounts.filter(account => account.id !== id)
      localStorage.setItem(getStorageKey(tenantId), JSON.stringify(accounts))
    return accounts.length < initialLength
    } catch (error) {
      console.error('Error deleting account:', error)
      return false
    }
  },

  addNoteToAccount: (accountId: string, noteContent: string, createdBy: string, tenantId?: string): Account | null => {
    const account = accountsMock.getAccount(accountId, tenantId)
    if (!account) return null

    const newNote: Note = {
      id: generateId(),
      content: noteContent,
      createdAt: new Date().toISOString(),
      createdBy: createdBy,
      updatedAt: new Date().toISOString(),
      updatedBy: createdBy
    }
    const updatedNotes = [...account.notes, newNote]
    return accountsMock.updateAccount(accountId, { notes: updatedNotes }, tenantId)
  },

  updateNoteInAccount: (accountId: string, noteId: string, newContent: string, updatedBy: string, tenantId?: string): Account | null => {
    const account = accountsMock.getAccount(accountId, tenantId)
    if (!account) return null

    const updatedNotes = account.notes.map(note =>
      note.id === noteId ? { 
        ...note, 
        content: newContent,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedBy
      } : note
    )
    return accountsMock.updateAccount(accountId, { notes: updatedNotes }, tenantId)
  },

  deleteNoteFromAccount: (accountId: string, noteId: string, tenantId?: string): Account | null => {
    const account = accountsMock.getAccount(accountId, tenantId)
    if (!account) return null

    const updatedNotes = account.notes.filter(note => note.id !== noteId)
    return accountsMock.updateAccount(accountId, { notes: updatedNotes }, tenantId)
  }
}

export default accountsMock