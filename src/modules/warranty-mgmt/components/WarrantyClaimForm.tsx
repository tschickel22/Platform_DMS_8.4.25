import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WarrantyClaimFormProps {
  onSubmit: (claimData: any) => void
  onCancel: () => void
  initialData?: any
}

export function WarrantyClaimForm({ onSubmit, onCancel, initialData }: WarrantyClaimFormProps) {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    customerEmail: initialData?.customerEmail || '',
    customerPhone: initialData?.customerPhone || '',
    vehicleVin: initialData?.vehicleVin || '',
    vehicleMake: initialData?.vehicleMake || '',
    vehicleModel: initialData?.vehicleModel || '',
    vehicleYear: initialData?.vehicleYear || '',
    issueDescription: initialData?.issueDescription || '',
    claimType: initialData?.claimType || '',
    priority: initialData?.priority || 'medium',
    warrantyProvider: initialData?.warrantyProvider || '',
    purchaseDate: initialData?.purchaseDate || '',
    warrantyExpirationDate: initialData?.warrantyExpirationDate || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const claimData = {
      ...formData,
      id: initialData?.id || `claim-${Date.now()}`,
      status: initialData?.status || 'pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    onSubmit(claimData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vehicleVin">VIN *</Label>
              <Input
                id="vehicleVin"
                value={formData.vehicleVin}
                onChange={(e) => handleChange('vehicleVin', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  id="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={(e) => handleChange('vehicleYear', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vehicleMake">Make</Label>
                <Input
                  id="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={(e) => handleChange('vehicleMake', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="vehicleModel">Model</Label>
              <Input
                id="vehicleModel"
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claim Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Claim Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claimType">Claim Type *</Label>
              <Select value={formData.claimType} onValueChange={(value) => handleChange('claimType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="warrantyProvider">Warranty Provider</Label>
            <Input
              id="warrantyProvider"
              value={formData.warrantyProvider}
              onChange={(e) => handleChange('warrantyProvider', e.target.value)}
              placeholder="e.g., Extended Service Contract, Manufacturer"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="warrantyExpirationDate">Warranty Expiration</Label>
              <Input
                id="warrantyExpirationDate"
                type="date"
                value={formData.warrantyExpirationDate}
                onChange={(e) => handleChange('warrantyExpirationDate', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="issueDescription">Issue Description *</Label>
            <Textarea
              id="issueDescription"
              value={formData.issueDescription}
              onChange={(e) => handleChange('issueDescription', e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Claim' : 'Create Claim'}
        </Button>
      </div>
    </form>
  )
}