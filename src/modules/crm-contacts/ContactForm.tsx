import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '../crm-accounts/hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      const contact = getContactById(id)
      if (contact) {
        setFirstName(contact.firstName || '')
        setLastName(contact.lastName || '')
        setEmail(contact.email || '')
        setPhone(contact.phone || '')
        setAccountId(contact.accountId || undefined)
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
      accountId: accountId === '' ? undefined : accountId 
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
              <Label htmlFor="accountId">Associated Account</Label>
              <Select value={accountId || ''} onValueChange={(value) => setAccountId(value || undefined)}>
                <SelectTrigger id="accountId">
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