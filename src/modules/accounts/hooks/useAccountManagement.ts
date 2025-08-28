import { useEffect, useMemo, useState } from 'react'
import { Account, AccountType, Contact } from '@/types/index'
import { mockAccounts } from '@/mocks/accountsMock'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils'

const LS_KEY = 'renter-insight-accounts'

export function useAccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- load on mount
  useEffect(() => {
    try {
      const saved = loadFromLocalStorage<Account[]>(LS_KEY, [])
      if (saved && saved.length) {
        setAccounts(saved)
      } else {
        setAccounts(mockAccounts.sampleAccounts)
        saveToLocalStorage(LS_KEY, mockAccounts.sampleAccounts)
      }
    } catch (err) {
      console.error('Error loading accounts:', err)
      setError('Failed to load accounts')
      setAccounts(mockAccounts.sampleAccounts)
    } finally {
      setLoading(false)
    }
  }, [])

  // --- persist on change
  useEffect(() => {
    if (accounts.length > 0) saveToLocalStorage(LS_KEY, accounts)
  }, [accounts])

  // --- metrics
  const metrics = useMemo(() => {
    const totalAccounts = accounts.length
    const customerAccounts = accounts.filter(a => a.type === AccountType.CUSTOMER).length
    const prospectAccounts = accounts.filter(a => a.type === AccountType.PROSPECT).length
    const vendorAccounts = accounts.filter(a => a.type === AccountType.VENDOR).length
    const partnerAccounts = accounts.filter(a => a.type === AccountType.PARTNER).length

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    const newThisMonth = accounts.filter(a => new Date(a.createdAt) >= startOfMonth).length

    const accountsByIndustry = accounts.reduce<Record<string, number>>((acc, a) => {
      const key = a.industry || 'Unspecified'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return {
      totalAccounts,
      customerAccounts,
      prospectAccounts,
      vendorAccounts,
      partnerAccounts,
      newThisMonth,
      accountsByIndustry,
    }
  }, [accounts])

  // --- CRUD
  const createAccount = async (data: Partial<Account>): Promise<Account> => {
    setLoading(true)
    try {
      const newAccount: Account = {
        id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: data.name || '',
        type: data.type || AccountType.PROSPECT,
        industry: data.industry || '',
        website: data.website || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA',
        },
        notes: data.notes || '',
        tags: data.tags || [],
        customFields: data.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user',
        updatedBy: 'current-user',
      }
      setAccounts(prev => [newAccount, ...prev])
      return newAccount
    } finally {
      setLoading(false)
    }
  }

  const updateAccount = async (accountId: string, updates: Partial<Account>): Promise<Account | null> => {
    const current = accounts.find(a => a.id === accountId)
    if (!current) return null

    const updated: Account = { ...current, ...updates, updatedAt: new Date(), updatedBy: 'current-user' }
    setAccounts(prev => prev.map(a => (a.id === accountId ? updated : a)))
    return updated
  }

  const deleteAccount = async (accountId: string): Promise<void> => {
    setAccounts(prev => prev.filter(a => a.id !== accountId))
  }

  // --- getters / filters
  const getAccount = (accountId: string): Account | null =>
    accounts.find(a => a.id === accountId) || null

  // alias used by other screens
  const getAccountById = (accountId: string): Account | null => getAccount(accountId)

  const filterAccounts = (filters: {
    type?: AccountType
    industry?: string
    tags?: string[]
    searchTerm?: string
  }): Account[] =>
    accounts.filter(account => {
      if (filters.type && account.type !== filters.type) return false
      if (filters.industry && account.industry !== filters.industry) return false
      if (filters.tags?.length && !filters.tags.some(t => account.tags.includes(t))) return false

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        const match =
          account.name.toLowerCase().includes(term) ||
          account.email?.toLowerCase().includes(term) ||
          account.phone?.includes(term) ||
          account.industry?.toLowerCase().includes(term) ||
          account.tags.some(t => t.toLowerCase().includes(term))
        if (!match) return false
      }
      return true
    })

  const getAccountsByType = (type: AccountType): Account[] =>
    accounts.filter(a => a.type === type)

  const getAllTags = (): string[] => [...new Set(accounts.flatMap(a => a.tags))].sort()

  const getAllIndustries = (): string[] =>
    [...new Set(accounts.map(a => a.industry).filter(Boolean) as string[])].sort()

  // Label helper needed by AccountList
  const getAccountTypeLabel = (type: AccountType | string): string => {
    // Prefer labels from mock config if available
    const opt = mockAccounts?.accountTypes?.find((o: any) => o.value === type)
    if (opt?.label) return opt.label

    // Fallback mapping
    const fallback: Record<string, string> = {
      [AccountType.CUSTOMER]: 'Customer',
      [AccountType.PROSPECT]: 'Prospect',
      [AccountType.VENDOR]: 'Vendor',
      [AccountType.PARTNER]: 'Partner',
    }
    return fallback[type as string] || String(type)
  }

  // Placeholder until wired to contacts hook / API
  const getContactsForAccount = (_accountId: string): Contact[] => []

  return {
    // state
    accounts,
    loading,
    error,
    metrics,

    // CRUD
    createAccount,
    updateAccount,
    deleteAccount,

    // getters / filters
    getAccount,
    getAccountById,
    getContactsForAccount,
    filterAccounts,
    getAccountsByType,
    getAllTags,
    getAllIndustries,
    getAccountTypeLabel, // <-- added
  }
}
