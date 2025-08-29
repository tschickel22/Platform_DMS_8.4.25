import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { generateId } from '@/lib/utils'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'

interface FinanceApplication {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  accountId?: string
  contactId?: string
  applicationType: string
  status: string
  requestedAmount: number
  vehicleInfo?: string
  employmentInfo: {
    employer: string
    position: string
    income: number
    yearsEmployed: number
  }
  creditInfo: {
    creditScore?: number
    hasCoSigner: boolean
    coSignerName?: string
  }
  notes: string
  submittedAt: string
  updatedAt: string
  createdAt: string
}

interface FinanceApplicationFormProps {
  application?: FinanceApplication
  onSave?: (application: FinanceApplication) => void
  onCancel?: () => void
  accountId?: string
  contactId?: string
}

export function FinanceApplicationForm({ 
  application, 
  onSave, 
  onCancel,
  accountId,
  contactId 
}: FinanceApplicationFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    customerId: application?.customerId || '',
    customerName: application?.customerName || '',
    customerEmail: application?.customerEmail || '',
    customerPhone: application?.customerPhone || '',
    applicationType: application?.applicationType || 'vehicle_purchase',
    status: application?.status || 'draft',
    requestedAmount: application?.requestedAmount || 0,
    vehicleInfo: application?.vehicleInfo || '',
    employer: application?.employmentInfo?.employer || '',
    position: application?.employmentInfo?.position || '',
    income: application?.employmentInfo?.income || 0,
    yearsEmployed: application?.employmentInfo?.yearsEmployed || 0,
    creditScore: application?.creditInfo?.creditScore || 0,
    hasCoSigner: application?.creditInfo?.hasCoSigner || false,
    coSignerName: application?.creditInfo?.coSignerName || '',
    notes: application?.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const applicationData: FinanceApplication = {
        id: application?.id || generateId(),
        customerId: formData.customerId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        accountId: accountId || application?.accountId,
        contactId: contactId || application?.contactId,
        applicationType: formData.applicationType,
        status: formData.status,
        requestedAmount: formData.requestedAmount,
        vehicleInfo: formData.vehicleInfo,
        employmentInfo: {
          employer: formData.employer,
          position: formData.position,
          income: formData.income,
          yearsEmployed: formData.yearsEmployed
        },
        creditInfo: {
          creditScore: formData.creditScore || undefined,
          hasCoSigner: formData.hasCoSigner,
          coSignerName: formData.hasCoSigner ? formData.coSignerName : undefined
        },
        notes: formData.notes,
        submittedAt: application?.submittedAt || new Date().toISOString(),
        createdAt: application?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      onSave?.(applicationData)
      
      toast({
        title: 'Success',
        description: `Finance application ${application ? 'updated' : 'created'} successfully`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save finance application',
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
        <CardTitle>{application ? 'Edit Finance Application' : 'New Finance Application'}</CardTitle>
        <CardDescription>
          {application ? 'Update application details' : 'Create a new finance application'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
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
                <Label htmlFor="applicationType">Application Type</Label>
                <Select value={formData.applicationType} onValueChange={(value) => handleChange('applicationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle_purchase">Vehicle Purchase</SelectItem>
                    <SelectItem value="vehicle_lease">Vehicle Lease</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                    <SelectItem value="home_purchase">Home Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestedAmount">Requested Amount</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  value={formData.requestedAmount}
                  onChange={(e) => handleChange('requestedAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="vehicleInfo">Vehicle/Property Info</Label>
                <Input
                  id="vehicleInfo"
                  value={formData.vehicleInfo}
                  onChange={(e) => handleChange('vehicleInfo', e.target.value)}
                  placeholder="Enter vehicle or property details"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleChange('employer', e.target.value)}
                  placeholder="Enter employer name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="Enter job position"
                  required
                />
              </div>

              <div>
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleChange('income', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="yearsEmployed">Years Employed</Label>
                <Input
                  id="yearsEmployed"
                  type="number"
                  value={formData.yearsEmployed}
                  onChange={(e) => handleChange('yearsEmployed', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  step="0.1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Credit Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Credit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="creditScore">Credit Score (Optional)</Label>
                <Input
                  id="creditScore"
                  type="number"
                  value={formData.creditScore}
                  onChange={(e) => handleChange('creditScore', parseInt(e.target.value) || 0)}
                  placeholder="700"
                  min="300"
                  max="850"
                />
              </div>

              <div>
                <Label htmlFor="hasCoSigner">Co-Signer</Label>
                <Select value={formData.hasCoSigner.toString()} onValueChange={(value) => handleChange('hasCoSigner', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Has co-signer?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No Co-Signer</SelectItem>
                    <SelectItem value="true">Has Co-Signer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.hasCoSigner && (
                <div className="md:col-span-2">
                  <Label htmlFor="coSignerName">Co-Signer Name</Label>
                  <Input
                    id="coSignerName"
                    value={formData.coSignerName}
                    onChange={(e) => handleChange('coSignerName', e.target.value)}
                    placeholder="Enter co-signer name"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes or comments"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (application ? 'Update Application' : 'Create Application')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}