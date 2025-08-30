import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Agreement, AgreementType, AgreementStatus } from '@/types'
import { mockAgreements } from '@/mocks/agreementsMock'
import { generateId } from '@/lib/utils'

interface AgreementFormProps {
  agreement?: Agreement
  onSave?: (agreement: Agreement) => void
  onCancel?: () => void
  accountId?: string
  contactId?: string
}

export function AgreementForm({ 
  agreement, 
  onSave, 
  onCancel,
  accountId,
  contactId 
}: AgreementFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    type: agreement?.type || 'PURCHASE',
    status: agreement?.status || 'DRAFT',
    customerId: agreement?.customerId || '',
    customerName: agreement?.customerName || '',
    customerEmail: agreement?.customerEmail || '',
    customerPhone: agreement?.customerPhone || '',
    vehicleId: agreement?.vehicleId || '',
    vehicleInfo: agreement?.vehicleInfo || '',
    quoteId: agreement?.quoteId || '',
    terms: agreement?.terms || '',
    effectiveDate: agreement?.effectiveDate ? 
      new Date(agreement.effectiveDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    expirationDate: agreement?.expirationDate ? 
      new Date(agreement.expirationDate).toISOString().split('T')[0] : '',
    totalAmount: agreement?.totalAmount || 0,
    downPayment: agreement?.downPayment || 0,
    monthlyPayment: agreement?.monthlyPayment || 0,
    notes: agreement?.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const agreementData: Agreement = {
        id: agreement?.id || generateId(),
        type: formData.type as AgreementType,
        status: formData.status as AgreementStatus,
        customerId: formData.customerId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        accountId: accountId || agreement?.accountId,
        contactId: contactId || agreement?.contactId,
        vehicleId: formData.vehicleId,
        vehicleInfo: formData.vehicleInfo,
        quoteId: formData.quoteId,
        terms: formData.terms,
        effectiveDate: formData.effectiveDate,
        expirationDate: formData.expirationDate || undefined,
        totalAmount: formData.totalAmount,
        downPayment: formData.downPayment,
        monthlyPayment: formData.monthlyPayment,
        signedBy: agreement?.signedBy,
        signedAt: agreement?.signedAt,
        ipAddress: agreement?.ipAddress,
        signatureData: agreement?.signatureData,
        documents: agreement?.documents || [],
        customFields: agreement?.customFields || {},
        createdAt: agreement?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: agreement?.createdBy || 'current-user'
      }

      onSave?.(agreementData)
      
      toast({
        title: 'Success',
        description: `Agreement ${agreement ? 'updated' : 'created'} successfully`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save agreement',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agreement ? 'Edit Agreement' : 'New Agreement'}</CardTitle>
        <CardDescription>
          {agreement ? 'Update agreement details' : 'Create a new agreement'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Agreement Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgreements.agreementTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgreements.agreementStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                placeholder="Enter customer email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
                placeholder="Enter customer phone"
              />
            </div>

            <div>
              <Label htmlFor="vehicleInfo">Vehicle/Property</Label>
              <Select value={formData.vehicleId} onValueChange={(value) => {
                const vehicle = mockAgreements.sampleVehicles.find(v => v.id === value)
                handleChange('vehicleId', value)
                handleChange('vehicleInfo', vehicle?.info || '')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgreements.sampleVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.info}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => handleChange('effectiveDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleChange('expirationDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input
                id="downPayment"
                type="number"
                value={formData.downPayment}
                onChange={(e) => handleChange('downPayment', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="monthlyPayment">Monthly Payment</Label>
              <Input
                id="monthlyPayment"
                type="number"
                value={formData.monthlyPayment}
                onChange={(e) => handleChange('monthlyPayment', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => handleChange('terms', e.target.value)}
              placeholder="Enter agreement terms and conditions"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (agreement ? 'Update Agreement' : 'Create Agreement')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AgreementForm;