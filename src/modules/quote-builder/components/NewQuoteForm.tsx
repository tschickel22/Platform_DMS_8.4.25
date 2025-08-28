import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useReturnTargets, ReturnToBehavior } from '@/hooks/useReturnTargets'
import { mockInventory } from '@/mocks/inventoryMock'
import { mockAccounts } from '@/mocks/accountsMock'
import { mockContacts } from '@/mocks/contactsMock'
import { formatCurrency, generateId, saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { Plus, Trash2, Calculator } from 'lucide-react'

interface QuoteFormData {
  accountId: string
  contactId: string
  vehicleId: string
  items: QuoteItem[]
  notes: string
  validUntil: string
  terms: string
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  number: string
  accountId: string
  contactId: string
  vehicleId: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  status: string
  validUntil: string
  terms: string
  notes: string
  createdAt: string
  updatedAt: string
}

type Props = ReturnToBehavior & {
  quoteId?: string
}

export default function NewQuoteForm(props: Props) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { accountId, afterSave } = useReturnTargets(props)
  const isEditing = !!props.quoteId

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<QuoteFormData>({
    accountId: accountId || '',
    contactId: '',
    vehicleId: '',
    items: [
      {
        id: generateId(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ],
    notes: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    terms: 'Standard terms and conditions apply. Quote valid for 30 days.'
  })

  // Get account and contact data for dropdowns
  const accounts = mockAccounts.sampleAccounts
  const contacts = mockContacts.sampleContacts.filter(c => 
    !formData.accountId || c.accountId === formData.accountId
  )
  const vehicles = mockInventory.sampleVehicles

  // Get selected account for auto-fill
  const selectedAccount = accounts.find(a => a.id === formData.accountId)

  const updateFormData = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    const newItem: QuoteItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    updateFormData('items', [...formData.items, newItem])
  }

  const updateItem = (itemId: string, field: keyof QuoteItem, value: any) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        // Recalculate total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    })
    updateFormData('items', updatedItems)
  }

  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      updateFormData('items', formData.items.filter(item => item.id !== itemId))
    }
  }

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 0.08 // 8% tax
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.accountId) {
        throw new Error('Account is required')
      }

      if (formData.items.length === 0 || formData.items.every(item => !item.description.trim())) {
        throw new Error('At least one quote item is required')
      }

      // Create quote object
      const newQuote: Quote = {
        id: generateId(),
        number: `Q-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        accountId: formData.accountId,
        contactId: formData.contactId,
        vehicleId: formData.vehicleId,
        items: formData.items.filter(item => item.description.trim()),
        subtotal,
        tax,
        total,
        status: 'draft',
        validUntil: formData.validUntil,
        terms: formData.terms,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage (in real app, this would be an API call)
      const existingQuotes = loadFromLocalStorage<Quote[]>('quotes', [])
      const updatedQuotes = [newQuote, ...existingQuotes]
      saveToLocalStorage('quotes', updatedQuotes)

      toast({
        title: 'Success',
        description: `Quote ${newQuote.number} created successfully`,
      })

      // Use afterSave for navigation/modal handling
      afterSave(newQuote, '/quotes')

    } catch (error) {
      console.error('Error creating quote:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create quote',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const isModal = !!props.onSaved

  return (
    <div className={isModal ? 'p-6' : ''}>
      {!isModal && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Quote</h1>
          <p className="text-muted-foreground">Generate a quote for products or services</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {isModal && (
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-semibold">Create New Quote</h2>
            <p className="text-sm text-muted-foreground">Generate a quote for products or services</p>
          </div>
        )}

        {/* Quote Information */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Information</CardTitle>
            <CardDescription>Basic quote details and customer information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountId">Account *</Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => {
                    updateFormData('accountId', value)
                    updateFormData('contactId', '') // Reset contact when account changes
                  }}
                  disabled={!!accountId} // Auto-filled from account
                >
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
                <Select
                  value={formData.contactId}
                  onValueChange={(value) => updateFormData('contactId', value)}
                  disabled={!formData.accountId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vehicleId">Vehicle/Product</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => updateFormData('vehicleId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => updateFormData('validUntil', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quote Items</CardTitle>
                <CardDescription>Products and services included in this quote</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-5">
                    <Label htmlFor={`description-${item.id}`}>Description *</Label>
                    <Input
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`quantity-${item.id}`}>Quantity *</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`unitPrice-${item.id}`}>Unit Price *</Label>
                    <Input
                      id={`unitPrice-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Total</Label>
                    <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote Totals */}
            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Terms and Notes</CardTitle>
            <CardDescription>Additional terms and internal notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="terms">Terms and Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => updateFormData('terms', e.target.value)}
                placeholder="Enter terms and conditions"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="Internal notes (not visible to customer)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => afterSave(null, '/quotes')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quote'}
          </Button>
        </div>
      </form>
    </div>
  )
}