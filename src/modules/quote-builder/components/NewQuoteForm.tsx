import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, FileText, Plus, Trash2 } from 'lucide-react'
import { useQuoteManagement } from '../hooks/useQuoteManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { Quote } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { TagInput } from '@/components/common/TagInput'
import mockQuoteBuilder from '@/mocks/quoteBuilderMock'
import { useReturnTargets, ReturnToBehavior } from '@/hooks/useReturnTargets'

interface QuoteFormState {
  accountId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleInfo: string
  items: QuoteItemState[]
  notes: string
  tags: string[]
  validUntil: string
}

interface QuoteItemState {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

type Props = ReturnToBehavior & {
  quoteId?: string
  onClose?: () => void
  onSuccess?: (quote: Quote) => void
}

export default function NewQuoteForm(props: Props) {
  const navigate = useNavigate()
  const { accountId, afterSave } = useReturnTargets(props)
  const { toast } = useToast()
  
  const { 
    quotes, 
    createQuote, 
    loading: quotesLoading 
  } = useQuoteManagement()
  
  const { accounts } = useAccountManagement()
  
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<QuoteFormState>({
    accountId: accountId || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleInfo: '',
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ],
    notes: '',
    tags: [],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  })

  // Pre-fill customer info if account is selected
  useEffect(() => {
    if (formData.accountId) {
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
  }, [formData.accountId, accounts])

  const addItem = () => {
    const newItem: QuoteItemState = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setFormData({ ...formData, items: [...formData.items, newItem] })
  }

  const removeItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    })
  }

  const updateItem = (itemId: string, updates: Partial<QuoteItemState>) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.id === itemId
          ? { ...item, ...updates, total: (updates.quantity || item.quantity) * (updates.unitPrice || item.unitPrice) }
          : item
      )
    })
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08 // 8% tax rate
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    return subtotal + tax
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const quoteData = {
        ...formData,
        subtotal: calculateSubtotal(),
        tax: calculateTax(calculateSubtotal()),
        total: calculateTotal(),
        status: 'draft' as const
      }
      
      const savedQuote = await createQuote(quoteData)
      
      toast({
        title: 'Success',
        description: 'Quote created successfully'
      })
      
      if (props.onSuccess) {
        props.onSuccess(savedQuote)
      }
      
      afterSave(savedQuote, '/quotes')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create quote',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (props.onSaved) {
      props.onSaved(null) // Close modal without saving
    } else if (props.onClose) {
      props.onClose()
    } else {
      navigate('/quotes')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {!props.onSaved && !props.onClose && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotes
            </Button>
            <div>
              <h1 className="text-2xl font-bold">New Quote</h1>
              <p className="text-muted-foreground">
                Create a new quote for a customer
              </p>
            </div>
          </div>
        </div>
      )}
      
      {(props.onSaved || props.onClose) && (
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">New Quote</h2>
          <p className="text-sm text-muted-foreground">
            Create a new quote for a customer
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quote Information
            </CardTitle>
            <CardDescription>
              Customer and quote details
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