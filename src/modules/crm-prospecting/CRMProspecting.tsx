import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Plus, Search, Phone, Mail, Calendar, TrendingUp, Target, Settings, Brain, MessageSquare, ListTodo } from 'lucide-react'
import { Lead, LeadStatus, Task } from '@/types'
import { TaskForm } from '@/modules/task-center/components/TaskForm'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useLeadManagement } from './hooks/useLeadManagement'
import { PipelineDashboard } from './components/PipelineDashboard'
import { LeadScoring } from './components/LeadScoring'
import { ActivityTimeline } from './components/ActivityTimeline'
import { LeadReminders } from './components/LeadReminders'
import { NurtureSequences } from './components/NurtureSequences'
import { AIInsights } from './components/AIInsights'
import { CommunicationCenter } from './components/CommunicationCenter'
import { NewLeadForm } from './components/NewLeadForm'
import { QuotesList } from './components/QuotesList'
import { TagSelector } from '@/modules/tagging-engine'
import { TagType } from '@/modules/tagging-engine/types'
import { useTasks } from '@/hooks/useTasks'
import { TaskModule, TaskPriority } from '@/types'
import { toast } from '@/hooks/use-toast'

function ContactModal({ isOpen, onClose, leadId }: { isOpen: boolean; onClose: () => void; leadId?: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LeadsList() {
  const {
    leads,
    sources,
    activities,
    salesReps,
    updateLeadStatus,
    assignLead,
    getActivitiesByLead,
    getRemindersByUser,
    getLeadScore
  } = useLeadManagement()

  const { createTask } = useTasks()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'qualified'>('all')

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskInitialData, setTaskInitialData] = useState<Partial<Task> | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)

  // ---- tile filter helper ----
  const applyTileFilter = (type: 'all' | 'new' | 'qualified') => {
    setActiveFilter(type)
    if (type === 'all') setStatusFilter('all')
    if (type === 'new') setStatusFilter(LeadStatus.NEW)
    if (type === 'qualified') setStatusFilter(LeadStatus.QUALIFIED)
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case LeadStatus.CONTACTED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case LeadStatus.QUALIFIED:
        return 'bg-green-50 text-green-700 border-green-200'
      case LeadStatus.PROPOSAL:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case LeadStatus.NEGOTIATION:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case LeadStatus.CLOSED_WON:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case LeadStatus.CLOSED_LOST:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    if (score >= 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getFilterLabel = () => {
    if (activeFilter === 'new') return 'New Leads'
    if (activeFilter === 'qualified') return 'Qualified Leads'
    return 'All Leads'
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || lead.sourceId === sourceFilter
    const matchesAssignee = assigneeFilter === 'all' || lead.assignedTo === assigneeFilter

    return matchesSearch && matchesStatus && matchesSource && matchesAssignee
  })

  const getTaskInitialData = (lead: Lead) => {
    const lastActivity = lead.lastActivity ? new Date(lead.lastActivity) : new Date(lead.createdAt)
    const dueDate = new Date(lastActivity)
    dueDate.setDate(dueDate.getDate() + 3)

    return {
      title: `Follow up with ${lead.firstName} ${lead.lastName}`,
      description: `Follow up on ${lead.status.replace('_', ' ')} lead from ${lead.source}`,
      module: TaskModule.CRM,
      priority: lead.score && lead.score >= 80 ? TaskPriority.HIGH :
                lead.score && lead.score >= 60 ? TaskPriority.MEDIUM : TaskPriority.LOW,
      sourceId: lead.id,
      sourceType: 'lead',
      assignedTo: lead.assignedTo,
      dueDate,
      customFields: {
        leadScore: lead.score,
        leadSource: lead.source,
        leadEmail: lead.email,
        leadPhone: lead.phone
      }
    }
  }

  const handleCreateTaskForLead = (lead: Lead) => {
    setTaskInitialData(getTaskInitialData(lead))
    setShowTaskForm(true)
  }

  // ---------- Selected lead view ----------
  if (selectedLead) {
    const leadActivities = getActivitiesByLead(selectedLead.id)
    const leadReminders = getRemindersByUser('current-user').filter(r => r.leadId === selectedLead.id)
    const leadScore = getLeadScore(selectedLead.id)

    return (
      <div className="space-y-6">
        {showTaskForm && (
          <TaskForm
            initialData={taskInitialData || undefined}
            onSave={async (taskData) => {
              await createTask(taskData)
              setShowTaskForm(false)
              setTaskInitialData(null)
              toast({ title: 'Task Created', description: 'Task has been created successfully' })
            }}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => setSelectedLead(null)} className="mb-4">
              ← Back to Leads
            </Button>
            <h1 className="ri-page-title">{selectedLead.firstName} {selectedLead.lastName}</h1>
            <p className="ri-page-description">Lead details and activity management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={cn('ri-badge-status', getStatusColor(selectedLead.status))}>
              {selectedLead.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {selectedLead.score && (
              <Badge className={cn('ri-badge-status', getScoreColor(selectedLead.score))}>
                Score: {selectedLead.score}
              </Badge>
            )}
            <Button onClick={() => setShowTaskForm(true)} size="sm" variant="outline" className="shadow-sm">
              <ListTodo className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="font-medium">{selectedLead.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="font-medium">{selectedLead.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Source</label>
                        <p className="font-medium">{selectedLead.source}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                        <p className="font-medium">
                          {salesReps.find(rep => rep.id === selectedLead.assignedTo)?.name || 'Unassigned'}
                        </p>
                      </div>
                      {Object.entries(selectedLead.customFields || {}).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="font-medium">{value as any}</p>
                        </div>
                      ))}
                    </div>
                    {selectedLead.notes && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                        <p className="mt-1 p-3 bg-muted/30 rounded-md">{selectedLead.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {leadScore && <LeadScoring leadScore={leadScore} lead={selectedLead} />}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTimeline leadId={selectedLead.id} activities={leadActivities} />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationCenter leadId={selectedLead.id} leadData={selectedLead} />
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsights leadId={selectedLead.id} leadData={selectedLead} />
          </TabsContent>

          <TabsContent value="nurturing">
            <div className="space-y-6">
              <NurtureSequences />
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <LeadReminders leadId={selectedLead.id} reminders={leadReminders} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // ---------- List view ----------
  return (
    <div className="space-y-8">
      {showNewLeadForm && (
        <NewLeadForm onClose={() => setShowNewLeadForm(false)} onSuccess={() => {}} />
      )}

      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM & Prospecting</h1>
            <p className="ri-page-description">
              Manage leads, track activities, and monitor sales pipeline with AI-powered insights
            </p>
          </div>
          <Button className="shadow-sm" onClick={() => setShowNewLeadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats tiles – now clickable */}
      <div className="ri-stats-grid">
        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => applyTileFilter('all')}
          onKeyDown={(e) => e.key === 'Enter' && applyTileFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{leads.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => applyTileFilter('new')}
          onKeyDown={(e) => e.key === 'Enter' && applyTileFilter('new')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">New Leads</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {leads.filter(l => l.status === LeadStatus.NEW).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => applyTileFilter('qualified')}
          onKeyDown={(e) => e.key === 'Enter' && applyTileFilter('qualified')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Qualified</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {leads.filter(l => l.status === LeadStatus.QUALIFIED).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => setShowAIInsights(true)}
          onKeyDown={(e) => e.key === 'Enter' && setShowAIInsights(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">AI Insights</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">47</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Brain className="h-3 w-3 mr-1" /> Active recommendations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
          <TabsTrigger value="forms">Intake Forms</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search leads..."
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
                <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                <SelectItem value={LeadStatus.CONTACTED}>Contacted</SelectItem>
                <SelectItem value={LeadStatus.QUALIFIED}>Qualified</SelectItem>
                <SelectItem value={LeadStatus.PROPOSAL}>Proposal</SelectItem>
                <SelectItem value={LeadStatus.NEGOTIATION}>Negotiation</SelectItem>
                <SelectItem value={LeadStatus.CLOSED_WON}>Closed Won</SelectItem>
                <SelectItem value={LeadStatus.CLOSED_LOST}>Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {salesReps.map(rep => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowNewLeadForm(true)} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center justify-between">
                    <span>{getFilterLabel()} ({filteredLeads.length})</span>
                    {activeFilter !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveFilter('all')
                          setStatusFilter('all')
                        }}
                      >
                        Clear Filter
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {activeFilter === 'all'
                      ? 'Manage and track your sales prospects'
                      : `Showing ${getFilterLabel().toLowerCase()}`}
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewLeadForm(true)} variant="outline" className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="ri-table-row cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {lead.firstName} {lead.lastName}
                          </h3>
                          <Badge className={cn('ri-badge-status', getStatusColor(lead.status))}>
                            {lead.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {lead.score && (
                            <Badge className={cn('ri-badge-status', getScoreColor(lead.score))}>
                              {lead.score}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Ready
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 text-blue-500" />
                            {lead.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-2 text-green-500" />
                            {lead.phone}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-2 text-purple-500" />
                            {salesReps.find(rep => rep.id === lead.assignedTo)?.name || 'Unassigned'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2 text-orange-500" />
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>
                        {lead.notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md">
                            {lead.notes}
                          </p>
                        )}
                        <div className="mt-2">
                          <TagSelector
                            entityId={lead.id}
                            entityType={TagType.LEAD}
                            onTagsChange={() => {}}
                            placeholder="Add lead tags..."
                            className="max-w-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                         setSelectedLead(lead)
                         setShowAIInsights(true)
                        }}
                      >
                        <ListTodo className="h-3 w-3 mr-1" />
                        Task
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                        e.stopPropagation()
                        setSelectedLeadId(lead.id)
                        setShowContactModal(true)
                      }}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                        e.stopPropagation()
                        setSelectedLead(lead)
                      }}>
                        <Brain className="h-3 w-3 mr-1" />
                        AI Insights
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <PipelineDashboard />
        </TabsContent>

        <TabsContent value="quotes">
          <QuotesList />
        </TabsContent>

        <TabsContent value="nurturing">
          <NurtureSequences />
        </TabsContent>

        <TabsContent value="forms">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Lead Intake Forms</CardTitle>
              <CardDescription>Create and manage dynamic lead capture forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Form builder coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>Manage and track lead source performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sources.map(source => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {source.type} • Conversion: {source.conversionRate}%
                        {source.trackingCode && ` • Code: ${source.trackingCode}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={source.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {source.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={(taskData) => {
              console.log('Task created:', taskData)
              setShowTaskModal(false)
            }}
            onCancel={() => setShowTaskModal(false)}
          />
        </DialogContent>
      </Dialog>

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        leadId={selectedLeadId || undefined}
      />

      <Dialog
        open={showAIInsights && !!selectedLead}
        onOpenChange={(open) => {
          setShowAIInsights(open)
          if (!open) setSelectedLead(null)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Insights</DialogTitle>
          </DialogHeader>
          
          {selectedLead ? (
            <AIInsights
              leadId={selectedLead.id}
              leadData={selectedLead}
            />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Select a lead to view insights.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CRMProspecting() {
  return (
    <Routes>
      <Route path="/" element={<LeadsList />} />
      <Route path="/*" element={<LeadsList />} />
    </Routes>
  )
}