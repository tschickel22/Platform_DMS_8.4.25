// src/modules/contacts/pages/ContactDetail.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash, Phone, MessageSquare, Mail, Building2, User as UserIcon } from 'lucide-react'
import { Contact } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { NotesSection } from '@/components/common/NotesSection'

export default function ContactDetail() {
  // Support either :id or :contactId route params
  const params = useParams<{ id?: string; contactId?: string }>()
  const contactId = params.id ?? params.contactId ?? ''

  const navigate = useNavigate()
  const { getContact, deleteContact } = useContactManagement()
  const { tenant } = useTenant()
  const { toast } = useToast()
  const { getAccount } = useAccountManagement()

  const [contact, setContact] = useState<Contact | null>(null)
  const [account, setAccount] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        if (!contactId) {
          if (!cancelled) setLoading(false)
          return
        }

        // getContact is sync in our hook, but await works fine either way
        const c = await getContact(contactId)
        if (cancelled) return
        setContact(c)

        if (c?.accountId) {
          const a = await getAccount(c.accountId)
          if (!cancelled) setAccount(a)
        }
      } catch (err) {
        console.error('Error loading contact:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [contactId, getContact, getAccount])

  const handleDelete = async () => {
    if (!contact) return
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(contact.id)
        navigate('/contacts')
      } catch (error) {
        console.error('Error deleting contact:', error)
      }
    }
  }

  const handleCommunicationAction = (type: 'phone' | 'sms' | 'email') => {
    if (!contact) return
    let action = ''
    let message = ''
    switch (type) {
      case 'phone':
        if (!contact.phone) return
        action = `tel:${contact.phone}`
        message = `Calling ${contact.phone}`
        break
      case 'sms':
        if (!contact.phone) return
        action = `sms:${contact.phone}`
        message = `Sending SMS to ${contact.phone}`
        break
      case 'email':
        if (!contact.email) return
        action = `mailto:${contact.email}`
        message = `Opening email to ${contact.email}`
        break
    }
    if (action) {
      window.location.href = action
      toast({ title: 'Communication Action', description: message })
    }
  }

  const allowPhone = tenant?.settings?.allowPhone ?? true
  const allowSMS = tenant?.settings?.allowSMS ?? true
  const allowEmail = tenant?.settings?.allowEmail ?? true

  // ✅ Don’t show “not found” until we finish loading
  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading contact…</div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Contact not found</h1>
        <Button onClick={() => navigate('/contacts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="text-muted-foreground">{contact.title}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/contacts/${contact.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <p className="text-sm text-muted-foreground">{contact.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <p className="text-sm text-muted-foreground">{contact.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <p className="text-sm text-muted-foreground">{contact.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <p className="text-sm text-muted-foreground">{contact.department}</p>
            </div>
          </div>
        </CardContent>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Communication</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => handleCommunicationAction('phone')}
              disabled={!contact.phone || !allowPhone}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call {contact.phone || 'N/A'}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCommunicationAction('sms')}
              disabled={!contact.phone || !allowSMS}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS {contact.phone || 'N/A'}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCommunicationAction('email')}
              disabled={!contact.email || !allowEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email {contact.email || 'N/A'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {contact.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Associated Account</CardTitle>
          <CardDescription>The account this contact is linked to.</CardDescription>
        </CardHeader>
        <CardContent>
          {account ? (
            <Link
              to={`/accounts/${account.id}`}
              className={cn(buttonVariants({ variant: 'link' }), 'flex items-center justify-start p-0')}
            >
              <Building2 className="h-4 w-4 mr-2" />
              {account.name}
            </Link>
          ) : (
            <p className="text-muted-foreground">No associated account.</p>
          )}
        </CardContent>
      </Card>

      <NotesSection entityId={contact.id} entityType="contact" className="mt-6" />
    </div>
  )
}
