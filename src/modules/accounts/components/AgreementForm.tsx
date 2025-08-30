import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { generateId, loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils'

type Agreement = {
  id: string
  accountId: string
  agreementNumber: string
  type: string
  provider?: string
  startDate?: string
  endDate?: string
  amount?: number
  status?: 'active' | 'pending' | 'cancelled' | 'expired'
  notes?: string
}

export function AgreementForm({
  accountId,
  onSaved,
  onCancel,
}: {
  accountId: string
  onSaved: (agreement: Agreement | null) => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [agreementNumber, setAgreementNumber] = useState('')
  const [type, setType] = useState('Retail Installment')
  const [provider, setProvider] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'active' | 'pending' | 'cancelled' | 'expired'>('active')
  const [notes, setNotes] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const item: Agreement = {
        id: generateId(),
        accountId,
        agreementNumber: agreementNumber || generateId().slice(0, 6),
        type,
        provider: provider || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        amount: amount ? Number(amount) : undefined,
        status,
        notes: notes || undefined,
      }
      const existing = loadFromLocalStorage<Agreement[]>('agreements', []) || []
      saveToLocalStorage('agreements', [item, ...existing])
      toast({ title: 'Agreement recorded', description: 'Saved successfully.' })
      onSaved(item)
    } catch {
      toast({ title: 'Error', description: 'Failed to save agreement', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Agreement #</Label>
          <Input value={agreementNumber} onChange={(e) => setAgreementNumber(e.target.value)} placeholder="e.g. RIC-001234" />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v)}>
            <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail Installment">Retail Installment</SelectItem>
              <SelectItem value="Lease">Lease</SelectItem>
              <SelectItem value="Service Contract">Service Contract</SelectItem>
              <SelectItem value="GAP">GAP</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Provider</Label>
          <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Lender / Provider" />
        </div>
        <div>
          <Label>Amount</Label>
          <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Agreement'}</Button>
      </div>
    </form>
  )
}
