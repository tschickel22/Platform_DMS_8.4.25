import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Mail, 
  Phone,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Copy
} from 'lucide-react'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorTrade } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'

// Helper function to get trade display name
const getTradeDisplayName = (trade: ContractorTrade): string => {
  const tradeNames: Record<ContractorTrade, string> = {
    [ContractorTrade.ELECTRICAL]: 'Electrical',
    [ContractorTrade.PLUMBING]: 'Plumbing',
    [ContractorTrade.SKIRTING]: 'Skirting',
    [ContractorTrade.HVAC]: 'HVAC',
    [ContractorTrade.FLOORING]: 'Flooring',
    [ContractorTrade.ROOFING]: 'Roofing',
    [ContractorTrade.GENERAL]: 'General',
    [ContractorTrade.LANDSCAPING]: 'Landscaping'
  }
  return tradeNames[trade] || trade
}

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  message: string
  type: 'job_assigned' | 'job_reminder' | 'job_completed' | 'general'
  isCustom?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Available merge fields for templates
const availableMergeFields = [
  { key: 'contractorName', label: 'Contractor Name', description: 'Name of the contractor' },
  { key: 'companyName', label: 'Company Name', description: 'Your company name' },
  { key: 'jobDescription', label: 'Job Description', description: 'Description of the job' },
  { key: 'jobAddress', label: 'Job Address', description: 'Location of the job' },
  { key: 'scheduledDate', label: 'Scheduled Date', description: 'Date the job is scheduled' },
  { key: 'scheduledTime', label: 'Scheduled Time', description: 'Time the job is scheduled' },
  { key: 'priority', label: 'Priority', description: 'Job priority level' },
  { key: 'customerName', label: 'Customer Name', description: 'Name of the customer' },
  { key: 'customerPhone', label: 'Customer Phone', description: 'Customer phone number' },
  { key: 'completedDate', label: 'Completed Date', description: 'Date the job was completed' },
  { key: 'portalLink', label: 'Portal Link', description: 'Link to contractor portal' },
  { key: 'estimatedDuration', label: 'Estimated Duration', description: 'Expected job duration' },
  { key: 'specialInstructions', label: 'Special Instructions', description: 'Special job instructions' }
]

const getDefaultTemplates = (): NotificationTemplate[] => [
  {
    id: 'job_assigned',
    name: 'Job Assignment',
    subject: 'New Job Assigned - {{jobDescription}}',
    type: 'job_assigned',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    message: `Hi {{contractorName}},

A new job has been assigned to you:

Job: {{jobDescription}}
Location: {{jobAddress}}
Scheduled: {{scheduledDate}}
Priority: {{priority}}
Customer: {{customerName}}

Please access your contractor portal to view full details and update job status:
{{portalLink}}

Thank you,
{{companyName}}`
  },
  {
    id: 'job_reminder',
    name: 'Job Reminder',
    subject: 'Reminder: Job Tomorrow - {{jobDescription}}',
    type: 'job_reminder',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    message: `Hi {{contractorName}},

This is a reminder about your job scheduled for tomorrow:

Job: {{jobDescription}}
Location: {{jobAddress}}
Time: {{scheduledTime}}
Customer: {{customerName}}
Phone: {{customerPhone}}

Please confirm your availability and update your status in the portal:
{{portalLink}}

Thank you,
{{companyName}}`
  },
  {
    id: 'job_completed',
    name: 'Job Completion Confirmation',
    subject: 'Job Completed - Thank You!',
    type: 'job_completed',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    message: `Hi {{contractorName}},

Thank you for completing the job:

Job: {{jobDescription}}
Location: {{jobAddress}}
Completed: {{completedDate}}

Your work has been recorded and will be processed for payment.

Best regards,
{{companyName}}`
  }
]

export function ContractorNotifications() {
  const { activeContractors, contractorJobs, loading, error } = useContractorManagement()
  const { toast } = useToast()
  const { tenant } = useTenant()

  const [selectedContractors, setSelectedContractors] = useState<string[]>([])
  const [selectedTrade, setSelectedTrade] = useState<string>('all')
  const [notificationType, setNotificationType] = useState<'sms' | 'email'>('email')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  
  // Template management state
  const [templates, setTemplates] = useState<NotificationTemplate[]>(getDefaultTemplates())
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    message: '',
    type: 'general' as NotificationTemplate['type']
  })

  // Filter contractors
  const filteredContractors = useMemo(() => {
    return activeContractors.filter(contractor => 
      selectedTrade === 'all' || contractor.trade === selectedTrade
    )
  }, [activeContractors, selectedTrade])

  // Recent notifications (simulated)
  const recentNotifications = useMemo(() => [
    {
      id: '1',
      contractorName: 'Mike Johnson',
      type: 'job_assigned',
      method: 'email',
      subject: 'New Job Assigned - Electrical Panel Installation',
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'delivered'
    },
    {
      id: '2',
      contractorName: 'Sarah Williams',
      type: 'job_reminder',
      method: 'sms',
      subject: 'Reminder: Plumbing Repair Tomorrow',
      sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'delivered'
    },
    {
      id: '3',
      contractorName: 'David Brown',
      type: 'job_completed',
      method: 'email',
      subject: 'Job Completed - Thank You!',
      sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'delivered'
    }
  ], [])

  const handleContractorToggle = (contractorId: string) => {
    setSelectedContractors(prev => 
      prev.includes(contractorId)
        ? prev.filter(id => id !== contractorId)
        : [...prev, contractorId]
    )
  }

  const handleSelectAll = () => {
    if (selectedContractors.length === filteredContractors.length) {
      setSelectedContractors([])
    } else {
      setSelectedContractors(filteredContractors.map(c => c.id))
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSubject(template.subject)
      setMessage(template.message)
    }
  }

  // Helper function to replace placeholders in templates
  const replacePlaceholders = (template: string, contractor: any, companyName: string) => {
    return template
      .replace(/\{\{contractorName\}\}/g, contractor.name || 'N/A')
      .replace(/\{\{companyName\}\}/g, companyName || 'Company')
      .replace(/\{\{jobDescription\}\}/g, 'N/A')
      .replace(/\{\{jobAddress\}\}/g, 'N/A')
      .replace(/\{\{scheduledDate\}\}/g, 'N/A')
      .replace(/\{\{scheduledTime\}\}/g, 'N/A')
      .replace(/\{\{priority\}\}/g, 'N/A')
      .replace(/\{\{customerName\}\}/g, 'N/A')
      .replace(/\{\{customerPhone\}\}/g, 'N/A')
      .replace(/\{\{completedDate\}\}/g, 'N/A')
      .replace(/\{\{portalLink\}\}/g, 'N/A')
  }

  const handleSendNotification = () => {
    if (selectedContractors.length === 0) {
      toast({
        title: 'No Recipients',
        description: 'Please select at least one contractor to send notifications to.',
        variant: 'destructive'
      })
      return
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Missing Content',
        description: 'Please provide both subject and message content.',
        variant: 'destructive'
      })
      return
    }

    // Get selected contractors and process notifications
    const selectedContractorObjects = activeContractors
      .filter(c => selectedContractors.includes(c.id))
    
    const companyName = tenant?.name || 'Company'

    console.log(`📧 ${notificationType.toUpperCase()} Notifications Sent:`)
    
    selectedContractorObjects.forEach(contractor => {
      const personalizedSubject = replacePlaceholders(subject, contractor, companyName)
      const personalizedMessage = replacePlaceholders(message, contractor, companyName)
      
      console.log(`To: ${contractor.name}`)
      console.log(`Subject: ${personalizedSubject}`)
      console.log(`Message: ${personalizedMessage}`)
      console.log('---')
    })

    toast({
      title: 'Notifications Sent',
      description: `${notificationType.toUpperCase()} notifications sent to ${selectedContractors.length} contractor${selectedContractors.length !== 1 ? 's' : ''}.`
    })

    // Reset form
    setSelectedContractors([])
    setSubject('')
    setMessage('')
    setSelectedTemplate('')
  }
  // Template management handlers
  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setTemplateForm({ name: '', subject: '', message: '', type: 'general' })
    setIsTemplateModalOpen(true)
  }

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      message: template.message,
      type: template.type,
    })
    setIsTemplateModalOpen(true)
  }

  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const copy: NotificationTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: template.name + ' (Copy)',
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates([copy, ...templates])
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
  }

  const handleSaveTemplate = () => {
    const updated: NotificationTemplate = {
      id: editingTemplate?.id || `custom-${Date.now()}`,
      ...templateForm,
      isCustom: true,
      updatedAt: new Date(),
      createdAt: editingTemplate?.createdAt || new Date(),
    }
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === updated.id ? updated : t))
    } else {
      setTemplates([updated, ...templates])
    }
    setIsTemplateModalOpen(false)
  }

  const insertMergeField = (key: string) => {
    const placeholder = `{{${key}}}`
    setTemplateForm(prev => ({ ...prev, message: prev.message + placeholder }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="ri-page-header">
        <h1 className="ri-page-title">Contractor Notifications</h1>
        <p className="ri-page-description">
          Send notifications and manage communication with your contractors
        </p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contractor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Recipients
                </CardTitle>
                <CardDescription>
                  Choose contractors to send notifications to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trade Filter */}
                <div>
                  <Label htmlFor="trade-filter">Filter by Trade</Label>
                  <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="All trades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trades</SelectItem>
                      {Object.values(ContractorTrade).map(trade => (
                        <SelectItem key={trade} value={trade}>
                          {getTradeDisplayName(trade)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select All Button */}
                <Button 
                  variant="outline" 
                  onClick={handleSelectAll}
                  className="w-full"
                >
                  {selectedContractors.length === filteredContractors.length ? 'Deselect All' : 'Select All'}
                  ({filteredContractors.length})
                </Button>

                {/* Contractor List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredContractors.map((contractor) => (
                    <div
                      key={contractor.id}
                      className={`p-2 border rounded cursor-pointer transition-colors ${
                        selectedContractors.includes(contractor.id)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => handleContractorToggle(contractor.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{contractor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {getTradeDisplayName(contractor.trade)}
                          </div>
                        </div>
                        {selectedContractors.includes(contractor.id) && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  {selectedContractors.length} of {filteredContractors.length} contractors selected
                </div>
              </CardContent>
            </Card>

            {/* Message Composition */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Compose Message
                  </CardTitle>
                  <CardDescription>
                    Create your notification message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Selection */}
                  <div>
                    <Label htmlFor="template">Use Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notification Type */}
                  <div>
                    <Label htmlFor="notification-type">Notification Type</Label>
                    <Select value={notificationType} onValueChange={(value) => setNotificationType(value as 'sms' | 'email')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </SelectItem>
                        <SelectItem value="sms">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            SMS
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject (Email only) */}
                  {notificationType === 'email' && (
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject..."
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message..."
                      rows={8}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Available variables: {'{{contractorName}}'}, {'{{jobDescription}}'}, {'{{jobAddress}}'}, {'{{scheduledDate}}'}, {'{{portalLink}}'}
                    </div>
                  </div>

                  {/* Send Button */}
                  <Button 
                    onClick={handleSendNotification}
                    className="w-full"
                    disabled={selectedContractors.length === 0 || !subject.trim() || !message.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send {notificationType.toUpperCase()} to {selectedContractors.length} Contractor{selectedContractors.length !== 1 ? 's' : ''}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription>
                History of sent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        {notification.method === 'email' ? (
                          <Mail className="h-5 w-5 text-primary" />
                        ) : (
                          <Phone className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{notification.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          To: {notification.contractorName} • {notification.sentAt.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={notification.status === 'delivered' ? 'default' : 'secondary'}>
                        {notification.status}
                      </Badge>
                      <Badge variant="outline">
                        {notification.method.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Notification Templates
                  </CardTitle>
                  <CardDescription>
                    Create and manage your notification templates with merge fields
                  </CardDescription>
                </div>
                <Button onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.type.replace('_', ' ')}</Badge>
                          {template.isCustom && (
                            <Badge variant="secondary">Custom</Badge>
                          )}
                        </div>
                        {template.updatedAt && (
                          <p className="text-xs text-muted-foreground">
                            Last updated: {template.updatedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Duplicate
                        </Button>
                        {template.isCustom && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Message:</strong> {template.message.substring(0, 200)}
                      {template.message.length > 200 && '...'}
                    </div>
                  </div>
                ))}
                
                {templates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No templates found</p>
                    <Button onClick={handleCreateTemplate} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Template
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Creation/Edit Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              Create a notification template with merge fields for dynamic content
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Form */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name..."
                />
              </div>
              
              <div>
                <Label htmlFor="template-type">Template Type</Label>
                <Select 
                  value={templateForm.type} 
                  onValueChange={(value) => setTemplateForm(prev => ({ ...prev, type: value as NotificationTemplate['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_assigned">Job Assignment</SelectItem>
                    <SelectItem value="job_reminder">Job Reminder</SelectItem>
                    <SelectItem value="job_completed">Job Completed</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="template-subject">Subject</Label>
                <Input
                  id="template-subject"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject..."
                />
              </div>
              
              <div>
                <Label htmlFor="template-message">Message</Label>
                <Textarea
                  id="template-message"
                  value={templateForm.message}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message template..."
                  rows={12}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </div>
            
            {/* Merge Fields Panel */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Available Merge Fields</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Click to insert into your message
                </p>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableMergeFields.map((field) => (
                  <div
                    key={field.key}
                    className="p-2 border rounded cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => insertMergeField(field.key)}
                  >
                    <div className="font-medium text-sm">{field.label}</div>
                    <div className="text-xs text-muted-foreground">{field.description}</div>
                    <div className="text-xs font-mono text-primary mt-1">
                      {`{{${field.key}}}`}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                <strong>Tip:</strong> Merge fields will be automatically replaced with actual values when sending notifications.
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}