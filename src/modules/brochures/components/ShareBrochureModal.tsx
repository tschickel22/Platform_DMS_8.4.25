import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Link2, 
  QrCode, 
  Download,
  Share2,
  Eye,
  BarChart3
} from 'lucide-react'
import { GeneratedBrochure } from '../types'
import QRCode from 'react-qr-code'
import { useToast } from '@/hooks/use-toast'

interface ShareBrochureModalProps {
  brochure: GeneratedBrochure
  onClose: () => void
}

export function ShareBrochureModal({ brochure, onClose }: ShareBrochureModalProps) {
  const { toast } = useToast()
  const [emailRecipients, setEmailRecipients] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [smsRecipients, setSmsRecipients] = useState('')
  const [smsMessage, setSmsMessage] = useState('')

  const shareUrl = `${window.location.origin}/b/${brochure.publicId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link Copied',
        description: 'Share link has been copied to clipboard'
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleSendEmail = async () => {
    // In a real app, this would call an API to send emails
    console.log('Sending email to:', emailRecipients)
    console.log('Message:', emailMessage)
    console.log('Brochure URL:', shareUrl)
    
    toast({
      title: 'Email Sent',
      description: `Brochure shared via email to ${emailRecipients.split(',').length} recipient(s)`
    })
  }

  const handleSendSMS = async () => {
    // In a real app, this would call an API to send SMS
    console.log('Sending SMS to:', smsRecipients)
    console.log('Message:', smsMessage)
    console.log('Brochure URL:', shareUrl)
    
    toast({
      title: 'SMS Sent',
      description: `Brochure shared via SMS to ${smsRecipients.split(',').length} recipient(s)`
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Brochure</DialogTitle>
          <DialogDescription>
            Share "{brochure.title}" with customers and prospects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Brochure Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-12 bg-primary/10 rounded border flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{brochure.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {brochure.listingCount} listing{brochure.listingCount !== 1 ? 's' : ''} • 
                    Template: {brochure.templateName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {brochure.listingType === 'both' ? 'RV & MH' : brochure.listingType.toUpperCase()}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{brochure.analytics?.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <Tabs defaultValue="link" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>

            {/* Link Sharing */}
            <TabsContent value="link" className="space-y-4">
              <div>
                <Label>Share Link</Label>
                <div className="flex space-x-2 mt-1">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Anyone with this link can view the brochure
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => window.open(shareUrl, '_blank')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={() => window.open(brochure.pdfUrl, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </TabsContent>

            {/* Email Sharing */}
            <TabsContent value="email" className="space-y-4">
              <div>
                <Label htmlFor="email-recipients">Recipients</Label>
                <Input
                  id="email-recipients"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="customer@email.com, prospect@email.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple emails with commas
                </p>
              </div>

              <div>
                <Label htmlFor="email-message">Message (Optional)</Label>
                <Textarea
                  id="email-message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleSendEmail}
                disabled={!emailRecipients.trim()}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </TabsContent>

            {/* SMS Sharing */}
            <TabsContent value="sms" className="space-y-4">
              <div>
                <Label htmlFor="sms-recipients">Phone Numbers</Label>
                <Input
                  id="sms-recipients"
                  value={smsRecipients}
                  onChange={(e) => setSmsRecipients(e.target.value)}
                  placeholder="+1234567890, +0987654321"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple numbers with commas
                </p>
              </div>

              <div>
                <Label htmlFor="sms-message">Message</Label>
                <Textarea
                  id="sms-message"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder={`Check out our latest brochure: ${shareUrl}`}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {smsMessage.length}/160 characters
                </p>
              </div>

              <Button 
                onClick={handleSendSMS}
                disabled={!smsRecipients.trim()}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
            </TabsContent>

            {/* QR Code */}
            <TabsContent value="qr" className="space-y-4">
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-lg border">
                  <QRCode value={shareUrl} size={200} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Scan to view brochure on mobile device
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy QR
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Analytics Preview */}
          {brochure.analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{brochure.analytics.views}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{brochure.analytics.downloads}</div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{brochure.analytics.shares}</div>
                    <div className="text-xs text-muted-foreground">Shares</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}