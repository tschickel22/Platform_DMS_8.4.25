import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { EntityChip } from '@/components/ui/entity-chip'
import { StatusBadge } from '@/components/ui/status-badge'
import { DetailRouteGuard, EntityNotFoundGuard } from '@/components/ui/route-guard'
import { NotesSection } from '@/components/common/NotesSection'
import { RelatedRecordsPanel } from '@/components/common/RelatedRecordsPanel'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { 
  Edit, 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Plus,
  ExternalLink,
  FileText,
  DollarSign,
  Wrench
} from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { ActivityType } from '@/types'
import { logger } from '@/utils/logger'

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAccountById, addNoteToAccount, updateNoteInAccount, deleteNoteFromAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { logActivity, getActivitiesForEntity } = useActivityTracking()
  const [activeTab, setActiveTab] = useState('overview')

  const account = getAccountById(id!)
  const accountContacts = contacts.filter(contact => contact.accountId === id)
  const activities = getActivitiesForEntity('account', id!)

  React.useEffect(() => {
    if (account) {
      logger.pageView(`/crm/accounts/${id}`, { accountName: account.name })
    }
  }, [id, account])

  const handleAddNote = async (content: string) => {
    if (!account) return
    await addNoteToAccount(account.id, content, 'Current User')
    logActivity(ActivityType.NOTE, 'Added note to account', {
      accountId: account.id,
      description: `Added note: ${content.substring(0, 50)}...`
    })
  }

  const handleUpdateNote = async (noteId: string, content: string) => {
    if (!account) return
    await updateNoteInAccount(account.id, noteId, content, 'Current User')
    logActivity(ActivityType.NOTE, 'Updated account note', {
      accountId: account.id
    })
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!account) return
    await deleteNoteFromAccount(account.id, noteId)
    logActivity(ActivityType.NOTE, 'Deleted account note', {
      accountId: account.id
    })
  }

  const handleCreateContact = () => {
    navigate(`/crm/contacts/new?accountId=${account?.id}`)
  }

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
        <div className="space-y-6">
          <PageHeader
            title={account?.name || 'Account Details'}
            description={`Account information and related records`}
          >
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/crm/accounts/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Account
              </Button>
              <Button onClick={handleCreateContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </PageHeader>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts ({accountContacts.length})</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Account Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Industry</label>
                          <p className="text-sm">{account?.industry || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">
                            <StatusBadge status={account?.status || 'Unknown'} />
                          </div>
                        </div>
                        {account?.email && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${account.email}`} className="text-sm text-primary hover:underline">
                                {account.email}
                              </a>
                            </div>
                          </div>
                        )}
                        {account?.phone && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${account.phone}`} className="text-sm text-primary hover:underline">
                                {account.phone}
                              </a>
                            </div>
                          </div>
                        )}
                        {account?.website && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Website</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <a 
                                href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                {account.website}
                                <ExternalLink className="h-3 w-3 ml-1 inline" />
                              </a>
                            </div>
                          </div>
                        )}
                        {account?.address && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Address</label>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{account.address}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {account?.tags && account.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tags</label>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {account.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <NotesSection
                    notes={account?.notes || []}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    title="Account Notes"
                    description="Internal notes and comments about this account"
                  />
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                  {accountContacts.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Add contacts to this account to manage relationships
                        </p>
                        <Button onClick={handleCreateContact}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Contact
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {accountContacts.map((contact) => (
                        <Card key={contact.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {contact.firstName} {contact.lastName}
                                  </h4>
                                  {contact.isPrimary && (
                                    <Badge variant="outline" className="text-xs">Primary</Badge>
                                  )}
                                </div>
                                {contact.title && (
                                  <p className="text-sm text-muted-foreground">{contact.title}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  {contact.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {contact.email}
                                    </div>
                                  )}
                                  {contact.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {contact.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/crm/contacts/${contact.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity">
                  <ActivityTimeline
                    activities={activities}
                    title="Account Activity"
                    description="Recent activity and interactions for this account"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contacts</span>
                    <span className="font-medium">{accountContacts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Primary Contacts</span>
                    <span className="font-medium">
                      {accountContacts.filter(c => c.isPrimary).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <span className="font-medium">{account?.notes?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleCreateContact}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/quotes/new?accountId=${id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Quote
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/service/new?accountId=${id}`)}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Schedule Service
                  </Button>
                </CardContent>
              </Card>

              {/* Related Records Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Records</CardTitle>
                  <CardDescription>Quick overview of associated records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Quotes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">0</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/quotes?accountId=${id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Agreements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">0</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/agreements?accountId=${id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Service Tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">0</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/service?accountId=${id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
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