import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { ApplicationSection, ApplicationField } from '../types'
import { FileUploadSection } from './FileUploadSection'

type SectionData = Record<string, any>
type ValidationMap = Record<string, string | undefined>

interface Props {
  section: ApplicationSection
  data: SectionData
  onChange: (data: SectionData) => void
  validationErrors?: ValidationMap
  applicationId?: string
}

function FieldRenderer({
  field,
  value,
  onValue,
  applicationId,
  error,
}: {
  field: ApplicationField
  value: any
  onValue: (v: any) => void
  applicationId?: string
  error?: string
}) {
  const id = field.id

  switch (field.type) {
    case 'textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{field.label}</Label>
          <Textarea id={id} value={value || ''} onChange={e => onValue(e.target.value)} placeholder={field.placeholder} />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
    case 'select':
    case 'radio':
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{field.label}</Label>
          <Select value={value ?? ''} onValueChange={(v) => onValue(v)}>
            <SelectTrigger id={id}>
              <SelectValue placeholder={field.placeholder || 'Select…'} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map(opt => (
                <SelectItem key={String(opt)} value={String(opt)}>{String(opt)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={id} checked={!!value} onCheckedChange={(v) => onValue(Boolean(v))} />
          <Label htmlFor={id}>{field.label}</Label>
          {error && <p className="text-xs text-red-600 ml-2">{error}</p>}
        </div>
      )
    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{field.label}</Label>
          <Input id={id} type="number" value={value ?? ''} onChange={e => onValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder={field.placeholder} />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
    case 'date':
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{field.label}</Label>
          <Input id={id} type="date" value={value ?? ''} onChange={e => onValue(e.target.value)} />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
    case 'file':
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          {applicationId ? (
            <FileUploadSection fieldId={id} applicationId={applicationId} validation={field.validation} multiple={!!field.validation?.allowMultiple} />
          ) : (
            <Card>
              <CardContent className="text-sm text-muted-foreground p-3">
                File uploads are available after the application is created.
              </CardContent>
            </Card>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
    case 'address':
      const addr = value || {}
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Street" value={addr.street || ''} onChange={e => onValue({ ...addr, street: e.target.value })} />
            <Input placeholder="City" value={addr.city || ''} onChange={e => onValue({ ...addr, city: e.target.value })} />
            <Input placeholder="State" value={addr.state || ''} onChange={e => onValue({ ...addr, state: e.target.value })} />
            <Input placeholder="Postal Code" value={addr.postalCode || ''} onChange={e => onValue({ ...addr, postalCode: e.target.value })} />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
    case 'email':
    case 'ssn':
    case 'phone':
    case 'text':
    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{field.label}</Label>
          <Input id={id} type={field.type === 'email' ? 'email' : 'text'} value={value ?? ''} onChange={e => onValue(e.target.value)} placeholder={field.placeholder} />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )
  }
}

export default function ApplicationSectionForm({
  section,
  data,
  onChange,
  validationErrors = {},
  applicationId,
}: Props) {
  const updateField = (fieldId: string, v: any) => {
    const next = { ...data, [fieldId]: v }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {section.description && (
        <p className="text-sm text-muted-foreground">{section.description}</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {section.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={data[field.id]}
            onValue={(v) => updateField(field.id, v)}
            applicationId={applicationId}
            error={validationErrors[field.id]}
          />
        ))}
      </div>
    </div>
  )
}