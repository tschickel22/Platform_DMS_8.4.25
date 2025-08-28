import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  FileText, 
  DollarSign, 
  Wrench, 
  Receipt,
  TrendingUp,
  Calendar,
  ListTodo,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Plus,
  Activity
} from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useTasks } from '@/hooks/useTasks'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { NotesSection } from '@/components/common/NotesSection'
import { RelatedRecordsPanel } from '@/components/common/RelatedRecordsPanel'
import { TasksSection } from '@/components/common/TasksSection'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'
import { mockQuoteBuilder } from '@/mocks/quoteBuilderMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { mockInvoice } from '@/mocks/invoiceMock'
import { mockFinance } from '@/mocks/financeMock'

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')

  // Data hooks
  const { accounts, updateAccount, deleteAccount, addNoteToAccount, updateNoteInAccount, deleteNoteFromAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { leads } = useLeadManagement()
  const { tasks } = useTasks()
  const { getActivitiesForEntity } = useActivityTracking()

  const account = accounts.find(acc => acc.id === id)

  // Filter related data for this account
  const relatedContacts = contacts.filter(contact => contact.accountId === id)
  const relatedLeads = leads.filter(lead => lead.accountId === id)
  const relatedDeals = mockCrmSalesDeal.sampleDeals.filter(deal => deal.accountId === id)
  const relatedQuotes = mockQuoteBuilder.sampleQuotes?.filter(quote => quote.accountId === id) || []
  const relatedAgreements = mockAgreements.sampleAgreements.filter(agreement => agreement.accountId === id)
  const relatedServiceTickets = mockServiceOps.sampleTickets.filter(ticket => ticket.accountId === id)
  const relatedInvoices = mockInvoice.sampleInvoices.filter(invoice => invoice.accountId === id)
  const relatedLoans = mockFinance.sampleLoans.filter(loan => loan.accountId === id)
  const relatedTasks = tasks.filter(task => task.accountId === id)
  const accountActivities = getActivitiesForEntity('account', id || '')

  // Calculate metrics for header tiles
  const metrics = useMemo(() => {
    const totalDealsValue = relatedDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
    const totalQuotesValue = relatedQuotes.reduce((sum, quote) => sum + (quote.total || 0), 0)
    const totalLoansValue = relatedLoans.reduce((sum, loan) => sum + loan.loanAmount, 0)
    const totalInvoicesValue = relatedInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)
    const openServiceTickets = relatedServiceTickets.filter(ticket => 
      ['Open', 'In Progress', 'Waiting for Parts'].includes(ticket.status)
    ).length

    return {
      totalContacts: relatedContacts.length,
      totalDeals: relatedDeals.length,
      totalDealsValue,
      totalQuotes: relatedQuotes.length,
      totalQuotesValue,
      totalLoans: relatedLoans.length,
      totalLoansValue,
      openServiceTickets,
      totalTasks: relatedTasks.length,
      recentActivity: accountActivities.length
    }
  }, [relatedContacts, relatedDeals, relatedQuotes, relatedLoans, relatedServiceTickets, relatedTasks, accountActivities])

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Account Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The account you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/crm/accounts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleEdit = () => {
    navigate(`/crm/accounts/${id}/edit`)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        await deleteAccount(id!)
        toast({
          title: 'Account Deleted',
          description: 'The account has been successfully deleted.'
        })
        navigate('/crm/accounts')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete account.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleAddNote = async (content: string) => {
    try {
      await addNoteToAccount(id!, content, 'Admin User')
      toast({
        title: 'Note Added',
        description: 'Note has been added successfully.'
      })
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
      await updateNoteInAccount(id!, noteId, content)
      toast({
        title: 'Note Updated',
        description: 'Note has been updated successfully.'
      })
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
      await deleteNoteFromAccount(id!, noteId)
      toast({
        title: 'Note Deleted',
        description: 'Note has been deleted successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note.',
        variant: 'destructive'
      })
    }
  }

  // Transform data for RelatedRecordsPanel
  const transformedLeads = relatedLeads.map(lead => ({
    id: lead.id,
    title: `${lead.firstName} ${lead.lastName}`,
    subtitle: `${lead.source} • Score: ${lead.score || 'N/A'}`,
    status: lead.status,
    date: lead.createdAt,
    link: `/crm`
  }))

  const transformedQuotes = relatedQuotes.map(quote => ({
    id: quote.id,
    title: `Quote ${quote.number}`,
    subtitle: quote.vehicleInfo,
    status: quote.status,
    amount: quote.total,
    date: quote.createdAt,
    link: `/quotes`
  }))

  const transformedDeals = relatedDeals.map(deal => ({
    id: deal.id,
    title: `${deal.customerName}`,
    subtitle: deal.vehicleInfo,
    status: deal.stage,
    amount: deal.amount,
    date: deal.createdAt,
    link: `/deals`
  }))

  const transformedAgreements = relatedAgreements.map(agreement => ({
    id: agreement.id,
    title: `${agreement.type} Agreement`,
    subtitle: agreement.vehicleInfo,
    status: agreement.status,
    amount: agreement.totalAmount,
    date: agreement.createdAt,
    link: `/agreements`
  }))

  const transformedServiceTickets = relatedServiceTickets.map(ticket => ({
    id: ticket.id,
    title: ticket.title,
    subtitle: ticket.vehicleInfo,
    status: ticket.status,
    date: ticket.createdAt,
    link: `/service`
  }))

  const transformedInvoices = relatedInvoices.map(invoice => ({
    id: invoice.id,
    title: `Invoice ${invoice.id}`,
    subtitle: invoice.description || 'Invoice',
    status: invoice.status,
    amount: invoice.totalAmount,
    date: invoice.createdAt,
    link: `/invoices`
  }))

  const transformedLoans = relatedLoans.map(loan => ({
    id: loan.id,
    title: `${loan.type || 'Loan'} - ${loan.vehicleInfo}`,
    subtitle: `${loan.termMonths} months • ${loan.interestRate}% APR`,
    status: loan.status,
    amount: loan.loanAmount,
    date: loan.createdAt,
    link: `/finance`
  }))

  const transformedTasks = relatedTasks.map(task => ({
    id: task.id,
    title: task.title,
    subtitle: task.description,
    status: task.status,
    date: task.createdAt.toString(),
    link: `/tasks`
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/crm/accounts')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Accounts
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{account.name}</h1>
                <p className="text-muted-foreground">Account details and related information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header Tiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-primary">{metrics.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                {relatedContacts.filter(c => c.isPrimary).length} primary
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-success">{metrics.totalDeals}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.totalDealsValue)} total value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loans</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-info">{metrics.totalLoans}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.totalLoansValue)} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Tickets</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-warning">{metrics.openServiceTickets}</div>
              <p className="text-xs text-muted-foreground">
                {relatedServiceTickets.length} total tickets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="related">Related Records</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Account Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Basic information about this account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        {account.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${account.email}`} className="text-primary hover:underline">
                              {account.email}
                            </a>
                          </div>
                        )}
                        {account.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${account.phone}`} className="text-primary hover:underline">
                              {account.phone}
                            </a>
                          </div>
                        )}
                        {account.website && (
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {account.website}
                            </a>
                          </div>
                        )}
                        {account.address && (
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">{account.address}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        {account.industry && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Industry:</span>
                            <p className="text-sm">{account.industry}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Created:</span>
                          <p className="text-sm">{formatDate(account.createdAt)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Last Updated:</span>
                          <p className="text-sm">{formatDate(account.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                    <CardDescription>
                      Key metrics and recent activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold stat-success">{metrics.totalQuotes}</div>
                        <p className="text-sm text-muted-foreground">Total Quotes</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(metrics.totalQuotesValue)}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold stat-info">{relatedInvoices.length}</div>
                        <p className="text-sm text-muted-foreground">Invoices</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(metrics.totalInvoicesValue || 0)}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold stat-primary">{metrics.recentActivity}</div>
                        <p className="text-sm text-muted-foreground">Activities</p>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Contacts */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Primary Contacts
                        </CardTitle>
                        <CardDescription>
                          Key contacts for this account
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/crm/contacts/new?accountId=${id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Contact
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {relatedContacts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No contacts yet</p>
                        <p className="text-sm">Add contacts to this account to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {relatedContacts.slice(0, 3).map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {contact.title && `${contact.title} • `}{contact.email}
                                </p>
                                {contact.isPrimary && (
                                  <Badge variant="secondary" className="text-xs">Primary</Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/crm/contacts/${contact.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        ))}
                        {relatedContacts.length > 3 && (
                          <div className="text-center pt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/crm/contacts?accountId=${id}`}>
                                View All {relatedContacts.length} Contacts
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Notes Section */}
              <div className="space-y-6">
                <NotesSection
                  notes={account.notes}
                  onAddNote={handleAddNote}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                  title="Account Notes"
                  description="Internal notes and comments"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <RelatedRecordsPanel
              accountId={id}
              leads={transformedLeads}
              quotes={transformedQuotes}
              agreements={transformedAgreements}
              serviceTickets={transformedServiceTickets}
              invoices={transformedInvoices}
              loans={transformedLoans}
              tasks={transformedTasks}
              onCreateNew={(type) => {
                switch (type) {
                  case 'leads':
                    navigate(`/crm?accountId=${id}`)
                    break
                  case 'quotes':
                    navigate(`/quotes?accountId=${id}`)
                    break
                  case 'tasks':
                    setActiveTab('tasks')
                    break
                  default:
                    break
                }
              }}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TasksSection
              accountId={id}
              title="Account Tasks"
              description="Tasks and follow-ups for this account"
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityTimeline
              activities={accountActivities}
              title="Account Activity"
              description="Complete history of interactions and changes"
              showEntityLinks={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}