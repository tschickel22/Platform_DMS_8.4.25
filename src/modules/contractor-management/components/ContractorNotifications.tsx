import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Mail, 
  Phone,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorTrade } from '@/types'
import { useToast } from '@/hooks/use-toast'

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
}

const defaultTemplates: NotificationTemplate[] = [
  {
    id: 'job_assigned',
    name: 'Job Assignment',
    subject: 'New Job Assigned - {{jobDescription}}',
    type: 'job_assigned',
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

  const [selectedContractors, setSelectedContractors] = useState<string[]>([])
  const [selectedTrade, setSelectedTrade] = useState<string>('all')
  const [notificationType, setNotificationType] = useState<'sms' | 'email'>('email')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

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
    const template = defaultTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSubject(template.subject)
      setMessage(template.message)
    }
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

    // Simulate sending notifications
    const selectedContractorNames = activeContractors
      .filter(c => selectedContractors.includes(c.id))
      .map(c => c.name)

    console.log(`📧 ${notificationType.toUpperCase()} Notifications Sent:`)
    console.log(`Recipients: ${selectedContractorNames.join(', ')}`)
    console.log(`Subject: ${subject}`)
    console.log(`Message: ${message}`)

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
                        {defaultTemplates.map(template => (
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
                      Available variables: {{contractorName}}, {{jobDescription}}, {{jobAddress}}, {{scheduledDate}}, {{portalLink}}
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
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notification Templates
              </CardTitle>
              <CardDescription>
                Manage your notification templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaultTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline">{template.type.replace('_', ' ')}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Message:</strong> {template.message.substring(0, 150)}...
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}