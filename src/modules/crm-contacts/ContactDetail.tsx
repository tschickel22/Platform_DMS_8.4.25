import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Building2 } from 'lucide-react'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { NotesSection } from '@/components/common/NotesSection'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { RelatedRecordsPanel } from '@/components/common/RelatedRecordsPanel'
import { CommunicationActions } from '@/components/common/CommunicationActions'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { useToast } from '@/hooks/use-toast'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { mockInvoice } from '@/mocks/invoiceMock'

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getContactById, updateContact, deleteContact, addNoteToContact, updateNoteInContact, deleteNoteFromContact } = useContactManagement()
  const { getAccountById } = useAccountManagement()
  const { getActivitiesForEntity } = useActivityTracking()
  const [contact, setContact] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const contactData = getContactById(id)
      setContact(contactData)
      
      if (contactData?.accountId) {
        const accountData = getAccountById(contactData.accountId)
        setAccount(accountData)
      }
    }
    setLoading(false)
  }, [id, getContactById, getAccountById])

  // Get related data
  const relatedLeads = mockCrmProspecting.pipelineLeads.filter(lead => lead.contactId === id)
  const relatedAgreements = mockAgreements.sampleAgreements.filter(agreement => agreement.contactId === id)
  const relatedServiceTickets = mockServiceOps.sampleTickets.filter(ticket => ticket.contactId === id)
  const relatedInvoices = mockInvoice.sampleInvoices.filter(invoice => invoice.contactId === id)
  const contactActivities = getActivitiesForEntity('contact', id || '')

  const handleEdit = () => {
    navigate(`/crm/contacts/${id}/edit`)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      const success = deleteContact(id || '')
      if (success) {
        navigate('/crm/contacts')
      }
    }
  }

  const handleAddNote = (content: string) => {
    if (id) {
      addNoteToContact(id, content)
    }
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    if (id) {
      updateNoteInContact(id, noteId, content)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (id) {
      deleteNoteFromContact(id, noteId)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Contact Not Found</h2>
        <p className="text-muted-foreground mb-4">The contact you are looking for does not exist or has been deleted.</p>
        <Button onClick={() => navigate('/crm/contacts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/crm/contacts')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{contact.firstName} {contact.lastName}</h1>
            <p className="text-muted-foreground">Contact details and information</p>
          </div>
        </div>
        <div className="flex space-x-2">
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

      <div className="space-y-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Basic information about this contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                    <p className="text-lg font-semibold">{contact.firstName} {contact.lastName}</p>
                  </div>
                  {contact.title && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Title</h3>
                      <p>{contact.title}</p>
                    </div>
                  )}
                  {contact.department && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Department</h3>
                      <p>{contact.department}</p>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {account && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <Link to={`/crm/accounts/${account.id}`} className="text-primary hover:underline">
                        {account.name}
                      </Link>
                    </div>
                  )}
                  {contact.preferences?.preferredContactMethod && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Preferred Contact</h3>
                      <p className="capitalize">{contact.preferences.preferredContactMethod}</p>
                    </div>
                  )}
                  {contact.lastContactDate && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Last Contact</h3>
                      <p>{formatDate(contact.lastContactDate)}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Communication Actions */}
                <div className="pt-4 border-t">
                  <CommunicationActions contact={contact} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="related">Related Records</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <NotesSection
              notes={contact.notes}
              onAddNote={(content) => handleAddNote(content)}
              onUpdateNote={(noteId, content) => handleUpdateNote(noteId, content)}
              onDeleteNote={(noteId) => handleDeleteNote(noteId)}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTimeline
              activities={contactActivities}
              title="Contact Activity"
              description="All activity related to this contact"
            />
          </TabsContent>

          <TabsContent value="related">
            <RelatedRecordsPanel
              contactId={id}
              leads={relatedLeads.map(lead => ({
                id: lead.id,
                title: `Lead: ${lead.firstName} ${lead.lastName}`,
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