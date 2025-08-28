import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useReturnTargets } from '@/hooks/useReturnTargets'
import { useDealManagement } from '../hooks/useDealManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'
import { mockInventory } from '@/mocks/inventoryMock'
import { X, Save, DollarSign } from 'lucide-react'

interface DealFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  accountId: string
  contactId: string
  vehicleId: string
  stage: string
  amount: number
  source: string
  type: string
  priority: string
  probability: number
  expectedCloseDate: string
  notes: string
}

interface ReturnToBehavior {
  accountId?: string
  onSaved?: (entity: any) => void
  returnTo?: 'account' | 'list'
}

interface DealFormProps extends ReturnToBehavior {
  dealId?: string
  onClose?: () => void
}

export function DealForm(props: DealFormProps) {
  const { toast } = useToast()
  const { accountId, afterSave } = useReturnTargets(props)
  const { createDeal, updateDeal, getDeal } = useDealManagement()
  const { accounts } = useAccountManagement()
  const { contacts } = useContactManagement()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DealFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    accountId: accountId || '',
    contactId: '',
    vehicleId: '',
    stage: mockCrmSalesDeal.defaultDeal.stage,
    amount: mockCrmSalesDeal.defaultDeal.amount,
    source: mockCrmSalesDeal.defaultDeal.source,
    type: mockCrmSalesDeal.defaultDeal.type,
    priority: mockCrmSalesDeal.defaultDeal.priority,
    probability: mockCrmSalesDeal.defaultDeal.probability,
    expectedCloseDate: mockCrmSalesDeal.defaultDeal.expectedCloseDate,
    notes: '',
  })

  const isEditing = !!props.dealId
  const isModal = !!props.onSaved

  // Load existing deal for editing
  useEffect(() => {
    if (!props.dealId) return
    const deal = getDeal(props.dealId)
    if (deal) {
      setFormData({
        customerName: deal.customerName || '',
        customerEmail: deal.customerEmail || '',
        customerPhone: deal.customerPhone || '',
        accountId: deal.accountId || '',
        contactId: deal.contactId || '',
        vehicleId: deal.vehicleId || '',
        stage: deal.stage,
        amount: deal.amount,
        source: deal.source,
        type: deal.type,
        priority: deal.priority,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate,
        notes: deal.notes || '',
      })
    }
  }, [props.dealId, getDeal])

  // Auto-fill customer info when account is selected (only for create)
  useEffect(() => {
    if (!formData.accountId || isEditing) return
    const account = accounts.find(acc => acc.id === formData.accountId)
    if (account) {
      setFormData(prev => ({
        ...prev,
        customerName: account.name,
        customerEmail: account.email || '',
        customerPhone: account.phone || '',
      }))
    }
  }, [formData.accountId, accounts, isEditing])

  // Filter contacts by selected account
  const filteredContacts = contacts.filter(
    c => !formData.accountId || c.accountId === formData.accountId
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let saved
      if (isEditing) {
        saved = await updateDeal(props.dealId!, formData)
        toast({ title: 'Success', description: 'Deal updated successfully' })
      } else {
        saved = await createDeal(formData)
        toast({ title: 'Success', description: 'Deal created successfully' })
      }
      afterSave(saved, '/deals')
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to save deal', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (props.onSaved) {
      props.onSaved(null) // close modal
    } else {
      afterSave(null, '/deals')
    }
  }

  return (
    <div className={isModal ? 'p-6 max-h-[80vh] overflow-y-auto' : ''}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? 'Edit Deal' : 'Create New Deal'}</h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update deal information' : 'Create a new sales deal'}
            </p>
          </div>
          {isModal && (
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Deal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={e => setFormData(p => ({ ...p, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    required
                    disabled={!!accountId}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Deal Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData(p => ({ ...p, amount: Number(e.target.value) }))}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={e => setFormData(p => ({ ...p, customerEmail: e.target.value }))}
                    placeholder="customer@example.com"
                    disabled={!!accountId}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={e => setFormData(p => ({ ...p, customerPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    disabled={!!accountId}
                  />
                </div>
              </div>

              {!accountId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountId">Account</Label>
                    <Select
                      value={formData.accountId}
                      onValueChange={v => setFormData(p => ({ ...p, accountId: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contactId">Contact</Label>
                    <Select
                      value={formData.contactId}
                      onValueChange={v => setFormData(p => ({ ...p, contactId: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredContacts.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.firstName} {c.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stage">Stage *</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={v => setFormData(p => ({ ...p, stage: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.dealStages.map(stage => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={v => setFormData(p => ({ ...p, priority: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.priorities.map(p => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.probability}
                    onChange={e => setFormData(p => ({ ...p, probability: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={v => setFormData(p => ({ ...p, source: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.dealSources.map(s => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={v => setFormData(p => ({ ...p, type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.dealTypes.map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={e => setFormData(p => ({ ...p, expectedCloseDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vehicleId">Vehicle/Product</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={v => setFormData(p => ({ ...p, vehicleId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventory.sampleVehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Add any additional notes about this deal..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : isEditing ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DealForm
