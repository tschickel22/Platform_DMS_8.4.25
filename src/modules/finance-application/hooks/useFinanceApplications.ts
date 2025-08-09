import { useState, useEffect } from 'react'
import { FinanceApplication, ApplicationTemplate } from '../types'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'

export function useFinanceApplications() {
  const [applications, setApplications] = useState<FinanceApplication[]>([])
  const [templates, setTemplates] = useState<ApplicationTemplate[]>([])

  // Initialize with mock data
  useEffect(() => {
    setApplications(mockFinanceApplications.sampleApplications)
    setTemplates(mockFinanceApplications.sampleTemplates || [])
  }, [])

  const createApplication = (data: Partial<FinanceApplication>): FinanceApplication => {
    const newApplication: FinanceApplication = {
      id: `app-${Date.now()}`,
      customerId: data.customerId || '',
      customerName: data.customerName || '',
      customerEmail: data.customerEmail || '',
      customerPhone: data.customerPhone || '',
      templateId: data.templateId || '',
      status: data.status || 'draft',
      data: data.data || {},
      uploadedFiles: data.uploadedFiles || [],
      notes: data.notes || '',
      adminNotes: data.adminNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: data.submittedAt,
      reviewedAt: data.reviewedAt,
      reviewedBy: data.reviewedBy,
      fraudCheckStatus: data.fraudCheckStatus,
      history: data.history || []
    }

    setApplications(prevApplications => [...(prevApplications || []), newApplication])
    return newApplication
  }

  const updateApplication = (id: string, data: Partial<FinanceApplication>) => {
    setApplications(prevApplications => 
      (prevApplications || []).map(app => 
        app.id === id 
          ? { ...app, ...data, updatedAt: new Date().toISOString() }
          : app
      )
    )
  }

  const deleteApplication = (id: string) => {
    setApplications(prevApplications => 
      (prevApplications || []).filter(app => app.id !== id)
    )
  }

  const createTemplate = (data: Partial<ApplicationTemplate>): ApplicationTemplate => {
    const newTemplate: ApplicationTemplate = {
      id: `template-${Date.now()}`,
      name: data.name || 'New Template',
      description: data.description || '',
      sections: data.sections || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTemplates(prevTemplates => [...(prevTemplates || []), newTemplate])
    return newTemplate
  }

  const updateTemplate = (id: string, data: Partial<ApplicationTemplate>) => {
    setTemplates(prevTemplates => 
      (prevTemplates || []).map(template => 
        template.id === id 
          ? { ...template, ...data, updatedAt: new Date().toISOString() }
          : template
      )
    )
  }

  const deleteTemplate = (id: string) => {
    setTemplates(prevTemplates => 
      (prevTemplates || []).filter(template => template.id !== id)
    )
  }

  return {
    applications,
    templates,
    createApplication,
    updateApplication,
    deleteApplication,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
}