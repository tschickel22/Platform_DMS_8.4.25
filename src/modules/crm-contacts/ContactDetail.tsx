import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { EntityChip } from '@/components/ui/entity-chip'
import { StatusBadge } from '@/components/ui/status-badge'
import { DetailRouteGuard, EntityNotFoundGuard } from '@/components/ui/route-guard'
import { NotesSection } from '@/components/common/NotesSection'
import { CommunicationActions } from '@/components/common/CommunicationActions'
import { TasksSection } from '@/components/common/TasksSection'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { 
  Edit, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  Tag
} from 'lucide-react'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { useTenant } from '@/contexts/TenantContext'
import { ActivityType } from '@/types'
import { logger } from '@/utils/logger'

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getContactById, addNoteToContact, updateNoteInContact, deleteNoteFromContact } = useContactManagement()
  const { getAccountById } = useAccountManagement()
  const { logActivity, getActivitiesForEntity } = useActivityTracking()
  const { tenant } = useTenant()
  const [activeTab, setActiveTab] = useState('overview')

  const contact = getContactById(id!)
  const account = contact?.accountId ? getAccountById(contact.accountId) : null
  const activities = getActivitiesForEntity('contact', id!)

  React.useEffect(() => {
    if (contact) {
      logger.pageView(`/crm/contacts/${id}`, { 
        contactName: `${contact.firstName} ${contact.lastName}`,
        hasAccount: !!contact.accountId
      })
    }
  }, [id, contact])

  const handleAddNote = async (content: string) => {
    if (!contact) return
    await addNoteToContact(contact.id, content, 'Current User')
    logActivity(ActivityType.NOTE, 'Added note to contact', {
      contactId: contact.id,
      description: `Added note: ${content.substring(0, 50)}...`
    })
  }

  const handleUpdateNote = async (noteId: string, content: string) => {
    if (!contact) return
    await updateNoteInContact(contact.id, noteId, content, 'Current User')
    logActivity(ActivityType.NOTE, 'Updated contact note', {
      contactId: contact.id
    })
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!contact) return
    await deleteNoteFromContact(contact.id, noteId)
    logActivity(ActivityType.NOTE, 'Deleted contact note', {
      contactId: contact.id
    })
  }

  // Check if communication features are enabled
  const communicationEnabled = {
    email: tenant?.settings?.features?.email !== false,
    sms: tenant?.settings?.features?.sms !== false,
    phone: true // Phone is always available
  }

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
        <div className="space-y-6">
          <PageHeader
            title={contact ? `${contact.firstName} ${contact.lastName}` : 'Contact Details'}
            description="Contact information and communication history"
          >
            <div className="flex items-center gap-2">
              <CommunicationActions contact={contact!} />
              <Button variant="outline" onClick={() => navigate(`/crm/contacts/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
            </div>
          </PageHeader>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Contact Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Account</label>
                          <div className="mt-1">
                            {account ? (
                              <EntityChip
                                type="account"
                                id={account.id}
                                name={account.name}
                                email={account.email}
                                industry={account.industry}
                                linkTo={`/crm/accounts/${account.id}`}
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground">No account assigned</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Title</label>
                          <p className="text-sm mt-1">{contact?.title || 'Not specified'}</p>
                        </div>
                        {contact?.email && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                                {contact.email}
                              </a>
                            </div>
                          </div>
                        )}
                        {contact?.phone && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${contact.phone}`} className="text-sm text-primary hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Preferred Contact</label>
                          <div className="mt-1">
                            <StatusBadge status={contact?.preferredContactMethod || 'Not set'} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Department</label>
                          <p className="text-sm mt-1">{contact?.department || 'Not specified'}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      {contact?.tags && contact.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tags</label>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Preferences */}
                      {contact?.preferences && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Preferences</label>
                          <div className="mt-2 space-y-2 text-sm">
                            {contact.preferences.bestTimeToContact && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>Best time: {contact.preferences.bestTimeToContact}</span>
                              </div>
                            )}
                            {contact.preferences.timezone && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>Timezone: {contact.preferences.timezone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <NotesSection
                    notes={contact?.notes || []}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    title="Contact Notes"
                    description="Internal notes and comments about this contact"
                  />
                </TabsContent>

                <TabsContent value="tasks">
                  <TasksSection
                    contactId={contact?.id}
                    title="Contact Tasks"
                    description="Tasks and follow-ups for this contact"
                  />
                </TabsContent>

                <TabsContent value="activity">
                  <ActivityTimeline
                    activities={activities}
                    title="Contact Activity"
                    description="Recent activity and interactions for this contact"
                  />
                </TabsContent>

                <TabsContent value="communication">
                  <Card>
                    <CardHeader>
                      <CardTitle>Communication History</CardTitle>
                      <CardDescription>
                        Email, SMS, and call history will appear here
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-8 text-muted-foreground">
                      <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Communication tracking coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <StatusBadge status={contact?.isPrimary ? 'Primary' : 'Secondary'} />
                  </div>
                  {contact?.lastContactDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Contact</span>
                      <span className="text-sm font-medium">
                        {new Date(contact.lastContactDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {contact?.nextFollowUpDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Next Follow-up</span>
                      <span className="text-sm font-medium">
                        {new Date(contact.nextFollowUpDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Communication Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication</CardTitle>
                  <CardDescription>Available communication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email</span>
                    </div>
                    <StatusBadge 
                      status={communicationEnabled.email && contact?.email ? 'Available' : 'Disabled'} 
                      variant={communicationEnabled.email && contact?.email ? 'success' : 'default'}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SMS</span>
                    </div>
                    <StatusBadge 
                      status={communicationEnabled.sms && contact?.phone ? 'Available' : 'Disabled'} 
                      variant={communicationEnabled.sms && contact?.phone ? 'success' : 'default'}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <StatusBadge 
                      status={contact?.phone ? 'Available' : 'No number'} 
                      variant={contact?.phone ? 'success' : 'default'}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </EntityNotFoundGuard>
    </DetailRouteGuard>
  )
}