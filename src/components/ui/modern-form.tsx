import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FormSection, FormGrid, FormActions } from '@/components/ui/form-section'
import { TagInput } from '@/components/common/TagInput'
import { AlertCircle, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  error,
  description,
  children,
  className
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  type?: 'text' | 'email' | 'tel' | 'url'
  className?: string
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  description,
  type = 'text',
  className
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(error && 'border-destructive')}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />
    </FormField>
  )
}

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  rows?: number
  className?: string
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  description,
  rows = 3,
  className
}: TextAreaFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(error && 'border-destructive')}
        aria-invalid={!!error}
      />
    </FormField>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  className?: string
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  error,
  description,
  className
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(error && 'border-destructive')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  error?: string
  className?: string
}

export function CheckboxField({
  label,
  checked,
  onChange,
  description,
  error,
  className
}: CheckboxFieldProps) {
  return (
    <FormField
      label=""
      error={error}
      description={description}
      className={className}
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={coerceBoolean(checked)}
          onCheckedChange={(value) => onChange(coerceBoolean(value))}
          aria-invalid={!!error}
        />
        <Label className="text-sm font-normal cursor-pointer">
          {label}
        </Label>
      </div>
    </FormField>
  )
}

interface TagFieldProps {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  required?: boolean
  error?: string
  description?: string
  className?: string
}

export function TagField({
  label,
  tags,
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  required = false,
  error,
  description,
  className
}: TagFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <TagInput
        tags={tags || []}
        onTagsChange={onChange}
        placeholder={placeholder}
        maxTags={maxTags}
        className={cn(error && 'border-destructive')}
      />
    </FormField>
  )
}

interface ModernFormProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
  hasUnsavedChanges?: boolean
  className?: string
}

export function ModernForm({
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  hasUnsavedChanges = false,
  className
}: ModernFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      <div className="ri-page-header">
        <div className="ri-page-header-main">
          <div className="ri-page-header-content">
            <h1 className="ri-page-title">{title}</h1>
            {description && (
              <p className="ri-page-description">{description}</p>
            )}
          </div>
          {hasUnsavedChanges && (
            <div className="text-sm text-amber-600 font-medium">
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {children}

      <FormActions>
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            {cancelLabel}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-24"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </FormActions>
    </form>
  )
}

// Export all form components for easy importing
export {
  FormSection,
  FormGrid,
  FormActions
}