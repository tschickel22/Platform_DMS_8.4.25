import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'            // ✅ added
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TagInput } from '@/components/common/TagInput'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Account, AccountType } from '@/types/index'
import { mockAccounts } from '@/mocks/accountsMock'
import { useToast } from '@/hooks/use-toast'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement' // ✅ added

export default function AccountForm() {
  const { accountId } = useParams<{ accountId?: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getAccount, createAccount, updateAccount } = useAccountManagement()

  // ✅ only editing when an id exists (e.g. /accounts/:accountId/edit)
  const isEditing = !!accountId && accountId !== 'new'
  const existingAccount = isEditing ? getAccount(accountId!) : null

  const [formData, setFormData] = useState<Partial<Account>>({
    ...mockAccounts.defaultAccount,
    ...(existingAccount || {})
  })
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isEditing && existingAccount) {
      setFormData(existingAccount)
    }
  }, [isEditing, existingAccount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEditing && accountId) {
        await updateAccount(accountId, formData)
        toast({ title: 'Account Updated', description: 'Account has been successfully updated.' })
      } else {
        await createAccount(formData)
        toast({ title: 'Account Created', description: 'New account has been successfully created.' })
      }
      navigate('/accounts')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save account. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      // ✅ guard against undefined address
      address: { ...(prev.address ?? {}), [field]: value }
    }))
  }

  const handleAddTag = () => {
    const t = tagInput.trim()
    if (t && !formData.tags?.includes(t)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), t] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) || [] }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
          <div>
            <h1 className="ri-page-title">
              {isEditing ? 'Edit Account' : 'New Account'}
            </h1>
            <p className="ri-page-description">
              {isEditing ? 'Update account information' : 'Create a new account record'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Account Type *</Label>
                <Select
                  value={(formData.type as string) || AccountType.PROSPECT}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
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
                <Select
                  value={(formData.industry as string) || ''}
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
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
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Physical address and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address?.street || ''}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.address?.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="TX"
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <TagInput
                  tags={formData.tags}
                  onTagsChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                  placeholder="Add tags to categorize this account..."
                  suggestions={[
                    'VIP Customer',
                    'High Value',
                    'Commercial',
                    'Referral Source',
                    'Preferred Vendor',
                    'Strategic Partner',
                    'First Time Buyer',
                    'Repeat Customer',
                    'Luxury Buyer',
                    'Budget Conscious'
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.address?.country || 'USA'}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    placeholder="USA"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags and Notes */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to categorize and organize accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                />
                <Button type="button" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information and comments</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add notes about this account..."
                rows={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/accounts')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !formData.name}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : isEditing ? 'Update Account' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  )
}
