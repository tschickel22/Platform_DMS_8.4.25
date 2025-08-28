import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAccountManagement } from '../hooks/useAccountManagement'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ContactForm from '@/modules/contacts/components/ContactForm'
import DealForm from '@/modules/crm-sales-deal/components/DealForm'
import NewQuoteForm from '@/modules/quote-builder/components/NewQuoteForm'
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
  Settings
} from 'lucide-react'

// Import section components
import { AccountContactsSection } from '../components/AccountContactsSection'
import { AccountDealsSection } from '../components/AccountDealsSection'
import { AccountQuotesSection } from '../components/AccountQuotesSection'
import { AccountServiceTicketsSection } from '../components/AccountServiceTicketsSection'
import { AccountNotesSection } from '../components/AccountNotesSection'

interface AccountSection {
  id: string
  type: string
  title: string
  component: React.ComponentType<any>
  description: string
}

const AVAILABLE_SECTIONS: AccountSection[] = [
  {
    id: 'contacts',
    type: 'contacts',
    title: 'Associated Contacts',
    component: AccountContactsSection,
    description: 'Contacts linked to this account'
  },
  {
    id: 'deals',
    type: 'deals', 
    title: 'Sales Deals',
    component: AccountDealsSection,
    description: 'Active and historical deals'
  },
  {
    id: 'quotes',
    type: 'quotes',
    title: 'Quotes',
    component: AccountQuotesSection,
    description: 'Quotes and proposals'
  },
  {
    id: 'service',
    type: 'service',
    title: 'Service Tickets',
    component: AccountServiceTicketsSection,
    description: 'Service requests and maintenance'
  },
  {
    id: 'notes',
    type: 'notes',
    title: 'Notes & Comments',
    component: AccountNotesSection,
    description: 'Internal notes and comments'
  }
]

const DEFAULT_LAYOUT = ['contacts', 'deals', 'quotes', 'service', 'notes']

export default function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { getAccount } = useAccountManagement()
  const { toast } = useToast()
  
  const [account, setAccount] = useState(null)
  const [sections, setSections] = useState<string[]>(DEFAULT_LAYOUT)
  
  // Modal states
  const [openContact, setOpenContact] = useState(false)
  const [openDeal, setOpenDeal] = useState(false)
  const [openQuote, setOpenQuote] = useState(false)
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const storageKey = `account-detail-layout-${accountId}`

  // Load account data
  useEffect(() => {
    if (accountId) {
      const accountData = getAccount(accountId)
      setAccount(accountData)
    }
  }, [accountId, getAccount])

  // Load saved layout
  useEffect(() => {
    if (accountId) {
      const savedLayout = loadFromLocalStorage<string[]>(storageKey, DEFAULT_LAYOUT)
      setSections(savedLayout)
    }
  }, [accountId, storageKey])

  // Save layout to localStorage
  const saveLayout = () => {
    if (accountId) {
      saveToLocalStorage(storageKey, sections)
      setHasUnsavedChanges(false)
      toast({
        title: 'Layout Saved',
        description: 'Your customized view has been saved successfully.'
      })
    }
  }

  // Reset to default layout
  const resetLayout = () => {
    setSections(DEFAULT_LAYOUT)
    setHasUnsavedChanges(true)
    toast({
      title: 'Layout Reset',
      description: 'Layout has been reset to default. Click Save to persist changes.'
    })
  }

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newSections = Array.from(sections)
    const [reorderedItem] = newSections.splice(result.source.index, 1)
    newSections.splice(result.destination.index, 0, reorderedItem)

    setSections(newSections)
    setHasUnsavedChanges(true)
  }

  // Add section
  const addSection = (sectionType: string) => {
    if (!sections.includes(sectionType)) {
      setSections([...sections, sectionType])
      setHasUnsavedChanges(true)
      setIsAddSectionOpen(false)
      toast({
        title: 'Section Added',
        description: 'New section has been added to your view.'
      })
    }
  }

  // Remove section
  const removeSection = (sectionType: string) => {
    setSections(sections.filter(s => s !== sectionType))
    setHasUnsavedChanges(true)
    toast({
      title: 'Section Removed',
      description: 'Section has been removed from your view.'
    })
  }

  const refreshSection = (sectionType: string) => {
    // Refresh section logic here
  }

  const handleContactSaved = (contact: any) => {
    setOpenContact(false)
    if (contact) {
      refreshSection('contacts')
      toast({
        title: 'Success',
        description: 'Contact created successfully'
      })
    }
  }

  const handleDealSaved = (deal: any) => {
    setOpenDeal(false)
    if (deal) {
      refreshSection('deals')
      toast({
        title: 'Success', 
        description: 'Deal created successfully'
      })
    }
  }

  const handleQuoteSaved = (quote: any) => {
    setOpenQuote(false)
    if (quote) {
      refreshSection('quotes')
      toast({
        title: 'Success',
        description: 'Quote created successfully'
      })
    }
  }


  // Get available sections to add
  const availableSectionsToAdd = AVAILABLE_SECTIONS.filter(
    section => !sections.includes(section.type)
  )

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading account...</p>
        </div>
      </div>
    )
  }

  const getAccountTypeColor = (type: string) => {
    const colors = {
      'customer': 'bg-green-100 text-green-800',
      'prospect': 'bg-blue-100 text-blue-800',
      'vendor': 'bg-purple-100 text-purple-800',
      'partner': 'bg-orange-100 text-orange-800',
      'competitor': 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

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
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <Badge className={getAccountTypeColor(account.type)}>
                {account.type}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {account.industry} • Created {new Date(account.createdAt).toLocaleDateString()}
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
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Choose a section to add to this account view:
                </p>
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

      {/* Account Information Card */}
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
              {account.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={account.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {account.website}
                  </a>
                </div>
              )}
              
              {account.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${account.email}`}
                    className="text-primary hover:underline"
                  >
                    {account.email}
                  </a>
                </div>
              )}
              
              {account.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${account.phone}`}
                    className="text-primary hover:underline"
                  >
                    {account.phone}
                  </a>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {account.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <div>{account.address.street}</div>
                    <div>{account.address.city}, {account.address.state} {account.address.zipCode}</div>
                    <div>{account.address.country}</div>
                  </div>
                </div>
              )}
              
              {account.tags && account.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {account.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {account.notes && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium mb-2">Notes</p>
              <p className="text-sm text-muted-foreground">{account.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Sections with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="account-sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {sections.map((sectionType, index) => {
                const sectionConfig = AVAILABLE_SECTIONS.find(s => s.type === sectionType)
                if (!sectionConfig) return null

                const SectionComponent = sectionConfig.component

                return (
                  <Draggable key={sectionType} draggableId={sectionType} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SectionComponent
                          accountId={accountId}
                          onRemove={() => removeSection(sectionType)}
                          isDragging={snapshot.isDragging}
                        />
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

      {/* Empty state when no sections */}
      {sections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No sections configured</h3>
            <p className="text-muted-foreground mb-4">
              Add sections to customize your account view
            </p>
            <Button onClick={() => setIsAddSectionOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="shadow-lg border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-orange-800">
                  You have unsaved layout changes
                </p>
                <Button size="sm" onClick={saveLayout}>
                  Save Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>

    {/* Contact Modal */}
    <Dialog open={openContact} onOpenChange={setOpenContact}>
      <DialogContent className="max-w-2xl p-0">
        <ContactForm
          accountId={account.id}
          returnTo="account"
          onSaved={handleContactSaved}
        />
      </DialogContent>
    </Dialog>

    {/* Deal Modal */}
    <Dialog open={openDeal} onOpenChange={setOpenDeal}>
      <DialogContent className="max-w-3xl p-0">
        <DealForm
          accountId={account.id}
          returnTo="account"
          onSaved={handleDealSaved}
        />
      </DialogContent>
    </Dialog>

    {/* Quote Modal */}
    <Dialog open={openQuote} onOpenChange={setOpenQuote}>
      <DialogContent className="max-w-3xl p-0">
        <NewQuoteForm
          accountId={account.id}
          returnTo="account"
          onSaved={handleQuoteSaved}
        />
      </DialogContent>
    </Dialog>
    </>
  )
}