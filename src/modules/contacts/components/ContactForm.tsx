import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, User } from 'lucide-react'
import { useContactManagement } from '../hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { Contact } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { TagInput } from '@/components/common/TagInput'
import mockCompanySettings from '@/mocks/companySettingsMock'
import { useReturnTargets, ReturnToBehavior } from '@/hooks/useReturnTargets'

interface ContactFormState {
  accountId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  department: string
  notes: string
  tags: string[]
  customFields: Record<string, any>
}

type Props = ReturnToBehavior & {
  contactId?: string
}

export default function ContactForm(props: Props) {
  const { contactId } = useParams<{ contactId: string }>()
  const actualContactId = props.contactId || contactId
  const navigate = useNavigate()
  const { accountId, afterSave } = useReturnTargets(props)
  const { toast } = useToast()
  
  const { 
    contacts, 
    createContact, 
    updateContact, 
    loading: contactsLoading 
  } = useContactManagement()
  
  const { accounts } = useAccountManagement()
  
  const [loading, setLoading] = useState(false)
  const isEditing = !!actualContactId
  
  const [formData, setFormData] = useState<ContactFormState>({
    accountId: accountId || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    notes: '',
    tags: [],
    customFields: {}
  })

  useEffect(() => {
    if (isEditing && actualContactId) {
      const contact = contacts.find(c => c.id === actualContactId)
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
    }
  }, [isEditing, actualContactId, contacts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let savedContact: Contact | null = null
      
      if (isEditing) {
        savedContact = await updateContact(actualContactId!, formData)
        toast({
          title: 'Success',
          description: 'Contact updated successfully'
        })
      } else {
        savedContact = await createContact(formData)
        toast({
          title: 'Success',
          description: 'Contact created successfully'
        })
      }
      
      afterSave(savedContact, '/contacts')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save contact',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (props.onSaved) {
      props.onSaved(null) // Close modal without saving
    } else {
      navigate('/contacts')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {!props.onSaved && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Contact' : 'New Contact'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update contact information' : 'Add a new contact to your CRM'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {props.onSaved && (
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Contact' : 'New Contact'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing ? 'Update contact information' : 'Add a new contact'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Basic contact details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountId">Account</Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => setFormData({ ...formData, accountId: value })}
                  disabled={!!accountId} // Disable if pre-filled from account context
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Account</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Select
                  value={formData.title}
                  onValueChange={(value) => setFormData({ ...formData, title: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanySettings.defaults.titleOptions?.map((title) => (
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
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanySettings.defaults.departmentOptions?.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes about this contact..."
              />
            </div>
            
            <div>
              <Label>Tags</Label>
              <TagInput
                tags={formData.tags}
                onTagsChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags..."
                suggestions={['VIP', 'Decision Maker', 'Technical Contact', 'Financial Contact']}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : isEditing ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </div>
  )
}