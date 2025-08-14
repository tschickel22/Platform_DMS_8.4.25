import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  MessageSquare, 
  Link2, 
  QrCode, 
  Copy, 
  ExternalLink,
  Send,
  CheckCircle
} from 'lucide-react'
import { GeneratedBrochure } from '../types'
import { useBrochureStore } from '../store/useBrochureStore'
import { useToast } from '@/hooks/use-toast'
import QRCode from 'react-qr-code'

interface ShareBrochureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brochure: GeneratedBrochure | null
  onClose: () => void
}

export function ShareBrochureModal({ 
  open, 
  onOpenChange, 
  brochure, 
  onClose 
}: ShareBrochureModalProps) {
  const { shareBrochure } = useBrochureStore()
  const { toast } = useToast()
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  })
  const [smsData, setSmsData] = useState({
    to: '',
    message: ''
  })
  const [isSending, setIsSending] = useState(false)

  if (!brochure) return null

  const shareUrl = brochure.shareUrl
  const qrCodeValue = shareUrl

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link Copied',
        description: 'Share link has been copied to clipboard.'
      })
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive'
      })
    }
  }

  const handleEmailShare = async () => {
    if (!emailData.to || !emailData.subject) return

    setIsSending(true)
    try {
      await shareBrochure(brochure.id, 'email', emailData)
      toast({
        title: 'Email Sent',
        description: `Brochure shared via email to ${emailData.to}.`
      })
      setEmailData({ to: '', subject: '', message: '' })
    } catch (error) {
      toast({
        title: 'Send Failed',
        description: 'Failed to send email.',
        variant: 'destructive'
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSmsShare = async () => {
    if (!smsData.to || !smsData.message) return

    setIsSending(true)
    try {
      await shareBrochure(brochure.id, 'sms', smsData)
      toast({
        title: 'SMS Sent',
        description: `Brochure shared via SMS to ${smsData.to}.`
      })
      setSmsData({ to: '', message: '' })
    } catch (error) {
      toast({
        title: 'Send Failed',
        description: 'Failed to send SMS.',
        variant: 'destructive'
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Brochure</DialogTitle>
          <DialogDescription>
            Share "{brochure.name}" with customers and prospects
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">
              <Link2 className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>

          {/* Link Sharing */}
          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label>Share Link</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input value={shareUrl} readOnly />
                      <Button onClick={handleCopyLink}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                      <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Preview
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Sharing */}
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emailTo">Recipient Email</Label>
                    <Input
                      id="emailTo"
                      type="email"
                      value={emailData.to}
                      onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailSubject">Subject</Label>
                    <Input
                      id="emailSubject"
                      value={emailData.subject}
                      onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder={`Check out our ${brochure.name}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailMessage">Message (Optional)</Label>
                    <Textarea
                      id="emailMessage"
                      value={emailData.message}
                      onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Add a personal message..."
                      rows={4}
                    />
                  </div>
                  <Button 
                    onClick={handleEmailShare}
                    disabled={!emailData.to || !emailData.subject || isSending}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Sharing */}
          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smsTo">Phone Number</Label>
                    <Input
                      id="smsTo"
                      type="tel"
                      value={smsData.to}
                      onChange={(e) => setSmsData(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smsMessage">Message</Label>
                    <Textarea
                      id="smsMessage"
                      value={smsData.message}
                      onChange={(e) => setSmsData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={`Check out our ${brochure.name}: ${shareUrl}`}
                      rows={4}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Character count: {smsData.message.length}/160
                  </div>
                  <Button 
                    onClick={handleSmsShare}
                    disabled={!smsData.to || !smsData.message || isSending}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send SMS'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code */}
          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-lg border">
                      <QRCode value={qrCodeValue} size={200} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan this QR code to view the brochure on mobile devices
                    </p>
                    <Button onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}