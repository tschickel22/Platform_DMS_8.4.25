import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import FormSelect from '@/components/form/FormSelect'
import { useToast } from '@/hooks/use-toast'
import { mockFinance } from '@/mocks/financeMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface NewLoanFormProps {
  onClose: () => void
  onSuccess?: (loan: any) => void
}

interface LoanFormData {
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleId: string
  vehicleInfo: string
  loanAmount: number
  downPayment: number
  interestRate: number
  termMonths: number
  startDate: string
  status: string
  isPortalVisible: boolean
  notes: string
}

export function NewLoanForm({ onClose, onSuccess }: NewLoanFormProps) {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleId: '',
    vehicleInfo: '',
    loanAmount: 25000,
    downPayment: 3000,
    interestRate: 7.25,
    termMonths: 60,
    paymentFrequency: 'Monthly',
    startDate: '',
    status: 'Current',
    notes: '',
    makeVisibleInPortal: false
  })

  // Define options for dropdowns
  const statusOptions = [
    { value: 'Current', label: 'Current' },
    { value: 'Late', label: 'Late' },
    { value: 'Default', label: 'Default' },
    { value: 'Paid Off', label: 'Paid Off' }
  ]

  const termOptions = mockFinance.termOptions.map(term => ({
    value: term.toString(),
    label: `${term} months`
  }))

  const rateOptions = mockFinance.interestRates.map(rate => ({
    value: rate.toString(),
    label: `${rate}%`
  }))

  const frequencyOptions = mockFinance.paymentFrequencies.map(freq => ({
    value: freq,
    label: freq
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debug logging for form data changes
  React.useEffect(() => {
    console.log('NewLoanForm: Form data updated:', formData)
  }, [formData])

  const updateField = (field: string, value: any) => {
    console.log(`NewLoanForm: Updating field "${field}" with value:`, value)
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      console.log(`NewLoanForm: Form data after ${field} update:`, updated)
      return updated
    })
  }

  const calculateMonthlyPayment = () => {
    const principal = formData.loanAmount - formData.downPayment
    const monthlyRate = formData.interestRate / 100 / 12
    const numPayments = formData.termMonths
    
    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return 0
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    return Math.round(monthlyPayment * 100) / 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('NewLoanForm: Submitting form with data:', formData)
    
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!formData.customerName || !formData.loanAmount || !formData.status) {
        throw new Error('Please fill in all required fields')
      }

      // Calculate monthly payment
      const monthlyPayment = calculateMonthlyPayment()
      
      // Create new loan object
      const newLoan = {
        id: `loan-${Date.now()}`,
        customerId: formData.customerId || `cust-${Date.now()}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        vehicleId: formData.vehicleId || `vh-${Date.now()}`,
        vehicleInfo: formData.vehicleInfo,
        loanAmount: formData.loanAmount,
        downPayment: formData.downPayment,
        interestRate: formData.interestRate,
        termMonths: formData.termMonths,
        monthlyPayment,
        startDate: formData.startDate,
        status: formData.status,
        remainingBalance: formData.loanAmount - formData.downPayment,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalPaid: 0,
        paymentsRemaining: formData.termMonths,
        isPortalVisible: formData.isPortalVisible,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log('NewLoanForm: Created loan object:', newLoan)

      // Save to localStorage (simulating database save)
      const existingLoans = loadFromLocalStorage('loans', [])
      const updatedLoans = [newLoan, ...existingLoans]
      saveToLocalStorage('loans', updatedLoans)

      console.log('NewLoanForm: Saved loan to localStorage')

      toast({
        title: 'Success',
        description: 'Loan created successfully'
      })

      if (onSuccess) {
        onSuccess(newLoan)
      }

      onClose()
    } catch (error) {
      console.error('NewLoanForm: Error creating loan:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create loan',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Loan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => updateField('customerEmail', e.target.value)}
                  placeholder="customer@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => updateField('customerPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicleInfo">Vehicle/Property</Label>
                <Input
                  id="vehicleInfo"
                  value={formData.vehicleInfo}
                  onChange={(e) => updateField('vehicleInfo', e.target.value)}
                  placeholder="2023 Forest River Cherokee"
                />
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Loan Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => updateField('loanAmount', parseFloat(e.target.value) || 0)}
                  placeholder="25000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="downPayment">Down Payment</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => updateField('downPayment', parseFloat(e.target.value) || 0)}
                  placeholder="3000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <FormSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => updateField('status', value)}
                  placeholder="Select status"
                  name="status"
                />
              </div>
              
              <div>
                <Label htmlFor="termMonths">Term (Months) *</Label>
                <FormSelect
                  options={termOptions}
                  value={formData.termMonths.toString()}
                  onChange={(value) => updateField('termMonths', parseInt(value))}
                  placeholder="Select term"
                  name="termMonths"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                <FormSelect
                  options={rateOptions}
                  value={formData.interestRate.toString()}
                  onChange={(value) => updateField('interestRate', parseFloat(value))}
                  placeholder="Select rate"
                  name="interestRate"
                />
              </div>
              
              <div>
                <Label htmlFor="paymentFrequency">Payment Frequency *</Label>
                <FormSelect
                  options={frequencyOptions}
                  value={formData.paymentFrequency}
                  onChange={(value) => updateField('paymentFrequency', value)}
                  placeholder="Select frequency"
                  name="paymentFrequency"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="isPortalVisible"
                  checked={formData.isPortalVisible}
                  onCheckedChange={(checked) => updateField('isPortalVisible', checked)}
                />
                <Label htmlFor="isPortalVisible">Make this loan visible in customer portal</Label>
              </div>
            </div>
          </div>

          {/* Calculated Payment */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Calculated Monthly Payment:</span>
              <span className="text-2xl font-bold text-primary">
                ${calculateMonthlyPayment().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Additional notes about this loan..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Loan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}