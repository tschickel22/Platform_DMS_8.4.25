import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Wrench, Clock, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useReturnTargets, ReturnToBehavior } from '@/hooks/useReturnTargets'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatCurrency, generateId, loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils'

type Ticket = any // use your real type if desired

type Props = ReturnToBehavior & {
  ticketId?: string
}

export function ServiceTicketForm(props: Props) {
  const { toast } = useToast()
  const { accountId: ctxAccountId, afterSave } = useReturnTargets(props)
  const { accounts } = useAccountManagement()
  const { contacts } = useContactManagement()

  const isModal = !!props.onSaved
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<any>({
    accountId: ctxAccountId || '',
    contactId: '',
    vehicleId: '',
    title: '',
    description: '',
    priority: mockServiceOps.priorities[1] ?? 'Medium',
    status: mockServiceOps.statuses?.[0] ?? 'Open',
    assignedTo: '',
    scheduledDate: '',
    notes: '',
    parts: [] as Array<{ id: string; partNumber: string; description: string; quantity: number; unitCost: number; total: number }>,
    labor: [] as Array<{ id: string; description: string; hours: number; rate: number; total: number }>,
    customFields: {
      warrantyStatus: 'not_covered',
      estimatedCompletionDate: '',
      customerAuthorization: false,
      technicianNotes: '',
      customerPortalAccess: true,
    },
  })

  const accountContacts = useMemo(
    () => contacts.filter((c) => !formData.accountId || c.accountId === formData.accountId),
    [contacts, formData.accountId],
  )

  // Parts & labor adders
  const [newPart, setNewPart] = useState({ partNumber: '', description: '', quantity: 1, unitCost: 0, total: 0 })
  const [newLabor, setNewLabor] = useState({ description: '', hours: 1, rate: 85, total: 85 })
  useEffect(() => setNewPart((p) => ({ ...p, total: (p.quantity || 0) * (p.unitCost || 0) })), [newPart.quantity, newPart.unitCost])
  useEffect(() => setNewLabor((l) => ({ ...l, total: (l.hours || 0) * (l.rate || 0) })), [newLabor.hours, newLabor.rate])

  const totals = useMemo(() => {
    const partsTotal = formData.parts.reduce((s: number, p: any) => s + p.total, 0)
    const laborTotal = formData.labor.reduce((s: number, l: any) => s + l.total, 0)
    return { partsTotal, laborTotal, grandTotal: partsTotal + laborTotal }
  }, [formData.parts, formData.labor])

  const addPart = () => {
    if (!newPart.partNumber || !newPart.description) {
      toast({ title: 'Validation Error', description: 'Part number and description are required', variant: 'destructive' })
      return
    }
    setFormData((p: any) => ({ ...p, parts: [...p.parts, { ...newPart, id: generateId() }] }))
    setNewPart({ partNumber: '', description: '', quantity: 1, unitCost: 0, total: 0 })
  }
  const removePart = (id: string) => setFormData((p: any) => ({ ...p, parts: p.parts.filter((x: any) => x.id !== id) }))

  const addLabor = () => {
    if (!newLabor.description) {
      toast({ title: 'Validation Error', description: 'Labor description is required', variant: 'destructive' })
      return
    }
    setFormData((p: any) => ({ ...p, labor: [...p.labor, { ...newLabor, id: generateId() }] }))
    setNewLabor({ description: '', hours: 1, rate: 85, total: 85 })
  }
  const removeLabor = (id: string) => setFormData((p: any) => ({ ...p, labor: p.labor.filter((x: any) => x.id !== id) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      toast({ title: 'Validation Error', description: 'Title and Description are required', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const ticket: Ticket = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const existing = loadFromLocalStorage<Ticket[]>('serviceTickets', [])
      saveToLocalStorage('serviceTickets', [ticket, ...existing])
      toast({ title: 'Success', description: 'Service ticket created successfully' })
      afterSave(ticket, '/service')
    } catch {
      toast({ title: 'Error', description: 'Failed to create service ticket', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={isModal ? 'p-6' : ''}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Service Ticket</h1>
          <p className="text-muted-foreground">Track service requests and maintenance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basics */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Account</Label>
                  <Select value={formData.accountId} onValueChange={(v) => setFormData((p: any) => ({ ...p, accountId: v, contactId: '' }))} disabled={!!ctxAccountId}>
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

                <div>
                  <Label>Contact</Label>
                  <Select value={formData.contactId} onValueChange={(v) => setFormData((p: any) => ({ ...p, contactId: v }))} disabled={!formData.accountId && accountContacts.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Contact</SelectItem>
                      {accountContacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.firstName} {c.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Service Title *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData((p: any) => ({ ...p, title: e.target.value }))} />
                </div>

                <div className="md:col-span-2">
                  <Label>Description *</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))} rows={3} />
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData((p: any) => ({ ...p, priority: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServiceOps.priorities.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData((p: any) => ({ ...p, status: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(mockServiceOps.statuses || ['Open', 'In Progress', 'Waiting for Parts', 'Completed', 'Cancelled']).map((s: string) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => setFormData((p: any) => ({ ...p, scheduledDate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parts */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Parts</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addPart}>
                <Plus className="h-4 w-4 mr-2" /> Add Part
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.parts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Wrench className="h-10 w-10 mx-auto mb-2 opacity-60" />
                  No parts added yet
                </div>
              ) : (
                formData.parts.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{p.description}</span>
                        <Badge variant="outline">{p.partNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Qty {p.quantity} × {formatCurrency(p.unitCost)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold">{formatCurrency(p.total)}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removePart(p.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {/* inline part editor */}
              <div className="grid gap-4 md:grid-cols-4 border rounded-lg p-3">
                <div className="md:col-span-1">
                  <Label>Part # *</Label>
                  <Input value={newPart.partNumber} onChange={(e) => setNewPart((x) => ({ ...x, partNumber: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <Label>Description *</Label>
                  <Input value={newPart.description} onChange={(e) => setNewPart((x) => ({ ...x, description: e.target.value }))} />
                </div>
                <div className="md:col-span-1 grid grid-cols-3 gap-2">
                  <div>
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newPart.quantity}
                      onChange={(e) => setNewPart((x) => ({ ...x, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={newPart.unitCost}
                      onChange={(e) => setNewPart((x) => ({ ...x, unitCost: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full h-10 px-3 py-2 rounded-md border bg-muted/50 flex items-center justify-between">
                      <span className="text-xs">Total</span>
                      <span className="font-semibold">{formatCurrency(newPart.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labor */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Labor</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addLabor}>
                <Plus className="h-4 w-4 mr-2" /> Add Labor
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.labor.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Clock className="h-10 w-10 mx-auto mb-2 opacity-60" />
                  No labor added yet
                </div>
              ) : (
                formData.labor.map((l: any) => (
                  <div key={l.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{l.description}</div>
                      <p className="text-sm text-muted-foreground">
                        {l.hours} hours × {formatCurrency(l.rate)}/hr
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold">{formatCurrency(l.total)}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeLabor(l.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {/* inline labor editor */}
              <div className="grid gap-4 md:grid-cols-4 border rounded-lg p-3">
                <div className="md:col-span-2">
                  <Label>Description *</Label>
                  <Input value={newLabor.description} onChange={(e) => setNewLabor((x) => ({ ...x, description: e.target.value }))} />
                </div>
                <div>
                  <Label>Hours</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newLabor.hours}
                    onChange={(e) => setNewLabor((x) => ({ ...x, hours: parseFloat(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newLabor.rate}
                    onChange={(e) => setNewLabor((x) => ({ ...x, rate: parseFloat(e.target.value) || 85 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Totals & extras */}
          {(formData.parts.length > 0 || formData.labor.length > 0) && (
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Parts Total:</span>
                    <span>{formatCurrency(totals.partsTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Total:</span>
                    <span>{formatCurrency(totals.laborTotal)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Estimated Completion</Label>
                  <Input
                    type="date"
                    value={formData.customFields.estimatedCompletionDate || ''}
                    onChange={(e) =>
                      setFormData((p: any) => ({
                        ...p,
                        customFields: { ...p.customFields, estimatedCompletionDate: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="customerAuthorization"
                    checked={!!formData.customFields.customerAuthorization}
                    onCheckedChange={(checked) =>
                      setFormData((p: any) => ({
                        ...p,
                        customFields: { ...p.customFields, customerAuthorization: !!checked },
                      }))
                    }
                  />
                  <Label htmlFor="customerAuthorization">Customer has authorized work</Label>
                </div>
              </div>

              <div>
                <Label>Technician Notes</Label>
                <Textarea
                  value={formData.customFields.technicianNotes || ''}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, customFields: { ...p.customFields, technicianNotes: e.target.value } }))
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label>Customer Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData((p: any) => ({ ...p, notes: e.target.value }))} rows={3} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customerPortalAccess"
                  checked={formData.customFields.customerPortalAccess !== false}
                  onCheckedChange={(checked) =>
                    setFormData((p: any) => ({ ...p, customFields: { ...p.customFields, customerPortalAccess: !!checked } }))
                  }
                />
                <Label htmlFor="customerPortalAccess">Allow customer to view this ticket in portal</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => afterSave(null, '/service')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceTicketForm
