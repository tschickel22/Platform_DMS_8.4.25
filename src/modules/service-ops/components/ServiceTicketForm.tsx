import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Save, Plus, Trash2, Wrench, Clock } from 'lucide-react'

import { ServiceTicket, ServiceStatus, Priority, ServicePart, ServiceLabor } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'

type ServiceTicketFormProps = {
  ticket?: ServiceTicket
  onSave: (ticketData: Partial<ServiceTicket>) => Promise<void>
  onCancel?: () => void
}

export function ServiceTicketForm({ ticket, onSave, onCancel }: ServiceTicketFormProps) {
  const { toast } = useToast()
  const { vehicles } = useInventoryManagement()
  const { leads } = useLeadManagement()
  const { getAccounts } = useAccountManagement()
  const { getContacts } = useContactManagement()

  const [loading, setLoading] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [filteredContacts, setFilteredContacts] = useState<any[]>([])

  const [formData, setFormData] = useState<Partial<ServiceTicket>>({
    customerId: '',
    vehicleId: '',
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    status: ServiceStatus.OPEN,
    assignedTo: '',
    scheduledDate: undefined,
    notes: '',
    accountId: '',
    contactId: '',
    parts: [],
    labor: [],
    customFields: {
      warrantyStatus: 'not_covered',
      estimatedCompletionDate: '',
      customerAuthorization: false,
      technicianNotes: '',
      customerPortalAccess: true,
    },
  })

  const [showAddPart, setShowAddPart] = useState(false)
  const [showAddLabor, setShowAddLabor] = useState(false)

  const [newPart, setNewPart] = useState<Partial<ServicePart>>({
    partNumber: '',
    description: '',
    quantity: 1,
    unitCost: 0,
    total: 0,
  })

  const [newLabor, setNewLabor] = useState<Partial<ServiceLabor>>({
    description: '',
    hours: 1,
    rate: 85,
    total: 85,
  })

  // Load accounts/contacts and seed form for edit
  useEffect(() => {
    const load = async () => {
      try {
        const [accs, cons] = await Promise.all([getAccounts(), getContacts()])
        setAccounts(accs)
        setContacts(cons)

        if (ticket) {
          setFormData({
            ...ticket,
            accountId: ticket.accountId || '',
            contactId: ticket.contactId || '',
            customFields: {
              warrantyStatus: ticket.customFields?.warrantyStatus ?? 'not_covered',
              estimatedCompletionDate: ticket.customFields?.estimatedCompletionDate ?? '',
              customerAuthorization: ticket.customFields?.customerAuthorization ?? false,
              technicianNotes: ticket.customFields?.technicianNotes ?? '',
              customerPortalAccess: ticket.customFields?.customerPortalAccess !== false,
            },
          })
        }
      } catch (e) {
        console.error(e)
        toast({ title: 'Error', description: 'Failed to load form data', variant: 'destructive' })
      }
    }
    load()
  }, [ticket, getAccounts, getContacts, toast])

  // Filter contacts for chosen account
  useEffect(() => {
    if (formData.accountId) {
      const list = contacts.filter((c) => c.accountId === formData.accountId)
      setFilteredContacts(list)
      if (formData.contactId && !list.find((c) => c.id === formData.contactId)) {
        setFormData((p) => ({ ...p, contactId: '' }))
      }
    } else {
      setFilteredContacts(contacts)
    }
  }, [formData.accountId, formData.contactId, contacts])

  // Keep part / labor totals in sync
  useEffect(() => {
    setNewPart((p) => ({
      ...p,
      total: (p.quantity || 1) * (p.unitCost || 0),
    }))
  }, [newPart.quantity, newPart.unitCost])

  useEffect(() => {
    setNewLabor((l) => ({
      ...l,
      total: (l.hours || 1) * (l.rate || 85),
    }))
  }, [newLabor.hours, newLabor.rate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerId || !formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Customer, title, and description are required.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Service ticket ${ticket ? 'updated' : 'created'} successfully`,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${ticket ? 'update' : 'create'} service ticket`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerSelect = (value: string) => {
    if (value === 'add-new') {
      setShowNewCustomerForm(true)
    } else {
      setFormData((p) => ({ ...p, customerId: value }))
    }
  }

  const handleNewCustomerSuccess = (newCustomer: any) => {
    setFormData((p) => ({ ...p, customerId: newCustomer.id }))
    setShowNewCustomerForm(false)
    toast({
      title: 'Customer Added',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added as a customer.`,
    })
  }

  const addPart = () => {
    if (!newPart.partNumber || !newPart.description) {
      toast({
        title: 'Validation Error',
        description: 'Part number and description are required',
        variant: 'destructive',
      })
      return
    }

    const part: ServicePart = {
      id: Math.random().toString(36).slice(2, 11),
      partNumber: newPart.partNumber!,
      description: newPart.description!,
      quantity: newPart.quantity || 1,
      unitCost: newPart.unitCost || 0,
      total: newPart.total || 0,
    }

    setFormData((p) => ({ ...p, parts: [...(p.parts || []), part] }))
    setNewPart({ partNumber: '', description: '', quantity: 1, unitCost: 0, total: 0 })
    setShowAddPart(false)
  }

  const removePart = (id: string) => {
    setFormData((p) => ({ ...p, parts: (p.parts || []).filter((x) => x.id !== id) }))
  }

  const addLabor = () => {
    if (!newLabor.description) {
      toast({
        title: 'Validation Error',
        description: 'Labor description is required',
        variant: 'destructive',
      })
      return
    }

    const labor: ServiceLabor = {
      id: Math.random().toString(36).slice(2, 11),
      description: newLabor.description!,
      hours: newLabor.hours || 1,
      rate: newLabor.rate || 85,
      total: newLabor.total || 85,
    }

    setFormData((p) => ({ ...p, labor: [...(p.labor || []), labor] }))
    setNewLabor({ description: '', hours: 1, rate: 85, total: 85 })
    setShowAddLabor(false)
  }

  const removeLabor = (id: string) => {
    setFormData((p) => ({ ...p, labor: (p.labor || []).filter((x) => x.id !== id) }))
  }

  const totals = {
    parts: (formData.parts || []).reduce((s, p) => s + (p.total || 0), 0),
    labor: (formData.labor || []).reduce((s, l) => s + (l.total || 0), 0),
  }
  const grandTotal = totals.parts + totals.labor

  // Simple mock list of technicians
  const technicians = [
    { id: 'Tech-001', name: 'John Smith' },
    { id: 'Tech-002', name: 'Sarah Johnson' },
    { id: 'Tech-003', name: 'Mike Davis' },
  ]

  // Treat presence of onCancel as "rendered inside a modal"
  const isModal = !!onCancel

  return (
    <div className={isModal ? 'p-6 max-h-[80vh] overflow-y-auto' : ''}>
      {showNewCustomerForm && (
        <NewLeadForm onClose={() => setShowNewCustomerForm(false)} onSuccess={handleNewCustomerSuccess} />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{ticket ? 'Edit Service Ticket' : 'Create Service Ticket'}</h1>
            <p className="text-muted-foreground">
              {ticket ? 'Update service ticket details' : 'Create a new service ticket'}
            </p>
          </div>
          {isModal && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Information */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
              <CardDescription>Customer and vehicle details for this ticket</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Account */}
                <div className="space-y-2">
                  <Label htmlFor="accountId">Account</Label>
                  <Select
                    value={formData.accountId || ''}
                    onValueChange={(v) => setFormData((p) => ({ ...p, accountId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Account</SelectItem>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <Label htmlFor="contactId">Contact</Label>
                  <Select
                    value={formData.contactId || ''}
                    onValueChange={(v) => setFormData((p) => ({ ...p, contactId: v }))}
                    disabled={!formData.accountId && filteredContacts.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Contact</SelectItem>
                      {filteredContacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.firstName} {c.lastName}
                          {c.title ? ` - ${c.title}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer (Lead) */}
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select value={formData.customerId || ''} onValueChange={handleCustomerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleCustomerSelect('add-new')}
                        >
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          Add New Customer
                        </Button>
                      </div>
                      <div className="px-2 py-1 border-t" />
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.firstName} {lead.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehicle */}
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle</Label>
                  <Select
                    value={formData.vehicleId || ''}
                    onValueChange={(v) => setFormData((p) => ({ ...p, vehicleId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Vehicle</SelectItem>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.year} {v.make} {v.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Annual Maintenance Service"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the service needed"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={(formData.priority as string) || Priority.MEDIUM}
                    onValueChange={(v) => setFormData((p) => ({ ...p, priority: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Priority.LOW}>Low</SelectItem>
                      <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={Priority.HIGH}>High</SelectItem>
                      <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={(formData.status as string) || ServiceStatus.OPEN}
                    onValueChange={(v) => setFormData((p) => ({ ...p, status: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ServiceStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={ServiceStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={ServiceStatus.WAITING_PARTS}>Waiting for Parts</SelectItem>
                      <SelectItem value={ServiceStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={ServiceStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned Technician</Label>
                  <Select
                    value={formData.assignedTo || ''}
                    onValueChange={(v) => setFormData((p) => ({ ...p, assignedTo: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {technicians.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={
                      formData.scheduledDate
                        ? new Date(formData.scheduledDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        scheduledDate: e.target.value ? new Date(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedCompletionDate">Estimated Completion</Label>
                  <Input
                    id="estimatedCompletionDate"
                    type="date"
                    value={formData.customFields?.estimatedCompletionDate || ''}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        customFields: { ...(p.customFields || {}), estimatedCompletionDate: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty */}
          <Card>
            <CardHeader>
              <CardTitle>Warranty & Authorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="warrantyStatus">Warranty Status</Label>
                  <Select
                    value={formData.customFields?.warrantyStatus || 'not_covered'}
                    onValueChange={(v) =>
                      setFormData((p) => ({
                        ...p,
                        customFields: { ...(p.customFields || {}), warrantyStatus: v },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="covered">Covered by Warranty</SelectItem>
                      <SelectItem value="partial">Partially Covered</SelectItem>
                      <SelectItem value="not_covered">Not Covered</SelectItem>
                      <SelectItem value="extended">Extended Warranty</SelectItem>
                      <SelectItem value="expired">Warranty Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-7">
                  <Checkbox
                    id="customerAuthorization"
                    checked={!!formData.customFields?.customerAuthorization}
                    onCheckedChange={(checked) =>
                      setFormData((p) => ({
                        ...p,
                        customFields: { ...(p.customFields || {}), customerAuthorization: !!checked },
                      }))
                    }
                  />
                  <Label htmlFor="customerAuthorization">Customer has authorized work</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parts */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Parts</CardTitle>
                <CardDescription>Add parts needed for this job</CardDescription>
              </div>
              <Button type="button" size="sm" onClick={() => setShowAddPart(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddPart && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="partNumber">Part Number *</Label>
                        <Input
                          id="partNumber"
                          value={newPart.partNumber || ''}
                          onChange={(e) => setNewPart((p) => ({ ...p, partNumber: e.target.value }))}
                          placeholder="e.g., AC-COMP-001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partDescription">Description *</Label>
                        <Input
                          id="partDescription"
                          value={newPart.description || ''}
                          onChange={(e) => setNewPart((p) => ({ ...p, description: e.target.value }))}
                          placeholder="e.g., AC Compressor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partQuantity">Quantity</Label>
                        <Input
                          id="partQuantity"
                          type="number"
                          min={1}
                          value={newPart.quantity || 1}
                          onChange={(e) =>
                            setNewPart((p) => ({ ...p, quantity: parseInt(e.target.value) || 1 }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="partUnitCost">Unit Cost</Label>
                        <Input
                          id="partUnitCost"
                          type="number"
                          min={0}
                          step="0.01"
                          value={newPart.unitCost || 0}
                          onChange={(e) =>
                            setNewPart((p) => ({ ...p, unitCost: parseFloat(e.target.value) || 0 }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="text-sm font-medium">Total: </span>
                        <span className="font-bold">{formatCurrency(newPart.total || 0)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddPart(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={addPart}>
                          Add Part
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(formData.parts || []).length > 0 ? (
                <div className="space-y-3">
                  {(formData.parts || []).map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{part.description}</span>
                          <Badge variant="outline">{part.partNumber}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {part.quantity} × {formatCurrency(part.unitCost)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{formatCurrency(part.total)}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePart(part.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No parts added yet</p>
                  <p className="text-sm">Add parts needed for this service</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Labor */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Labor</CardTitle>
                <CardDescription>Add labor for this job</CardDescription>
              </div>
              <Button type="button" size="sm" onClick={() => setShowAddLabor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Labor
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddLabor && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-3">
                        <Label htmlFor="laborDescription">Description *</Label>
                        <Input
                          id="laborDescription"
                          value={newLabor.description || ''}
                          onChange={(e) => setNewLabor((p) => ({ ...p, description: e.target.value }))}
                          placeholder="e.g., Diagnostic and Repair"
                        />
                      </div>
                      <div>
                        <Label htmlFor="laborHours">Hours</Label>
                        <Input
                          id="laborHours"
                          type="number"
                          step="0.5"
                          min={0.5}
                          value={newLabor.hours || 1}
                          onChange={(e) =>
                            setNewLabor((p) => ({ ...p, hours: parseFloat(e.target.value) || 1 }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="laborRate">Hourly Rate</Label>
                        <Input
                          id="laborRate"
                          type="number"
                          step="0.01"
                          min={0}
                          value={newLabor.rate || 85}
                          onChange={(e) =>
                            setNewLabor((p) => ({ ...p, rate: parseFloat(e.target.value) || 85 }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 flex items-center">
                          {formatCurrency(newLabor.total || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddLabor(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addLabor}>
                        Add Labor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(formData.labor || []).length > 0 ? (
                <div className="space-y-3">
                  {(formData.labor || []).map((labor) => (
                    <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{labor.description}</div>
                        <p className="text-sm text-muted-foreground">
                          {labor.hours} hours × {formatCurrency(labor.rate)}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{formatCurrency(labor.total)}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeLabor(labor.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No labor added yet</p>
                  <p className="text-sm">Add labor for this service</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          {(formData.parts?.length || 0) + (formData.labor?.length || 0) > 0 && (
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Parts Total:</span>
                    <span>{formatCurrency(totals.parts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Total:</span>
                    <span>{formatCurrency(totals.labor)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extra notes / portal toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="technicianNotes">Technician Notes</Label>
                <Textarea
                  id="technicianNotes"
                  value={formData.customFields?.technicianNotes || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      customFields: { ...(p.customFields || {}), technicianNotes: e.target.value },
                    }))
                  }
                  placeholder="Notes for technicians only (not visible to customer)"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Notes visible to the customer"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customerPortalAccess"
                  checked={formData.customFields?.customerPortalAccess !== false}
                  onCheckedChange={(checked) =>
                    setFormData((p) => ({
                      ...p,
                      customFields: { ...(p.customFields || {}), customerPortalAccess: !!checked },
                    }))
                  }
                />
                <Label htmlFor="customerPortalAccess">Allow customer to view this ticket in portal</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {ticket ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {ticket ? 'Update' : 'Create'} Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// IMPORTANT: provide a default export to fix "does not provide an export named 'default'"
export default ServiceTicketForm
