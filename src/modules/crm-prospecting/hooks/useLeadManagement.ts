import { useState, useEffect } from 'react'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  status: string
  source: string
  value: number
  assignedTo: string
  createdAt: string
  updatedAt: string
  notes?: string
  tags?: string[]
  lastContact?: string
  nextFollowUp?: string
}

export function useLeadManagement() {
  const [leads, setLeads] = useState<Lead[]>(mockCrmProspecting.sampleLeads || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLeadByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status)
  }

  const getLeadById = (id: string) => {
    return leads.find(lead => lead.id === id)
  }

  const createLead = async (leadData: Partial<Lead>) => {
    setLoading(true)
    try {
      const newLead: Lead = {
        id: Math.random().toString(36).substr(2, 9),
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        company: leadData.company,
        status: leadData.status || 'New',
        source: leadData.source || 'Direct',
        value: leadData.value || 0,
        assignedTo: leadData.assignedTo || 'Unassigned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: leadData.notes,
        tags: leadData.tags || [],
        lastContact: leadData.lastContact,
        nextFollowUp: leadData.nextFollowUp
      }
      
      setLeads(prev => [...prev, newLead])
      return newLead
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setLoading(true)
    try {
      setLeads(prev => prev.map(lead => 
        lead.id === id 
          ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
          : lead
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteLead = async (id: string) => {
    setLoading(true)
    try {
      setLeads(prev => prev.filter(lead => lead.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const assignLead = async (leadId: string, userId: string) => {
    return updateLead(leadId, { assignedTo: userId })
  }

  const updateLeadStatus = async (leadId: string, status: string) => {
    return updateLead(leadId, { status })
  }

  const addLeadNote = async (leadId: string, note: string) => {
    const lead = getLeadById(leadId)
    if (lead) {
      const currentNotes = lead.notes || ''
      const newNotes = currentNotes ? `${currentNotes}\n\n${note}` : note
      return updateLead(leadId, { notes: newNotes })
    }
  }

  const searchLeads = (query: string) => {
    if (!query.trim()) return leads
    
    const lowercaseQuery = query.toLowerCase()
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(lowercaseQuery) ||
      lead.email.toLowerCase().includes(lowercaseQuery) ||
      lead.company?.toLowerCase().includes(lowercaseQuery) ||
      lead.phone.includes(query)
    )
  }

  const getLeadsBySource = (source: string) => {
    return leads.filter(lead => lead.source === source)
  }

  const getLeadsByAssignee = (assigneeId: string) => {
    return leads.filter(lead => lead.assignedTo === assigneeId)
  }

  return {
    leads,
    loading,
    error,
    getLeadByStatus,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    assignLead,
    updateLeadStatus,
    addLeadNote,
    searchLeads,
    getLeadsBySource,
    getLeadsByAssignee
  }
}