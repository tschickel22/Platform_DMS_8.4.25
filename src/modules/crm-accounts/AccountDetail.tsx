import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAccountManagement } from './hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Edit, Trash2, Globe, Mail, Phone, Users, DollarSign, FileText, Wrench, PlusCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { NotesSection } from '@/components/common/NotesSection'
import { TasksSection } from '@/components/common/TasksSection'
import { useContactManagement } from '../crm-contacts/hooks/useContactManagement'

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAccountById, loading, error, deleteAccount, addNoteToAccount, updateNoteInAccount, deleteNoteFromAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const account = getAccountById(id || '')

  // Get related data for this account
  const relatedContacts = contacts.filter(contact => contact.accountId === id)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      const success = deleteAccount(id || '')
      if (success) {
        navigate('/crm/accounts')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!account) {
    return (
      <EmptyState
        title="Account Not Found"
        description="The account you are looking for does not exist or has been deleted."
        icon={<Trash2 className="h-12 w-12" />}
        action={{
          label: 'Back to Accounts',
          onClick: () => navigate('/crm/accounts')
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ri-page-header">
          <h1 className="ri-page-title">{account.name}</h1>
          <p className="ri-page-description">Details for this account.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/crm/accounts/${account.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Account
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>General details about {account.name}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{account.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{account.phone || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Website</p>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {account.website ? (
                  <a 
                    href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {account.website}
                  </a>
                ) : (
                  <p className="text-base">N/A</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-base">{account.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Industry</p>
              <p className="text-base">{account.industry || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-base">{formatDateTime(account.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-base">{formatDateTime(account.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Data Tabs */}
        <Tabs defaultValue="notes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="contacts">
              Contacts ({relatedContacts.length})
            </TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <NotesSection
              notes={account.notes}
              onAddNote={(content) => addNoteToAccount(account.id, content)}
              onUpdateNote={(noteId, content) => updateNoteInAccount(account.id, noteId, content)}
              onDeleteNote={(noteId) => deleteNoteFromAccount(account.id, noteId)}
              title="Account Notes"
              description="Internal notes about this account"
            />
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Related Contacts
                    </CardTitle>
                    <CardDescription>Contacts associated with this account</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/crm/contacts/new?accountId=${account.id}`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Contact
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {relatedContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No contacts for this account yet.</p>
                    <p className="text-sm">Add a contact to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {relatedContacts.map((contact) => (
                      <div key={contact.id} className="ri-table-row">
                        <div>
                          <Link to={`/crm/contacts/${contact.id}`} className="font-medium text-primary hover:underline">
                            {contact.firstName} {contact.lastName}
                          </Link>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Related Deals
                </CardTitle>
                <CardDescription>Sales deals associated with this account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No deals for this account yet.</p>
                  <p className="text-sm">Deals will appear here when created.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Related Quotes
                </CardTitle>
                <CardDescription>Quotes generated for this account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No quotes for this account yet.</p>
                  <p className="text-sm">Quotes will appear here when created.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agreements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Related Agreements
                </CardTitle>
                <CardDescription>Agreements and contracts for this account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No agreements for this account yet.</p>
                  <p className="text-sm">Agreements will appear here when created.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Service Tickets
                </CardTitle>
                <CardDescription>Service requests for this account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No service tickets for this account yet.</p>
                  <p className="text-sm">Service tickets will appear here when created.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <TasksSection
              accountId={account.id}
              title="Account Tasks"
              description="Tasks and follow-ups for this account"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}