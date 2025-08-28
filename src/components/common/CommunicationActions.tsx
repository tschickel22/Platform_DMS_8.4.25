import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Mail, MessageSquare, Phone, Send, ChevronDown, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { Contact } from '@/types'

interface CommunicationActionsProps {
  contact: Contact
  className?: string
}

export function CommunicationActions({ contact, className = "" }: CommunicationActionsProps) {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showSmsDialog, setShowSmsDialog] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [emailTemplate, setEmailTemplate] = useState('')
  const [smsTemplate, setSmsTemplate] = useState('')

  // Check what communication methods are enabled
  const emailEnabled = tenant?.settings?.emailProvider && tenant?.settings?.emailApiKey
  const smsEnabled = tenant?.settings?.smsProvider && tenant?.settings?.smsApiKey
  const phoneEnabled = true // Phone is always available

  // Check if contact has required information
  const hasEmail = !!contact.email
  const hasPhone = !!contact.phone

  const emailTemplates = [
    { id: 'welcome', name: 'Welcome Message', subject: 'Welcome!', body: 'Hi {{firstName}},\n\nWelcome to our dealership!' },
    { id: 'followup', name: 'Follow-up', subject: 'Following up', body: 'Hi {{firstName}},\n\nJust following up on our conversation.' },
    { id: 'quote', name: 'Quote Follow-up', subject: 'Your Quote', body: 'Hi {{firstName}},\n\nAttached is your requested quote.' }
  ]

  const smsTemplates = [
    { id: 'welcome', name: 'Welcome SMS', message: 'Hi {{firstName}}, welcome to our dealership! Call us at (555) 123-4567.' },
    { id: 'appointment', name: 'Appointment Reminder', message: 'Hi {{firstName}}, reminder about your appointment tomorrow at 2 PM.' },
    { id: 'followup', name: 'Follow-up SMS', message: 'Hi {{firstName}}, thanks for visiting! Any questions about the RV you saw?' }
  ]

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{firstName\}\}/g, contact.firstName)
      .replace(/\{\{lastName\}\}/g, contact.lastName)
      .replace(/\{\{fullName\}\}/g, `${contact.firstName} ${contact.lastName}`)
      .replace(/\{\{email\}\}/g, contact.email || '')
  }

  const handleEmailTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setEmailSubject(replaceVariables(template.subject))
      setEmailBody(replaceVariables(template.body))
    }
    setEmailTemplate(templateId)
  }

  const handleSmsTemplateChange = (templateId: string) => {
    const template = smsTemplates.find(t => t.id === templateId)
    if (template) {
      setSmsMessage(replaceVariables(template.message))
    }
    setSmsTemplate(templateId)
  }

  const sendEmail = () => {
    // In a real implementation, this would integrate with your email service
    console.log('Sending email:', {
      to: contact.email,
      subject: emailSubject,
      body: emailBody
    })
    
    toast({
      title: 'Email Sent',
      description: `Email sent to ${contact.firstName} ${contact.lastName}`
    })
    
    setShowEmailDialog(false)
    setEmailSubject('')
    setEmailBody('')
    setEmailTemplate('')
  }

  const sendSms = () => {
    // In a real implementation, this would integrate with your SMS service
    console.log('Sending SMS:', {
      to: contact.phone,
      message: smsMessage
    })
    
    toast({
      title: 'SMS Sent',
      description: `SMS sent to ${contact.firstName} ${contact.lastName}`
    })
    
    setShowSmsDialog(false)
    setSmsMessage('')
    setSmsTemplate('')
  }

  const makeCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`
    }
  }

  // Helper function to get tooltip message for disabled actions
  const getTooltipMessage = (type: 'email' | 'sms' | 'phone') => {
    switch (type) {
      case 'email':
        if (!hasEmail) return 'No email address available'
        if (!emailEnabled) return 'Email provider not configured in settings'
        return ''
      case 'sms':
        if (!hasPhone) return 'No phone number available'
        if (!smsEnabled) return 'SMS provider not configured in settings'
        return ''
      case 'phone':
        if (!hasPhone) return 'No phone number available'
        return ''
      default:
        return ''
    }
  }

  const ActionButton = ({ 
    type, 
    icon: Icon, 
    label, 
    onClick, 
    disabled 
  }: { 
    type: 'email' | 'sms' | 'phone'
    icon: React.ComponentType<any>
    label: string
    onClick: () => void
    disabled: boolean
  }) => {
    const tooltipMessage = getTooltipMessage(type)
    
    if (disabled && tooltipMessage) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="outline" size="sm" disabled className="w-full justify-start">
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                  <AlertCircle className="h-3 w-3 ml-auto text-muted-foreground" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Button variant="outline" size="sm" onClick={onClick} disabled={disabled} className="w-full justify-start">
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Button>
    )
  }

  const emailDisabled = !hasEmail || !emailEnabled
  const smsDisabled = !hasPhone || !smsEnabled
  const phoneDisabled = !hasPhone

  return (
    <div className={`space-y-2 ${className}`}>
      <ActionButton
        type="email"
        icon={Mail}
        label="Send Email"
        onClick={() => setShowEmailDialog(true)}
        disabled={emailDisabled}
      />
      
      <ActionButton
        type="sms"
        icon={MessageSquare}
        label="Send SMS"
        onClick={() => setShowSmsDialog(true)}
        disabled={smsDisabled}
      />
      
      <ActionButton
        type="phone"
        icon={Phone}
        label="Call Contact"
        onClick={makeCall}
        disabled={phoneDisabled}
      />

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to {contact.firstName} {contact.lastName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Email Template (Optional)</Label>
              <Select value={emailTemplate} onValueChange={handleEmailTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Template</SelectItem>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emailTo">To</Label>
              <Input id="emailTo" value={contact.email} disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emailSubject">Subject</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emailBody">Message</Label>
              <Textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Enter your message"
                rows={6}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button onClick={sendEmail} disabled={!emailSubject.trim() || !emailBody.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS to {contact.firstName} {contact.lastName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>SMS Template (Optional)</Label>
              <Select value={smsTemplate} onValueChange={handleSmsTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Template</SelectItem>
                  {smsTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="smsTo">To</Label>
              <Input id="smsTo" value={contact.phone} disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="smsMessage">Message</Label>
              <Textarea
                id="smsMessage"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Enter your SMS message"
                rows={4}
                maxLength={160}
              />
              <div className="text-xs text-muted-foreground text-right">
                {smsMessage.length}/160 characters
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSmsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={sendSms} disabled={!smsMessage.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}