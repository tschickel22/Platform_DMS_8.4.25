// src/modules/crm-sales-deal/components/DealForm.tsx
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
import { mockInventory } from '@/mocks/inventoryMock'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'
import { formatCurrency, generateId, loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils'

type Props = ReturnToBehavior & {
  dealId?: string // (future edit use)
}

type Deal = {
  id: string
  accountId: string
  contactId?: string
  vehicleId?: string
  stage: string
  amount: number
  expectedCloseDate?: string
  probability?: number
  leadSource?: string
  notes?: string
  vehicleInfo?: string
  createdAt: string
  updatedAt: string
}

const STAGES: string[] =
  mockCrmSalesDeal?.stages ||
  ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

const STAGE_COLORS: Record<string, string> =
  mockCrmSalesDeal?.stageColors || {
    Qualification: 'bg-blue-100 text-blue-800',
    'Needs Analysis': 'bg-indigo-100 text-indigo-800',
    Proposal: 'bg-amber-100 text-amber-800',
    Negotiation: 'bg-purple-100 text-purple-800',
    'Closed Won': 'bg-green-100 text-green-800',
    'Closed Lost': 'bg-red-100 text-red-800',
  }

// rough default probability per stage (can be tuned)
const DEFAULT_PROB: Record<string, number> = {
  Qualification: 0.2,
  'Needs Analysis': 0.35,
  Proposal: 0.5,
  Negotiation: 0.7,
  'Closed Won': 1,
  'Closed Lost': 0,
}

export function DealForm(props: Props) {
  const { toast } = useToast()
  const { accountId: ctxAccountId, afterSave } = useReturnTargets(props)
  const isModal = !!props.onSaved

  const { accounts } = useAccountManagement()
  const { contacts } = useContactManagement()

  // form state
  const [form, setForm] = useState<{
    accountId: string
    contactId: string
    vehicleId: string
    stage: string
    amount: string
    expectedCloseDate: string
    probability: string
    leadSource: string
    notes: string
  }>({
    accountId: ctxAccountId || '',
    contactId: '',
    vehicleId: '',
    stage: STAGES[0],
    amount: '',
    expectedCloseDate: '',
    probability: String(DEFAULT_PROB[STAGES[0]] ?? 0.2),
    leadSource: '',
    notes: '',
  })

  const accountContacts = useMemo(
    () => contacts.filter((c) => !form.accountId || c.accountId === form.accountId),
    [contacts, form.accountId],
  )

  const selectedVehicle = useMemo(
    () => mockInventory?.sampleVehicles?.find((v) => v.id === form.vehicleId),
    [form.vehicleId],
  )

  const amountNum = useMemo(() => parseFloat(form.amount || '0') || 0, [form.amount])
  const probNum = useMemo(
    () => Math.min(1, Math.max(0, parseFloat(form.probability || '0') || 0)),
    [form.probability],
  )
  const weighted = useMemo(() => amountNum * probNum, [amountNum, probNum])

  const onChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }))

  const onStageChange = (v: string) => {
    onChange('stage', v)
    if (form.probability === '' || form.probability === String(DEFAULT_PROB[form.stage] ?? '')) {
      onChange('probability', String(DEFAULT_PROB[v] ?? 0.2))
    }
  }

  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.accountId) {
      toast({ title: 'Validation error', description: 'Account is required', variant: 'destructive' })
      return
    }
    if (!form.stage) {
      toast({ title: 'Validation error', description: 'Stage is required', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const vehicleInfo = selectedVehicle
        ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
        : ''

      const deal: Deal = {
        id: generateId(),
        accountId: form.accountId,
        contactId: form.contactId || undefined,
        vehicleId: form.vehicleId || undefined,
        stage: form.stage,
        amount: amountNum,
        expectedCloseDate: form.expectedCloseDate || undefined,
        probability: probNum,
        leadSource: form.leadSource || undefined,
        notes: form.notes || undefined,
        vehicleInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Persist to localStorage (same pattern as Quotes/Service)
      const existing = loadFromLocalStorage<Deal[]>('deals', [])
      saveToLocalStorage('deals', [deal, ...existing])

      toast({ title: 'Success', description: 'Deal created successfully' })
      afterSave(deal, '/deals')
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to create deal', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={isModal ? 'p-6' : ''}>
      {!isModal && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Deal</h1>
          <p className="text-muted-foreground">Track a sales opportunity for this customer</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Account *</Label>
                <Select
                  value={form.accountId}
                  onValueChange={(v) => {
                    onChange('accountId', v)
                    onChange('contactId', '')
                  }}
                  disabled={!!ctxAccountId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contact</Label>
                <Select
                  value={form.contactId}
                  onValueChange={(v) => onChange('contactId', v)}
                  disabled={!form.accountId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select value={form.stage} onValueChange={onStageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <Badge className={STAGE_COLORS[s] || 'bg-gray-100 text-gray-800'}>{s}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => onChange('amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>Expected Close Date</Label>
                <Input
                  type="date"
                  value={form.expectedCloseDate}
                  onChange={(e) => onChange('expectedCloseDate', e.target.value)}
                />
              </div>

              <div>
                <Label>Probability (0–1)</Label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={form.probability}
                  onChange={(e) => onChange('probability', e.target.value)}
                />
              </div>

              <div>
                <Label>Lead Source</Label>
                <Input
                  value={form.leadSource}
                  onChange={(e) => onChange('leadSource', e.target.value)}
                  placeholder="Web, Referral, Event…"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border p-3 bg-muted/30">
                <div className="text-sm">Weighted Amount</div>
                <div className="text-xl font-semibold">{formatCurrency(weighted)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(amountNum)} × {Math.round(probNum * 100)}%
                </div>
              </div>
              {selectedVehicle && (
                <div className="rounded-md border p-3 bg-muted/30">
                  <div className="text-sm">Selected</div>
                  <div className="text-base font-medium">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </div>
                  {selectedVehicle.stockNumber && (
                    <div className="text-xs text-muted-foreground">Stock #{selectedVehicle.stockNumber}</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              value={form.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Internal notes about this opportunity…"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => afterSave(null, '/deals')} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Creating…' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </div>
  )
}
