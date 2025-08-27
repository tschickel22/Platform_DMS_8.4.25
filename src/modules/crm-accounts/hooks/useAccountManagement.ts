import { useState, useEffect, useCallback } from 'react'
import { Account, Note } from '@/types'
import accountsMock from '@/mocks/accountsMock'
import { useAuth } from '@/contexts/AuthContext'

export function useAccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchAccounts = useCallback(() => {
    setLoading(true)
    try {
      const fetchedAccounts = accountsMock.getAccounts()
      setAccounts(fetchedAccounts)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch accounts:', err)
      setError('Failed to load accounts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const getAccountById = useCallback((id: string): Account | undefined => {
    return accounts.find(account => account.id === id)
  }, [accounts])

  const createAccount = useCallback((newAccount: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Account | undefined => {
    try {
      const createdAccount = accountsMock.createAccount(newAccount)
      setAccounts(prev => [...prev, createdAccount])
      setError(null)
      return createdAccount
    } catch (err) {
      console.error('Failed to create account:', err)
      setError('Failed to create account.')
      return undefined
    }
  }, [])

  const updateAccount = useCallback((id: string, updates: Partial<Account>): Account | undefined => {
    try {
      const updatedAccount = accountsMock.updateAccount(id, updates)
      if (updatedAccount) {
        setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc))
        setError(null)
        return updatedAccount
      }
      setError('Account not found for update.')
      return undefined
    } catch (err) {
      console.error('Failed to update account:', err)
      setError('Failed to update account.')
      return undefined
    }
  }, [])

  const deleteAccount = useCallback((id: string): boolean => {
    try {
      const success = accountsMock.deleteAccount(id)
      if (success) {
        setAccounts(prev => prev.filter(acc => acc.id !== id))
        setError(null)
        return true
      }
      setError('Account not found for deletion.')
      return false
    } catch (err) {
      console.error('Failed to delete account:', err)
      setError('Failed to delete account.')
      return false
    }
  }, [])

  const addNoteToAccount = useCallback((accountId: string, content: string): Note | undefined => {
    const createdBy = user?.name || 'Unknown User'
    try {
      const updatedAccount = accountsMock.addNoteToAccount(accountId, content, createdBy)
      if (updatedAccount) {
        setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc))
        setError(null)
        return updatedAccount.notes[updatedAccount.notes.length - 1]
      }
      setError('Account not found to add note.')
      return undefined
    } catch (err) {
      console.error('Failed to add note to account:', err)
      setError('Failed to add note.')
      return undefined
    }
  }, [user])

  const updateNoteInAccount = useCallback((accountId: string, noteId: string, newContent: string): Note | undefined => {
    try {
      const updatedAccount = accountsMock.updateNoteInAccount(accountId, noteId, newContent)
      if (updatedAccount) {
        setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc))
        setError(null)
        return updatedAccount.notes.find(note => note.id === noteId)
      }
      setError('Account or note not found for update.')
      return undefined
    } catch (err) {
      console.error('Failed to update note in account:', err)
      setError('Failed to update note.')
      return undefined
    }
  }, [])

  const deleteNoteFromAccount = useCallback((accountId: string, noteId: string): boolean => {
    try {
      const updatedAccount = accountsMock.deleteNoteFromAccount(accountId, noteId)
      if (updatedAccount) {
        setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc))
        setError(null)
        return true
      }
      setError('Account or note not found for deletion.')
      return false
    } catch (err) {
      console.error('Failed to delete note from account:', err)
      setError('Failed to delete note.')
      return false
    }
  }, [])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    addNoteToAccount,
    updateNoteInAccount,
    deleteNoteFromAccount
  }
}