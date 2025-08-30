// src/modules/accounts/pages/AccountDetail.tsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { useToast } from '@/hooks/use-toast'

import ContactForm from '@/modules/contacts/components/ContactForm'
import DealForm from '@/modules/crm-sales-deal/components/DealForm'
import NewQuoteForm from '@/modules/quote-builder/components/NewQuoteForm'
import ServiceTicketForm from '@/modules/service-ops/components/ServiceTicketForm'

import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

import {
  ArrowLeft,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  RotateCcw,
  Settings,
  PackageCheck,
  Shield,
  CreditCard,
  FileText,
  FileSignature,
  Receipt,
  GripVertical,
} from 'lucide-react'

// ---- Existing section components ----
import { AccountContactsSection } from '@/modules/accounts/components/AccountContactsSection'
import { AccountDealsSection } from '@/modules/accounts/components/AccountDealsSection'
import { AccountQuotesSection } from '@/modules/accounts/components/AccountQuotesSection'
import { AccountServiceTicketsSection } from '@/modules/accounts/components/AccountServiceTicketsSection'
import { AccountNotesSection } from '@/modules/accounts/components/AccountNotesSection'

/**
 * Lightweight, generic section used for the new modules until
 * you add dedicated components. Shows an empty state + Create button
 * that either calls an onAdd handler (to open a modal) or routes
 * to the module’s “new” page with accountId + returnTo=account.
 */
function GenericAccountSection({
  accountId,
  type,
  title,
  description,
  createLabel,
  createPath,
  Icon,
  onRemove,
  isDragging,
  onAdd,
}: {
  accountId: string
  type:
    | 'deliveries'
    | 'warranty'
    | 'payments'
    | 'agreements'
    | 'applications'
    | 'invoices'
  title: string
  description: string
  createLabel: string
  createPath: string
  Icon: React.ComponentType<{ className?: string }>
  onRemove?: () => void
  isDragging?: boolean
  onAdd?: () => void
}) {
  const handleCreate = () => {
    if (onAdd) return onAdd()
    window.location.href = `${createPath}?accountId=${accountId}&returnTo=account`
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <Icon className="h-5 w-5 mr-2" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">0</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          description={`Create a ${title.toLowerCase().replace(/s$/, '')} for this account`}
          icon={<Icon className="h-12 w-12" />}
          action={{ label: createLabel, onClick: handleCreate }}
        />
      </CardContent>
    </Card>
  )
}

// ---------------- Types & Sections ----------------

type SectionType =
  | 'contacts'
  | 'deals'
  | 'quotes'
  | 'service'
  | 'notes'
  // new ones:
  | 'deliveries'
  | 'warranty'
  | 'payments'
  | 'agreements'
  | 'applications'
  | 'invoices'

interface AccountSection {
  id: string
  type: SectionType
  title: string
  // For built-in sections we pass the component directly.
  // For new sections we render GenericAccountSection inline.
  component?: React.ComponentType<any>
  description: string
}

const SECTION_META: Record<
  Extract<
    SectionType,
    'deliveries' | 'warranty' | 'payments' | 'agreements' | 'applications' | 'invoices'
  >,
  {
    title: string
    description: string
    createLabel: string
    createPath: string
    Icon: React.ComponentType<{ className?: string }>
  }
> = {
  deliveries: {
    title: 'Deliveries',
    description: 'Delivery records and scheduling for this account',
    createLabel: 'Create Delivery',
    createPath: '/delivery/new',
    Icon: PackageCheck,
  },
  warranty: {
    title: 'Warranty',
    description: 'Warranty registrations and claims',
    createLabel: 'Register / File Claim',
    createPath: '/inventory/warranty/new',
    Icon: Shield,
  },
  payments: {
    title: 'Payments',
    description: 'Payments and finance transactions',
    createLabel: 'Record Payment',
    createPath: '/finance/payments/new',
    Icon: CreditCard,
  },
  agreements: {
    title: 'Agreements',
    description: 'Contracts and signed documents',
    createLabel: 'Create Agreement',
    createPath: '/agreements/new',
    Icon: FileSignature,
  },
  applications: {
    title: 'Applications',
    description: 'Finance/credit applications tied to this account',
    createLabel: 'New Application',
    createPath: '/client-applications/new',
    Icon: FileText,
  },
  invoices: {
    title: 'Invoices',
    description: 'Billing and open invoices',
    createLabel: 'Create Invoice',
    createPath: '/invoices/new',
    Icon: Receipt,
  },
}

const AVAILABLE_SECTIONS: AccountSection[] = [
  { id: 'contacts', type: 'contacts', title: 'Associated Contacts', component: AccountContactsSection, description: 'Contacts linked to this account' },
  { id: 'deals', type: 'deals', title: 'Sales Deals', component: AccountDealsSection, description: 'Active and historical deals' },
  { id: 'quotes', type: 'quotes', title: 'Quotes', component: AccountQuotesSection, description: 'Quotes and proposals' },
  { id: 'service', type: 'service', title: 'Service Tickets', component: AccountServiceTicketsSection, description: 'Service requests and maintenance' },
  { id: 'deliveries', type: 'deliveries', title: 'Deliveries', description: SECTION_META.deliveries.description },
  { id: 'warranty', type: 'warranty', title: 'Warranty', description: SECTION_META.warranty.description },
  { id: 'payments', type: 'payments', title: 'Payments', description: SECTION_META.payments.description },
  { id: 'agreements', type: 'agreements', title: 'Agreements', description: SECTION_META.agreements.description },
  { id: 'applications', type: 'applications', title: 'Applications', description: SECTION_META.applications.description },
  { id: 'invoices', type: 'invoices', title: 'Invoices', description: SECTION_META.invoices.description },
  { id: 'notes', type: 'notes', title: 'Notes & Comments', component: AccountNotesSection, description: 'Internal notes and comments' },
]

// Put your preferred order here
const DEFAULT_LAYOUT: SectionType[] = [
  'contacts',
  'deals',
  'quotes',
  'service',
  'deliveries',
  'warranty',
  'payments',
  'agreements',
  'applications',
  'invoices',
  'notes',
]

export default function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>()
  const { getAccount } = useAccountManagement()
  const { toast } = useToast()

  const [account, setAccount] = useState<any>(null)
  const [sections, setSections] = useState<SectionType[]>([...DEFAULT_LAYOUT])

  // Modals
  const [openContact, setOpenContact] = useState(false)
  const [openDeal, setOpenDeal] = useState(false)
  const [openQuote, setOpenQuote] = useState(false)
  const [openService, setOpenService] = useState(false)

  // Future modals (we’ll drop in forms later). Right now we show a tiny placeholder.
  const [openDelivery, setOpenDelivery] = useState(false)
  const [openWarranty, setOpenWarranty] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)
  const [openAgreement, setOpenAgreement] = useState(false)
  const [openApplication, setOpenApplication] = useState(false)
  const [openInvoice, setOpenInvoice] = useState(false)

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const storageKey = `account-detail-layout-${accountId ?? 'unknown'}`

  useEffect(() => {
    if (!accountId) return
    const data = getAccount(accountId)
    setAccount(data ?? null)
  }, [accountId, getAccount])

  useEffect(() => {
    if (!accountId) return
    const saved = loadFromLocalStorage<SectionType[]>(storageKey, [...DEFAULT_LAYOUT])
    setSections(saved || [...DEFAULT_LAYOUT])
  }, [accountId, storageKey])

  const saveLayout = () => {
    if (!accountId) return
    saveToLocalStorage(storageKey, sections)
    setHasUnsavedChanges(false)
    toast({ title: 'Layout Saved', description: 'Your customized view has been saved successfully.' })
  }

  const resetLayout = () => {
    setSections([...DEFAULT_LAYOUT])
    setHasUnsavedChanges(true)
    toast({ title: 'Layout Reset', description: 'Layout has been reset to default. Click Save to persist changes.' })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newSections = Array.from(sections)
    const [moved] = newSections.splice(result.source.index, 1)
    newSections.splice(result.destination.index, 0, moved)
    setSections(newSections)
    setHasUnsavedChanges(true)
  }

  const addSection = (type: SectionType) => {
    if (!sections.includes(type)) {
      setSections([...sections, type])
      setHasUnsavedChanges(true)
      setIsAddSectionOpen(false)
      toast({ title: 'Section Added', description: 'New section has been added to your view.' })
    }
  }

  const removeSection = (type: SectionType) => {
    setSections(sections.filter((s) => s !== type))
    setHasUnsavedChanges(true)
    toast({ title: 'Section Removed', description: 'Section has been removed from your view.' })
  }

  const refreshSection = (_: string) => {
    // placeholder — sections read from shared state or localStorage
  }

  const handleContactSaved = (contact: any) => {
    setOpenContact(false)
    if (contact) {
      refreshSection('contacts')
      toast({ title: 'Success', description: 'Contact created successfully' })
    }
  }
  const handleDealSaved = (deal: any) => {
    setOpenDeal(false)
    if (deal) {
      refreshSection('deals')
      toast({ title: 'Success', description: 'Deal created successfully' })
    }
  }
  const handleQuoteSaved = (quote: any) => {
    setOpenQuote(false)
    if (quote) {
      refreshSection('quotes')
      toast({ title: 'Success', description: 'Quote created successfully' })
    }
  }
  const handleServiceSaved = (ticket: any) => {
    setOpenService(false)
    if (ticket) {
      refreshSection('service')
    }
  }

  // Placeholder “saved” handlers for future modals
  const closeAndToast = (setter: (v: boolean) => void, label: string) => (x: any) => {
    setter(false)
    if (x) toast({ title: 'Success', description: `${label} created` })
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading account...</p>
        </div>
      </div>
    )
  }

  const getAccountTypeColor = (type: string) => {
    const map: Record<string, string> = {
      customer: 'bg-green-100 text-green-800',
      prospect: 'bg-blue-100 text-blue-800',
      vendor: 'bg-purple-100 text-purple-800',
      partner: 'bg-orange-100 text-orange-800',
      competitor: 'bg-red-100 text-red-800',
    }
    return map[type] || 'bg-gray-100 text-gray-800'
  }

  // Helper to render the generic new sections
  const renderGeneric = (t: keyof typeof SECTION_META, isDragging?: boolean) => {
    const m = SECTION_META[t]
    return (
      <GenericAccountSection
        key={t}
        accountId={accountId!}
        type={t}
        title={m.title}
        description={m.description}
        createLabel={m.createLabel}
        createPath={m.createPath}
        Icon={m.Icon}
        isDragging={isDragging}
        onRemove={() => removeSection(t)}
        // Open a placeholder modal for now; later we can swap in real forms
        onAdd={
          t === 'deliveries'
            ? () => setOpenDelivery(true)
            : t === 'warranty'
            ? () => setOpenWarranty(true)
            : t === 'payments'
            ? () => setOpenPayment(true)
            : t === 'agreements'
            ? () => setOpenAgreement(true)
            : t === 'applications'
            ? () => setOpenApplication(true)
            : () => setOpenInvoice(true)
        }
      />
    )
  }

  const availableSectionsToAdd = AVAILABLE_SECTIONS.filter((s) => !sections.includes(s.type))

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/accounts">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Accounts
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">{account?.name}</h1>
                {account?.type && <Badge className={getAccountTypeColor(account.type)}>{account.type}</Badge>}
              </div>
              <p className="text-muted-foreground">
                {account?.industry ?? '—'} • Created{' '}
                {account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Button variant="outline" size="sm" onClick={saveLayout}>
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={resetLayout}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Layout
            </Button>

            {/* Add Section */}
            <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Section</DialogTitle>
                  <DialogDescription>Select a section to add to this account view.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  {availableSectionsToAdd.map((section) => (
                    <Button
                      key={section.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addSection(section.type)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-muted-foreground">{section.description}</div>
                      </div>
                    </Button>
                  ))}
                  {availableSectionsToAdd.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      All available sections are already added to this view.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" asChild>
              <Link to={`/accounts/${accountId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Account info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {!!account?.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {account.website}
                    </a>
                  </div>
                )}
                {!!account?.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${account.email}`} className="text-primary hover:underline">
                      {account.email}
                    </a>
                  </div>
                )}
                {!!account?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${account.phone}`} className="text-primary hover:underline">
                      {account.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {!!account?.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <div>{account.address?.street}</div>
                      <div>
                        {account.address?.city}, {account.address?.state} {account.address?.zipCode}
                      </div>
                      <div>{account.address?.country}</div>
                    </div>
                  </div>
                )}

                {Array.isArray(account?.tags) && account.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {account.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!!account?.notes && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground">{account.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sections (drag & drop) */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="account-sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {sections.map((type, index) => {
                  const meta = AVAILABLE_SECTIONS.find((s) => s.type === type)
                  if (!meta) return null

                  return (
                    <Draggable key={type} draggableId={type} index={index}>
                      {(p, s) => (
                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                          {type === 'deals' ? (
                            <AccountDealsSection
                              accountId={accountId!}
                              onRemove={() => removeSection(type)}
                              isDragging={s.isDragging}
                              onAddDeal={() => setOpenDeal(true)}
                            />
                          ) : type === 'quotes' ? (
                            <AccountQuotesSection
                              accountId={accountId!}
                              onRemove={() => removeSection(type)}
                              isDragging={s.isDragging}
                              onAddQuote={() => setOpenQuote(true)}
                            />
                          ) : type === 'service' ? (
                            <AccountServiceTicketsSection
                              accountId={accountId!}
                              onRemove={() => removeSection(type)}
                              isDragging={s.isDragging}
                              onAddService={() => setOpenService(true)}
                            />
                          ) : type === 'contacts' ? (
                            <AccountContactsSection
                              accountId={accountId!}
                              onRemove={() => removeSection(type)}
                              isDragging={s.isDragging}
                            />
                          ) : type === 'notes' ? (
                            <AccountNotesSection
                              accountId={accountId!}
                              onRemove={() => removeSection(type)}
                              isDragging={s.isDragging}
                            />
                          ) : type === 'deliveries' ? (
                            renderGeneric('deliveries', s.isDragging)
                          ) : type === 'warranty' ? (
                            renderGeneric('warranty', s.isDragging)
                          ) : type === 'payments' ? (
                            renderGeneric('payments', s.isDragging)
                          ) : type === 'agreements' ? (
                            renderGeneric('agreements', s.isDragging)
                          ) : type === 'applications' ? (
                            renderGeneric('applications', s.isDragging)
                          ) : type === 'invoices' ? (
                            renderGeneric('invoices', s.isDragging)
                          ) : null}
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Unsaved indicator */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="shadow-lg border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-sm font-medium text-orange-800">You have unsaved layout changes</p>
                  <Button size="sm" onClick={saveLayout}>Save Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Create Contact</DialogTitle>
          <DialogDescription className="sr-only">Add a new contact for this account.</DialogDescription>
          <ContactForm accountId={account.id} returnTo="account" onSaved={handleContactSaved} />
        </DialogContent>
      </Dialog>

      {/* Deal Modal */}
      <Dialog open={openDeal} onOpenChange={setOpenDeal}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Create Deal</DialogTitle>
          <DialogDescription className="sr-only">Create a new sales deal for this account.</DialogDescription>
          <DealForm accountId={account.id} returnTo="account" onSaved={handleDealSaved} />
        </DialogContent>
      </Dialog>

      {/* Quote Modal */}
      <Dialog open={openQuote} onOpenChange={setOpenQuote}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Create Quote</DialogTitle>
          <DialogDescription className="sr-only">Create a new quote for this account.</DialogDescription>
          <NewQuoteForm accountId={account.id} returnTo="account" onSaved={handleQuoteSaved} />
        </DialogContent>
      </Dialog>

      {/* Service Ticket Modal */}
      <Dialog open={openService} onOpenChange={setOpenService}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Create Service Ticket</DialogTitle>
          <DialogDescription className="sr-only">Create a new service request for this account.</DialogDescription>
          <ServiceTicketForm accountId={account.id} returnTo="account" onSaved={handleServiceSaved} />
        </DialogContent>
      </Dialog>

      {/* Placeholder modals for new sections (we'll replace with real forms later) */}
      <Dialog open={openDelivery} onOpenChange={setOpenDelivery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Delivery</DialogTitle>
            <DialogDescription>We’ll plug the real Delivery form here next.</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            For now, you can continue in the Delivery module.
          </div>
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/delivery/new?accountId=${account.id}&returnTo=account`}>Go to Delivery</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openWarranty} onOpenChange={setOpenWarranty}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warranty Action</DialogTitle>
            <DialogDescription>We’ll hook up the Warranty form here.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/inventory/warranty/new?accountId=${account.id}&returnTo=account`}>Open Warranty</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openPayment} onOpenChange={setOpenPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>We’ll add the Finance payment form here.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/finance/payments/new?accountId=${account.id}&returnTo=account`}>Go to Finance</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openAgreement} onOpenChange={setOpenAgreement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Agreement</DialogTitle>
            <DialogDescription>Agreement form coming next.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/agreements/new?accountId=${account.id}&returnTo=account`}>Open Agreements</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openApplication} onOpenChange={setOpenApplication}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
            <DialogDescription>We’ll embed the finance application form here.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/client-applications/new?accountId=${account.id}&returnTo=account`}>Open Applications</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openInvoice} onOpenChange={setOpenInvoice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Invoice creation will be embedded here.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/invoices/new?accountId=${account.id}&returnTo=account`}>Go to Invoices</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
