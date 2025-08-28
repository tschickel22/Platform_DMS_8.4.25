import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { TagInput } from '@/components/common/TagInput'
import { ArrowLeft, Save, Building2 } from 'lucide-react'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { Contact } from '@/types'
import { useToast } from '@/hooks/use-toast'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'

export default function ContactForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getContactById, createContact, updateContact } = useContactManagement()
  const { accounts } = useAccountManagement()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const isEditing = !!id
  const preselectedAccountId = searchParams.get('accountId')

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    accountId: preselectedAccountId || '',
    isPrimary: false,
    preferredContactMethod: 'email' as 'email' | 'phone' | 'sms',
    tags: [] as string[]
  })

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load contact data for editing
  useEffect(() => {
    if (isEditing && id) {
      const contact = getContactById(id)
      if (contact) {
        setFormData({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email || '',
          phone: contact.phone || '',
          title: contact.title || '',
          department: contact.department || '',
          accountId: contact.accountId || '',
          isPrimary: !!contact.isPrimary,
          preferredContactMethod: contact.preferredContactMethod || 'email',
          tags: contact.tags || []
        })
      } else {
        toast({
          title: 'Error',
          description: 'Contact not found',
          variant: 'destructive'
        })
        navigate('/crm/contacts')
      }
    }
  }, [id, isEditing, getContactById, navigate, toast])

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

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

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)\.]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
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
      return
    }

    setLoading(true)
    try {
      if (isEditing && id) {
        const result = await updateContact(id, formData)
        if (result) {
          setHasUnsavedChanges(false)
          navigate(`/crm/contacts/${id}`)
        }
      } else {
        const result = await createContact(formData)
        if (result) {
          setHasUnsavedChanges(false)
          navigate(`/crm/contacts/${result.id}`)
        }
      }
    } catch (error) {
      console.error('Error saving contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(isEditing ? `/crm/contacts/${id}` : '/crm/contacts')
      }
    } else {
      navigate(isEditing ? `/crm/contacts/${id}` : '/crm/contacts')
    }
  }

  return (
    <ModuleErrorBoundary moduleName="Contact Form">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Contact' : 'New Contact'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update contact information' : 'Create a new contact'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Enter department"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountId">Account</Label>
                  <Select value={formData.accountId} onValueChange={(value) => handleInputChange('accountId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No account</SelectItem>
                      {(accounts || []).map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-3 w-3" />
                            <span>{account.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                  <Select 
                    value={formData.preferredContactMethod} 
                    onValueChange={(value) => handleInputChange('preferredContactMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput
                  tags={formData.tags}
                  onTagsChange={(tags) => handleInputChange('tags', tags)}
                  placeholder="Add tags..."
                  maxTags={10}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => handleInputChange('isPrimary', !!checked)}
                />
                <Label htmlFor="isPrimary">Primary contact for account</Label>
              </div>

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
          </CardContent>
        </Card>
      </div>
    </ModuleErrorBoundary>
  )
}