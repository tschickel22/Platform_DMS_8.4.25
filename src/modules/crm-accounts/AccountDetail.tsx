import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Mail, Phone, Globe, MapPin } from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { NotesSection } from '@/components/common/NotesSection'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { RelatedRecordsPanel } from '@/components/common/RelatedRecordsPanel'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { mockInvoice } from '@/mocks/invoiceMock'

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getAccountById, updateAccount, deleteAccount, addNoteToAccount, updateNoteInAccount, deleteNoteFromAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { getActivitiesForEntity } = useActivityTracking()
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const foundAccount = getAccountById(id)
      setAccount(foundAccount)
    }
    setLoading(false)
  }, [id, getAccountById])

  // Get related data
  const relatedContacts = contacts.filter(contact => contact.accountId === id)
  const relatedLeads = mockCrmProspecting.pipelineLeads.filter(lead => lead.accountId === id)
  const relatedAgreements = mockAgreements.sampleAgreements.filter(agreement => agreement.accountId === id)
  const relatedServiceTickets = mockServiceOps.sampleTickets.filter(ticket => ticket.accountId === id)
  const relatedInvoices = mockInvoice.sampleInvoices.filter(invoice => invoice.accountId === id)
  const accountActivities = getActivitiesForEntity('account', id || '')

  const handleEdit = () => {
    navigate(`/crm/accounts/${id}/edit`)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const success = deleteAccount(id!)
      if (success) {
        toast({
          title: 'Account deleted',
          description: 'The account has been successfully deleted.',
        })
        navigate('/crm/accounts')
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the account.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleAddNote = (content: string) => {
    if (id) {
      addNoteToAccount(id, content)
      setAccount(getAccountById(id))
    }
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    if (id) {
      updateNoteInAccount(id, noteId, content)
      setAccount(getAccountById(id))
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (id) {
      deleteNoteFromAccount(id, noteId)
      setAccount(getAccountById(id))
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!account) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/crm/accounts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Account not found</h2>
          <p className="text-muted-foreground mt-2">
            The account you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/crm/accounts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{account.name}</h1>
            <p className="text-muted-foreground">
              Account details and related information
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Basic information about this account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {account.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{account.email}</span>
                </div>
              )}
              {account.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{account.phone}</span>
                </div>
              )}
              {account.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {account.website}
                  </a>
                </div>
              )}
              {account.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{account.address}</span>
                </div>
              )}
              {account.industry && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Industry: </span>
                  <span>{account.industry}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">
              Contacts
              {relatedContacts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {relatedContacts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="related">Related Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <NotesSection
              notes={account.notes}
              onAddNote={(content) => handleAddNote(content)}
              onUpdateNote={(noteId, content) => handleUpdateNote(noteId, content)}
              onDeleteNote={(noteId) => handleDeleteNote(noteId)}
            />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Associated Contacts</CardTitle>
                    <CardDescription>
                      People associated with this account
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/crm/contacts/new?accountId=${id}`}>
                      Add Contact
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {relatedContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No contacts associated with this account</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to={`/crm/contacts/new?accountId=${id}`}>
                        Add First Contact
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {relatedContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </h4>
                            {contact.isPrimary && (
                              <Badge variant="outline">Primary</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {contact.title && <p>{contact.title}</p>}
                            {contact.email && <p>{contact.email}</p>}
                            {contact.phone && <p>{contact.phone}</p>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/crm/contacts/${contact.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityTimeline
              activities={accountActivities}
              title="Account Activity"
              description="All activity related to this account"
            />
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <RelatedRecordsPanel
              accountId={id}
              leads={relatedLeads.map(lead => ({
                id: lead.id,
                title: `${lead.firstName} ${lead.lastName}`,
                subtitle: `${lead.source} • Score: ${lead.score}`,
                status: lead.status,
                date: lead.createdAt,
                link: `/crm?leadId=${lead.id}`
              }))}
              agreements={relatedAgreements.map(agreement => ({
                id: agreement.id,
                title: `${agreement.type} Agreement`,
                subtitle: agreement.vehicleInfo,
                status: agreement.status,
                amount: agreement.totalAmount,
                date: agreement.createdAt,
                link: `/agreements?agreementId=${agreement.id}`
              }))}
              serviceTickets={relatedServiceTickets.map(ticket => ({
                id: ticket.id,
                title: ticket.title,
                subtitle: ticket.vehicleInfo,
                status: ticket.status,
                amount: ticket.totalCost,
                date: ticket.createdAt,
                link: `/service?ticketId=${ticket.id}`
              }))}
              invoices={relatedInvoices.map(invoice => ({
                id: invoice.id,
                title: `Invoice ${invoice.id}`,
                subtitle: invoice.lineItems?.[0]?.description,
                status: invoice.status,
                amount: invoice.totalAmount,
                date: invoice.dueDate,
                link: `/invoices?invoiceId=${invoice.id}`
              }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}