import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModernForm, TextField, SelectField, TagField, CheckboxField, FormSection, FormGrid } from '@/components/ui/modern-form'
import { DetailRouteGuard, EntityNotFoundGuard } from '@/components/ui/route-guard'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { EntityChip } from '@/components/ui/entity-chip'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { Contact } from '@/types'
import { logger } from '@/utils/logger'
import { useToast } from '@/hooks/use-toast'

const contactMethodOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' }
]

const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' }
]

export default function ContactForm() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getContactById, createContact, updateContact } = useContactManagement()
  const { accounts, getAccountById } = useAccountManagement()
  
  const isEditing = !!id
  const contact = isEditing ? getContactById(id) : null
  const preselectedAccountId = searchParams.get('accountId')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    accountId: preselectedAccountId || '',
    isPrimary: false,
    preferredContactMethod: 'email' as const,
    tags: [] as string[],
    preferences: {
      bestTimeToContact: '',
      timezone: 'America/New_York'
    },
    socialProfiles: {
      linkedin: '',
      facebook: '',
      twitter: ''
    }
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)

  // Load contact data for editing
  useEffect(() => {
    if (isEditing && contact) {
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email || '',
        phone: contact.phone || '',
        title: contact.title || '',
        department: contact.department || '',
        accountId: contact.accountId || '',
        isPrimary: contact.isPrimary || false,
        preferredContactMethod: contact.preferredContactMethod || 'email',
        tags: contact.tags || [],
        preferences: {
          bestTimeToContact: contact.preferences?.bestTimeToContact || '',
          timezone: contact.preferences?.timezone || 'America/New_York'
        },
        socialProfiles: {
          linkedin: contact.socialProfiles?.linkedin || '',
          facebook: contact.socialProfiles?.facebook || '',
          twitter: contact.socialProfiles?.twitter || ''
        }
      })
    }
  }, [isEditing, contact])

  // Track unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!isEditing) return Object.values(formData).some(value => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') return Object.values(value).some(v => v !== '')
      return value !== '' && value !== false && value !== 'email'
    })
    
    if (!contact) return false
    
    return (
      formData.firstName !== contact.firstName ||
      formData.lastName !== contact.lastName ||
      formData.email !== (contact.email || '') ||
      formData.phone !== (contact.phone || '') ||
      formData.title !== (contact.title || '') ||
      formData.department !== (contact.department || '') ||
      formData.accountId !== (contact.accountId || '') ||
      formData.isPrimary !== (contact.isPrimary || false) ||
      formData.preferredContactMethod !== (contact.preferredContactMethod || 'email') ||
      JSON.stringify(formData.tags) !== JSON.stringify(contact.tags || []) ||
      formData.preferences.bestTimeToContact !== (contact.preferences?.bestTimeToContact || '') ||
      formData.preferences.timezone !== (contact.preferences?.timezone || 'America/New_York') ||
      formData.socialProfiles.linkedin !== (contact.socialProfiles?.linkedin || '') ||
      formData.socialProfiles.facebook !== (contact.socialProfiles?.facebook || '') ||
      formData.socialProfiles.twitter !== (contact.socialProfiles?.twitter || '')
    )
  }, [formData, contact, isEditing])

  const { showConfirmDialog, confirmNavigation, cancelNavigation } = useUnsavedChanges({
    hasUnsavedChanges,
    message: 'You have unsaved changes. Are you sure you want to leave?'
  })

  useEffect(() => {
    logger.pageView(isEditing ? `/crm/contacts/${id}/edit` : '/crm/contacts/new')
  }, [isEditing, id])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.email && !formData.phone) {
      newErrors.email = 'Either email or phone is required'
      newErrors.phone = 'Either email or phone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const contactData = {
        ...formData,
        preferences: formData.preferences.bestTimeToContact || formData.preferences.timezone !== 'America/New_York' 
          ? formData.preferences 
          : undefined,
        socialProfiles: Object.values(formData.socialProfiles).some(v => v) 
          ? formData.socialProfiles 
          : undefined
      }

      if (isEditing && contact) {
        await updateContact(contact.id, contactData)
        logger.userAction('contact_updated', { 
          contactId: contact.id, 
          contactName: `${formData.firstName} ${formData.lastName}` 
        })
        toast({
          title: 'Contact Updated',
          description: `${formData.firstName} ${formData.lastName} has been updated successfully`
        })
      } else {
        const newContact = await createContact(contactData)
        logger.userAction('contact_created', { 
          contactId: newContact.id, 
          contactName: `${formData.firstName} ${formData.lastName}`,
          accountId: formData.accountId || undefined
        })
        toast({
          title: 'Contact Created',
          description: `${formData.firstName} ${formData.lastName} has been created successfully`
        })
      }
      
      navigate('/crm/contacts')
    } catch (error) {
      console.error('Error saving contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to save contact. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      navigate('/crm/contacts')
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Account options for dropdown
  const accountOptions = accounts.map(account => ({
    value: account.id,
    label: account.name
  }))

  const selectedAccount = formData.accountId ? getAccountById(formData.accountId) : null

  function ContactFormContent() {
    return (
      <div className="max-w-4xl mx-auto">
        <ModernForm
          title={isEditing ? 'Edit Contact' : 'Create New Contact'}
          description={isEditing ? 'Update contact information and preferences' : 'Add a new contact to your CRM'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isEditing ? 'Update Contact' : 'Create Contact'}
          isSubmitting={isSubmitting}
          hasUnsavedChanges={hasUnsavedChanges}
        >
          <FormSection
            title="Basic Information"
            description="Essential contact details and identification"
          >
            <FormGrid>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(value) => handleFieldChange('firstName', value)}
                placeholder="Enter first name"
                required
                error={errors.firstName}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(value) => handleFieldChange('lastName', value)}
                placeholder="Enter last name"
                required
                error={errors.lastName}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value)}
                placeholder="contact@email.com"
                error={errors.email}
              />
              <TextField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleFieldChange('phone', value)}
                placeholder="(555) 123-4567"
                error={errors.phone}
              />
              <TextField
                label="Job Title"
                value={formData.title}
                onChange={(value) => handleFieldChange('title', value)}
                placeholder="e.g., Sales Manager"
              />
              <TextField
                label="Department"
                value={formData.department}
                onChange={(value) => handleFieldChange('department', value)}
                placeholder="e.g., Sales, Service"
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Account Association"
            description="Link this contact to a business account"
          >
            <FormGrid>
              <div className="space-y-2">
                <SelectField
                  label="Account"
                  value={formData.accountId}
                  onChange={(value) => handleFieldChange('accountId', value)}
                  options={[
                    { value: '', label: 'No account' },
                    ...accountOptions
                  ]}
                  placeholder="Select an account"
                />
                {selectedAccount && (
                  <div className="mt-2">
                    <EntityChip
                      type="account"
                      id={selectedAccount.id}
                      name={selectedAccount.name}
                      email={selectedAccount.email}
                      industry={selectedAccount.industry}
                      linkTo={`/crm/accounts/${selectedAccount.id}`}
                    />
                  </div>
                )}
              </div>
              <CheckboxField
                label="Primary contact for this account"
                checked={formData.isPrimary}
                onChange={(checked) => handleFieldChange('isPrimary', checked)}
                description="Mark as the main point of contact"
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Communication Preferences"
            description="How and when to contact this person"
          >
            <FormGrid>
              <SelectField
                label="Preferred Contact Method"
                value={formData.preferredContactMethod}
                onChange={(value) => handleFieldChange('preferredContactMethod', value)}
                options={contactMethodOptions}
              />
              <TextField
                label="Best Time to Contact"
                value={formData.preferences.bestTimeToContact}
                onChange={(value) => handleFieldChange('preferences.bestTimeToContact', value)}
                placeholder="e.g., Weekdays 9am-5pm"
              />
              <SelectField
                label="Timezone"
                value={formData.preferences.timezone}
                onChange={(value) => handleFieldChange('preferences.timezone', value)}
                options={timezoneOptions}
              />
              <TagField
                label="Tags"
                tags={formData.tags}
                onChange={(tags) => handleFieldChange('tags', tags)}
                placeholder="Add tags to categorize this contact"
                description="Use tags to organize and filter contacts"
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Social Profiles"
            description="Social media and professional profiles (optional)"
          >
            <FormGrid>
              <TextField
                label="LinkedIn"
                value={formData.socialProfiles.linkedin}
                onChange={(value) => handleFieldChange('socialProfiles.linkedin', value)}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />
              <TextField
                label="Facebook"
                value={formData.socialProfiles.facebook}
                onChange={(value) => handleFieldChange('socialProfiles.facebook', value)}
                placeholder="https://facebook.com/username"
                type="url"
              />
              <TextField
                label="Twitter"
                value={formData.socialProfiles.twitter}
                onChange={(value) => handleFieldChange('socialProfiles.twitter', value)}
                placeholder="https://twitter.com/username"
                type="url"
              />
            </FormGrid>
          </FormSection>
        </ModernForm>

        {/* Unsaved Changes Dialog */}
        <ConfirmationDialog
          open={showUnsavedDialog}
          onOpenChange={setShowUnsavedDialog}
          title="Unsaved Changes"
          description="You have unsaved changes that will be lost. Are you sure you want to leave?"
          confirmLabel="Leave Without Saving"
          cancelLabel="Stay on Page"
          onConfirm={() => navigate('/crm/contacts')}
          onCancel={() => setShowUnsavedDialog(false)}
          variant="destructive"
        />

        {/* Navigation Confirmation Dialog */}
        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={() => {}}
          title="Unsaved Changes"
          description="You have unsaved changes. What would you like to do?"
          confirmLabel="Leave Without Saving"
          cancelLabel="Stay on Page"
          onConfirm={confirmNavigation}
          onCancel={cancelNavigation}
          variant="destructive"
        />
      </div>
    )
  }

  if (isEditing) {
    return (
      <DetailRouteGuard
        entityId={id}
        entityName="Contact"
        listPath="/crm/contacts"
        moduleName="Contacts"
      >
        <EntityNotFoundGuard
          entity={contact}
          entityName="Contact"
          listPath="/crm/contacts"
        >
          <ContactFormContent />
        </EntityNotFoundGuard>
      </DetailRouteGuard>
    )
  }

  function ContactFormContent() {
    return (
      <div className="max-w-4xl mx-auto">
        <ModernForm
          title={isEditing ? 'Edit Contact' : 'Create New Contact'}
          description={isEditing ? 'Update contact information and preferences' : 'Add a new contact to your CRM'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isEditing ? 'Update Contact' : 'Create Contact'}
          isSubmitting={isSubmitting}
          hasUnsavedChanges={hasUnsavedChanges}
        >
          <FormSection
            title="Basic Information"
            description="Essential contact details and identification"
          >
            <FormGrid>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(value) => handleFieldChange('firstName', value)}
                placeholder="Enter first name"
                required
                error={errors.firstName}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(value) => handleFieldChange('lastName', value)}
                placeholder="Enter last name"
                required
                error={errors.lastName}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value)}
                placeholder="contact@email.com"
                error={errors.email}
              />
              <TextField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleFieldChange('phone', value)}
                placeholder="(555) 123-4567"
                error={errors.phone}
              />
              <TextField
                label="Job Title"
                value={formData.title}
                onChange={(value) => handleFieldChange('title', value)}
                placeholder="e.g., Sales Manager"
              />
              <TextField
                label="Department"
                value={formData.department}
                onChange={(value) => handleFieldChange('department', value)}
                placeholder="e.g., Sales, Service"
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Account Association"
            description="Link this contact to a business account"
          >
            <FormGrid>
              <div className="space-y-2">
                <SelectField
                  label="Account"
                  value={formData.accountId}
                  onChange={(value) => handleFieldChange('accountId', value)}
                  options={[
                    { value: '', label: 'No account' },
                    ...accountOptions
                  ]}
                  placeholder="Select an account"
                />
                {selectedAccount && (
                  <div className="mt-2">
                    <EntityChip
                      type="account"
                      id={selectedAccount.id}
                      name={selectedAccount.name}
                      email={selectedAccount.email}
                      industry={selectedAccount.industry}
                      linkTo={`/crm/accounts/${selectedAccount.id}`}
                    />
                  </div>
                )}
              </div>
              <CheckboxField
                label="Primary contact for this account"
                checked={formData.isPrimary}
                onChange={(checked) => handleFieldChange('isPrimary', checked)}
                description="Mark as the main point of contact"
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Communication Preferences"
            description="How and when to contact this person"
          >
            <FormGrid>
              <SelectField
                label="Preferred Contact Method"
                value={formData.preferredContactMethod}
                onChange={(value) => handleFieldChange('preferredContactMethod', value)}
                options={contactMethodOptions}
              />
              <TextField
                label="Best Time to Contact"
                value={formData.preferences.bestTimeToContact}
                onChange={(value) => handleFieldChange('preferences.bestTimeToContact', value)}
                placeholder="e.g., Weekdays 9am-5pm"
              />
              <SelectField
                label="Timezone"
                value={formData.preferences.timezone}
                onChange={(value) => handleFieldChange('preferences.timezone', value)}
                options={timezoneOptions}
              />
              <TagField
                label="Tags"
                tags={formData.tags}
                onChange={(tags) => handleFieldChange('tags', tags)}
                placeholder="Add tags to categorize this contact"
                description="Use tags to organize and filter contacts"
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Social Profiles"
            description="Social media and professional profiles (optional)"
          >
            <FormGrid>
              <TextField
                label="LinkedIn"
                value={formData.socialProfiles.linkedin}
                onChange={(value) => handleFieldChange('socialProfiles.linkedin', value)}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />
              <TextField
                label="Facebook"
                value={formData.socialProfiles.facebook}
                onChange={(value) => handleFieldChange('socialProfiles.facebook', value)}
                placeholder="https://facebook.com/username"
                type="url"
              />
              <TextField
                label="Twitter"
                value={formData.socialProfiles.twitter}
                onChange={(value) => handleFieldChange('socialProfiles.twitter', value)}
                placeholder="https://twitter.com/username"
                type="url"
              />
            </FormGrid>
          </FormSection>
        </ModernForm>

        {/* Unsaved Changes Dialog */}
        <ConfirmationDialog
          open={showUnsavedDialog}
          onOpenChange={setShowUnsavedDialog}
          title="Unsaved Changes"
          description="You have unsaved changes that will be lost. Are you sure you want to leave?"
          confirmLabel="Leave Without Saving"
          cancelLabel="Stay on Page"
          onConfirm={() => navigate('/crm/contacts')}
          onCancel={() => setShowUnsavedDialog(false)}
          variant="destructive"
        />

        {/* Navigation Confirmation Dialog */}
        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={() => {}}
          title="Unsaved Changes"
          description="You have unsaved changes. What would you like to do?"
          confirmLabel="Leave Without Saving"
          cancelLabel="Stay on Page"
          onConfirm={confirmNavigation}
          onCancel={cancelNavigation}
          variant="destructive"
        />
      </div>
    )
  }

  return <ContactFormContent />
}