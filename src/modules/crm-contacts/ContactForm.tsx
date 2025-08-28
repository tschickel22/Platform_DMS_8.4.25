import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '../crm-accounts/hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { TagInput } from '@/components/common/TagInput'
import { useToast } from '@/hooks/use-toast'
import { TagInput } from '@/components/common/TagInput'

export default function ContactForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getContactById, createContact, updateContact, loading, error } = useContactManagement()
  const { accounts, loading: accountsLoading } = useAccountManagement()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [accountId, setAccountId] = useState<string | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    accountId: '',
    title: '',
    department: '',
    isPrimary: false,
    tags: [] as string[],
    preferences: {
      preferredContactMethod: 'email' as 'email' | 'phone' | 'sms',
      bestTimeToContact: '',
      timezone: ''
    },
    socialProfiles: {
      linkedin: '',
      facebook: '',
      twitter: ''
    },
    nextFollowUpDate: ''
  })

  useEffect(() => {
    if (id) {
      const contact = getContactById(id)
      if (contact) {
        setFirstName(contact.firstName || '')
        setLastName(contact.lastName || '')
        setEmail(contact.email || '')
        setPhone(contact.phone || '')
        setAccountId(contact.accountId || undefined)
        setFormData({
          accountId: contact.accountId || '',
          title: contact.title || '',
          department: contact.department || '',
          isPrimary: contact.isPrimary || false,
          tags: contact.tags || [],
          preferences: {
            preferredContactMethod: contact.preferences?.preferredContactMethod || 'email',
            bestTimeToContact: contact.preferences?.bestTimeToContact || '',
            timezone: contact.preferences?.timezone || ''
          },
          socialProfiles: {
            linkedin: contact.socialProfiles?.linkedin || '',
            facebook: contact.socialProfiles?.facebook || '',
            twitter: contact.socialProfiles?.twitter || ''
          },
          nextFollowUpDate: contact.nextFollowUpDate || ''
        })
      } else if (!loading) {
        toast({
          title: 'Contact Not Found',
          description: 'The contact you are trying to edit does not exist.',
          variant: 'destructive'
        })
        navigate('/crm/contacts')
      }
    }
  }, [id, getContactById, loading, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const contactData = { 
      firstName, 
      lastName, 
      email, 
      phone, 
      accountId: accountId === '' ? undefined : accountId,
      tags
    }

    try {
      if (id) {
        await updateContact(id, contactData)
        toast({
          title: 'Success',
          description: 'Contact updated successfully.'
        })
      } else {
        await createContact(contactData)
        toast({
          title: 'Success',
          description: 'Contact created successfully.'
        })
      }
      navigate('/crm/contacts')
    } catch (submitError) {
      console.error('Submission error:', submitError)
      toast({
        title: 'Error',
        description: `Failed to save contact: ${error || 'Unknown error'}`,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || accountsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">{id ? 'Edit Contact' : 'Create New Contact'}</h1>
        <p className="ri-page-description">
          {id ? `Update details for ${firstName} ${lastName}` : 'Fill in the details for your new contact.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Basic information about the contact.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Sales Manager"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Sales"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked as boolean })}
              />
              <Label htmlFor="isPrimary">Primary contact for this account</Label>
            </div>

            {/* Contact Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                  <Select 
                    value={formData.preferences.preferredContactMethod} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, preferredContactMethod: value as 'email' | 'phone' | 'sms' }
                    })}
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
                <div className="grid gap-2">
                  <Label htmlFor="bestTimeToContact">Best Time to Contact</Label>
                  <Input
                    id="bestTimeToContact"
                    value={formData.preferences.bestTimeToContact}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, bestTimeToContact: e.target.value }
                    })}
                    placeholder="e.g., Mornings, Weekdays after 2pm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={formData.preferences.timezone} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
                  <Input
                    id="nextFollowUpDate"
                    type="date"
                    value={formData.nextFollowUpDate}
                    onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialProfiles.linkedin}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialProfiles: { ...formData.socialProfiles, linkedin: e.target.value }
                    })}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialProfiles.facebook}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialProfiles: { ...formData.socialProfiles, facebook: e.target.value }
                    })}
                    placeholder="Facebook profile URL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialProfiles.twitter}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialProfiles: { ...formData.socialProfiles, twitter: e.target.value }
                    })}
                    placeholder="Twitter profile URL"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tags</h3>
              <TagInput
                tags={formData.tags}
                onTagsChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags to categorize this contact..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder="Add tags (press Enter or comma to add)"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Contact'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/crm/contacts')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}