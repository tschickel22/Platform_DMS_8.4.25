import React, { useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Settings, CreditCard, Eye, Users, Search, Save, User, Clock, XCircle } from 'lucide-react'
import { ListTodo } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { FinanceApplicationForm } from './components/FinanceApplicationForm'
import { AdminApplicationBuilder } from './components/AdminApplicationBuilder'
import { ApplicationTypeSelectionModal } from './components/ApplicationTypeSelectionModal'
import { PortalApplicationView } from './components/PortalApplicationView'
import { InviteCustomerModal } from './components/InviteCustomerModal'
import { useFinanceApplications } from './hooks/useFinanceApplications'
import { FinanceApplication as FinanceApplicationType } from './types'
import { mockFinanceApplications } from './mocks/financeApplicationMock'
import { TaskForm } from '@/modules/task-center/components/TaskForm'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskModule, TaskPriority } from '@/types'

function FinanceApplicationDashboard() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const { createTask } = useTasks()
  const [activeTab, setActiveTab] = useState('applications')
  const [showApplicationTypeSelectionModal, setShowApplicationTypeSelectionModal] = useState(false)
  const [applicationCreationMode, setApplicationCreationMode] = useState<'none' | 'completeNow' | 'inviteCustomer'>('none')
  const [selectedApplication, setSelectedApplication] = useState<FinanceApplicationType | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>(undefined)
  
  // Search and filter states
  const [applicationSearchQuery, setApplicationSearchQuery] = useState('')
  const [applicationDateFilter, setApplicationDateFilter] = useState('')
  const [templateSearchQuery, setTemplateSearchQuery] = useState('')
  
  // Admin notes state
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'pending_review' | 'approved' | 'denied'>('all')
  
  // Helper function to apply tile filters
  const applyTileFilter = (status: 'all' | 'draft' | 'pending_review' | 'approved' | 'denied') => {
    setActiveTab('applications')
    console.log('🔥 TILE CLICKED - Setting statusFilter to:', status)
    setStatusFilter(status)
    console.log('🔥 TILE CLICKED - statusFilter should now be:', status)
  }

  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
  })
  const [currentAdminNote, setCurrentAdminNote] = useState('')
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const adminNotesRef = useRef<HTMLTextAreaElement>(null)
  
  const {
    applications,
    templates,
    createApplication,
    updateApplication,
    deleteApplication,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useFinanceApplications()

  // Filter applications based on search and filters
  const filteredApplications = React.useMemo(() => {
    console.log('🔍 DEBUG - statusFilter:', statusFilter)
    console.log('🔍 DEBUG - Total applications:', applications.length)
    console.log('🔍 DEBUG - Application statuses:', applications.map(app => ({ name: app.customerName, status: app.status })))
    
    let currentApplications = applications

    // Search filter (name, email, phone)
    if (applicationSearchQuery) {
      const lowerCaseQuery = applicationSearchQuery.toLowerCase()
      currentApplications = currentApplications.filter(app =>
        (app.customerName && app.customerName.toLowerCase().includes(lowerCaseQuery)) ||
        (app.customerEmail && app.customerEmail.toLowerCase().includes(lowerCaseQuery)) ||
        (app.customerPhone && app.customerPhone.toLowerCase().includes(lowerCaseQuery))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      currentApplications = currentApplications.filter(app => app.status === statusFilter)
    }

    // Date filter (created on or after)
    if (applicationDateFilter) {
      const filterDate = new Date(applicationDateFilter)
      currentApplications = currentApplications.filter(app => {
        const appCreationDate = new Date(app.createdAt)
        return appCreationDate.setHours(0,0,0,0) >= filterDate.setHours(0,0,0,0)
      })
    }

    console.log('🔍 DEBUG - Filtered applications:', currentApplications.length)
    console.log('🔍 DEBUG - Filtered app details:', currentApplications.map(app => ({ name: app.customerName, status: app.status })))
    
    return currentApplications
  }, [applications, applicationSearchQuery, statusFilter, applicationDateFilter])

  // Filter templates based on search
  const filteredTemplates = React.useMemo(() => {
    let currentTemplates = templates || []

    if (templateSearchQuery) {
      const lowerCaseQuery = templateSearchQuery.toLowerCase()
      currentTemplates = currentTemplates.filter(template =>
        template.name.toLowerCase().includes(lowerCaseQuery) ||
        template.description.toLowerCase().includes(lowerCaseQuery)
      )
    }

    return currentTemplates
  }, [templates, templateSearchQuery])

  // Get platform-specific labels
  const getModuleLabel = () => {
    return 'Applications'
  }

  const getApplicationLabel = () => {
    const platformType = tenant?.settings?.platformType || 'mh'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides['finance.application']) {
      return labelOverrides['finance.application']
    }
    
    switch (platformType) {
      case 'rv':
        return 'RV Loan Application'
      case 'auto':
        return 'Auto Loan Application'
      case 'mh':
      default:
        return 'MH Finance Application'
    }
  }

  const handleOpenApplicationCreationFlow = () => {
    setShowApplicationTypeSelectionModal(true)
  }

  const handleSelectApplicationType = (type: 'completeNow' | 'inviteCustomer') => {
    setShowApplicationTypeSelectionModal(false)
    setApplicationCreationMode(type)
    
    if (type === 'completeNow') {
      const defaultTemplate = templates.find(t => t.isActive) || templates[0]
      if (!defaultTemplate) {
        toast({
          title: 'No Templates Available',
          description: 'Please create an application template first.',
          variant: 'destructive'
        })
        setApplicationCreationMode('none')
        return
      }
      
      const newApp = createApplication({
        customerId: '',
        customerName: '',
        customerEmail: '',
        templateId: defaultTemplate.id,
        status: 'draft'
      })
      setSelectedApplication(newApp)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    if (!selectedApplication) return
    
    // Check if changing FROM denied TO another status - requires note validation
    if (selectedApplication.status === 'denied' && newStatus !== 'denied') {
      if (!currentAdminNote.trim()) {
        // Set pending status but don't save yet
        setPendingStatus(newStatus)
        
        // Scroll to admin notes section
        adminNotesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        
        toast({
          title: 'Internal Note Required',
          description: 'Please add an internal note explaining the reason for changing from denied status.',
          variant: 'destructive'
        })
        return
      }
    }
    
    // Auto-save the status change
    const isStatusChanging = newStatus !== selectedApplication.status
    
    if (isStatusChanging) {
      const updateData: any = {
        status: newStatus,
        reviewedBy: 'Admin User', // In real app, get from auth context
        reviewedAt: new Date().toISOString(),
        adminNotes: currentAdminNote
      }
      
      // Update the application
      updateApplication(selectedApplication.id, updateData)
      
      // Update the selected application state to reflect changes immediately
      const updatedApplication = {
        ...selectedApplication,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      setSelectedApplication(updatedApplication)
      
      // Clear pending status
      setPendingStatus(null)
      
      toast({
        title: 'Status Updated',
        description: `Application status changed to ${mockFinanceApplications.statusOptions.find(s => s.value === newStatus)?.label || newStatus}.`
      })
    }
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData)
      setShowTaskForm(false)
      setInitialTaskData(undefined)
      toast({
        title: 'Task Created',
        description: 'Task has been created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      })
    }
  }

  const handleCreateTaskForApplication = (application: FinanceApplicationType) => {
    // Determine priority based on application status
    const priority = application.status === 'pending_review' ? TaskPriority.HIGH :
                    application.status === 'submitted' ? TaskPriority.MEDIUM :
                    application.status === 'conditionally_approved' ? TaskPriority.HIGH :
                    TaskPriority.LOW

    // Set due date based on status
    const dueDate = application.status === 'pending_review' || application.status === 'conditionally_approved'
      ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day for urgent review
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days for others

    setInitialTaskData({
      sourceId: application.id,
      sourceType: 'finance_application',
      module: TaskModule.FINANCE,
      title: `Review application: ${application.customerName || 'Unnamed Application'}`,
      description: `Application status: ${application.status.replace('_', ' ')}, Customer: ${application.customerEmail || 'No email'}`,
      priority,
      dueDate,
      link: `/client-applications`,
      customFields: {
        customerId: application.customerId,
        customerName: application.customerName,
        customerEmail: application.customerEmail,
        applicationStatus: application.status,
        templateId: application.templateId
      }
    })
    setShowTaskForm(true)
  }

  const handleCloseApplicationForm = () => {
    setSelectedApplication(null)
    setCurrentAdminNote('')
    setPendingStatus(null)
    setApplicationCreationMode('none')
  }

  const handleCloseInviteModal = () => {
    setApplicationCreationMode('none')
  }

  const handleViewApplication = (application: FinanceApplicationType) => {
    setSelectedApplication(application)
    setCurrentAdminNote(application.adminNotes || '')
    setPendingStatus(null)
    setApplicationCreationMode('none') // Reset creation mode when viewing
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'conditionally_approved':
        return 'bg-orange-100 text-orange-800'
      case 'denied':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSaveNotesAndStatus = () => {
    if (selectedApplication) {
      const newStatusToApply = pendingStatus || selectedApplication.status
      const isStatusChanging = newStatusToApply !== selectedApplication.status
      
      // Check if note is required (changing FROM denied to another status)
      if (isStatusChanging && selectedApplication.status === 'denied' && newStatusToApply !== 'denied' && !currentAdminNote.trim()) {
        // Scroll to admin notes section
        adminNotesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        
        toast({
          title: 'Internal Note Required',
          description: 'Please add an internal note explaining the reason for changing from denied status.',
          variant: 'destructive'
        })
        return
      }
      
      // Prepare update data
      const updateData: any = {
        adminNotes: currentAdminNote
      }
      
      // Add status change data if status is changing
      if (isStatusChanging) {
        updateData.status = newStatusToApply
        updateData.reviewedBy = 'Admin User' // In real app, get from auth context
        updateData.reviewedAt = new Date().toISOString()
      }
      
      // Update the application
      updateApplication(selectedApplication.id, updateData)
      
      // Update the selected application state to reflect changes immediately
      const updatedApplication = {
        ...selectedApplication,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      setSelectedApplication(updatedApplication)
      
      // Clear pending status
      setPendingStatus(null)
      
      toast({
        title: isStatusChanging ? 'Status and Notes Updated' : 'Admin Notes Saved',
        description: isStatusChanging 
          ? `Application status changed to ${mockFinanceApplications.statusOptions.find(s => s.value === newStatusToApply)?.label || newStatusToApply} and notes saved.`
          : 'Internal notes have been saved successfully.'
      })
    }
  }

  // Calculate stats
  const draftApplications = applications.filter(app => app.status === 'draft').length
  const rejectedApplications = applications.filter(app => app.status === 'denied').length
  const pendingReviewApplications = applications.filter(app => app.status === 'pending_review').length

  if (selectedApplication && applicationCreationMode === 'completeNow') {
    return (
      <FinanceApplicationForm
        application={selectedApplication}
        onSave={(data) => {
          updateApplication(selectedApplication.id, data)
          toast({
            title: 'Application Updated',
            description: 'Finance application has been saved successfully.'
          })
        }}
        onCancel={handleCloseApplicationForm}
        onSubmit={(data) => {
          updateApplication(selectedApplication.id, { ...data, status: 'submitted' })
          handleCloseApplicationForm()
          toast({
            title: 'Application Submitted',
            description: 'Finance application has been submitted for review.'
          })
        }}
      />
    )
  }

  if (applicationCreationMode === 'inviteCustomer') {
    return (
      <div className="space-y-6">
        <InviteCustomerModal
          onClose={handleCloseInviteModal}
          onInvite={(customerData, templateId) => {
            const newApp = createApplication({
              customerId: customerData.id || '',
              customerName: customerData.name,
              customerEmail: customerData.email,
              templateId: templateId,
              status: 'draft'
            })
            handleCloseInviteModal()
            toast({
              title: 'Invitation Sent',
              description: `Finance application invitation sent to ${customerData.name}`
            })
          }}
        />
      </div>
    )
  }

  // Add view mode for selected application
  if (selectedApplication && applicationCreationMode === 'none') {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleCloseApplicationForm}>
              ← Back to Applications
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Application Details</h1>
              <p className="text-muted-foreground">
                {selectedApplication.customerName || 'Unnamed Application'}
              </p>
            </div>
          </div>
        </div>

        {/* Application Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Application #{selectedApplication.id.slice(-6).toUpperCase()}</CardTitle>
                <CardDescription>
                  Created {new Date(selectedApplication.createdAt).toLocaleDateString()}
                  {selectedApplication.submittedAt && (
                    <span> • Submitted {new Date(selectedApplication.submittedAt).toLocaleDateString()}</span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Status:</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFinanceApplications.statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></div>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedApplication.fraudCheckStatus && (
                  <Badge variant="outline">
                    IDV: {selectedApplication.fraudCheckStatus.charAt(0).toUpperCase() + selectedApplication.fraudCheckStatus.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">{selectedApplication.customerName || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedApplication.customerEmail || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedApplication.customerPhone || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Customer ID</Label>
                  <p className="text-sm">{selectedApplication.customerId || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            {/* Application Data */}
            {Object.keys(selectedApplication.data).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Application Data</h3>
                <div className="space-y-4">
                  {Object.entries(selectedApplication.data).map(([sectionId, sectionData]) => (
                    <div key={sectionId} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 capitalize">{sectionId.replace('-', ' ')}</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {Object.entries(sectionData as Record<string, any>).map(([fieldId, value]) => (
                          <div key={fieldId}>
                            <Label className="text-xs text-muted-foreground capitalize">
                              {fieldId.replace('-', ' ')}
                            </Label>
                            <p className="text-sm">{value || 'Not provided'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            {selectedApplication.uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {selectedApplication.uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedApplication.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{selectedApplication.notes}</p>
                </div>
              </div>
            )}

            {/* Review Information */}
            {selectedApplication.reviewedAt && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Review Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Reviewed Date</Label>
                    <p className="text-sm">{new Date(selectedApplication.reviewedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Reviewed By</Label>
                    <p className="text-sm">{selectedApplication.reviewedBy || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Admin Notes (Internal Only)</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotesAndStatus}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {pendingStatus && pendingStatus !== selectedApplication.status ? 'Save Status & Notes' : 'Save Notes'}
                </Button>
              </div>
              <Textarea
                ref={adminNotesRef}
                value={currentAdminNote}
                onChange={(e) => setCurrentAdminNote(e.target.value)}
                placeholder="Add internal notes about this application (not visible to customer)..."
                rows={4}
                className="mb-4"
              />
              <p className="text-xs text-muted-foreground">
                These notes are for internal use only and will not be visible to the customer.
                {pendingStatus && pendingStatus !== selectedApplication.status && (
                  <span className="block mt-1 text-orange-600 font-medium">
                    Status will be changed to "{mockFinanceApplications.statusOptions.find(s => s.value === pendingStatus)?.label}" when saved.
                  </span>
                )}
              </p>
            </div>

            {/* Application History */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Application History</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedApplication.history?.length > 0 ? (
                  selectedApplication.history
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/20">
                        <div className="flex-shrink-0 mt-1">
                          {entry.action.includes('Status') ? (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Settings className="h-4 w-4 text-blue-600" />
                            </div>
                          ) : entry.action.includes('Document') ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                          ) : entry.action.includes('Notes') ? (
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Clock className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{entry.action}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                          {(entry.oldValue || entry.newValue) && (
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              {entry.oldValue && (
                                <div>
                                  <span className="font-medium">From:</span> {entry.oldValue}
                                </div>
                              )}
                              {entry.newValue && (
                                <div>
                                  <span className="font-medium">To:</span> {entry.newValue}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex items-center space-x-1 mt-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{entry.userName}</span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm">No history available</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          initialData={initialTaskData}
          onSave={handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false)
            setInitialTaskData(undefined)
          }}
        />
      )}

      {/* Application Type Selection Modal */}
      {showApplicationTypeSelectionModal && (
        <ApplicationTypeSelectionModal
          onClose={() => setShowApplicationTypeSelectionModal(false)}
          onSelectType={handleSelectApplicationType}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">{getModuleLabel()}</h1>
            <p className="ri-page-description">
              Manage finance applications and approval workflows
            </p>
          </div>
          <div>
            <Button onClick={handleOpenApplicationCreationFlow}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card {...tileProps(() => applyTileFilter('all'))} className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card {...tileProps(() => applyTileFilter('draft'))} className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Draft</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{draftApplications}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              Pending Review
            </p>
          </CardContent>
        </Card>
        
        <Card {...tileProps(() => applyTileFilter('pending_review'))} className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingReviewApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card {...tileProps(() => applyTileFilter('approved'))} className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card 
          {...tileProps(() => applyTileFilter('denied'))} 
          className="border-0 bg-gradient-to-br from-red-50 to-red-100/50 cursor-pointer hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{rejectedApplications}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <XCircle className="h-3 w-3 mr-1" />
              Rejected applications
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finance Applications</CardTitle>
              <CardDescription>
                Manage and review customer finance applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter Indicator */}
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    Filtered by: {statusFilter === 'pending_review' ? 'Pending Review' : statusFilter === 'denied' ? 'Rejected' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => applyTileFilter('all')}>
                    Clear Filter
                  </Button>
                </div>
              )}

              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone"
                    value={applicationSearchQuery}
                    onChange={(e) => setApplicationSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={applicationDateFilter}
                  onChange={(e) => setApplicationDateFilter(e.target.value)}
                  className="w-[180px]"
                  title="Filter by creation date (on or after)"
                />
              </div>

              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{application.customerName || 'Unnamed Application'}</h4>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status === 'pending_review' ? 'PENDING REVIEW' : application.status === 'denied' ? 'REJECTED' : application.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {application.fraudCheckStatus && (
                          <Badge variant="outline">
                            IDV: {application.fraudCheckStatus.charAt(0).toUpperCase() + application.fraudCheckStatus.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {application.customerEmail && (
                          <span>{application.customerEmail} • </span>
                        )}
                        Created: {new Date(application.createdAt).toLocaleDateString()}
                        {application.submittedAt && (
                          <span> • Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateTaskForApplication(application)}
                      >
                        <ListTodo className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {applications.length === 0 ? (
                      <>
                        <p>No applications yet</p>
                        <p className="text-sm">Create your first application to get started</p>
                      </>
                    ) : (
                      <>
                        <p>No applications found matching your criteria</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Debug: statusFilter = "{statusFilter}", total apps = {applications.length}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Template Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name or description"
              value={templateSearchQuery}
              onChange={(e) => setTemplateSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <AdminApplicationBuilder
            templates={filteredTemplates}
            onCreateTemplate={createTemplate}
            onUpdateTemplate={updateTemplate}
            onDeleteTemplate={deleteTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function FinanceApplication() {
  return (
    <Routes>
      <Route path="/" element={<FinanceApplicationDashboard />} />
      <Route path="/portal" element={<PortalApplicationView />} />
      <Route path="/*" element={<FinanceApplicationDashboard />} />
    </Routes>
  )
}