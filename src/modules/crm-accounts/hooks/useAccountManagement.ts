import accountsMock from '@/mocks/accountsMock'
import type { Account } from '@/types'
import { useToast } from '@/hooks/use-toast'

type NewAccount = Partial<Account>

const LS_KEY = 'crm.accounts'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveToLS(accounts: Account[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(accounts))
  } catch {
    // ignore storage errors silently
  }
}

export function useAccountManagement() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const didInit = useRef(false)

  // Initial load (from localStorage as a safe fallback)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
        // Ensure mock data is seeded first
        const loadedAccounts = accountsMock.getAccounts()
        console.log('Loaded accounts:', loadedAccounts) // Debug log
      const data = safeParse<Account[]>(localStorage.getItem(LS_KEY), [])
      setAccounts(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (e: any) {
      setError(e?.message || 'Failed to load accounts')
      setLoading(false)
    }
  }, [])

  // Derived helpers
  const getAccountById = useCallback(
    (id: string) => accounts.find((a) => a.id === id) || null,
    [accounts]
  )

  const createAccount = useCallback(async (input: NewAccount) => {
    const id = input.id ?? crypto.randomUUID?.() ?? String(Date.now())
    const now = new Date().toISOString()

    // Construct a new Account object while preserving optional fields
    const newAccount: Account = {
      id,
      name: input.name || 'Untitled Account',
      email: input.email || '',
      phone: input.phone || '',
      industry: input.industry || '',
      website: (input as any).website || '',
      address: (input as any).address || '',
      createdAt: (input as any).createdAt || now,
      updatedAt: now,
      // carry over any other custom fields that might exist in your type
      ...(input as any),
    }

    setAccounts((prev) => {
      const next = [newAccount, ...prev]
      saveToLS(next)
      return next
    })

    toast({ title: 'Account created', description: newAccount.name })
    return newAccount
  }, [toast])

  const updateAccount = useCallback(async (id: string, patch: Partial<Account>) => {
    let updated: Account | null = null
    setAccounts((prev) => {
      const next = prev.map((acc) => {
        if (acc.id !== id) return acc
        updated = { ...acc, ...patch, updatedAt: new Date().toISOString() }
        return updated!
      })
      saveToLS(next)
      return next
    })

    if (updated) {
      toast({ title: 'Account updated', description: updated.name })
    } else {
      toast({ title: 'Not found', description: 'Account could not be updated', variant: 'destructive' })
    }

    return updated
  }, [toast])

  const deleteAccount = useCallback(async (id: string) => {
    let removed = false
    setAccounts((prev) => {
      const next = prev.filter((a) => {
        const keep = a.id !== id
        if (!keep) removed = true
        return keep
      })
      saveToLS(next)
      return next
    })

    if (removed) {
      toast({ title: 'Account deleted' })
    } else {
      toast({ title: 'Not found', description: 'Account could not be deleted', variant: 'destructive' })
    }
  }, [toast])

  const addNoteToAccount = useCallback(async (id: string, note: { id?: string; text: string; createdAt?: string }) => {
    const noteId = note.id ?? crypto.randomUUID?.() ?? String(Date.now())
    const createdAt = note.createdAt ?? new Date().toISOString()
    const target = getAccountById(id)
    if (!target) {
      toast({ title: 'Not found', description: 'Account does not exist', variant: 'destructive' })
      return null
    }
    const nextNotes = [...((target as any).notes ?? []), { id: noteId, text: note.text, createdAt }]
    return updateAccount(id, { ...(target as any), notes: nextNotes } as Partial<Account>)
  }, [getAccountById, updateAccount, toast])

  // Expose API surface used throughout the app
  return useMemo(
    () => ({
      accounts,
      loading,
      error,
      getAccountById,
      createAccount,
      updateAccount,
      deleteAccount,
      addNoteToAccount,
    }),
    [accounts, loading, error, getAccountById, createAccount, updateAccount, deleteAccount, addNoteToAccount]
  )
}
