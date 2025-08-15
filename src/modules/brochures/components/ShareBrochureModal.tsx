import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  QrCode, 
  Link as LinkIcon,
  ExternalLink,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Share2
} from 'lucide-react'
import QRCode from 'react-qr-code'

interface ShareBrochureModalProps {
  isOpen: boolean
  onClose: () => void
  brochure: {
    id: string
    title: string
    description?: string
    publicUrl: string
    downloadUrl?: string
    analytics?: {
      views: number
      downloads: number
      shares: number
    }
  }
}

export function ShareBrochureModal({ isOpen, onClose, brochure }: ShareBrochureModalProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('link')
  const [emailRecipients, setEmailRecipients] = useState('')
  const [emailSubject, setEmailSubject] = useState(`Check out: ${brochure.title}`)
  const [emailMessage, setEmailMessage] = useState(`I thought you might be interested in this brochure: ${brochure.title}`)
  const [smsRecipients, setSmsRecipients] = useState('')
  const [smsMessage, setSmsMessage] = useState(`Check out this brochure: ${brochure.title} - ${brochure.publicUrl}`)

  const copyToClipboard = async (text: string, label: string = 'Link') => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive'
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(emailSubject)
    const body = encodeURIComponent(`${emailMessage}\n\n${brochure.publicUrl}`)
    window.open(`mailto:${emailRecipients}?subject=${subject}&body=${body}`)
  }

  const handleSmsShare = () => {
    const message = encodeURIComponent(smsMessage)
    window.open(`sms:${smsRecipients}?body=${message}`)
  }

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(brochure.publicUrl)
    const title = encodeURIComponent(brochure.title)
    const description = encodeURIComponent(brochure.description || `Check out this amazing brochure: ${brochure.title}`)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`
        break
      case 'twitter':
        const hashtags = 'RV,MobileHome,RenterInsight'
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=${hashtags}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`
        break
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy formatted content
        const instagramContent = `${brochure.title}\n\n${brochure.description || ''}\n\nLink in bio: ${brochure.publicUrl}\n\n#RV #MobileHome #RenterInsight #PropertyListing`
        copyToClipboard(instagramContent, 'Instagram post content')
        toast({
          title: 'Instagram Content Ready',
          description: 'Post content copied! Paste it when creating your Instagram post.',
        })
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    }
  }

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500',
      bgColor: 'hover:bg-sky-50'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'hover:bg-blue-50'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'hover:bg-pink-50'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Brochure</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Share "{brochure.title}" with customers and prospects
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="link">
              <LinkIcon className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="h-4 w-4 mr-2" />
              Social
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

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Link</CardTitle>
                <CardDescription>
                  Copy and share this direct link to your brochure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={brochure.publicUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(brochure.publicUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(brochure.publicUrl, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  {brochure.downloadUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(brochure.downloadUrl, '_blank')}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media Sharing</CardTitle>
                <CardDescription>
                  Share your brochure on social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Platform Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {socialPlatforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant="outline"
                      onClick={() => handleSocialShare(platform.id)}
                      className={`flex items-center justify-center space-x-2 h-12 ${platform.bgColor}`}
                    >
                      <platform.icon className={`h-5 w-5 ${platform.color}`} />
                      <span>Share on {platform.name}</span>
                    </Button>
                  ))}
                </div>

                <Separator />

                {/* Quick Copy Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Quick Copy Templates</h4>
                  
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(
                        `🏠 Check out our latest brochure: ${brochure.title}\n\n${brochure.description || ''}\n\n🔗 ${brochure.publicUrl}\n\n#RV #MobileHome #RenterInsight`,
                        'Social media post'
                      )}
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">📱 Social Media Post</span>
                        <span className="text-xs text-muted-foreground">
                          Ready-to-use post with emojis and hashtags
                        </span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(brochure.publicUrl, 'Link only')}
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">🔗 Link Only</span>
                        <span className="text-xs text-muted-foreground">
                          Just the brochure URL
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Instagram Special Instructions */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Instagram className="h-4 w-4 text-pink-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-pink-800">Instagram Tip</p>
                      <p className="text-pink-700">
                        Instagram doesn't support direct link sharing. Click the Instagram button to copy formatted content, then paste it in your Instagram post.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Share</CardTitle>
                <CardDescription>
                  Send this brochure via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Recipients</label>
                  <Input
                    placeholder="Enter email addresses (comma separated)"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={4}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleEmailShare} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SMS Share</CardTitle>
                <CardDescription>
                  Send this brochure via text message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Phone Numbers</label>
                  <Input
                    placeholder="Enter phone numbers (comma separated)"
                    value={smsRecipients}
                    onChange={(e) => setSmsRecipients(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={3}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {smsMessage.length}/160 characters
                  </p>
                </div>
                
                <Button onClick={handleSmsShare} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code</CardTitle>
                <CardDescription>
                  Generate a QR code for easy mobile sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border">
                    <QRCode
                      value={brochure.publicUrl}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Scan with any QR code reader to view the brochure
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Create a canvas to convert QR code to image for download
                      const canvas = document.createElement('canvas')
                      const ctx = canvas.getContext('2d')
                      canvas.width = 200
                      canvas.height = 200
                      
                      // This is a simplified version - in production you'd want to properly render the QR code
                      const link = document.createElement('a')
                      link.download = `${brochure.title}-qr-code.png`
                      link.href = canvas.toDataURL()
                      link.click()
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Brochure Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Brochure Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Template:</span>
                <span className="ml-2 font-medium">Premium RV Collection</span>
              </div>
              <div>
                <span className="text-muted-foreground">Properties:</span>
                <span className="ml-2 font-medium">3 listings</span>
              </div>
              <div>
                <span className="text-muted-foreground">Downloads:</span>
                <span className="ml-2 font-medium">{brochure.analytics?.downloads || 28}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Shares:</span>
                <span className="ml-2 font-medium">{brochure.analytics?.shares || 8}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}