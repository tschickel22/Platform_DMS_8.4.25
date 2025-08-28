import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { Contact } from '@/types/index'
import { mockContacts } from '@/mocks/contactsMock'
import { useToast } from '@/hooks/use-toast'

export default function ContactForm() {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createContact, updateContact, getContactById } = useContactManagement()
  const { accounts } = useAccountManagement()
  
  const isEditing = !!contactId
  const existingContact = isEditing ? getContactById(contactId) : null
  
  const isEditing = contactId !== 'new'
  const existingContact = isEditing ? getContact(contactId!) : null

  const [formData, setFormData] = useState<Partial<Contact>>({
    ...mockContacts.defaultContact,
    ...(existingContact || {})
  })
  const [saving, setSaving] = useState(false)
  // Load existing contact data when editing
  useEffect(() => {
    if (isEditing && existingContact) {
      setFormData({
        accountId: existingContact.accountId || '',
        firstName: existingContact.firstName,
        lastName: existingContact.lastName,
        email: existingContact.email || '',
        phone: existingContact.phone || '',
        title: existingContact.title || '',
        department: existingContact.department || '',
        notes: existingContact.notes || '',
        tags: existingContact.tags || [],
        customFields: existingContact.customFields || {}
      })
    }
  }, [isEditing, existingContact])

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isEditing && existingContact) {
      setFormData(existingContact)
    }
  }, [isEditing, existingContact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

      if (isEditing && contactId) {
        await updateContact(contactId, formData)
        toast({
          title: 'Success',
          description: 'Contact updated successfully'
        })
      } else {
        await createContact(formData)
        toast({
          title: 'Success',
          description: 'Contact created successfully'
        })
      }
      if (isEditing && contactId) {
        await updateContact(contactId, formData)
        toast({
          title: 'Contact Updated',
          description: 'Contact has been successfully updated.'
        })
      } else {
        await createContact(formData)
      navigate('/contacts')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save contact. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
          <div>
            <h1 className="ri-page-title">
              {isEditing ? 'Edit Contact' : 'New Contact'}
            </h1>
            <p className="ri-page-description">
              {isEditing ? 'Update contact information' : 'Create a new contact record'}
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
              <CardDescription>
                Personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.smith@example.com"
                  />
                </div>

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
              </div>

              <div>
                <Label htmlFor="accountId">Associated Account</Label>
                <Select 
                  value={formData.accountId || ''} 
                  onValueChange={(value) => handleInputChange('accountId', value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Account</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Job title, department, and role details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Select 
                  value={formData.title || ''} 
                  onValueChange={(value) => handleInputChange('title', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContacts.titleOptions.map(title => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department || ''} 
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContacts.departmentOptions.map(department => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add notes about this contact..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update contact information' : 'Create a new contact record'}
            </CardDescription>
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

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/contacts')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !formData.firstName || !formData.lastName}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : isEditing ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </div>
  )
}