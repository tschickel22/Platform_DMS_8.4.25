import { useLocation, useNavigate } from 'react-router-dom'

export type ReturnToBehavior = {
  /** When present, pre-associate with this account and return to it after save (if returnTo=account) */
  accountId?: string
  /** If set, form will call this on successful save instead of navigating */
  onSaved?: (entity: any) => void
  /** Optional explicit override; otherwise read from URL (?returnTo=account) */
  returnTo?: 'account' | 'list'
}

export function useReturnTargets(props: ReturnToBehavior) {
  const navigate = useNavigate()
  const { search } = useLocation()
  const qs = new URLSearchParams(search)

  const accountId =
    props.accountId ?? qs.get('accountId') ?? undefined
  const returnTo =
    props.returnTo ?? (qs.get('returnTo') as 'account' | 'list' | null) ?? null

  const afterSave = (entity: any, defaultPath: string) => {
    if (props.onSaved) return props.onSaved(entity)
    if (returnTo === 'account' && accountId) return navigate(`/accounts/${accountId}`)
    return navigate(defaultPath)
  }

  return { accountId, returnTo, afterSave }
}