import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Account, AccountType } from '@/types'
import { mockAccounts } from '@/mocks/accountsMock'
import { generateId } from '@/lib/utils'
import { TagInput } from '@/components/common/TagInput'

interface AccountFormProps {
  account?: Account
  onSave?: (account: Account) => void
  onCancel?: () => void
}

export default function AccountForm({ account, onSave, onCancel }: AccountFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || AccountType.PROSPECT,
    industry: account?.industry || '',
    website: account?.website || '',
    phone: account?.phone || '',
    email: account?.email || '',
    street: account?.address?.street || '',
    city: account?.address?.city || '',
    state: account?.address?.state || '',
    zipCode: account?.address?.zipCode || '',
    country: account?.address?.country || 'USA',
    notes: account?.notes || '',
    tags: account?.tags || [],
    preferredContactMethod: account?.customFields?.preferredContactMethod || 'email',
    creditRating: account?.customFields?.creditRating || '',
    lifetimeValue: account?.customFields?.lifetimeValue || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const accountData: Account = {
        id: account?.id || generateId(),
        name: formData.name,
        type: formData.type,
        industry: formData.industry || undefined,
        website: formData.website || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        notes: formData.notes || undefined,
        tags: formData.tags,
        customFields: {
          preferredContactMethod: formData.preferredContactMethod,
          creditRating: formData.creditRating,
          lifetimeValue: formData.lifetimeValue,
          ...account?.customFields
        },
        createdAt: account?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: account?.createdBy || 'current-user',
        updatedBy: 'current-user'
      }

      onSave?.(accountData)
      
      toast({
        title: 'Success',
        description: `Account ${account ? 'updated' : 'created'} successfully`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save account',
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
        <CardTitle>{account ? 'Edit Account' : 'New Account'}</CardTitle>
        <CardDescription>
          {account ? 'Update account information' : 'Create a new account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts.accountTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts.industryOptions.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <Select value={formData.preferredContactMethod} onValueChange={(value) => handleChange('preferredContactMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="text">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="creditRating">Credit Rating</Label>
                <Select value={formData.creditRating} onValueChange={(value) => handleChange('creditRating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Austin"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="TX"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="78701"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div>
              <Label htmlFor="lifetimeValue">Estimated Lifetime Value</Label>
              <Input
                id="lifetimeValue"
                type="number"
                value={formData.lifetimeValue}
                onChange={(e) => handleChange('lifetimeValue', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                tags={formData.tags}
                onTagsChange={(tags) => handleChange('tags', tags)}
                placeholder="Add tags..."
                suggestions={['VIP Customer', 'High Value', 'Referral Source', 'Commercial', 'First Time Buyer']}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes about this account"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (account ? 'Update Account' : 'Create Account')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}