import { useState, useEffect, useCallback } from 'react'
import { Account } from '@/types'
import { accountsMock } from '@/mocks/accountsMock'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/utils/logger'

export function useAccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { tenant } = useTenant()
  const { user } = useAuth()
  const { toast } = useToast()

  const tenantId = tenant?.id

  // Load accounts
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const accountsData = accountsMock.getAccounts(tenantId)
      setAccounts(accountsData || [])
      logger.debug('Accounts loaded', { count: accountsData?.length || 0, tenantId })
    } catch (err) {
      const errorMessage = 'Failed to load accounts'
      setError(errorMessage)
      logger.error('Error loading accounts', err, { tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [tenantId, toast])

  // Get account by ID (null-safe)
  const getAccountById = useCallback((id: string): Account | null => {
    try {
      return accountsMock.getAccount(id, tenantId)
    } catch (err) {
      logger.error('Error getting account by ID', err, { accountId: id, tenantId })
      return null
    }
  }, [tenantId])

  // Create account
  const createAccount = useCallback(async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Promise<Account | null> => {
    try {
      setLoading(true)
      const newAccount = accountsMock.createAccount(accountData, tenantId)
      await loadAccounts() // Refresh list
      
      logger.userAction('account_created', { accountId: newAccount.id, tenantId })
      toast({
        title: 'Success',
        description: 'Account created successfully'
      })
      
      return newAccount
    } catch (err) {
      const errorMessage = 'Failed to create account'
      logger.error('Error creating account', err, { tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [tenantId, loadAccounts, toast])

  // Update account
  const updateAccount = useCallback(async (id: string, updates: Partial<Account>): Promise<Account | null> => {
    try {
      setLoading(true)
      const updatedAccount = accountsMock.updateAccount(id, updates, tenantId)
      if (updatedAccount) {
        await loadAccounts() // Refresh list
        
        logger.userAction('account_updated', { accountId: id, tenantId })
        toast({
          title: 'Success',
          description: 'Account updated successfully'
        })
      }
      
      return updatedAccount
    } catch (err) {
      const errorMessage = 'Failed to update account'
      logger.error('Error updating account', err, { accountId: id, tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [tenantId, loadAccounts, toast])

  // Delete account
  const deleteAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const success = accountsMock.deleteAccount(id, tenantId)
      if (success) {
        await loadAccounts() // Refresh list
        
        logger.userAction('account_deleted', { accountId: id, tenantId })
        toast({
          title: 'Success',
          description: 'Account deleted successfully'
        })
      }
      
      return success
    } catch (err) {
      const errorMessage = 'Failed to delete account'
      logger.error('Error deleting account', err, { accountId: id, tenantId })
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [tenantId, loadAccounts, toast])

  // Note management
  const addNote = useCallback(async (accountId: string, content: string): Promise<boolean> => {
    try {
      const createdBy = user?.name || 'Unknown User'
      const updatedAccount = accountsMock.addNoteToAccount(accountId, content, createdBy, tenantId)
      if (updatedAccount) {
        await loadAccounts() // Refresh to show new note
        
        logger.userAction('account_note_added', { accountId, tenantId })
        toast({
          title: 'Success',
          description: 'Note added successfully'
        })
        return true
      }
      return false
    } catch (err) {
      logger.error('Error adding note to account', err, { accountId, tenantId })
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive'
      })
      return false
    }
  }, [tenantId, user?.name, loadAccounts, toast])

  const updateNote = useCallback(async (accountId: string, noteId: string, content: string): Promise<boolean> => {
    try {
      const updatedBy = user?.name || 'Unknown User'
      const updatedAccount = accountsMock.updateNoteInAccount(accountId, noteId, content, updatedBy, tenantId)
      if (updatedAccount) {
        await loadAccounts() // Refresh to show updated note
        
        logger.userAction('account_note_updated', { accountId, noteId, tenantId })
        toast({
          title: 'Success',
          description: 'Note updated successfully'
        })
        return true
      }
      return false
    } catch (err) {
      logger.error('Error updating note in account', err, { accountId, noteId, tenantId })
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive'
      })
      return false
    }
  }, [tenantId, user?.name, loadAccounts, toast])

  const deleteNote = useCallback(async (accountId: string, noteId: string): Promise<boolean> => {
    try {
      const updatedAccount = accountsMock.deleteNoteFromAccount(accountId, noteId, tenantId)
      if (updatedAccount) {
        await loadAccounts() // Refresh to remove deleted note
        
        logger.userAction('account_note_deleted', { accountId, noteId, tenantId })
        toast({
          title: 'Success',
          description: 'Note deleted successfully'
        })
        return true
      }
      return false
    } catch (err) {
      logger.error('Error deleting note from account', err, { accountId, noteId, tenantId })
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive'
      })
      return false
    }
  }, [tenantId, loadAccounts, toast])

  // Load accounts on mount and when tenant changes
  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  return {
    accounts,
    loading,
    error,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    addNote,
    updateNote,
    deleteNote,
    refresh: loadAccounts
  }
}