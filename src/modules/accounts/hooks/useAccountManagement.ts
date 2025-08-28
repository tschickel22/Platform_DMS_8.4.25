import { useState, useEffect } from 'react'
import { Account, AccountType } from '@/types'
import { mockAccounts } from '@/mocks/accountsMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function useAccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load accounts from localStorage on mount
  useEffect(() => {
    try {
      const savedAccounts = loadFromLocalStorage<Account[]>('accounts', mockAccounts.sampleAccounts)
      setAccounts(savedAccounts)
    } catch (err) {
      console.error('Error loading accounts:', err)
      setError('Failed to load accounts')
      setAccounts(mockAccounts.sampleAccounts)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save accounts to localStorage whenever accounts change
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage('accounts', accounts)
    }
  }, [accounts, loading])

  const createAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> => {
    try {
      const newAccount: Account = {
        ...accountData,
        id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setAccounts(prev => [newAccount, ...prev])
      
      toast({
        title: 'Success',
        description: 'Account created successfully'
      })

      return newAccount
    } catch (error) {
      console.error('Error creating account:', error)
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateAccount = async (accountId: string, updates: Partial<Account>): Promise<Account | null> => {
    try {
      const updatedAccounts = accounts.map(account =>
        account.id === accountId
          ? { ...account, ...updates, updatedAt: new Date() }
          : account
      )

      setAccounts(updatedAccounts)
      
      const updatedAccount = updatedAccounts.find(a => a.id === accountId)
      
      toast({
        title: 'Success',
        description: 'Account updated successfully'
      })

      return updatedAccount || null
    } catch (error) {
      console.error('Error updating account:', error)
      toast({
        title: 'Error',
        description: 'Failed to update account',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteAccount = async (accountId: string): Promise<void> => {
    try {
      setAccounts(prev => prev.filter(account => account.id !== accountId))
      
      toast({
        title: 'Success',
        description: 'Account deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getAccount = (accountId: string): Account | undefined => {
    return accounts.find(account => account.id === accountId)
  }

  const searchAccounts = (searchTerm: string): Account[] => {
    if (!searchTerm.trim()) return accounts
    
    const term = searchTerm.toLowerCase()
    return accounts.filter(account =>
      account.name.toLowerCase().includes(term) ||
      account.email?.toLowerCase().includes(term) ||
      account.phone?.includes(term) ||
      account.industry?.toLowerCase().includes(term) ||
      account.tags.some(tag => tag.toLowerCase().includes(term))
    )
  }

  const filterAccountsByType = (type: AccountType): Account[] => {
    return accounts.filter(account => account.type === type)
  }

  const getAccountStats = () => {
    const totalAccounts = accounts.length
    const customerAccounts = accounts.filter(acc => acc.type === AccountType.CUSTOMER).length
    const prospectAccounts = accounts.filter(acc => acc.type === AccountType.PROSPECT).length
    const vendorAccounts = accounts.filter(acc => acc.type === AccountType.VENDOR).length
    const partnerAccounts = accounts.filter(acc => acc.type === AccountType.PARTNER).length

    // Calculate new accounts this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = accounts.filter(acc => new Date(acc.createdAt) >= thisMonth).length

    return {
      totalAccounts,
      customerAccounts,
      prospectAccounts,
      vendorAccounts,
      partnerAccounts,
      newThisMonth
    }
  }

  const getAccountTypeLabel = (type: AccountType): string => {
    return mockAccounts.accountTypes.find(t => t.value === type)?.label || type
  }

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    searchAccounts,
    filterAccountsByType,
    getAccountStats,
    getAccountTypeLabel
  }
}