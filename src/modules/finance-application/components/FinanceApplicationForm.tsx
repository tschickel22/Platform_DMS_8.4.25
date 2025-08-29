import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  FileText,
  ListTodo,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { FinanceApplication, ApplicationData } from '../types'
import { useFinanceApplications } from '../hooks/useFinanceApplications'
import ApplicationSectionForm from './ApplicationSectionForm' // default export
import { useTenant } from '@/contexts/TenantContext'

type ValidationMap = Record<string, string>

interface FinanceApplicationFormProps {
  application: FinanceApplication
  onSave: (data: Partial<FinanceApplication>) => void
  onCancel: () => void
  onSubmit: (data: Partial<FinanceApplication>) => void
  onCreateTask?: (application: FinanceApplication) => void
}

/** Small helper to debounce changes before auto-saving */
function useDebouncedEffect(effect: () => void, deps: React.DependencyList, delay = 800) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const t = setTimeout(effect, delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function FinanceApplicationForm({
  application,
  onSave,
  onCancel,
  onSubmit,
  onCreateTask,
}: FinanceApplicationFormProps) {
  const { tenant } = useTenant()
  const fin: any = useFinanceApplications()

  // --- provider-safe helpers (no assumptions about hook shape) ---
  const getTemplates = useMemo(() => {
    if (Array.isArray(fin?.templates)) return () => fin.templates
    if (typeof fin?.getTemplates === 'function') return () => fin.getTemplates()
    return () => [] as any[]
  }, [fin])

  const getTemplateById = (id: string) => {
    if (typeof fin?.getTemplateById === 'function') return fin.getTemplateById(id)
    const list = getTemplates()
    return list.find((t: any) => t.id === id)
  }

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [formData, setFormData] = useState<ApplicationData>(application.data || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationMap>({})
  const [lastAutoSaveAt, setLastAutoSaveAt] = useState<string | null>(null)

  const template = getTemplateById(application.templateId)

  // If template isn't found, show a very explicit safe screen
  if (!template) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Template not found</p>
        <Button onClick={onCancel} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  // Stabilize sections (no in-place mutation)
  const sections = useMemo(
    () => [...(template.sections || [])].sort((a, b) => a.order - b.order),
    [template.sections]
  )

  // Add a synthetic "Review" step as the last screen
  const hasReviewStep = true
  const lastStepIndex = sections.length + (hasReviewStep ? 1 : 0) - 1
  const atReview = hasReviewStep && currentSectionIndex === lastStepIndex
  const visibleSectionsCount = sections.length + (hasReviewStep ? 1 : 0)

  const currentSection = !atReview ? sections[currentSectionIndex] : null
  const progress = ((currentSectionIndex + 1) / visibleSectionsCount) * 100

  // ========= Labels / Header =========
  const getApplicationLabel = () => {
    const platformType = tenant?.settings?.platformType || 'mh'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    if (labelOverrides['finance.application']) return labelOverrides['finance.application']
    switch (platformType) {
      case 'rv': return 'RV Loan Application'
      case 'auto': return 'Auto Loan Application'
      default: return 'MH Finance Application'
    }
  }

  // ========= Validation =========
  const sectionErrors = (sectionId: string): ValidationMap => {
    const errs: ValidationMap = {}
    const section = sections.find(s => s.id === sectionId)
    if (!section) return errs
    const data = formData[sectionId] || {}
    section.fields.forEach((field: any) => {
      const value = data[field.id]
      if (field.required && (value === undefined || value === null || value === '')) {
        errs[`${sectionId}.${field.id}`] = `${field.label} is required`
      }
      if (value && field.validation) {
        const { minLength, maxLength, pattern } = field.validation
        if (minLength && String(value).length < minLength) {
          errs[`${sectionId}.${field.id}`] = `${field.label} must be at least ${minLength} characters`
        }
        if (maxLength && String(value).length > maxLength) {
          errs[`${sectionId}.${field.id}`] = `${field.label} must be no more than ${maxLength} characters`
        }
        if (pattern && !new RegExp(pattern).test(String(value))) {
          errs[`${sectionId}.${field.id}`] = `${field.label} format is invalid`
        }
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
          errs[`${sectionId}.${field.id}`] = 'Please enter a valid email address'
        }
      }
    })
    return errs
  }

  const validateSection = (sectionIndex: number): boolean => {
    const s = sections[sectionIndex]
    const errs = sectionErrors(s.id)
    setValidationErrors(prev => ({ ...prev, ...errs }))
    return Object.keys(errs).length === 0
  }

  const validateAll = (): { ok: boolean; errors: ValidationMap } => {
    let ok = true
    const all: ValidationMap = {}
    sections.forEach(s => {
      const errs = sectionErrors(s.id)
      if (Object.keys(errs).length) ok = false
      Object.assign(all, errs)
    })
    setValidationErrors(all)
    return { ok, errors: all }
  }

  // Track section completion for the left nav UI
  const sectionComplete = (sectionId: string) => Object.keys(sectionErrors(sectionId)).length === 0

  // ========= Data handling =========
  const handleSectionDataChange = (sectionId: string, sectionData: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        ...sectionData,
      },
    }))
  }

  // Debounced auto-save on data change
  useDebouncedEffect(() => {
    onSave({ data: formData, status: 'draft' })
    setLastAutoSaveAt(new Date().toLocaleTimeString())
  }, [formData])

  // ========= Navigation =========
  const jumpTo = (index: number) => setCurrentSectionIndex(Math.max(0, Math.min(lastStepIndex, index)))

  const handleNext = () => {
    if (atReview) return
    const ok = validateSection(currentSectionIndex)
    if (!ok) return
    setCurrentSectionIndex(i => Math.min(lastStepIndex, i + 1))
  }

  const handlePrevious = () => setCurrentSectionIndex(i => Math.max(0, i - 1))

  // ========= Actions =========
  const handleSaveClick = () => onSave({ data: formData, status: 'draft' })

  const handleSubmit = async () => {
    const { ok, errors } = validateAll()
    if (!ok) {
      // jump to first section with an error
      const first = sections.findIndex(s => Object.keys(errors).some(k => k.startsWith(`${s.id}.`)))
      if (first >= 0) setCurrentSectionIndex(first)
      return
    }
    setIsSubmitting(true)
    // simulate async submit
    await new Promise(r => setTimeout(r, 800))
    onSubmit({
      data: formData,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    })
    setIsSubmitting(false)
  }

  // ========= Derived UI helpers =========
  const totalCompleted = sections.reduce((acc: number, s: any) => acc + (sectionComplete(s.id) ? 1 : 0), 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
      {/* ===== Left rail: section list / status ===== */}
      <aside className="hidden lg:block">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Sections</CardTitle>
            <CardDescription>Select a section to jump</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.map((s: any, idx: number) => {
              const errored = Object.keys(validationErrors).some(k => k.startsWith(`${s.id}.`))
              const complete = sectionComplete(s.id)
              const active = idx === currentSectionIndex && !atReview
              return (
                <Button
                  key={s.id}
                  variant={active ? 'secondary' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => jumpTo(idx)}
                >
                  <span className="truncate">{s.title}</span>
                  {complete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : errored ? (
                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                  ) : null}
                </Button>
              )
            })}
            {hasReviewStep && (
              <>
                <Separator className="my-2" />
                <Button
                  variant={atReview ? 'secondary' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => jumpTo(lastStepIndex)}
                >
                  Review & Submit
                  {totalCompleted === sections.length ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : null}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </aside>

      {/* ===== Main column ===== */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{getApplicationLabel()}</h1>
              <p className="text-muted-foreground">{application.customerName || 'New Application'}</p>
              {onCreateTask && (
                <Button variant="outline" size="sm" onClick={() => onCreateTask(application)} className="mt-2">
                  <ListTodo className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{application.status.replace('_', ' ').toUpperCase()}</Badge>
            {application.fraudCheckStatus && (
              <Badge variant="secondary">
                IDV: {application.fraudCheckStatus.charAt(0).toUpperCase() + application.fraudCheckStatus.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Step {currentSectionIndex + 1} of {visibleSectionsCount}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
              {!atReview && currentSection ? (
                <p className="text-sm text-muted-foreground">{currentSection.title}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Review & Submit</p>
              )}
              {lastAutoSaveAt && (
                <p className="text-xs text-muted-foreground">Auto-saved at {lastAutoSaveAt}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Section or Review */}
        {!atReview && currentSection ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentSection.title}</CardTitle>
              {currentSection.description && (
                <CardDescription>{currentSection.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <ApplicationSectionForm
                section={currentSection}
                data={formData[currentSection.id] || {}}
                onChange={(data: any) => handleSectionDataChange(currentSection.id, data)}
                validationErrors={validationErrors}
                applicationId={application.id}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Review your application</CardTitle>
              <CardDescription>
                Make sure everything looks good before submitting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Outstanding required items */}
              {(() => {
                const all = Object.entries(validationErrors)
                if (all.length === 0) return null
                const grouped: Record<string, string[]> = {}
                all.forEach(([k, msg]) => {
                  const [sid] = k.split('.')
                  ;(grouped[sid] ||= []).push(msg as string)
                })
                return (
                  <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
                    <div className="font-medium text-orange-900 mb-2">
                      You still have {all.length} required item{all.length > 1 ? 's' : ''} to fill:
                    </div>
                    <ul className="list-disc pl-6 text-sm text-orange-900 space-y-1">
                      {Object.entries(grouped).map(([sid, msgs]) => {
                        const s: any = sections.find((x: any) => x.id === sid)
                        return (
                          <li key={sid}>
                            <span className="font-medium">{s?.title || sid}:</span>{' '}
                            {msgs.join(', ')}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })()}

              {/* Quick summary */}
              <div className="space-y-4">
                {sections.map((s: any) => (
                  <div key={s.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{s.title}</div>
                      <div className="flex items-center gap-2">
                        {sectionComplete(s.id) ? (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <AlertCircle className="h-3 w-3" /> Needs review
                          </Badge>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => jumpTo(sections.findIndex((x: any) => x.id === s.id))}>
                          Edit
                        </Button>
                      </div>
                    </div>
                    {/* Very light summary of values */}
                    <div className="mt-2 text-sm text-muted-foreground">
                      {Object.keys(formData[s.id] || {}).length === 0 ? (
                        <span>No answers captured yet.</span>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {s.fields.slice(0, 9).map((f: any) => (
                            <div key={f.id}>
                              <span className="font-medium">{f.label}: </span>
                              <span className="break-words">
                                {String((formData[s.id] || {})[f.id] ?? '—')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sticky-ish footer actions */}
        <div className="flex justify-between sticky bottom-0 py-3 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button variant="outline" onClick={handlePrevious} disabled={currentSectionIndex === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveClick}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>

            {atReview ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceApplicationForm
