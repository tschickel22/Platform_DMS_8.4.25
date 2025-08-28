import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Save, CreditCard, DollarSign } from 'lucide-react'
import { Payment, PaymentMethod, PaymentStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface RecordPaymentFormProps {
  invoiceId: string
  invoiceTotal: number
  remainingBalance: number
  onSave: (paymentData: Partial<Payment>) => Promise<void>
  onCancel: () => void
}

export default function RecordPaymentForm({
  invoiceId,
  invoiceTotal,
  remainingBalance,
  onSave,
  onCancel
}: RecordPaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD)
  const [transactionId, setTransactionId] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive'
      })
      return
    }

    if (paymentAmount > remainingBalance) {
      toast({
        title: 'Amount Too High',
        description: 'Payment amount cannot exceed the remaining balance.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const paymentData: Partial<Payment> = {
        invoiceId,
        amount: paymentAmount,
        method,
        status: PaymentStatus.COMPLETED,
        transactionId: transactionId || undefined,
        processedDate: new Date(),
        notes: notes || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await onSave(paymentData)
      
      toast({
        title: 'Payment Recorded',
        description: `Payment of ${formatCurrency(paymentAmount)} has been recorded successfully.`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentMethods = [
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.CHECK, label: 'Check' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' }
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Record Payment
            </CardTitle>
            <CardDescription>
              Record a payment for this invoice
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Invoice Total:</span>
                <div className="font-semibold">{formatCurrency(invoiceTotal)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining Balance:</span>
                <div className="font-semibold text-primary">{formatCurrency(remainingBalance)}</div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remainingBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction or reference ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this payment"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}