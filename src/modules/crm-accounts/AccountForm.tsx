import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModernForm, TextField, SelectField, TagField, FormSection, FormGrid } from '@/components/ui/modern-form'
import { DetailRouteGuard, EntityNotFoundGuard } from '@/components/ui/route-guard'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { useAccountManagement } from './hooks/useAccountManagement'
import { Account } from '@/types'
import { logger } from '@/utils/logger'
import { useToast } from '@/hooks/use-toast'

const industryOptions = [
  { value: 'RV Dealership', label: 'RV Dealership' },
  { value: 'Manufactured Home Dealer', label: 'Manufactured Home Dealer' },
  { value: 'RV Rental', label: 'RV Rental' },
  { value: 'Mobile Home Park', label: 'Mobile Home Park' },
  { value: 'Auto Dealership', label: 'Auto Dealership' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Other', label: 'Other' }
]

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Prospect', label: 'Prospect' },
  { value: 'Former', label: 'Former' }
]

export default function AccountForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getAccountById, createAccount, updateAccount } = useAccountManagement()
  
  const isEditing = !!id
  const account = isEditing ? getAccountById(id) : null
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    industry: '',
    status: 'Active',
    tags: [] as string[]
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)

  // Load account data for editing
  useEffect(() => {
    if (isEditing && account) {
      setFormData({
        name: account.name,
        email: account.email || '',
        phone: account.phone || '',
        website: account.website || '',
        address: account.address || '',
        industry: account.industry || '',
        status: account.status || 'Active',
        tags: account.tags || []
      })
    }
  }, [isEditing, account])

  // Track unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!isEditing) return Object.values(formData).some(value => 
      Array.isArray(value) ? value.length > 0 : value !== ''
    )
    
    if (!account) return false
    
    return (
      formData.name !== account.name ||
      formData.email !== (account.email || '') ||
      formData.phone !== (account.phone || '') ||
      formData.website !== (account.website || '') ||
      formData.address !== (account.address || '') ||
      formData.industry !== (account.industry || '') ||
      formData.status !== (account.status || 'Active') ||
      JSON.stringify(formData.tags) !== JSON.stringify(account.tags || [])
    )
  }, [formData, account, isEditing])

  const { showConfirmDialog, confirmNavigation, cancelNavigation, navigateWithConfirm } = useUnsavedChanges({
    hasUnsavedChanges,
    message: 'You have unsaved changes. Are you sure you want to leave?'
  })

  useEffect(() => {
    logger.pageView(isEditing ? `/crm/accounts/${id}/edit` : '/crm/accounts/new')
  }, [isEditing, id])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.website && !formData.website.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
      newErrors.website = 'Please enter a valid website URL'
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
      if (isEditing && account) {
        await updateAccount(account.id, formData)
        logger.userAction('account_updated', { accountId: account.id, accountName: formData.name })
        toast({
          title: 'Account Updated',
          description: `${formData.name} has been updated successfully`
        })
      } else {
        const newAccount = await createAccount(formData)
        logger.userAction('account_created', { accountId: newAccount.id, accountName: formData.name })
        toast({
          title: 'Account Created',
          description: `${formData.name} has been created successfully`
        })
      }
      
      navigate('/crm/accounts')
    } catch (error) {
      console.error('Error saving account:', error)
      toast({
        title: 'Error',
        description: 'Failed to save account. Please try again.',
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
      navigate('/crm/accounts')
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (isEditing) {
    return (
      <DetailRouteGuard
        entityId={id}
        entityName="Account"
        listPath="/crm/accounts"
        moduleName="Accounts"
      >
        <EntityNotFoundGuard
          entity={account}
          entityName="Account"
          listPath="/crm/accounts"
        >
          <AccountFormContent />
        </EntityNotFoundGuard>
      </DetailRouteGuard>
    )
  }

  function AccountFormContent() {
    return (
      <div className="max-w-4xl mx-auto">
        <ModernForm
          title={isEditing ? 'Edit Account' : 'Create New Account'}
          description={isEditing ? 'Update account information and settings' : 'Add a new business account to your CRM'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isEditing ? 'Update Account' : 'Create Account'}
          isSubmitting={isSubmitting}
          hasUnsavedChanges={hasUnsavedChanges}
        >
          <FormSection
            title="Basic Information"
            description="Essential account details and contact information"
          >
            <FormGrid>
              <TextField
                label="Account Name"
                value={formData.name}
                onChange={(value) => handleFieldChange('name', value)}
                placeholder="Enter account name"
                required
                error={errors.name}
              />
              <SelectField
                label="Industry"
                value={formData.industry}
                onChange={(value) => handleFieldChange('industry', value)}
                options={industryOptions}
                placeholder="Select industry"
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value)}
                placeholder="contact@company.com"
                error={errors.email}
              />
              <TextField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleFieldChange('phone', value)}
                placeholder="(555) 123-4567"
              />
              <TextField
                label="Website"
                type="url"
                value={formData.website}
                onChange={(value) => handleFieldChange('website', value)}
                placeholder="www.company.com"
                error={errors.website}
              />
              <SelectField
                label="Status"
                value={formData.status}
                onChange={(value) => handleFieldChange('status', value)}
                options={statusOptions}
              />
            </FormGrid>
          </FormSection>

          <FormSection
            title="Additional Details"
            description="Address, tags, and other account information"
          >
            <FormGrid columns={1}>
              <TextField
                label="Address"
                value={formData.address}
                onChange={(value) => handleFieldChange('address', value)}
                placeholder="123 Main St, City, State 12345"
              />
              <TagField
                label="Tags"
                tags={formData.tags}
                onChange={(tags) => handleFieldChange('tags', tags)}
                placeholder="Add tags to categorize this account"
                description="Use tags to organize and filter accounts"
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
          onConfirm={() => navigate('/crm/accounts')}
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

  return <AccountFormContent />
}