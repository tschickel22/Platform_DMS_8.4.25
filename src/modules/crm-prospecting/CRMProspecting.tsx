import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  CheckSquare,
  Brain,
  User,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  Users,
  Activity
} from 'lucide-react'
import { useLeadManagement } from './hooks/useLeadManagement'
import { useNurturing } from './hooks/useNurturing'
import { LeadIntakeForm } from './components/LeadIntakeForm'
import { ActivityTimeline } from './components/ActivityTimeline'
import { NurtureSequences } from './components/NurtureSequences'
import { CommunicationCenter } from './components/CommunicationCenter'
import { PipelineDashboard } from './components/PipelineDashboard'
import { AIInsights } from './components/AIInsights'
import { TagSelector } from '@/modules/tagging-engine'
import { TagType } from '@/modules/tagging-engine/types'
import { useTasks } from '@/hooks/useTasks'
import { TaskModule, TaskPriority, TaskStatus } from '@/types'

export default function CRMProspecting() {
  const navigate = useNavigate()
  const location = useLocation()
  const { leads, addLead, updateLead, deleteLead, getLeadsByStatus } = useLeadManagement()
  const { 
    leads: filteredLeads,
    loading, 
    error, 
    getLeadByStatus, 
    createLead, 
    updateLead, 
    deleteLead,
    getLeadById 
  } = useLeadManagement()
  const { tasks, addTask } = useTasks()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm)
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  // Get lead statistics
  const leadStats = {
    total: leads.length,
    new: getLeadsByStatus('new').length,
    contacted: getLeadsByStatus('contacted').length,
    qualified: getLeadsByStatus('qualified').length,
    converted: getLeadsByStatus('converted').length
  }

  const handleTaskClick = (leadId: string) => {
    setSelectedLead(leadId)
    setShowTaskModal(true)
  }

  const handleContactClick = (leadId: string) => {
    setSelectedLead(leadId)
    setShowContactModal(true)
  }

  const handleAIInsightsClick = (leadId: string) => {
    setSelectedLead(leadId)
    setShowAIInsights(true)
  }

  const handleCreateTask = (taskData: any) => {
    const lead = leads.find(l => l.id === selectedLead)
    if (lead) {
      const newTask = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority as TaskPriority,
        status: 'pending' as TaskStatus,
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        module: 'crm-prospecting' as TaskModule,
        relatedId: selectedLead,
        relatedName: `${lead.firstName} ${lead.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      addTask(newTask)
    }
    setShowTaskModal(false)
    setSelectedLead(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-purple-100 text-purple-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">CRM & Prospecting</h1>
                <p className="text-muted-foreground">Manage leads and nurture prospects</p>
              </div>
              <Button onClick={() => setShowNewLeadForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Lead
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadStats.new}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadStats.contacted}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Qualified</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadStats.qualified}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Converted</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadStats.converted}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="leads" className="space-y-4">
              <TabsList>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="leads" className="space-y-4">
                {/* Search and Filters */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {/* Leads Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leads</CardTitle>
                    <CardDescription>
                      Manage your prospect database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredLeads.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                              <div className="text-sm text-muted-foreground">{lead.email}</div>
                              <div className="text-sm text-muted-foreground">{lead.phone}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                            <Badge className={getPriorityColor(lead.priority)}>
                              {lead.priority}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTaskClick(lead.id)}
                              >
                                <CheckSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleContactClick(lead.id)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAIInsightsClick(lead.id)}
                              >
                                <Brain className="h-4 w-4" />
                              </Button>
                            </div>
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

              <TabsContent value="nurturing">
                <NurtureSequences />
              </TabsContent>

              <TabsContent value="communication">
                <CommunicationCenter />
              </TabsContent>

              <TabsContent value="insights">
                <AIInsights />
              </TabsContent>
            </Tabs>

            {/* New Lead Form Modal */}
            <Dialog open={showNewLeadForm} onOpenChange={setShowNewLeadForm}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Enter the lead information to add them to your pipeline
                  </DialogDescription>
                </DialogHeader>
                <LeadIntakeForm
                  onSubmit={(leadData) => {
                    addLead(leadData)
                    setShowNewLeadForm(false)
                  }}
                  onCancel={() => setShowNewLeadForm(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Task Modal */}
            <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                  <DialogDescription>
                    Create a new task for this lead
                  </DialogDescription>
                </DialogHeader>
                <TaskForm
                  onSubmit={handleCreateTask}
                  onCancel={() => {
                    setShowTaskModal(false)
                    setSelectedLead(null)
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Contact Modal */}
            <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Contact Lead</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to contact this lead
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Lead
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* AI Insights Modal */}
            <Dialog open={showAIInsights} onOpenChange={setShowAIInsights}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>AI Insights</DialogTitle>
                  <DialogDescription>
                    AI-powered insights and recommendations for this lead
                  </DialogDescription>
                </DialogHeader>
                <AIInsights leadId={selectedLead} />
              </DialogContent>
            </Dialog>
          </>
        } />
        
        <Route path="/activity" element={<ActivityTimeline />} />
        <Route path="/sequences" element={<NurtureSequences />} />
        <Route path="/communication" element={<CommunicationCenter />} />
        <Route path="/pipeline" element={<PipelineDashboard />} />
        <Route path="/insights" element={<AIInsights />} />
      </Routes>
    </div>
  )
}