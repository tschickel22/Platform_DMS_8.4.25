import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, X, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDate, generateId } from '@/lib/utils'
import { useTenant } from '@/contexts/TenantContext'

/** Local minimal types keep the file robust to app changes. */
type AgreementStatus = 'draft' | 'pending' | 'active' | 'expired' | 'cancelled'
type AgreementType = 'purchase' | 'service' | 'rental' | 'nda' | 'other'

type Doc = {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: Date
  type?: string
}

type Template = {
  id: string
  name: string
  description?: string
  fields: Array<{ id: string; label: string }>
}

export interface AgreementFormProps {
  /** Existing agreement if editing */
  agreement?: {
    id?: string
    accountId?: string
    customerId?: string
    vehicleId?: string
    quoteId?: string
    title?: string
    type?: AgreementType
    status?: AgreementStatus
    effectiveDate?: string | Date
    expirationDate?: string | Date
    terms?: string
    documents?: Doc[]
    // signature info
    signedBy?: string
    signedAt?: string | Date
    ipAddress?: string
    signatureData?: string
  }

  /** Context from Account page */
  accountId?: string

  /** Optional helpers (either works) */
  onSaved?: (agreement: any | null) => void
  onSave?: (agreement: any) => Promise<void>
  onCancel?: () => void

  /** Optional related entities for pickers */
  customers?: Array<{ id: string; name: string; email: string }>
  vehicles?: Array<{ id: string; info: string }>
  quotes?: Array<{ id: string; number: string }>

  /** Optional template info banner */
  selectedTemplate?: Template | null
}

const FALLBACK_TYPES: { value: AgreementType; label: string }[] = [
  { value: 'purchase', label: 'Purchase' },
  { value: 'service', label: 'Service' },
  { value: 'rental', label: 'Rental' },
  { value: 'nda', label: 'NDA' },
  { value: 'other', label: 'Other' },
]

const STATUS_OPTIONS: { value: AgreementStatus; label: string; color: string }[] = [
  { value: 'draft',     label: 'Draft',     color: 'bg-gray-100 text-gray-800' },
  { value: 'pending',   label: 'Pending',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'active',    label: 'Active',    color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'expired',   label: 'Expired',   color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200' },
]

function AgreementForm({
  agreement,
  accountId,
  onSaved,
  onSave,
  onCancel,
  customers = [],
  vehicles = [],
  quotes = [],
  selectedTemplate,
}: AgreementFormProps) {
  const { toast } = useToast()
  const { tenant } = useTenant()

  // Types: prefer tenant config if provided
  const tenantTypes: { value: AgreementType; label: string }[] | undefined =
    (tenant as any)?.agreementTypes
  const TYPE_OPTIONS = tenantTypes && tenantTypes.length ? tenantTypes : FALLBACK_TYPES

  // Form state
  const [title, setTitle] = useState(agreement?.title ?? '')
  const [type, setType] = useState<AgreementType>(agreement?.type ?? (TYPE_OPTIONS[0].value as AgreementType))
  const [status, setStatus] = useState<AgreementStatus>(agreement?.status ?? 'draft')
  const [effectiveDate, setEffectiveDate] = useState<string>(
    agreement?.effectiveDate ? new Date(agreement.effectiveDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [expirationDate, setExpirationDate] = useState<string>(
    agreement?.expirationDate ? new Date(agreement.expirationDate).toISOString().slice(0, 10) : ''
  )
  const [terms, setTerms] = useState(agreement?.terms ?? '')
  const [documents, setDocuments] = useState<Doc[]>(agreement?.documents ?? [])
  const [customerId, setCustomerId] = useState<string | undefined>(agreement?.customerId)
  const [vehicleId, setVehicleId] = useState<string | undefined>(agreement?.vehicleId)
  const [quoteId, setQuoteId] = useState<string | undefined>(agreement?.quoteId)
  const [saving, setSaving] = useState(false)

  // Signature (read-only display if present)
  const signedBy = agreement?.signedBy
  const signedAt = agreement?.signedAt
  const ipAddress = agreement?.ipAddress
  const signatureData = agreement?.signatureData

  const onUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const added: Doc[] = Array.from(files).map((f) => ({
      id: generateId(),
      name: f.name,
      type: f.type,
      size: f.size,
      url: URL.createObjectURL(f),
      uploadedAt: new Date(),
    }))
    setDocuments((prev) => [...prev, ...added])
  }

  const removeDoc = (id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id))

  const statusColor = STATUS_OPTIONS.find((s) => s.value === status)?.color ?? 'bg-gray-100 text-gray-800'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({ title: 'Title required', description: 'Please provide a title for this agreement.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        id: agreement?.id ?? generateId(),
        accountId: agreement?.accountId ?? accountId,
        customerId: customerId || undefined,
        vehicleId: vehicleId || undefined,
        quoteId: quoteId || undefined,
        title: title.trim(),
        type,
        status,
        effectiveDate: effectiveDate ? new Date(effectiveDate).toISOString() : undefined,
        expirationDate: expirationDate ? new Date(expirationDate).toISOString() : undefined,
        terms,
        documents,
        // Keep signature info if already present
        signedBy,
        signedAt,
        ipAddress,
        signatureData,
      }

      if (onSave) {
        await onSave(payload)
      } else {
        onSaved?.(payload)
      }

      toast({ title: 'Success', description: `Agreement ${agreement?.id ? 'updated' : 'created'} successfully` })
    } catch {
      toast({ title: 'Error', description: 'Failed to save agreement', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const statusLabel = STATUS_OPTIONS.find((s) => s.value === status)?.label

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                {agreement?.id ? 'Edit Agreement' : 'New Agreement'}
              </CardTitle>
              <CardDescription>
                {selectedTemplate ? 'Agreement will be based on the selected template' : 'Fill in the agreement details'}
              </CardDescription>
            </div>
            {status && <Badge className={statusColor}>{statusLabel}</Badge>}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Banner */}
            {selectedTemplate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Based on Template:</span>
                  <span className="text-blue-800">{selectedTemplate.name}</span>
                </div>
                {selectedTemplate.description && (
                  <p className="text-sm text-blue-700 mt-1">{selectedTemplate.description}</p>
                )}
                <p className="text-xs text-blue-600 mt-2">
                  This agreement will include {selectedTemplate.fields.length} pre-configured fields
                </p>
              </div>
            )}

            {/* Basic */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Sales Agreement" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Agreement Type *</Label>
                <Select value={type} onValueChange={(v) => setType(v as AgreementType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agreement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FALLBACK_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AgreementStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div />
            </div>

            {/* Associations */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={customerId || ''} onValueChange={(v) => setCustomerId(v || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Customer</SelectItem>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.email ? `(${c.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select value={vehicleId || ''} onValueChange={(v) => setVehicleId(v || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Vehicle</SelectItem>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.info}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="quote">Related Quote</Label>
              <Select value={quoteId || ''} onValueChange={(v) => setQuoteId(v || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quote (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Quote</SelectItem>
                  {quotes.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      Quote #{q.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="effective">Effective Date *</Label>
                <Input id="effective" type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires">Expiration Date</Label>
                <Input id="expires" type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions *</Label>
              <Textarea
                id="terms"
                rows={6}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter the agreement terms and conditions…"
              />
            </div>

            {/* Documents */}
            <div className="space-y-2">
              <Label>Documents</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Upload agreement documents</p>
                <Input type="file" multiple accept=".pdf,.doc,.docx,.txt" onChange={onUploadFiles} className="max-w-xs mx-auto" />
              </div>

              {documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  <Label>Uploaded Documents</Label>
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.size / 1024).toFixed(1)} KB • {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeDoc(doc.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signature Info (read-only if present) */}
            {(signedBy || signedAt || ipAddress || signatureData) && (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-sm">Signature Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <Label className="text-xs">Signed By</Label>
                      <p className="font-medium">{signedBy || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Signed At</Label>
                      <p className="font-medium">{signedAt ? formatDate(signedAt) : '—'}</p>
                    </div>
                    <div>
                      <Label className="text-xs">IP Address</Label>
                      <p className="font-medium">{ipAddress || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Signature</Label>
                      {signatureData ? (
                        <img src={signatureData} alt="Signature" className="h-12 border rounded" />
                      ) : (
                        <p className="text-muted-foreground">No signature data</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving…' : agreement?.id ? 'Update Agreement' : 'Create Agreement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Provide BOTH a default export and a named export so either
// `import AgreementForm from ...` or `import { AgreementForm } from ...` works.
export { AgreementForm }
export default AgreementForm
