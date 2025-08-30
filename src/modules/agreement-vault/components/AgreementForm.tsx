import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Agreement, AgreementType, AgreementStatus } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockUsers } from '@/mocks/usersMock'
import { mockInventory } from '@/mocks/inventoryMock'
import { FileText, Calendar, User, Package, DollarSign, Save, X } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface AgreementFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (agreement: Agreement) => void
  agreement?: Agreement | null
  mode?: 'create' | 'edit'
}

export function AgreementForm({
  isOpen,
  onClose,
  onSave,
  agreement,
  mode = 'create'
}: AgreementFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: AgreementType.PURCHASE,
    status: AgreementStatus.DRAFT,
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleId: '',
    vehicleInfo: '',
    quoteId: '',
    terms: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    totalAmount: 0,
    downPayment: 0,
    financingAmount: 0,
    monthlyPayment: 0,
    securityDeposit: 0,
    annualFee: 0,
    coverageLevel: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load form data when editing
  useEffect(() => {
    if (agreement && mode === 'edit') {
      setFormData({
        type: agreement.type,
        status: agreement.status || AgreementStatus.DRAFT,
        customerId: agreement.customerId || '',
        customerName: agreement.customerName || '',
        customerEmail: agreement.customerEmail || '',
        customerPhone: agreement.customerPhone || '',
        vehicleId: agreement.vehicleId || '',
        vehicleInfo: agreement.vehicleInfo || '',
        quoteId: agreement.quoteId || '',
        terms: agreement.terms || '',
        effectiveDate: agreement.effectiveDate ? new Date(agreement.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expirationDate: agreement.expirationDate ? new Date(agreement.expirationDate).toISOString().split('T')[0] : '',
        totalAmount: agreement.totalAmount || 0,
        downPayment: agreement.downPayment || 0,
        financingAmount: agreement.financingAmount || 0,
        monthlyPayment: agreement.monthlyPayment || 0,
        securityDeposit: agreement.securityDeposit || 0,
        annualFee: agreement.annualFee || 0,
        coverageLevel: agreement.coverageLevel || ''
      })
    } else {
      // Reset form for create mode
      setFormData({
        type: AgreementType.PURCHASE,
        status: AgreementStatus.DRAFT,
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        vehicleId: '',
        vehicleInfo: '',
        quoteId: '',
        terms: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
        totalAmount: 0,
        downPayment: 0,
        financingAmount: 0,
        monthlyPayment: 0,
        securityDeposit: 0,
        annualFee: 0,
        coverageLevel: ''
      })
    }
    setErrors({})
  }, [agreement, mode, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-populate customer info when customer is selected
    if (field === 'customerId' && value) {
      const customer = mockUsers.sampleUsers.find(u => u.id === value)
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone
        }))
      }
    }

    // Auto-populate vehicle info when vehicle is selected
    if (field === 'vehicleId' && value) {
      const vehicle = mockInventory.sampleVehicles.find(v => v.id === value)
      if (vehicle) {
        setFormData(prev => ({
          ...prev,
          vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`
        }))
      }
    }

    // Auto-populate quote info when quote is selected
    if (field === 'quoteId' && value) {
      const quote = mockAgreements.sampleQuotes.find(q => q.id === value)
      if (quote) {
        setFormData(prev => ({
          ...prev,
          totalAmount: quote.amount
        }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.type) {
      newErrors.type = 'Agreement type is required'
    }

    if (!formData.customerId && !formData.customerName) {
      newErrors.customerId = 'Customer is required'
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required'
    }

    if (!formData.terms.trim()) {
      newErrors.terms = 'Terms and conditions are required'
    }

    // Type-specific validations
    if (formData.type === AgreementType.PURCHASE) {
      if (!formData.vehicleId && !formData.vehicleInfo) {
        newErrors.vehicleId = 'Vehicle is required for purchase agreements'
      }
      if (formData.totalAmount <= 0) {
        newErrors.totalAmount = 'Total amount must be greater than 0'
      }
    }

    if (formData.type === AgreementType.LEASE) {
      if (!formData.vehicleId && !formData.vehicleInfo) {
        newErrors.vehicleId = 'Vehicle is required for lease agreements'
      }
      if (formData.monthlyPayment <= 0) {
        newErrors.monthlyPayment = 'Monthly payment must be greater than 0'
      }
      if (!formData.expirationDate) {
        newErrors.expirationDate = 'Expiration date is required for lease agreements'
      }
    }

    if (formData.type === AgreementType.SERVICE) {
      if (formData.annualFee <= 0) {
        newErrors.annualFee = 'Annual fee must be greater than 0'
      }
      if (!formData.coverageLevel) {
        newErrors.coverageLevel = 'Coverage level is required for service agreements'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const agreementData: Agreement = {
        id: agreement?.id || `agr-${Date.now()}`,
        type: formData.type,
        status: formData.status,
        customerId: formData.customerId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        vehicleId: formData.vehicleId,
        vehicleInfo: formData.vehicleInfo,
        quoteId: formData.quoteId,
        terms: formData.terms,
        effectiveDate: formData.effectiveDate,
        expirationDate: formData.expirationDate || undefined,
        signedDate: agreement?.signedDate,
        signedBy: agreement?.signedBy,
        signedAt: agreement?.signedAt,
        ipAddress: agreement?.ipAddress,
        signatureData: agreement?.signatureData,
        documents: agreement?.documents || [],
        customFields: agreement?.customFields || {},
        createdAt: agreement?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: agreement?.createdBy || 'current-user',
        totalAmount: formData.totalAmount,
        downPayment: formData.downPayment,
        financingAmount: formData.financingAmount,
        monthlyPayment: formData.monthlyPayment,
        securityDeposit: formData.securityDeposit,
        annualFee: formData.annualFee,
        coverageLevel: formData.coverageLevel
      }

      onSave(agreementData)
      
      toast({
        title: 'Success',
        description: `Agreement ${mode === 'create' ? 'created' : 'updated'} successfully`
      })

      onClose()
    } catch (error) {
      console.error('Error saving agreement:', error)
      toast({
        title: 'Error',
        description: 'Failed to save agreement. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mode === 'create' ? 'Create New Agreement' : 'Edit Agreement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>
                Agreement type and status information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Agreement Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value as AgreementType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agreement type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgreements.agreementTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as AgreementStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgreements.agreementStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  />
                  {errors.effectiveDate && <p className="text-sm text-destructive">{errors.effectiveDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  />
                  {errors.expirationDate && <p className="text-sm text-destructive">{errors.expirationDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <CardDescription>
                Select or enter customer details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => handleInputChange('customerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.sampleUsers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          {(formData.type === AgreementType.PURCHASE || formData.type === AgreementType.LEASE) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>
                  Select the vehicle for this agreement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle *</Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => handleInputChange('vehicleId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInventory.sampleVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {formatCurrency(vehicle.salePrice || 0)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicleId && <p className="text-sm text-destructive">{errors.vehicleId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleInfo">Vehicle Description</Label>
                  <Input
                    id="vehicleInfo"
                    value={formData.vehicleInfo}
                    onChange={(e) => handleInputChange('vehicleInfo', e.target.value)}
                    placeholder="Enter vehicle description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quoteId">Related Quote</Label>
                  <Select
                    value={formData.quoteId}
                    onValueChange={(value) => handleInputChange('quoteId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select related quote (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgreements.sampleQuotes.map((quote) => (
                        <SelectItem key={quote.id} value={quote.id}>
                          {quote.number} - {formatCurrency(quote.amount)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
              <CardDescription>
                Agreement pricing and payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.type === AgreementType.PURCHASE && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount *</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                    {errors.totalAmount && <p className="text-sm text-destructive">{errors.totalAmount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="financingAmount">Financing Amount</Label>
                    <Input
                      id="financingAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.financingAmount}
                      onChange={(e) => handleInputChange('financingAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {formData.type === AgreementType.LEASE && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPayment">Monthly Payment *</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlyPayment}
                      onChange={(e) => handleInputChange('monthlyPayment', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                    {errors.monthlyPayment && <p className="text-sm text-destructive">{errors.monthlyPayment}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {formData.type === AgreementType.SERVICE && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualFee">Annual Fee *</Label>
                    <Input
                      id="annualFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.annualFee}
                      onChange={(e) => handleInputChange('annualFee', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                    {errors.annualFee && <p className="text-sm text-destructive">{errors.annualFee}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverageLevel">Coverage Level *</Label>
                    <Select
                      value={formData.coverageLevel}
                      onValueChange={(value) => handleInputChange('coverageLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.coverageLevel && <p className="text-sm text-destructive">{errors.coverageLevel}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terms and Conditions</CardTitle>
              <CardDescription>
                Agreement terms, conditions, and legal text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions *</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  placeholder="Enter the terms and conditions for this agreement..."
                  rows={8}
                />
                {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Agreement' : 'Update Agreement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}