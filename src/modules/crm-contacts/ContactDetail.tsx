import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EntityChip } from '@/components/ui/entity-chip'
import { NotesSection } from '@/components/common/NotesSection'
import { TasksSection } from '@/components/common/TasksSection'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { RelatedRecordsPanel } from '@/components/common/RelatedRecordsPanel'
import { CommunicationActions } from '@/components/common/CommunicationActions'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MessageSquare,
  User,
  Building2,
  Calendar,
  Globe,
  MapPin,
  Clock
} from 'lucide-react'
import { Contact } from '@/types'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { tenant } = useTenant()
  const { getContact, updateContact, deleteContact, addNoteToContact, updateNoteInContact, deleteNoteFromContact } = useContactManagement()
  const { accounts } = useAccountManagement()
  const { getActivitiesForEntity, logActivity } = useActivityTracking()

  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  // Load contact data
  useEffect(() => {
    if (id) {
      try {
        const contactData = getContact(id)
        if (contactData) {
          setContact(contactData)
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
    }
  }, [id, getContact, navigate, toast])

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

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Contact Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The contact you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/crm/contacts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get linked account
  const linkedAccount = contact.accountId 
    ? accounts.find(account => account.id === contact.accountId)
    : null

  // Get activities for this contact
  const activities = getActivitiesForEntity('contact', contact.id)

  // Check communication features
  const emailEnabled = tenant?.settings?.features?.email !== false
  const smsEnabled = tenant?.settings?.features?.sms !== false

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await deleteContact(contact.id)
        toast({
          title: 'Contact Deleted',
          description: `${contact.firstName} ${contact.lastName} has been deleted.`
        })
        navigate('/crm/contacts')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete contact.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleAddNote = async (content: string) => {
    try {
      const updatedContact = await addNoteToContact(contact.id, content, 'Admin User')
      if (updatedContact) {
        setContact(updatedContact)
        logActivity('note', 'Added note to contact', {
          contactId: contact.id,
          description: `Added note: ${content.substring(0, 50)}...`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add note.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateNote = async (noteId: string, content: string) => {
    try {
      const updatedContact = await updateNoteInContact(contact.id, noteId, content, 'Admin User')
      if (updatedContact) {
        setContact(updatedContact)
        logActivity('note', 'Updated contact note', {
          contactId: contact.id,
          description: `Updated note: ${content.substring(0, 50)}...`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update note.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const updatedContact = await deleteNoteFromContact(contact.id, noteId)
      if (updatedContact) {
        setContact(updatedContact)
        logActivity('note', 'Deleted contact note', {
          contactId: contact.id
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/crm/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="text-muted-foreground">
              Contact details and activity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CommunicationActions contact={contact} />
          <Button variant="outline" onClick={() => navigate(`/crm/contacts/${contact.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Summary */}
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
                  <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                  <p className="text-lg font-semibold">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.title && (
                    <p className="text-sm text-muted-foreground">{contact.title}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Account</h3>
                  {linkedAccount ? (
                    <EntityChip
                      type="account"
                      id={linkedAccount.id}
                      name={linkedAccount.name}
                      email={linkedAccount.email}
                      industry={linkedAccount.industry}
                      linkTo={`/crm/accounts/${linkedAccount.id}`}
                      showHoverCard={true}
                    />
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>

                {contact.email && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.department && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Department</h3>
                    <p>{contact.department}</p>
                  </div>
                )}

                {contact.preferredContactMethod && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Preferred Contact</h3>
                    <Badge variant="outline">
                      {contact.preferredContactMethod}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Profiles */}
              {(contact.socialProfiles?.linkedin || contact.socialProfiles?.facebook || contact.socialProfiles?.twitter) && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Social Profiles</h3>
                  <div className="flex gap-2">
                    {contact.socialProfiles?.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contact.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {contact.socialProfiles?.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contact.socialProfiles.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </Button>
                    )}
                    {contact.socialProfiles?.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contact.socialProfiles.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {(contact.preferences?.bestTimeToContact || contact.preferences?.timezone) && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Preferences</h3>
                  <div className="space-y-1 text-sm">
                    {contact.preferences?.bestTimeToContact && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Best time: {contact.preferences.bestTimeToContact}</span>
                      </div>
                    )}
                    {contact.preferences?.timezone && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>Timezone: {contact.preferences.timezone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Created:</span> {formatDateTime(contact.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {formatDateTime(contact.updatedAt)}
                  </div>
                  {contact.lastContactDate && (
                    <div>
                      <span className="font-medium">Last Contact:</span> {formatDate(contact.lastContactDate)}
                    </div>
                  )}
                  {contact.nextFollowUpDate && (
                    <div>
                      <span className="font-medium">Next Follow-up:</span> {formatDate(contact.nextFollowUpDate)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Notes, Tasks, and Activity */}
          <Tabs defaultValue="notes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="notes">
              <NotesSection
                notes={contact.notes || []}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                title="Contact Notes"
                description="Internal notes and comments about this contact"
              />
            </TabsContent>

            <TabsContent value="tasks">
              <TasksSection
                contactId={contact.id}
                title="Contact Tasks"
                description="Tasks and follow-ups for this contact"
              />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTimeline
                activities={activities}
                title="Contact Activity"
                description="Recent activity and interactions with this contact"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Communication Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Communicate with this contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Email Action */}
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!contact.email || !emailEnabled}
                title={
                  !contact.email 
                    ? 'No email address available'
                    : !emailEnabled 
                    ? 'Email provider not configured'
                    : 'Send email to contact'
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
                {(!contact.email || !emailEnabled) && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {!contact.email ? 'No email' : 'Not configured'}
                  </span>
                )}
              </Button>

              {/* SMS Action */}
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!contact.phone || !smsEnabled}
                title={
                  !contact.phone 
                    ? 'No phone number available'
                    : !smsEnabled 
                    ? 'SMS provider not configured'
                    : 'Send SMS to contact'
                }
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS
                {(!contact.phone || !smsEnabled) && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {!contact.phone ? 'No phone' : 'Not configured'}
                  </span>
                )}
              </Button>

              {/* Call Action */}
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!contact.phone}
                onClick={() => contact.phone && (window.location.href = `tel:${contact.phone}`)}
                title={!contact.phone ? 'No phone number available' : 'Call contact'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Contact
                {!contact.phone && (
                  <span className="ml-auto text-xs text-muted-foreground">No phone</span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Primary Contact</span>
                <Badge variant={contact.isPrimary ? 'default' : 'secondary'}>
                  {contact.isPrimary ? 'Yes' : 'No'}
                </Badge>
              </div>
              
              {contact.ownerId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Owner</span>
                  <span className="text-sm">{contact.ownerId}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">{formatDate(contact.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">{formatDate(contact.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Records */}
          <RelatedRecordsPanel
            contactId={contact.id}
            leads={[]} // TODO: Implement when leads are available
            quotes={[]} // TODO: Implement when quotes are available
            agreements={[]} // TODO: Implement when agreements are available
            serviceTickets={[]} // TODO: Implement when service tickets are available
            invoices={[]} // TODO: Implement when invoices are available
            onCreateNew={(type) => {
              // TODO: Implement creation of related records
              toast({
                title: 'Feature Coming Soon',
                description: `Creating ${type} from contacts will be available soon.`
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}