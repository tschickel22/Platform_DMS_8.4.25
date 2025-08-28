import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/loading-skeleton'
import { NotesSection } from '@/components/common/NotesSection'
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  Calendar,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { Contact } from '@/types'
import { formatDate } from '@/lib/utils'
import { useTenant } from '@/contexts/TenantContext'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getContactById, addNote, updateNote, deleteNote } = useContactManagement()
  const { getAccountById } = useAccountManagement()
  const { tenant } = useTenant()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate('/crm/contacts')
      return
    }

    try {
      const contactData = getContactById(id)
      if (!contactData) {
        navigate('/crm/contacts')
        return
      }
      setContact(contactData)
    } catch (error) {
      console.error('Error loading contact:', error)
      navigate('/crm/contacts')
    } finally {
      setLoading(false)
    }
  }, [id, getContactById, navigate])

  // Get linked account
  const linkedAccount = contact?.accountId ? getAccountById(contact.accountId) : null

  // Check feature availability
  const emailEnabled = tenant?.settings?.features?.email !== false
  const smsEnabled = tenant?.settings?.features?.sms !== false

  const handleAddNote = async (content: string) => {
    if (contact) {
      const success = await addNote(contact.id, content)
      if (success) {
        // Refresh contact data to show new note
        const updatedContact = getContactById(contact.id)
        if (updatedContact) {
          setContact(updatedContact)
        }
      }
    }
  }

  const handleUpdateNote = async (noteId: string, content: string) => {
    if (contact) {
      const success = await updateNote(contact.id, noteId, content)
      if (success) {
        // Refresh contact data to show updated note
        const updatedContact = getContactById(contact.id)
        if (updatedContact) {
          setContact(updatedContact)
        }
      }
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (contact) {
      const success = await deleteNote(contact.id, noteId)
      if (success) {
        // Refresh contact data to remove deleted note
        const updatedContact = getContactById(contact.id)
        if (updatedContact) {
          setContact(updatedContact)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/crm/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Contact Not Found</h3>
              <p className="text-muted-foreground">
                The contact you're looking for doesn't exist or has been deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ModuleErrorBoundary moduleName="Contact Detail">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/crm/contacts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {contact.firstName} {contact.lastName}
                {contact.isPrimary && (
                  <Badge variant="outline" className="ml-2">Primary</Badge>
                )}
              </h1>
              <p className="text-muted-foreground">Contact Details</p>
            </div>
          </div>
          <Button asChild>
            <Link to={`/crm/contacts/${contact.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contact
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {linkedAccount ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account</span>
                    <Button variant="ghost" size="sm" asChild className="h-auto p-1">
                      <Link to={`/crm/accounts/${linkedAccount.id}`} className="flex items-center space-x-2">
                        <Building2 className="h-3 w-3" />
                        <span className="text-sm">{linkedAccount.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account</span>
                    <span className="text-sm text-muted-foreground">No account linked</span>
                  </div>
                )}
                {contact.title && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <span className="text-sm">{contact.title}</span>
                  </div>
                )}
                {contact.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Department</span>
                    <span className="text-sm">{contact.department}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${contact.email}`} className="text-sm hover:text-primary">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${contact.phone}`} className="text-sm hover:text-primary">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {contact.preferredContactMethod && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preferred Contact</span>
                    <Badge variant="outline">{contact.preferredContactMethod}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDate(contact.createdAt)}</span>
                </div>
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Actions</CardTitle>
              <CardDescription>
                Communicate with this contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.email && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={!emailEnabled}
                  title={!emailEnabled ? 'Email not configured for this tenant' : undefined}
                  onClick={() => window.location.href = `mailto:${contact.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              )}
              {contact.phone && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = `tel:${contact.phone}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!smsEnabled}
                    title={!smsEnabled ? 'SMS not configured for this tenant' : undefined}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                </>
              )}
              {!contact.email && !contact.phone && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No contact methods available</p>
                  <p className="text-xs">Add email or phone to enable actions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <NotesSection
          notes={contact.notes || []}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          title="Contact Notes"
          description="Internal notes and comments about this contact"
        />
      </div>
    </ModuleErrorBoundary>
  )
}