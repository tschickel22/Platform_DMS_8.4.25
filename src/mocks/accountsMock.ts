import { Account, Note } from '@/types'
import { generateId } from '@/lib/utils'

const sampleAccounts: Account[] = [
  {
    id: 'acc-001',
    name: 'RV World Inc.',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 111-2222',
    email: 'info@rvworld.com',
    website: 'www.rvworld.com',
    industry: 'RV Dealership',
    notes: [
      { 
        id: generateId(), 
        content: 'Initial contact made via website form.', 
        createdAt: '2024-07-01T10:00:00Z', 
        createdBy: 'Admin User' 
      },
      { 
        id: generateId(), 
        content: 'Follow-up call scheduled for next week.', 
        createdAt: '2024-07-02T14:30:00Z', 
        createdBy: 'Admin User' 
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
    notes: [
      { 
        id: generateId(), 
        content: 'Client interested in bulk purchase of land-home packages.', 
        createdAt: '2024-06-20T09:00:00Z', 
        createdBy: 'Admin User' 
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
    notes: [],
    createdAt: '2024-05-10T13:00:00Z',
    updatedAt: '2024-05-10T13:00:00Z'
  },
  {
    id: 'acc-004',
    name: 'Sunshine RV Center',
    address: '321 Highway 1, Coastal City, FL',
    phone: '(555) 777-8888',
    email: 'info@sunshinerv.com',
    website: 'www.sunshinerv.com',
    industry: 'RV Dealership',
    notes: [
      { 
        id: generateId(), 
        content: 'Large dealership with multiple locations.', 
        createdAt: '2024-01-15T10:00:00Z', 
        createdBy: 'Admin User' 
      }
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'acc-005',
    name: 'Premier Mobile Homes',
    address: '654 Industrial Blvd, Manufacturing City, TX',
    phone: '(555) 999-0000',
    email: 'sales@premiermh.com',
    website: 'www.premiermh.com',
    industry: 'Manufactured Home Dealer',
    notes: [],
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-05T12:00:00Z'
  }
]

export const accountsMock = {
  getAccounts: (): Account[] => {
    console.log('accountsMock.getAccounts() called')
    try {
      const stored = localStorage.getItem('mockAccounts')
      console.log('Stored accounts data:', stored)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('Parsed accounts:', parsed)
        // If stored data is empty or invalid, use sample data
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Returning stored accounts:', parsed.length)
          return parsed
        }
      }
      // Initialize with sample data and save to localStorage
      console.log('Initializing with sample accounts:', sampleAccounts.length)
      localStorage.setItem('mockAccounts', JSON.stringify(sampleAccounts))
      return sampleAccounts
    } catch (error) {
      console.error('Error loading accounts from localStorage:', error)
      // Fallback to sample data and try to save it
      try {
        console.log('Fallback: saving sample accounts to localStorage')
        localStorage.setItem('mockAccounts', JSON.stringify(sampleAccounts))
      } catch (saveError) {
        console.error('Error saving sample accounts:', saveError)
      }
      return sampleAccounts
    }
  },

  getAccount: (id: string): Account | undefined => {
    const accounts = accountsMock.getAccounts()
    return accounts.find(account => account.id === id)
  },

  createAccount: (newAccount: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Account => {
    const accounts = accountsMock.getAccounts()
    const account: Account = {
      id: generateId(),
      ...newAccount,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    accounts.push(account)
    localStorage.setItem('mockAccounts', JSON.stringify(accounts))
    return account
  },

  updateAccount: (id: string, updates: Partial<Account>): Account | undefined => {
    let accounts = accountsMock.getAccounts()
    const index = accounts.findIndex(account => account.id === id)
    if (index === -1) return undefined

    const updatedAccount = {
      ...accounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    accounts[index] = updatedAccount
    localStorage.setItem('mockAccounts', JSON.stringify(accounts))
    return updatedAccount
  },

  deleteAccount: (id: string): boolean => {
    let accounts = accountsMock.getAccounts()
    const initialLength = accounts.length
    accounts = accounts.filter(account => account.id !== id)
    localStorage.setItem('mockAccounts', JSON.stringify(accounts))
    return accounts.length < initialLength
  },

  addNoteToAccount: (accountId: string, noteContent: string, createdBy: string): Account | undefined => {
    const account = accountsMock.getAccount(accountId)
    if (!account) return undefined

    const newNote: Note = {
      id: generateId(),
      content: noteContent,
      createdAt: new Date().toISOString(),
      createdBy: createdBy
    }
    const updatedNotes = [...account.notes, newNote]
    return accountsMock.updateAccount(accountId, { notes: updatedNotes })
  },

  updateNoteInAccount: (accountId: string, noteId: string, newContent: string): Account | undefined => {
    const account = accountsMock.getAccount(accountId)
    if (!account) return undefined

    const updatedNotes = account.notes.map(note =>
      note.id === noteId ? { ...note, content: newContent } : note
    )
    return accountsMock.updateAccount(accountId, { notes: updatedNotes })
  },

  deleteNoteFromAccount: (accountId: string, noteId: string): Account | undefined => {
    const account = accountsMock.getAccount(accountId)
    if (!account) return undefined

    const updatedNotes = account.notes.filter(note => note.id !== noteId)
    return accountsMock.updateAccount(accountId, { notes: updatedNotes })
  }
}

export default accountsMock