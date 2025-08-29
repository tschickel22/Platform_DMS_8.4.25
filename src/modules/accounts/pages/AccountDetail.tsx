// src/modules/accounts/pages/AccountDetail.tsx
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'
import { saveToLocalStorage, loadFromLocalStorage, generateId } from '@/lib/utils'

import ContactForm from '@/modules/contacts/components/ContactForm'
import DealForm from '@/modules/crm-sales-deal/components/DealForm'
import NewQuoteForm from '@/modules/quote-builder/components/NewQuoteForm'
import ServiceTicketForm from '@/modules/service-ops/components/ServiceTicketForm'
import { DeliveryForm } from '@/modules/delivery-tracker/components/DeliveryForm'
import { WarrantyClaimForm } from '@/modules/warranty-mgmt/components/WarrantyClaimForm'
import AgreementForm from '@/modules/agreement-vault/components/AgreementForm'
import { InvoiceForm } from '@/modules/invoice-payments/components/InvoiceForm'

// 👉 new: real applications modal form
import { FinanceApplicationForm } from '@/modules/finance-application/components/FinanceApplicationForm'

import {
  ArrowLeft, Edit, Globe, Mail, MapPin, Phone, Plus, Save, RotateCcw, Settings,
} from 'lucide-react'

// Core/static sections
import { AccountContactsSection } from '@/modules/accounts/components/AccountContactsSection'
import { AccountDealsSection } from '@/modules/accounts/components/AccountDealsSection'
import { AccountQuotesSection } from '@/modules/accounts/components/AccountQuotesSection'
import { AccountServiceTicketsSection } from '@/modules/accounts/components/AccountServiceTicketsSection'
import { AccountNotesSection } from '@/modules/accounts/components/AccountNotesSection'
import { AccountDeliveriesSection } from '@/modules/accounts/components/AccountDeliveriesSection'

// ---------- Types ----------
type SectionType =
  | 'contacts'
  | 'deals'
  | 'quotes'
  | 'service'
  | 'deliveries'
  | 'warranty'
  | 'payments'
  | 'agreements'
  | 'applications'
  | 'invoices'
  | 'notes'

interface AccountSectionDescriptor {
  id: string
  type: SectionType
  title: string
  description: string
  component: React.ComponentType<any>
  sort?: number
  defaultVisible?: boolean
}

interface AccountSection extends AccountSectionDescriptor {}

// ---------- Dynamic Section Registry ----------
const sectionModules = import.meta.glob('@/modules/**/account-section.{ts,tsx}', { eager: true }) as Record<
  string,
  { default?: AccountSectionDescriptor }
>

const dynamicSections: AccountSection[] = Object.values(sectionModules)
  .map((m) => m?.default)
  .filter(Boolean)
  .map((d) => ({
    ...d!,
    sort: d?.sort ?? 100,
    defaultVisible: d?.defaultVisible ?? true,
  })) as AccountSection[]

// Static “core” sections
const coreSections: AccountSection[] = [
  {
    id: 'contacts',
    type: 'contacts',
    title: 'Associated Contacts',
    description: 'Contacts linked to this account',
    component: AccountContactsSection,
    sort: 10,
    defaultVisible: true,
  },
  {
    id: 'deals',
    type: 'deals',
    title: 'Sales Deals',
    description: 'Active and historical deals',
    component: AccountDealsSection,
    sort: 20,
    defaultVisible: true,
  },
  {
    id: 'quotes',
    type: 'quotes',
    title: 'Quotes',
    description: 'Quotes and proposals',
    component: AccountQuotesSection,
    sort: 30,
    defaultVisible: true,
  },
  {
    id: 'service',
    type: 'service',
    title: 'Service Tickets',
    description: 'Service requests and maintenance',
    component: AccountServiceTicketsSection,
    sort: 40,
    defaultVisible: true,
  },
  {
    id: 'deliveries',
    type: 'deliveries',
    title: 'Deliveries',
    description: 'Delivery records and scheduling',
    component: AccountDeliveriesSection,
    sort: 50,
    defaultVisible: true,
  },
  {
    id: 'notes',
    type: 'notes',
    title: 'Notes & Comments',
    description: 'Internal notes and comments',
    component: AccountNotesSection,
    sort: 999,
    defaultVisible: true,
  },
]

function mergeSections(core: AccountSection[], dyn: AccountSection[]): AccountSection[] {
  const byType = new Map<SectionType, AccountSection>()
  for (const s of core) byType.set(s.type, s)
  for (const s of dyn) byType.set(s.type, { ...byType.get(s.type), ...s })
  return Array.from(byType.values()).sort((a, b) => (a.sort ?? 100) - (b.sort ?? 100))
}

const AVAILABLE_SECTIONS = mergeSections(coreSections, dynamicSections)

// ---------------- Quick Payment (inline modal content) ----------------
type QuickPayment = {
  id: string
  accountId: string
  date: string
  amount: number
  method: 'cash' | 'card' | 'ach' | 'check' | 'other'
  reference?: string
  notes?: string
}

function QuickPaymentForm({
  accountId,
  onSaved,
  onCancel,
}: {
  accountId: string
  onSaved: (p: QuickPayment | null) => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [amount, setAmount] = useState<string>('')
  const [method, setMethod] = useState<QuickPayment['method']>('card')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) {
      toast({ title: 'Amount required', description: 'Please enter a payment amount.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const item: QuickPayment = {
        id: generateId(),
        accountId,
        date,
        amount: Number(amount),
        method,
        reference: reference || undefined,
        notes: notes || undefined,
      }
      const existing = loadFromLocalStorage<QuickPayment[]>('payments', []) || []
      saveToLocalStorage('payments', [item, ...existing])
      toast({ title: 'Payment recorded', description: 'Payment has been saved.' })
      onSaved(item)
    } catch {
      toast({ title: 'Error', description: 'Failed to save payment.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-lg w-[95vw] max-h-[85vh] overflow-y-auto">
      <DialogTitle>Record Payment</DialogTitle>
      <DialogDescription>Add a new payment for this account.</DialogDescription>

      <form onSubmit={handleSave} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Amount</Label>
            <Input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Method</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as QuickPayment['method'])}>
              <SelectTrigger><SelectValue placeholder="Choose a method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="ach">ACH</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reference #</Label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Payment'}</Button>
        </div>
      </form>
    </DialogContent>
  )
}

// ---------------- Page ----------------
export default function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>()
  const { getAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { vehicles } = useInventoryManagement()
  const { toast } = useToast()

  const [account, setAccount] = useState<any>(null)

  const defaultLayout = useMemo(
    () => AVAILABLE_SECTIONS.filter((s) => s.defaultVisible !== false).map((s) => s.type),
    []
  )
  const [sections, setSections] = useState<SectionType[]>(defaultLayout as SectionType[])

  // Modals
  const [openContact, setOpenContact] = useState(false)
  const [openDeal, setOpenDeal] = useState(false)
  const [openQuote, setOpenQuote] = useState(false)
  const [openService, setOpenService] = useState(false)
  const [openDelivery, setOpenDelivery] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)
  const [openWarranty, setOpenWarranty] = useState(false)
  const [openAgreement, setOpenAgreement] = useState(false)
  const [openInvoice, setOpenInvoice] = useState(false)
  const [openApplication, setOpenApplication] = useState(false) // ← NEW

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const storageKey = `account-detail-layout-${accountId ?? 'unknown'}`

  useEffect(() => {
    if (!accountId) return
    const data = getAccount(accountId)
    setAccount(data ?? null)
  }, [accountId, getAccount])

  // Merge any saved layout with current defaults
  useEffect(() => {
    if (!accountId) return
    const saved = loadFromLocalStorage<SectionType[]>(storageKey, []) || []
    const valid = new Set<SectionType>(AVAILABLE_SECTIONS.map((s) => s.type))
    const cleaned = saved.filter((t) => valid.has(t))
    const mergedUnique = Array.from(new Set<SectionType>([...cleaned, ...(defaultLayout as SectionType[])]))
    setSections(mergedUnique)
    if (saved.length && mergedUnique.length !== saved.length) setHasUnsavedChanges(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const saveLayout = () => {
    if (!accountId) return
    saveToLocalStorage(storageKey, sections)
    setHasUnsavedChanges(false)
    toast({ title: 'Layout Saved', description: 'Your customized view has been saved successfully.' })
  }

  const resetLayout = () => {
    setSections(defaultLayout as SectionType[])
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

  const refreshSection = (_: string) => {}

  // Save handlers
  const handleContactSaved = (c: any) => { setOpenContact(false); if (c) toast({ title: 'Success', description: 'Contact created successfully' }) }
  const handleDealSaved = (d: any) => { setOpenDeal(false); if (d) toast({ title: 'Success', description: 'Deal created successfully' }) }
  const handleQuoteSaved = (q: any) => { setOpenQuote(false); if (q) toast({ title: 'Success', description: 'Quote created successfully' }) }
  const handleServiceSaved = (t: any) => { setOpenService(false); if (t) toast({ title: 'Success', description: 'Service ticket created successfully' }) }

  // Deliveries (localStorage demo)
  const handleDeliverySaved = async (delivery: any | null) => {
    setOpenDelivery(false)
    if (!delivery) return
    const existing = loadFromLocalStorage<any[]>('deliveries', [])
    const withId = delivery.id ? delivery : { ...delivery, id: generateId() }
    saveToLocalStorage('deliveries', [withId, ...existing])
    refreshSection('deliveries')
    toast({ title: 'Success', description: 'Delivery saved successfully' })
  }

  // Warranty (localStorage demo)
  const handleWarrantySaved = async (claim: any | null) => {
    setOpenWarranty(false)
    if (!claim) return
    const existing = loadFromLocalStorage<any[]>('warranties', [])
    const withId = claim.id ? claim : { ...claim, id: generateId(), accountId }
    saveToLocalStorage('warranties', [withId, ...existing])
    refreshSection('warranty')
    toast({ title: 'Success', description: 'Warranty claim saved successfully' })
  }

  // Agreement (localStorage demo)
  const handleAgreementSaved = async (data: any) => {
    const existing = loadFromLocalStorage<any[]>('agreements', [])
    const withId = data.id ? data : { ...data, id: generateId(), accountId }
    saveToLocalStorage('agreements', [withId, ...existing])
    setOpenAgreement(false)
    refreshSection('agreements')
    toast({ title: 'Success', description: 'Agreement saved successfully' })
  }

  // Invoice (localStorage demo)
  const handleInvoiceSave = async (data: any) => {
    const existing = loadFromLocalStorage<any[]>('invoices', [])
    const withId = data.id ? data : { ...data, id: generateId(), accountId }
    saveToLocalStorage('invoices', [withId, ...existing])
    setOpenInvoice(false)
    refreshSection('invoices')
    toast({ title: 'Success', description: 'Invoice saved successfully' })
  }

  // Applications (localStorage demo)
  const handleApplicationSave = async (data: any) => {
    const existing = loadFromLocalStorage<any[]>('applications', [])
    const withId = data?.id ? data : { ...data, id: generateId(), accountId }
    saveToLocalStorage('applications', [withId, ...existing])
    setOpenApplication(false)
    refreshSection('applications')
    toast({ title: 'Success', description: 'Application saved successfully' })
  }

  const handleApplicationSubmit = async (data: any) => {
    await handleApplicationSave({ ...data, status: 'submitted', submittedAt: new Date().toISOString() })
  }

  // Default "new application" shell for the modal
  const newApplication = useMemo(
    () => ({
      id: generateId(),
      accountId,
      customerName: account?.name ?? '',
      templateId: 'standard', // your FinanceApplicationForm will resolve an existing template
      status: 'draft',
      data: {},
    }),
    [account?.name, accountId]
  )

  // Generic fallback create route (used by types we don't modal-ize)
  const routeCreateForType = (t: SectionType) => {
    const map: Partial<Record<SectionType, string>> = {
      deals: `/deals/new?accountId=${accountId}&returnTo=account`,
      quotes: `/quotes/new?accountId=${accountId}&returnTo=account`,
      service: `/service/new?accountId=${accountId}&returnTo=account`,
      deliveries: `/delivery/new?accountId=${accountId}&returnTo=account`,
      // applications: (handled via modal now)
      invoices: `/invoices/new?accountId=${accountId}&returnTo=account`,
    }
    const href = map[t]
    if (href) window.location.href = href
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

  const availableToAdd = AVAILABLE_SECTIONS.filter(
    (s) => !sections.includes(s.type) && s.defaultVisible !== false
  )

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
                {account?.type && <span className={`px-2 py-0.5 rounded-md text-xs ${getAccountTypeColor(account.type)}`}>{account.type}</span>}
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
                <div className="space-y-2">
                  {availableToAdd.map((s) => (
                    <Button
                      key={s.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addSection(s.type)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-muted-foreground">{s.description}</div>
                      </div>
                    </Button>
                  ))}
                  {availableToAdd.length === 0 && (
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
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md border">{tag}</span>
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
                  const config = AVAILABLE_SECTIONS.find((s) => s.type === type)
                  if (!config) return null
                  const Section = config.component as any

                  const commonProps = {
                    accountId: accountId!,
                    onRemove: () => removeSection(type),
                    onCreate: () => routeCreateForType(type),
                  }

                  const withSpecialHandlers =
                    type === 'deliveries'
                      ? { ...commonProps, onAddDelivery: () => setOpenDelivery(true) }
                      : type === 'payments'
                        ? { ...commonProps, onCreate: () => setOpenPayment(true) }
                        : type === 'warranty'
                          ? { ...commonProps, onCreate: () => setOpenWarranty(true) }
                          : type === 'agreements'
                            ? { ...commonProps, onCreate: () => setOpenAgreement(true) }
                            : type === 'invoices'
                              ? { ...commonProps, onCreate: () => setOpenInvoice(true) }
                              : type === 'applications'
                                ? { ...commonProps, onCreate: () => setOpenApplication(true) } // ← NEW
                                : commonProps

                  return (
                    <Draggable key={type} draggableId={type} index={index}>
                      {(p, s) => (
                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                          {type === 'deals' ? (
                            <AccountDealsSection {...withSpecialHandlers} isDragging={s.isDragging} onAddDeal={() => setOpenDeal(true)} />
                          ) : type === 'quotes' ? (
                            <AccountQuotesSection {...withSpecialHandlers} isDragging={s.isDragging} onAddQuote={() => setOpenQuote(true)} />
                          ) : type === 'service' ? (
                            <AccountServiceTicketsSection {...withSpecialHandlers} isDragging={s.isDragging} onAddService={() => setOpenService(true)} />
                          ) : type === 'deliveries' ? (
                            <AccountDeliveriesSection {...withSpecialHandlers} isDragging={s.isDragging} />
                          ) : (
                            <Section {...withSpecialHandlers} isDragging={s.isDragging} />
                          )}
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

      {/* Delivery Modal (DeliveryForm renders its own overlay UI) */}
      {openDelivery && (
        <DeliveryForm
          customers={contacts}
          vehicles={vehicles}
          onSave={async (d) => handleDeliverySaved({ ...d, accountId })}
          onCancel={() => setOpenDelivery(false)}
        />
      )}

      {/* Payments Modal */}
      <Dialog open={openPayment} onOpenChange={setOpenPayment}>
        <QuickPaymentForm
          accountId={account.id}
          onSaved={() => {
            setOpenPayment(false)
            refreshSection('payments')
            toast({ title: 'Success', description: 'Payment recorded successfully' })
          }}
          onCancel={() => setOpenPayment(false)}
        />
      </Dialog>

      {/* Warranty Claim Modal */}
      <Dialog open={openWarranty} onOpenChange={setOpenWarranty}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">New Warranty Claim</DialogTitle>
          <DialogDescription className="sr-only">Create a warranty claim for this account.</DialogDescription>
          <WarrantyClaimForm
            accountId={account.id}
            onSaved={(claim) => handleWarrantySaved(claim)}
            onCancel={() => setOpenWarranty(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Agreement Modal */}
      {openAgreement && (
        <AgreementForm
          onSaved={(data) => handleAgreementSaved(data)}
          onCancel={() => setOpenAgreement(false)}
        />
      )}

      {/* Invoice Modal */}
      {openInvoice && (
        <InvoiceForm
          onSave={handleInvoiceSave}
          onCancel={() => setOpenInvoice(false)}
        />
      )}

      {/* Applications Modal – opens instead of routing */}
      <Dialog open={openApplication} onOpenChange={setOpenApplication}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">New Finance Application</DialogTitle>
          <DialogDescription className="sr-only">Create a finance application for this account.</DialogDescription>
          <FinanceApplicationForm
            application={newApplication as any}
            onSave={(data) => handleApplicationSave(data)}
            onSubmit={(data) => handleApplicationSubmit(data)}
            onCancel={() => setOpenApplication(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
