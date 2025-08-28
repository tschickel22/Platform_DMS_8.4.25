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

// Section components (existing)
import { AccountContactsSection } from '@/modules/accounts/components/AccountContactsSection'
import { AccountDealsSection } from '@/modules/accounts/components/AccountDealsSection'
import { AccountQuotesSection } from '@/modules/accounts/components/AccountQuotesSection'
import { AccountServiceTicketsSection } from '@/modules/accounts/components/AccountServiceTicketsSection'
import { AccountNotesSection } from '@/modules/accounts/components/AccountNotesSection'
import { AccountDeliveriesSection } from '@/modules/accounts/components/AccountDeliveriesSection'

// NEW section components (we'll add these files next)
import { AccountWarrantySection } from '@/modules/accounts/components/AccountWarrantySection'
import { AccountPaymentsSection } from '@/modules/accounts/components/AccountPaymentsSection'
import { AccountAgreementsSection } from '@/modules/accounts/components/AccountAgreementsSection'
import { AccountApplicationsSection } from '@/modules/accounts/components/AccountApplicationsSection'
import { AccountInvoicesSection } from '@/modules/accounts/components/AccountInvoicesSection'

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
} from 'lucide-react'

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

interface AccountSection {
  id: string
  type: SectionType
  title: string
  component: React.ComponentType<any>
  description: string
}

const AVAILABLE_SECTIONS: AccountSection[] = [
  { id: 'contacts', type: 'contacts', title: 'Associated Contacts', component: AccountContactsSection, description: 'Contacts linked to this account' },
  { id: 'deals', type: 'deals', title: 'Sales Deals', component: AccountDealsSection, description: 'Active and historical deals' },
  { id: 'quotes', type: 'quotes', title: 'Quotes', component: AccountQuotesSection, description: 'Quotes and proposals' },
  { id: 'service', type: 'service', title: 'Service Tickets', component: AccountServiceTicketsSection, description: 'Service requests and maintenance' },

  // NEW
  { id: 'deliveries', type: 'deliveries', title: 'Deliveries', component: AccountDeliveriesSection, description: 'Delivery records and scheduling' },
  { id: 'warranty', type: 'warranty', title: 'Warranty', component: AccountWarrantySection, description: 'Warranty registrations and claims' },
  { id: 'payments', type: 'payments', title: 'Payments', component: AccountPaymentsSection, description: 'Payments and finance transactions' },
  { id: 'agreements', type: 'agreements', title: 'Agreements', component: AccountAgreementsSection, description: 'Contracts and signed documents' },
  { id: 'applications', type: 'applications', title: 'Applications', component: AccountApplicationsSection, description: 'Finance/credit applications' },
  { id: 'invoices', type: 'invoices', title: 'Invoices', component: AccountInvoicesSection, description: 'Billing, invoices and balances' },

  { id: 'notes', type: 'notes', title: 'Notes & Comments', component: AccountNotesSection, description: 'Internal notes and comments' },
]

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
  const { contacts } = useContactManagement()
  const { vehicles } = useInventoryManagement()
  const { toast } = useToast()

  const [account, setAccount] = useState<any>(null)
  const [sections, setSections] = useState<SectionType[]>([...DEFAULT_LAYOUT])

  // Modals we already support today
  const [openContact, setOpenContact] = useState(false)
  const [openDeal, setOpenDeal] = useState(false)
  const [openQuote, setOpenQuote] = useState(false)
  const [openService, setOpenService] = useState(false)
  const [openDelivery, setOpenDelivery] = useState(false)

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

  // existing save handlers
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

  // Delivery save (localStorage
