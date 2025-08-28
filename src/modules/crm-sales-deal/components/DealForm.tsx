import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useReturnTargets, ReturnToBehavior } from '@/hooks/useReturnTargets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Trash2, DollarSign, Calendar, User, Target, Package, ArrowLeft } from 'lucide-react'
import { Deal, DealStage, DealStatus, DealPriority, DealProduct } from '../types'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'
import { TagSelector } from '@/modules/tagging-engine'
import { TagType } from '@/modules/tagging-engine/types'
import { useDealManagement } from '../hooks/useDealManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { TagInput } from '@/components/common/TagInput'
import mockCrmSalesDeal from '@/mocks/crmSalesDealMock'

interface DealFormState {
  accountId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleInfo: string
  stage: string
  amount: number
  source: string
  type: string
  priority: string
  repId: string
  probability: number
  expectedCloseDate: string
  notes: string
  tags: string[]
}

type Props = ReturnToBehavior & {
  dealId?: string
}

export default function DealForm(props: Props) {
  const { dealId } = useParams<{ dealId: string }>()
  const actualDealId = props.dealId || dealId
  const navigate = useNavigate()
  const { accountId, afterSave } = useReturnTargets(props)
  const { toast } = useToast()
  
  const { 
    deals, 
    createDeal, 
    updateDeal, 
    loading: dealsLoading 
  } = useDealManagement()
  
  const { accounts } = useAccountManagement()
  
  const [loading, setLoading] = useState(false)
  const isEditing = !!actualDealId
  
  const [formData, setFormData] = useState<DealFormState>({
    accountId: accountId || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleInfo: '',
    stage: mockCrmSalesDeal.defaultDeal.stage,
    amount: 0,
    source: mockCrmSalesDeal.defaultDeal.source,
    type: mockCrmSalesDeal.defaultDeal.type,
    priority: mockCrmSalesDeal.defaultDeal.priority,
    repId: '',
    probability: mockCrmSalesDeal.defaultDeal.probability,
    expectedCloseDate: mockCrmSalesDeal.defaultDeal.expectedCloseDate,
    notes: '',
    tags: []
  })

  useEffect(() => {
    if (isEditing && actualDealId) {
      const deal = deals.find(d => d.id === actualDealId)
      if (deal) {
        setFormData({
          accountId: deal.accountId || '',
          customerName: deal.customerName,
          customerEmail: deal.customerEmail || '',
          customerPhone: deal.customerPhone || '',
          vehicleInfo: deal.vehicleInfo || '',
          stage: deal.stage,
          amount: deal.amount,
          source: deal.source,
          type: deal.type,
          priority: deal.priority,
          repId: deal.repId,
          probability: deal.probability,
          expectedCloseDate: deal.expectedCloseDate,
          notes: deal.notes || '',
          tags: []
        })
      }
    }
  }, [isEditing, actualDealId, deals])

  // Pre-fill customer info if account is selected
  useEffect(() => {
    if (formData.accountId && !isEditing) {
      const account = accounts.find(a => a.id === formData.accountId)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let savedDeal = null
      
      if (isEditing) {
        savedDeal = await updateDeal(actualDealId!, formData)
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
      
      afterSave(savedDeal, '/deals')
    } catch (error) {
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
      props.onSaved(null) // Close modal without saving
    } else {
      navigate('/deals')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {!props.onSaved && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deals
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Deal' : 'New Deal'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update deal information' : 'Create a new sales deal'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {props.onSaved && (
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Deal' : 'New Deal'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing ? 'Update deal information' : 'Create a new sales deal'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Deal Information
            </CardTitle>
            <CardDescription>
              Basic deal details and customer information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountId">Account</Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => setFormData({ ...formData, accountId: value })}
                  disabled={!!accountId} // Disable if pre-filled from account context
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Account</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  disabled={!!accountId} // Auto-filled from account
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  disabled={!!accountId} // Auto-filled from account
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  disabled={!!accountId} // Auto-filled from account
                />
              </div>
              
              <div>
                <Label htmlFor="vehicleInfo">Vehicle/Product</Label>
                <Input
                  id="vehicleInfo"
                  value={formData.vehicleInfo}
                  onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                  placeholder="e.g., 2023 Forest River Cherokee"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Deal Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="100"
                />
              </div>
              
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                >
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
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
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
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
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
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
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
                <Label htmlFor="repId">Assigned Sales Rep</Label>
                <Select
                  value={formData.repId}
                  onValueChange={(value) => setFormData({ ...formData, repId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCrmSalesDeal.reps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
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
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Deal notes and additional information..."
              />
            </div>
            
            <div>
              <Label>Tags</Label>
              <TagInput
                tags={formData.tags}
                onTagsChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags..."
                suggestions={['Hot Lead', 'Qualified', 'Follow-up', 'High Value']}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
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
  )
}