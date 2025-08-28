import { useState, useEffect, useMemo } from 'react'
import { Account, AccountType } from '@/types/index'
import { mockAccounts } from '@/mocks/accountsMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useAccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load accounts from localStorage on mount
  useEffect(() => {
    try {
      const savedAccounts = loadFromLocalStorage<Account[]>('renter-insight-accounts', [])
      if (savedAccounts.length > 0) {
        setAccounts(savedAccounts)
      } else {
        // Use mock data if no saved data exists
        setAccounts(mockAccounts.sampleAccounts)
        saveToLocalStorage('renter-insight-accounts', mockAccounts.sampleAccounts)
      }
    } catch (err) {
      console.error('Error loading accounts:', err)
      setError('Failed to load accounts')
      setAccounts(mockAccounts.sampleAccounts)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    if (accounts.length > 0) {
      saveToLocalStorage('renter-insight-accounts', accounts)
    }
  }, [accounts])

  // Calculate account metrics
  const metrics = useMemo(() => {
    const totalAccounts = accounts.length
    const customerAccounts = accounts.filter(acc => acc.type === AccountType.CUSTOMER).length
    const prospectAccounts = accounts.filter(acc => acc.type === AccountType.PROSPECT).length
    const vendorAccounts = accounts.filter(acc => acc.type === AccountType.VENDOR).length
    const partnerAccounts = accounts.filter(acc => acc.type === AccountType.PARTNER).length

    // Calculate new accounts this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = accounts.filter(acc => new Date(acc.createdAt) >= thisMonth).length

    // Calculate accounts by industry
    const accountsByIndustry = accounts.reduce((acc, account) => {
      const industry = account.industry || 'Unspecified'
      acc[industry] = (acc[industry] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalAccounts,
      customerAccounts,
      prospectAccounts,
      vendorAccounts,
      partnerAccounts,
      newThisMonth,
      accountsByIndustry
    }
  }, [accounts])

  // Create a new account
  const getAccounts = (): Account[] => {
    return loadFromLocalStorage('accounts', mockAccounts.sampleAccounts)
  }

  const createAccount = async (accountData: Partial<Account>): Promise<Account> => {
    setLoading(true)
    try {
      const newAccount: Account = {
        id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: accountData.name || '',
        type: accountData.type || AccountType.PROSPECT,
        industry: accountData.industry || '',
        website: accountData.website || '',
        phone: accountData.phone || '',
        email: accountData.email || '',
        address: accountData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        notes: accountData.notes || '',
        tags: accountData.tags || [],
        customFields: accountData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user', // TODO: Get from auth context
        updatedBy: 'current-user'
      }

      setAccounts(prev => [newAccount, ...prev])
      return newAccount
    } finally {
      setLoading(false)
    }
  }

  // Update an existing account
  const updateAccount = async (accountId: string, updates: Partial<Account>): Promise<Account | null> => {
    const existingAccount = accounts.find(acc => acc.id === accountId)
    if (!existingAccount) return null

    const updatedAccount = {
      ...existingAccount,
      ...updates,
      updatedAt: new Date(),
      updatedBy: 'current-user' // TODO: Get from auth context
    }

    setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc))
    return updatedAccount
  }

  // Delete an account
  const deleteAccount = async (accountId: string): Promise<void> => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId))
  }

  // Get account by ID
  const getAccount = (accountId: string): Account | null => {
    return accounts.find(acc => acc.id === accountId) || null
  }

  // Filter functions
  const filterAccounts = (filters: {
    type?: AccountType
    industry?: string
    tags?: string[]
    searchTerm?: string
  }) => {
    return accounts.filter(account => {
      if (filters.type && account.type !== filters.type) return false
      if (filters.industry && account.industry !== filters.industry) return false
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => account.tags.includes(tag))
        if (!hasMatchingTag) return false
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        const matchesSearch = 
          account.name.toLowerCase().includes(term) ||
          account.email?.toLowerCase().includes(term) ||
          account.phone?.includes(term) ||
          account.industry?.toLowerCase().includes(term) ||
          account.tags.some(tag => tag.toLowerCase().includes(term))
        if (!matchesSearch) return false
      }
      return true
    })
  }

  // Get accounts by type
  const getAccountsByType = (type: AccountType) => {
    return accounts.filter(account => account.type === type)
  }

  // Get all unique tags
  const getAllTags = () => {
    const allTags = accounts.flatMap(account => account.tags)
    return [...new Set(allTags)].sort()
  }

  // Get all unique industries
  const getAllIndustries = () => {
    const allIndustries = accounts.map(account => account.industry).filter(Boolean)
    return [...new Set(allIndustries)].sort()
  }

  return {
    accounts,
    loading,
    error,
    metrics,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    filterAccounts,
    getAccountsByType,
    getAllTags,
    getAllIndustries
  }
}