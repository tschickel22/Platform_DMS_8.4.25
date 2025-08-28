// src/modules/contacts/pages/ContactDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit,
  Trash,
  Phone,
  MessageSquare,
  Mail,
  Building2,
  User as UserIcon,
} from 'lucide-react'
import type { Contact } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { NotesSection } from '@/components/common/NotesSection'

export default function ContactDetail() {
  // NOTE: if your route param is ":contactId", change to { contactId } below.
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { tenant } = useTenant()

  // pull both variants if available to be resilient
  const {
    getContact,
    getContactById,
    deleteContact,
  } = useContactManagement()
  const {
    getAccount,
    getAccountById,
  } = useAccountManagement()

  const [contact, setContact] = useState<Contact | null>(null)
  const [account, setAccount] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        // Try async getContactById first; fall back to sync getContact
        let c: Contact | null = null
        if (typeof getContactById === 'function') {
          c = await getContactById(id)
        } else if (typeof getContact === 'function') {
          c = getContact(id)
        }
        if (cancelled) return
        setContact(c)

        if (c?.accountId) {
          let a: any | null = null
          if (typeof getAccountById === 'function') {
            a = getAccountById(c.accountId)
          } else if (typeof getAccount === 'function') {
            a = getAccount(c.accountId)
          }
          if (!cancelled) setAccount(a ?? null)
        } else {
          setAccount(null)
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
  }, [id, getContact, getContactById, getAccount, getAccountById])

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

  // Proper loading gate to avoid false "not found"
  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading contact…</p>
        </div>
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
            {contact.title && <p className="text-muted-foreground">{contact.title}</p>}
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
              <p className="text-sm text-muted-foreground">{contact.email || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-sm text-muted-foreground">{contact.phone || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <p className="text-sm text-muted-foreground">{contact.title || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <p className="text-sm text-muted-foreground">{contact.department || '—'}</p>
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
              Call {contact.phone || ''}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCommunicationAction('sms')}
              disabled={!contact.phone || !allowSMS}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS {contact.phone || ''}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCommunicationAction('email')}
              disabled={!contact.email || !allowEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email {contact.email || ''}
            </Button>
          </div>
          {contact.tags?.length ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
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
              className={cn(
                buttonVariants({ variant: 'link' }),
                'flex items-center justify-start p-0'
              )}
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
