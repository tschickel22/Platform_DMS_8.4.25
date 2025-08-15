import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Mail, MessageSquare, QrCode, ExternalLink, Download, Share2, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  QrCode, 
  Download, 
  ExternalLink,
  Check,
  Share
} from 'lucide-react'
import { GeneratedBrochure } from '../types'
import QRCode from 'react-qr-code'

interface ShareBrochureModalProps {
  brochure: GeneratedBrochure
  onClose: () => void
}

export function ShareBrochureModal({ brochure, onClose }: ShareBrochureModalProps) {
  const [copied, setCopied] = useState(false)
  const [emailRecipient, setEmailRecipient] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [smsRecipient, setSmsRecipient] = useState('')
  const [smsMessage, setSmsMessage] = useState('')

  const brochureUrl = `${window.location.origin}/b/${brochure.publicId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(brochureUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const shareToSocialMedia = (platform: string) => {
    const url = encodeURIComponent(shareUrl)
    const text = encodeURIComponent(`Check out this brochure: ${brochure.title}`)
    const hashtags = encodeURIComponent('RV,ManufacturedHomes,PropertyListings')
    
    let shareLink = ''
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so copy to clipboard with instructions
        copyToClipboard(`${brochure.title}\n\n${shareUrl}\n\n#RV #ManufacturedHomes #PropertyListings`)
        toast({
          title: 'Content copied for Instagram',
          description: 'Paste this content in your Instagram post or story',
        })
        return
      default:
        return
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400')
    }
  }

  const handleEmailShare = () => {
    const subject = `Check out this brochure: ${brochure.title}`
    const body = `${emailMessage}\n\nView the brochure: ${brochureUrl}`
    const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  const handleSmsShare = () => {
    const message = `${smsMessage} ${brochureUrl}`
    const smsUrl = `sms:${smsRecipient}?body=${encodeURIComponent(message)}`
    window.open(smsUrl)
  }

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading brochure:', brochure.id)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Brochure</DialogTitle>
          <DialogDescription>
            Share "{brochure.title}" with customers and prospects
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Link</CardTitle>
                <CardDescription>
                  Copy and share this direct link to your brochure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input value={brochureUrl} readOnly className="flex-1" />
                  <Button onClick={handleCopyLink} variant="outline">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => window.open(brochureUrl, '_blank')} variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Sharing</CardTitle>
                <CardDescription>
                  Send this brochure via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-recipient">Recipient Email</Label>
                  <Input
                    id="email-recipient"
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="email-message">Message (Optional)</Label>
                  <Input
                    id="email-message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Hi! I thought you'd be interested in these properties..."
                  />
                </div>
                <Button 
                  onClick={handleEmailShare}
                  disabled={!emailRecipient}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SMS Sharing</CardTitle>
                <CardDescription>
                  Send this brochure via text message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-recipient">Phone Number</Label>
                  <Input
                    id="sms-recipient"
                    type="tel"
                    value={smsRecipient}
                    onChange={(e) => setSmsRecipient(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="sms-message">Message</Label>
                  <Input
                    id="sms-message"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Check out our latest properties:"
                  />
                </div>
                <Button 
                  onClick={handleSmsShare}
                  disabled={!smsRecipient}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media</CardTitle>
                <CardDescription>
                  Share this brochure on social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => shareToSocialMedia('facebook')}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <span>Facebook</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => shareToSocialMedia('twitter')}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <span>Twitter</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => shareToSocialMedia('linkedin')}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <span>LinkedIn</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => shareToSocialMedia('instagram')}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <span>Instagram</span>
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> For Instagram, the content will be copied to your clipboard. 
                    Paste it into your Instagram post or story along with the brochure image.
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Quick Share Options</h4>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`🏠 New listings available! Check out our latest brochure: ${brochure.title}\n\n${shareUrl}\n\n#RV #ManufacturedHomes #PropertyListings`)}
                      className="w-full justify-start"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy social media post template
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${shareUrl}`)}
                      className="w-full justify-start"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy link only
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code</CardTitle>
                <CardDescription>
                  Generate a QR code for easy mobile access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border">
                    <QRCode value={brochureUrl} size={200} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan this QR code to view the brochure on mobile devices
                  </p>
                  <Button onClick={() => window.print()} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Print QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Brochure Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Brochure Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Template:</span>
                <span className="ml-2">{brochure.templateName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Properties:</span>
                <span className="ml-2">{brochure.listingIds.length} listings</span>
              </div>
              <div>
                <span className="text-muted-foreground">Downloads:</span>
                <span className="ml-2">{brochure.downloadCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Shares:</span>
                <span className="ml-2">{brochure.shareCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}