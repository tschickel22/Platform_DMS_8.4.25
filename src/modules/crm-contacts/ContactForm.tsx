import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ModernForm, 
  FormSection, 
  FormGrid, 
  TextField, 
  SelectField, 
  TagField 
} from '@/components/ui/modern-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Contact } from '@/types'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { useToast } from '@/hooks/use-toast'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  accountId: string
  title: string
  department: string
  isPrimary: boolean
  preferredContactMethod: 'email' | 'phone' | 'sms' | ''
  tags: string[]
  socialProfiles: {
    linkedin: string
    facebook: string
    twitter: string
  }
  preferences: {
    bestTimeToContact: string
    timezone: string
  }
  nextFollowUpDate: string
}

export default function ContactForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { contacts, createContact, updateContact, getContact } = useContactManagement()
  const { accounts } = useAccountManagement()

  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountId: '',
    title: '',
    department: '',
    isPrimary: false,
    preferredContactMethod: '',
    tags: [],
    socialProfiles: {
      linkedin: '',
      facebook: '',
      twitter: ''
    },
    preferences: {
      bestTimeToContact: '',
      timezone: 'America/New_York'
    },
    nextFollowUpDate: ''
  })

  const [originalData, setOriginalData] = useState<ContactFormData | null>(null)
  const hasUnsavedChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData)

  // Load contact data for editing
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true)
      try {
        const contact = getContact(id)
        if (contact) {
          const contactFormData: ContactFormData = {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email || '',
            phone: contact.phone || '',
            accountId: contact.accountId || '',
            title: contact.title || '',
            department: contact.department || '',
            isPrimary: contact.isPrimary || false,
            preferredContactMethod: contact.preferredContactMethod || '',
            tags: contact.tags || [],
            socialProfiles: {
              linkedin: contact.socialProfiles?.linkedin || '',
              facebook: contact.socialProfiles?.facebook || '',
              twitter: contact.socialProfiles?.twitter || ''
            },
            preferences: {
              bestTimeToContact: contact.preferences?.bestTimeToContact || '',
              timezone: contact.preferences?.timezone || 'America/New_York'
            },
            nextFollowUpDate: contact.nextFollowUpDate || ''
          }
          setFormData(contactFormData)
          setOriginalData(contactFormData)
        } else {
          toast({
            title: 'Contact Not Found',
            description: 'The contact you are looking for could not be found.',
            variant: 'destructive'
          })
          navigate('/crm/contacts')
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load contact data.',
          variant: 'destructive'
        })
        navigate('/crm/contacts')
      } finally {
        setLoading(false)
      }
    } else {
      setOriginalData(formData)
    }
  }, [id, isEditing, getContact, navigate, toast])

  const { navigateWithConfirm } = useUnsavedChanges({
    hasUnsavedChanges: !!hasUnsavedChanges,
    message: 'You have unsaved changes. Are you sure you want to leave?'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'notes'> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        accountId: formData.accountId || undefined,
        title: formData.title || undefined,
        department: formData.department || undefined,
        isPrimary: formData.isPrimary,
        ownerId: 'user-1', // TODO: Get from auth context
        preferredContactMethod: formData.preferredContactMethod || undefined,
        tags: formData.tags,
        socialProfiles: {
          linkedin: formData.socialProfiles.linkedin || undefined,
          facebook: formData.socialProfiles.facebook || undefined,
          twitter: formData.socialProfiles.twitter || undefined
        },
        preferences: {
          preferredContactMethod: formData.preferredContactMethod || undefined,
          bestTimeToContact: formData.preferences.bestTimeToContact || undefined,
          timezone: formData.preferences.timezone
        },
        nextFollowUpDate: formData.nextFollowUpDate || undefined
      }

      if (isEditing && id) {
        await updateContact(id, contactData)
        toast({
          title: 'Contact Updated',
          description: `${formData.firstName} ${formData.lastName} has been updated.`
        })
      } else {
        const newContact = await createContact(contactData)
        toast({
          title: 'Contact Created',
          description: `${formData.firstName} ${formData.lastName} has been created.`
        })
        navigate(`/crm/contacts/${newContact.id}`)
        return
      }

      navigate(`/crm/contacts/${id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} contact.`,
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      navigateWithConfirm('/crm/contacts')
    } else {
      navigate('/crm/contacts')
    }
  }

  if (loading) {
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Contact' : 'New Contact'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update contact information' : 'Add a new contact to your database'}
          </p>
        </div>
      </div>

      <ModernForm
        title={isEditing ? `Edit ${formData.firstName} ${formData.lastName}` : 'Create New Contact'}
        description={isEditing ? 'Update contact information and preferences' : 'Enter contact details and preferences'}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEditing ? 'Update Contact' : 'Create Contact'}
        isSubmitting={saving}
        hasUnsavedChanges={!!hasUnsavedChanges}
      >
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Essential contact details"
        >
          <FormGrid>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
              placeholder="Enter first name"
              required
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
              placeholder="Enter last name"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              placeholder="Enter email address"
            />
            <TextField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
              placeholder="Enter phone number"
            />
          </FormGrid>
        </FormSection>

        {/* Account & Role Information */}
        <FormSection
          title="Account & Role"
          description="Link to account and define role"
        >
          <FormGrid>
            <div className="space-y-2">
              <Label>Account</Label>
              <Select 
                value={formData.accountId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an account (optional)" />
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
            <TextField
              label="Job Title"
              value={formData.title}
              onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
              placeholder="Enter job title"
            />
            <TextField
              label="Department"
              value={formData.department}
              onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              placeholder="Enter department"
            />
            <SelectField
              label="Preferred Contact Method"
              value={formData.preferredContactMethod}
              onChange={(value) => setFormData(prev => ({ ...prev, preferredContactMethod: value as any }))}
              options={[
                { value: '', label: 'No preference' },
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'sms', label: 'SMS' }
              ]}
              placeholder="Select preferred method"
            />
          </FormGrid>
        </FormSection>

        {/* Tags & Preferences */}
        <FormSection
          title="Tags & Preferences"
          description="Categorization and communication preferences"
        >
          <FormGrid>
            <div className="md:col-span-2">
              <TagField
                label="Tags"
                tags={formData.tags}
                onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                placeholder="Add tags to categorize this contact..."
                maxTags={10}
              />
            </div>
            <TextField
              label="Best Time to Contact"
              value={formData.preferences.bestTimeToContact}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                preferences: { ...prev.preferences, bestTimeToContact: value }
              }))}
              placeholder="e.g., Weekdays 9am-5pm"
            />
            <SelectField
              label="Timezone"
              value={formData.preferences.timezone}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                preferences: { ...prev.preferences, timezone: value }
              }))}
              options={[
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' }
              ]}
            />
          </FormGrid>
        </FormSection>

        {/* Social Profiles */}
        <FormSection
          title="Social Profiles"
          description="Social media and professional profiles"
        >
          <FormGrid>
            <TextField
              label="LinkedIn"
              type="url"
              value={formData.socialProfiles.linkedin}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                socialProfiles: { ...prev.socialProfiles, linkedin: value }
              }))}
              placeholder="LinkedIn profile URL"
            />
            <TextField
              label="Facebook"
              type="url"
              value={formData.socialProfiles.facebook}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                socialProfiles: { ...prev.socialProfiles, facebook: value }
              }))}
              placeholder="Facebook profile URL"
            />
            <TextField
              label="Twitter"
              type="url"
              value={formData.socialProfiles.twitter}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                socialProfiles: { ...prev.socialProfiles, twitter: value }
              }))}
              placeholder="Twitter profile URL"
            />
            <div className="space-y-2">
              <Label>Next Follow-up Date</Label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.nextFollowUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, nextFollowUpDate: e.target.value }))}
              />
            </div>
          </FormGrid>
        </FormSection>
      </ModernForm>
    </div>
  )
}