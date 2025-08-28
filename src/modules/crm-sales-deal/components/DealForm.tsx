import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
  const navigate = useNavigate()
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
    notes: ''
  })

  const isEditing = !!props.dealId
  const isModal = !!props.onSaved

  // Load existing deal for editing
  useEffect(() => {
    if (props.dealId) {
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
          notes: deal.notes || ''
        })
      }
    }
  }, [props.dealId, getDeal])

  // Auto-fill customer info when account is selected
  useEffect(() => {
    if (formData.accountId && !isEditing) {
      const account = accounts.find(acc => acc.id === formData.accountId)
      if (account) {
        setFormData(prev => ({
          ...prev,
          customerName: account.name,
          customerEmail: account.email || '',
          customerPhone: account.phone || ''
        }))
      }
    }
  }, [formData.accountId, accounts, isEditing])

  // Filter contacts by selected account
  const filteredContacts = contacts.filter(contact => 
    !formData.accountId || contact.accountId === formData.accountId
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let savedDeal
      if (isEditing) {
        savedDeal = await updateDeal(props.dealId!, formData)
        toast({
          title: 'Success',
          description: 'Deal updated successfully'
        })
      } else {
        savedDeal = await createDeal(formData)
        toast({
          title: 'Success',
          description: 'Deal created successfully'
        })
      }

      // Use return targets logic
      afterSave(savedDeal, '/deals')
    } catch (error) {
      console.error('Error saving deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to save deal',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (props.onSaved) {
      props.onSaved(null) // Close modal
    } else {
      afterSave(null, '/deals')
    }
  }

  return (
    <div className={isModal ? 'p-6' : ''}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Deal' : 'Create New Deal'}
            </h1>
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
          {/* Customer Information */}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="customer@example.com"
                    disabled={!!accountId}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    disabled={!!accountId}
                  />
                </div>
              </div>

              {!accountId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountId">Account</Label>
                    <Select value={formData.accountId} onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contactId">Contact</Label>
                    <Select value={formData.contactId} onValueChange={(value) => setFormData(prev => ({ ...prev, contactId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredContacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.firstName} {contact.lastName}
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
                  <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.dealStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
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
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData(prev => ({ ...prev, probability: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.dealSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCrmSalesDeal.dealTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vehicleId">Vehicle/Product</Label>
                <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventory.sampleVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this deal..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
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