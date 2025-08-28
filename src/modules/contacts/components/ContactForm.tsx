import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { mockContacts } from '@/mocks/contactsMock'
import { mockAccounts } from '@/mocks/accountsMock'

export default function ContactForm() {
  const navigate = useNavigate()
  const { contactId } = useParams()
  const { toast } = useToast()
  const { createContact, updateContact, getContactById } = useContactManagement()
  
  const isEditing = !!contactId
  
  const [formData, setFormData] = useState({
    accountId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    notes: '',
    tags: [] as string[],
    customFields: {}
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  // Load existing contact data if editing
  useEffect(() => {
    if (isEditing && contactId) {
      const loadContact = async () => {
        try {
          const contact = await getContactById(contactId)
          if (contact) {
            setFormData({
              accountId: contact.accountId || '',
              firstName: contact.firstName,
              lastName: contact.lastName,
              email: contact.email || '',
              phone: contact.phone || '',
              title: contact.title || '',
              department: contact.department || '',
              notes: contact.notes || '',
              tags: contact.tags || [],
              customFields: contact.customFields || {}
            })
          }
        } catch (error) {
          console.error('Failed to load contact:', error)
          toast({
            title: 'Error',
            description: 'Failed to load contact data',
            variant: 'destructive'
          })
        } finally {
          setInitialLoading(false)
        }
      }
      loadContact()
    }
  }, [contactId, isEditing, getContactById, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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
      navigate('/contacts')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save contact. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contact...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Edit Contact' : 'New Contact'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Update contact information' : 'Add a new contact to your CRM'}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Contact' : 'Contact Information'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update the contact details below' : 'Enter the contact details below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Selection */}
            <div className="space-y-2">
              <Label htmlFor="accountId">Account (Optional)</Label>
              <Select value={formData.accountId} onValueChange={(value) => handleInputChange('accountId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Account</SelectItem>
                  {mockAccounts.sampleAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Job Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Select value={formData.title} onValueChange={(value) => handleInputChange('title', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContacts.titleOptions.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContacts.departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/contacts')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Contact' : 'Create Contact'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}