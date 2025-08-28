import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useReturnTargets, ReturnToBehavior } from '@/hooks/useReturnTargets'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useDealManagement } from '@/modules/crm-sales-deal/hooks/useDealManagement'
import { mockInventory } from '@/mocks/inventoryMock'
import type { Deal, DealStage } from '@/modules/crm-sales-deal/types'
import { formatCurrency } from '@/lib/utils'

type Maybe<T> = T | undefined

type Props = ReturnToBehavior & {
  // When opened from DealsList
  deal?: Partial<Deal>
  customers?: Array<{ id: string; name?: string }>
  salesReps?: Array<{ id: string; name: string }>
  territories?: Array<{ id: string; name: string }>
  products?: Array<{ id: string; name: string; price?: number }>
  onSave?: (dealData: Partial<Deal>) => Promise<void> | void
  onCancel?: () => void
}

const STAGES: DealStage[] = [
  'PROSPECTING',
  'QUALIFICATION',
  'NEEDS_ANALYSIS',
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
] as unknown as DealStage[]

const STAGE_BADGE: Record<string, string> = {
  PROSPECTING: 'bg-sky-100 text-sky-800',
  QUALIFICATION: 'bg-indigo-100 text-indigo-800',
  NEEDS_ANALYSIS: 'bg-amber-100 text-amber-800',
  PROPOSAL: 'bg-purple-100 text-purple-800',
  NEGOTIATION: 'bg-blue-100 text-blue-800',
  CLOSED_WON: 'bg-green-100 text-green-800',
  CLOSED_LOST: 'bg-red-100 text-red-800',
}

export function DealForm(props: Props) {
  const { toast } = useToast()
  const { afterSave, accountId: ctxAccountId } = useReturnTargets(props)
  const isModalFromAccount = !!props.onSaved // AccountDetail passes onSaved
  const { getAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { createDeal } = useDealManagement()

  const accountId = ctxAccountId || (props.deal as any)?.accountId || ''

  const account = accountId ? getAccount(accountId) : undefined
  const accountContacts = useMemo(
    () => contacts.filter((c) => !accountId || c.accountId === accountId),
    [contacts, accountId]
  )

  // initial values (support both modes)
  const [form, setForm] = useState({
    name: props.deal?.name || (account ? `${account.name} – New Opportunity` : ''),
    accountId: accountId || '',
    contactId: '',
    vehicleId: '',
    customerName: props.deal?.customerName || account?.name || '',
    assignedTo: props.deal?.assignedTo || '',
    stage: (props.deal?.stage as DealStage) || STAGES[0],
    value: props.deal?.value?.toString?.() || '',
    probability: props.deal?.probability?.toString?.() || '20', // percent 0–100
    expectedCloseDate: props.deal?.expectedCloseDate || '',
    notes: props.deal?.notes || '',
  })

  const onChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }))

  const selectedVehicle = useMemo(
    () => mockInventory.sampleVehicles.find((v) => v.id === form.vehicleId),
    [form.vehicleId]
  )

  const numericValue = Math.max(0, parseFloat(form.value || '0') || 0)
  const percent = Math.min(100, Math.max(0, parseFloat(form.probability || '0') || 0))
  const weighted = (numericValue * percent) / 100

  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast({ title: 'Validation error', description: 'Deal name is required', variant: 'destructive' })
      return
    }
    if (!form.customerName.trim() && !form.accountId) {
      toast({
        title: 'Validation error',
        description: 'Customer/Account is required',
        variant: 'destructive',
      })
      return
    }

    const payload: Partial<Deal> = {
      // core (what your Deals module expects)
      name: form.name.trim(),
      customerName: form.customerName || account?.name || '',
      stage: form.stage as DealStage,
      value: numericValue,
      probability: percent, // your module uses % (0–100)
      expectedCloseDate: form.expectedCloseDate || undefined,
      assignedTo: form.assignedTo || undefined,
      notes: form.notes || undefined,
      // helpful extra links for Account view
      // @ts-ignore – these fields are fine to include in Partial<Deal>
      accountId: form.accountId || undefined,
      // @ts-ignore
      contactId: form.contactId || undefined,
      // @ts-ignore
      vehicleId: form.vehicleId || undefined,
    }

    setSaving(true)
    try {
      if (typeof props.onSave === 'function') {
        // Opened from the Deals module: delegate to parent
        await props.onSave(payload)
        props.onCancel?.()
      } else {
        // Opened from AccountDetail: create via DealManagement, then afterSave
        await createDeal(payload)
        toast({ title: 'Success', description: 'Deal created successfully' })
        afterSave(payload as Deal, '/deals')
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to save deal', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={isModalFromAccount ? 'p-6' : ''}>
      {!isModalFromAccount && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{props.deal ? 'Edit Deal' : 'Create Deal'}</h1>
          <p className="text-muted-foreground">Track a sales opportunity through your pipeline</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Deal Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  placeholder="e.g., 2023 Airstream Classic – Upgrade Package"
                />
              </div>

              <div>
                <Label>Account</Label>
                <Input value={account?.name || ''} disabled placeholder="(optional)" />
              </div>

              <div>
                <Label>Contact</Label>
                <Select
                  value={form.contactId}
                  onValueChange={(v) => onChange('contactId', v)}
                  disabled={!accountId || accountContacts.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Contact</SelectItem>
                    {accountContacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vehicle / Product</Label>
                <Select value={form.vehicleId} onValueChange={(v) => onChange('vehicleId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventory.sampleVehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Stage *</Label>
                <Select
                  value={form.stage}
                  onValueChange={(v) => onChange('stage', v as DealStage)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <Badge className={STAGE_BADGE[s] || 'bg-gray-100 text-gray-800'}>
                            {s.replace('_', ' ')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assigned To</Label>
                <Input
                  value={form.assignedTo}
                  onChange={(e) => onChange('assignedTo', e.target.value)}
                  placeholder="Sales rep (optional)"
                />
              </div>

              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => onChange('value', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>Probability (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={form.probability}
                  onChange={(e) => onChange('probability', e.target.value)}
                />
              </div>

              <div>
                <Label>Expected Close</Label>
                <Input
                  type="date"
                  value={form.expectedCloseDate}
                  onChange={(e) => onChange('expectedCloseDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border p-3 bg-muted/30">
                <div className="text-sm">Weighted Amount</div>
                <div className="text-xl font-semibold">{formatCurrency(weighted)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(numericValue)} × {Math.round(percent)}%
                </div>
              </div>
              {selectedVehicle && (
                <div className="rounded-md border p-3 bg-muted/30">
                  <div className="text-sm">Selected</div>
                  <div className="text-base font-medium">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
        </Card>
        <Textarea
          rows={4}
          value={form.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Internal notes about this opportunity…"
        />

        <div className="flex justify-end gap-3">
          {props.onCancel && (
            <Button type="button" variant="outline" onClick={props.onCancel} disabled={saving}>
              Cancel
            </Button>
          )}
          {!props.onCancel && (
            <Button type="button" variant="outline" onClick={() => afterSave(null, '/deals')} disabled={saving}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : props.deal ? 'Save Changes' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DealForm
