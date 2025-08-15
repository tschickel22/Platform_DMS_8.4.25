import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FileText, Plus, Search, Filter, Send, Edit, Eye, TrendingUp, DollarSign, Copy, Trash2, Download, X, ListTodo } from 'lucide-react'
import { Quote, QuoteStatus, Vehicle, VehicleStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { mockQuoteBuilder } from '@/mocks/quoteBuilderMock'
import { Textarea } from '@/components/ui/textarea'
import { TaskForm } from '@/modules/task-center/components/TaskForm'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskModule, TaskPriority } from '@/types'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'


const mockQuotes: Quote[] = [
  {
    id: '1',
    customerId: 'cust-1',
    vehicleId: 'veh-1',
    items: [
      {
        id: '1',
        description: '2024 Forest River Georgetown',
        quantity: 1,
        unitPrice: 125000,
        total: 125000
      },
      {
        id: '2',
        description: 'Extended Warranty',
        quantity: 1,
        unitPrice: 2500,
        total: 2500
      }
    ],
    subtotal: 127500,
    tax: 10200,
    total: 137700,
    status: QuoteStatus.SENT,
    validUntil: new Date('2024-02-15'),
    notes: 'Customer interested in financing options',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    customerId: 'cust-2',
    vehicleId: 'veh-2',
    items: [
      {
        id: '3',
        description: '2023 Winnebago View',
        quantity: 1,
        unitPrice: 89000,
        total: 89000
      }
    ],
    subtotal: 89000,
    tax: 7120,
    total: 96120,
    status: QuoteStatus.ACCEPTED,
    validUntil: new Date('2024-02-20'),
    notes: 'Ready to proceed with purchase',
    customFields: {},
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18')
  }
]

// --- Simple, self-contained Quote Builder modal used by QuotesList ---
type SimpleQuoteBuilderProps = {
  quote: Quote | null
  customerId: string
  vehicles: Vehicle[]
  onSave: (data: Partial<Quote>) => void
  onCancel: () => void
}

function SimpleQuoteBuilder({
  quote,
  customerId,
  vehicles,
  onSave,
  onCancel
}: SimpleQuoteBuilderProps) {
  const [custId, setCustId] = React.useState(customerId || '')
  const [vehicleId, setVehicleId] = React.useState<string>(quote?.vehicleId || '')
  const [price, setPrice] = React.useState<number>(quote?.total || 0)

  // Keep it dumb: pick a vehicle and a price
  const available = React.useMemo(
    () => vehicles.filter(v => v.status === VehicleStatus.AVAILABLE),
    [vehicles]
  )

  const handleSave = () => {
    const selected = vehicles.find(v => v.id === vehicleId)
    const subtotal = price
    const tax = Math.round(subtotal * 0.08)
    const total = subtotal + tax

    onSave({
      customerId: custId || 'unknown',
      vehicleId: selected?.id,
      items: selected
        ? [{
            id: 'li-1',
            description: `${selected.year} ${selected.make} ${selected.model}`,
            quantity: 1,
            unitPrice: price,
            total: price
          }]
        : [],
      subtotal,
      tax,
      total,
      notes: quote?.notes || '',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    } as Partial<Quote>)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{quote ? 'Edit Quote' : 'New Quote'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cust">Customer ID</Label>
            <Input id="cust" value={custId} onChange={(e) => setCustId(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="veh">Vehicle</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger id="veh"><SelectValue placeholder="Select a vehicle" /></SelectTrigger>
              <SelectContent>
                {available.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
// Quote Detail Modal Component
interface QuoteDetailModalProps {
  quote: Quote
  onClose: () => void
  onEdit: (quote: Quote) => void
}

function QuoteDetailModal({ quote, onClose, onEdit }: QuoteDetailModalProps) {
  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'viewed':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'expired':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Quote #{quote.id}</CardTitle>
              <CardDescription>
                Quote details and line items
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(quote)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Quote
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quote Header Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
              <p className="font-medium">{quote.customerId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                  {quote.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created Date</label>
              <p className="font-medium">{formatDate(quote.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Valid Until</label>
              <p className="font-medium">{formatDate(quote.validUntil)}</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            <div className="space-y-3">
              {quote.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatCurrency(item.total)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Totals */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(quote.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <div className="mt-1 p-3 bg-muted/30 rounded-md">
                <p className="text-sm">{quote.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function QuotesList() {
  const { toast } = useToast()
  const { createTask } = useTasks()
  const { vehicles } = useInventoryManagement()
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case QuoteStatus.SENT:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case QuoteStatus.VIEWED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case QuoteStatus.ACCEPTED:
        return 'bg-green-50 text-green-700 border-green-200'
      case QuoteStatus.REJECTED:
        return 'bg-red-50 text-red-700 border-red-200'
      case QuoteStatus.EXPIRED:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateQuote = () => {
    setEditingQuote(null)
    setSelectedCustomerId('')
    setShowQuoteBuilder(true)
  }

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote)
    setSelectedCustomerId(quote.customerId)
    setShowQuoteBuilder(true)
  }

  const handleViewQuote = (quote: Quote) => {
    setViewingQuote(quote)
  }

  const handleCloseView = () => setViewingQuote(null)

  const handleSaveQuote = async (quoteData: any) => {
    try {
      if (editingQuote) {
        // Update existing quote
        setQuotes(prev => prev.map(q => 
          q.id === editingQuote.id 
            ? { ...q, ...quoteData, updatedAt: new Date() }
            : q
        ))
        toast({
          title: 'Success',
          description: 'Quote updated successfully',
        })
      } else {
        // Create new quote
        const newQuote: Quote = {
          id: Math.random().toString(36).substr(2, 9),
          ...quoteData,
          status: QuoteStatus.DRAFT,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setQuotes(prev => [...prev, newQuote])
        toast({
          title: 'Success',
          description: 'Quote created successfully',
        })
      }
      setShowQuoteBuilder(false)
      setEditingQuote(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive'
      })
    }
  }

  const handleSendQuote = async (quoteId: string) => {
    try {
      setQuotes(prev => prev.map(q => 
        q.id === quoteId 
          ? { ...q, status: QuoteStatus.SENT, updatedAt: new Date() }
          : q
      ))
      toast({
        title: 'Success',
        description: 'Quote sent to customer',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send quote',
        variant: 'destructive'
      })
    }
  }

  const handleDuplicateQuote = async (quoteId: string) => {
    try {
      const originalQuote = quotes.find(q => q.id === quoteId)
      if (originalQuote) {
        const duplicatedQuote: Quote = {
          ...originalQuote,
          id: Math.random().toString(36).substr(2, 9),
          status: QuoteStatus.DRAFT,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setQuotes(prev => [...prev, duplicatedQuote])
        toast({
          title: 'Success',
          description: 'Quote duplicated successfully',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate quote',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        setQuotes(prev => prev.filter(q => q.id !== quoteId))
        toast({
          title: 'Success',
          description: 'Quote deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete quote',
          variant: 'destructive'
        })
      }
    }
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData)
      setShowTaskForm(false)
      setInitialTaskData(undefined)
      toast({
        title: 'Task Created',
        description: 'Task has been created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      })
    }
  }

  const handleCreateTaskForQuote = (quote: Quote) => {
    const dueDate = new Date(quote.validUntil)
    // If quote is expiring soon, make it high priority
    const daysUntilExpiry = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const priority = daysUntilExpiry <= 3 ? TaskPriority.HIGH : 
                    daysUntilExpiry <= 7 ? TaskPriority.MEDIUM : TaskPriority.LOW

    setInitialTaskData({
      sourceId: quote.id,
      sourceType: 'quote',
      module: TaskModule.QUOTE,
      title: `Follow up on quote #${quote.id}`,
      description: `Quote total: ${formatCurrency(quote.total)}, Status: ${quote.status}`,
      priority,
      dueDate,
      link: `/quotes`,
      customFields: {
        quoteTotal: quote.total,
        customerId: quote.customerId,
        quoteStatus: quote.status
      }
    })
    setShowTaskForm(true)
  }

  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.reduce((sum, q) => sum + q.total, 0),
    acceptedValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0)
  }

  return (
    <div className="space-y-8">
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          initialData={initialTaskData}
          onSave={handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false)
            setInitialTaskData(undefined)
          }}
        />
      )}

      {/* Quote Builder Modal */}
      {showQuoteBuilder && (
        <SimpleQuoteBuilder
          quote={editingQuote}
          customerId={selectedCustomerId}
          vehicles={vehicles}
          onSave={handleSaveQuote}
          onCancel={() => {
            setShowQuoteBuilder(false)
            setEditingQuote(null)
          }}
        />
      )}

      {/* Quote Detail Modal */}
      {viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={handleCloseView}
          onEdit={handleEditQuote}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Quote Builder</h1>
            <p className="ri-page-description">
              Create and manage customer quotes with advanced pricing rules
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateQuote}>
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All quotes
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.sent}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Awaiting response
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Accepted</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.accepted}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% acceptance rate
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Quote Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatCurrency(stats.acceptedValue)} accepted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Quotes Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quotes ({filteredQuotes.length})</CardTitle>
          <CardDescription>
            Manage customer quotes with advanced pricing and bundling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">Quote #{quote.id}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                        {quote.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {quote.customerId}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> 
                        <span className="font-bold text-primary ml-1">{formatCurrency(quote.total)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(quote.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span> {formatDate(quote.validUntil)}
                      </div>
                    </div>
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {quote.items.length} item(s)
                      </p>
                      {quote.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Notes:</span> {quote.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewQuote(quote)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditQuote(quote)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {quote.status === 'draft' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => handleSendQuote(quote.id)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleDuplicateQuote(quote.id)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleCreateTaskForQuote(quote)}
                  >
                    <ListTodo className="h-3 w-3 mr-1" />
                    Task
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteQuote(quote.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No quotes found</p>
                <p className="text-sm">Create your first quote to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Types
interface QuoteLineItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  category: string
  isBundle?: boolean
  discount?: number
  discountType?: 'percentage' | 'fixed'
  total: number
}

interface QuoteData {
  id: string
  customerName: string
  customerEmail: string
  validUntil: string
  items: QuoteLineItem[]
  subtotal: number
  totalDiscount: number
  taxRate: number
  tax: number
  total: number
  status: 'draft' | 'pending' | 'accepted' | 'rejected'
}

// Pure functions for pricing calculations
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 15)
}

function calculateLineTotal(item: QuoteLineItem): number {
  const baseTotal = item.quantity * item.unitPrice
  
  if (!item.discount || item.discount === 0) {
    return baseTotal
  }
  
  if (item.discountType === 'percentage') {
    return baseTotal * (1 - item.discount / 100)
  } else if (item.discountType === 'fixed') {
    return Math.max(0, baseTotal - item.discount)
  }
  
  return baseTotal
}

function applyPricingRulesToItems(items: QuoteLineItem[]): QuoteLineItem[] {
  const processedItems = items.map(item => ({ ...item }))
  
  // Count accessory items
  const accessoryItems = processedItems.filter(item => 
    item.category.toLowerCase() === 'accessory'
  )
  
  // Apply rules
  processedItems.forEach(item => {
    // Reset discounts first
    item.discount = 0
    item.discountType = 'percentage'
    
    // Rule 1: 3+ accessory items get 10% discount
    if (accessoryItems.length >= 3 && item.category.toLowerCase() === 'accessory') {
      item.discount = 10
      item.discountType = 'percentage'
    }
    
    // Rule 2: Bundle items get $500 fixed discount
    if (item.isBundle) {
      item.discount = 500
      item.discountType = 'fixed'
    }
    
    // Recalculate line total
    item.total = calculateLineTotal(item)
  })
  
  return processedItems
}

function QuoteBuilderTab() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'builder'>('dashboard')
  const [quotes] = useState(mockQuoteBuilder.sampleQuotes)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)
  
  // Quote builder state
  const [quoteData, setQuoteData] = useState<QuoteData>({
    id: generateId(),
    customerName: '',
    customerEmail: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    totalDiscount: 0,
    taxRate: 0.08,
    tax: 0,
    total: 0,
    status: 'draft'
  })
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    category: 'vehicle',
    isBundle: false
  })

  // Helper function for tile clicks
  function applyQuoteTileFilter(status: 'all' | 'pending' | 'accepted' | 'rejected') {
    setActiveTab('quotes')
    setStatusFilter(status)
  }

  // Recalculate totals whenever items or tax rate changes
  useEffect(() => {
    const subtotal = quoteData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const totalDiscount = quoteData.items.reduce((sum, item) => {
      const baseTotal = item.quantity * item.unitPrice
      return sum + (baseTotal - item.total)
    }, 0)
    const tax = (subtotal - totalDiscount) * quoteData.taxRate
    const total = (subtotal - totalDiscount) + tax

    setQuoteData(prev => ({
      ...prev,
      subtotal,
      totalDiscount,
      tax,
      total
    }))
  }, [quoteData.items, quoteData.taxRate])

  // Add item handler
  const handleAddItem = () => {
    if (!newItem.name || newItem.unitPrice <= 0) return

    setQuoteData(prev => {
      const newItemWithId: QuoteLineItem = {
        id: generateId(),
        ...newItem,
        total: newItem.quantity * newItem.unitPrice
      }
      
      const updatedItems = [...prev.items, newItemWithId]
      const processedItems = applyPricingRulesToItems(updatedItems)
      
      return {
        ...prev,
        items: processedItems
      }
    })

    // Reset form
    setNewItem({
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      category: 'vehicle',
      isBundle: false
    })
  }

  // Remove item handler
  const handleRemoveItem = (itemId: string) => {
    setQuoteData(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId)
      const processedItems = applyPricingRulesToItems(updatedItems)
      
      return {
        ...prev,
        items: processedItems
      }
    })
  }

  // Update item handler
  const handleUpdateItem = (itemId: string, updates: Partial<QuoteLineItem>) => {
    setQuoteData(prev => {
      const updatedItems = prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
      const processedItems = applyPricingRulesToItems(updatedItems)
      
      return {
        ...prev,
        items: processedItems
      }
    })
  }

  // Export quote handler
  const handleExportQuote = () => {
    console.log('Exporting quote:', quoteData)
    alert('Quote exported successfully! (Simulated)')
  }

  // Filter quotes based on status
  const filteredQuotes = statusFilter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === statusFilter)

  // Tile props helper
  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
    className: 'shadow-sm border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring'
  })

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="quotes">Quotes</TabsTrigger>
        <TabsTrigger value="builder">Quote Builder</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            {...tileProps(() => applyQuoteTileFilter('all'))}
            className="bg-gradient-to-br from-blue-50 to-blue-100/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card 
            {...tileProps(() => applyQuoteTileFilter('pending'))}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotes.filter(q => q.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card 
            {...tileProps(() => applyQuoteTileFilter('accepted'))}
            className="bg-gradient-to-br from-green-50 to-green-100/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotes.filter(q => q.status === 'accepted').length}
              </div>
              <p className="text-xs text-muted-foreground">Closed deals</p>
            </CardContent>
          </Card>

          <Card 
            {...tileProps(() => applyQuoteTileFilter('accepted'))}
            className="bg-gradient-to-br from-purple-50 to-purple-100/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${quotes.reduce((sum, q) => sum + q.total, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All quotes</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="quotes" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Quotes</h2>
            <p className="text-muted-foreground">Manage your quotes and proposals</p>
          </div>
          <div className="flex items-center gap-4">
            {statusFilter !== 'all' && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Clear Filter
                </Button>
              </div>
            )}
            <Button onClick={() => setShowQuoteBuilder(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Quote
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No quotes found</p>
                  <p className="text-sm">
                    {statusFilter !== 'all' 
                      ? `No ${statusFilter} quotes available`
                      : 'Create your first quote to get started'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Quote #{quote.quoteNumber}</h3>
                        <Badge variant={
                          quote.status === 'ACCEPTED' ? 'default' :
                          quote.status === 'PENDING' ? 'secondary' :
                          'destructive'
                        }>
                          {quote.status.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Customer: {quote.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold">
                        ${quote.total.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Simulate PDF download
                            console.log('Downloading PDF for quote:', quote.quoteNumber)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter indicator */}
          {statusFilter !== 'all' && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Filtered by: {statusFilter}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStatusFilter('all')}
              >
                Clear Filter
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="builder" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={quoteData.customerName}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={quoteData.customerEmail}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="Enter customer email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={quoteData.validUntil}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={quoteData.taxRate}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardHeader>
              <CardTitle>Add Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemDescription">Description</Label>
                <Input
                  id="itemDescription"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="warranty">Warranty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isBundle"
                  checked={newItem.isBundle}
                  onChange={(e) => setNewItem(prev => ({ ...prev, isBundle: e.target.checked }))}
                />
                <Label htmlFor="isBundle">Bundle Item ($500 discount)</Label>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quote Items */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Items</CardTitle>
          </CardHeader>
          <CardContent>
            {quoteData.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items added yet. Add items above to build your quote.
              </div>
            ) : (
              <div className="space-y-4">
                {quoteData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                      <div className="text-sm">
                        {item.quantity} × ${item.unitPrice.toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}
                        {item.discount && item.discount > 0 && (
                          <span className="text-green-600 ml-2">
                            (-{item.discountType === 'percentage' ? `${item.discount}%` : `$${item.discount}`})
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {item.category}
                        {item.isBundle && ' • Bundle'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-medium">${item.total.toFixed(2)}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (pre-discount):</span>
                <span>${quoteData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Total Discount:</span>
                <span>-${quoteData.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({(quoteData.taxRate * 100).toFixed(1)}%):</span>
                <span>${quoteData.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${quoteData.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Button onClick={handleExportQuote} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Quote (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default function QuoteBuilder() {
  return (
    <Routes>
      <Route path="/" element={<QuotesList />} />
      <Route path="/builder" element={<QuoteBuilderTab />} />
      <Route path="/*" element={<QuotesList />} />
    </Routes>
  )
}