// src/modules/contacts/pages/ContactDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  MessageSquare,
  Briefcase,
  Users,
  Building
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { NotesSection } from '@/components/common/NotesSection'
import type { Contact } from '@/types/index' // keep your local typing

export default function ContactDetail() {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { getContactById, deleteContact } = useContactManagement()
  const { getAccount } = useAccountManagement() // hook exposes getAccount in this project

  const [contact, setContact] = useState<Contact | null>(null)
  const [account, setAccount] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!contactId) return
      try {
        const c = await getContactById(contactId)
        if (cancelled) return
        setContact(c ?? null)

        if (c?.accountId) {
          const a = getAccount(c.accountId) // sync getter from accounts hook
          if (!cancelled) setAccount(a ?? null)
        } else {
          setAccount(null)
        }
      } catch (err) {
        console.error('Error loading contact:', err)
        if (!cancelled) {
          toast({
            title: 'Error',
            description: 'Failed to load contact details.',
            variant: 'destructive'
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [contactId, getContactById, getAccount, toast])

  const handleCommunication = (type: 'phone' | 'email' | 'sms') => {
    if (!contact) return
    switch (type) {
      case 'phone':
        if (contact.phone) window.location.href = `tel:${contact.phone}`
        break
      case 'email':
        if (contact.email) window.location.href = `mailto:${contact.email}`
        break
      case 'sms':
        if (contact.phone) window.location.href = `sms:${contact.phone}`
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading contact…</p>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/contacts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </Button>
            <div>
              <h1 className="ri-page-title">Contact Not Found</h1>
              <p className="ri-page-description">The requested contact could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/contacts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </Button>
            <div>
              <h1 className="ri-page-title">
                {contact.firstName} {contact.lastName}
              </h1>
              <p className="ri-page-description">
                {contact.title && `${contact.title}`}
                {contact.title && contact.department && ' • '}
                {contact.department}
                {account && ` • ${account.name}`}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to={`/contacts/${contact.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contact
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1 block">Full Name</Label>
                  <p className="text-sm">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>

                {contact.title && (
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Job Title</Label>
                    <p className="text-sm">{contact.title}</p>
                  </div>
                )}

                {contact.department && (
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Department</Label>
                    <p className="text-sm">{contact.department}</p>
                  </div>
                )}

                {account && (
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Account</Label>
                    <Link
                      to={`/accounts/${account.id}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Building className="h-3 w-3" />
                      {account.name}
                    </Link>
                  </div>
                )}
              </div>

              {contact.tags?.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {contact.notes && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Notes</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {contact.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Associated Account */}
          {account && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Associated Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      to={`/accounts/${account.id}`}
                      className="text-lg font-medium text-primary hover:underline"
                    >
                      {account.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                    {account.industry && (
                      <p className="text-sm text-muted-foreground">{account.industry}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/accounts/${account.id}`)}>
                    View Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes on contact */}
          <NotesSection entityId={contact.id} entityType="contact" />

          {/* Communication History placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>Recent interactions and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No communications yet</h3>
                <p className="text-sm text-muted-foreground">
                  Communication history will appear here as you interact with this contact.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Communication actions */}
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contact.phone && (
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleCommunication('phone')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call {contact.phone}
                </Button>
              )}

              {contact.email && (
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleCommunication('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email {contact.email}
                </Button>
              )}

              {contact.phone && (
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleCommunication('sms')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text Message
                </Button>
              )}

              {!contact.phone && !contact.email && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No contact methods available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Contact stats */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Open Deals</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Quotes</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Service Tickets</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium text-xs">
                  {contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <label className={`text-sm font-medium ${className || ''}`} {...props}>
      {children}
    </label>
  )
}
