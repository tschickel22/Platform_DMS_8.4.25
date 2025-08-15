import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  QrCode,
  Share2,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react'
import QRCode from 'react-qr-code'

interface ShareBrochureModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isOpen?: boolean
  onClose?: () => void
  brochure: any
  company?: { id?: string; name?: string; slug?: string }
}

export function ShareBrochureModal(props: ShareBrochureModalProps) {
  const open = props.open ?? props.isOpen ?? false
  const onOpenChange = props.onOpenChange ?? ((o: boolean) => { if (!o) props.onClose?.() })
  
  const { toast } = useToast()
  const [customMessage, setCustomMessage] = useState('')
  const [showQR, setShowQR] = useState(false)
  
  if (!props.brochure) return null
  
  // Company info with defaults
  const companySlug = props.company?.slug ?? 'demo'
  const companyName = props.company?.name ?? 'Demo RV Dealership'
  
  // Generate shareable link
  const shareableLink = `${window.location.origin}/b/${props.brochure.publicId}`
  
  // Extract preview content from brochure
  const getPreviewImage = () => {
    // Try to find hero block image first
    const heroBlock = props.brochure.blocks?.find((block: any) => block.type === 'hero')
    if (heroBlock?.data?.image) {
      return heroBlock.data.image
    }
    
    // Try to find first gallery image
    const galleryBlock = props.brochure.blocks?.find((block: any) => block.type === 'gallery')
    if (galleryBlock?.data?.images?.[0]) {
      return galleryBlock.data.images[0]
    }
    
    // Fallback to generated preview
    return `${window.location.origin}/api/brochure-preview/${props.brochure.publicId}.jpg`
  }
  
  const getPreviewDescription = () => {
    // Try brochure description first
    if (props.brochure.description) {
      return props.brochure.description.length > 200 
        ? props.brochure.description.substring(0, 200) + '...'
        : props.brochure.description
    }
    
    // Try hero block description
    const heroBlock = props.brochure.blocks?.find((block: any) => block.type === 'hero')
    if (heroBlock?.data?.description) {
      const desc = heroBlock.data.description
      return desc.length > 200 ? desc.substring(0, 200) + '...' : desc
    }
    
    // Try first text or features block
    const textBlock = props.brochure.blocks?.find((block: any) => 
      ['text', 'features'].includes(block.type) && block.data?.content
    )
    if (textBlock?.data?.content) {
      const content = typeof textBlock.data.content === 'string' 
        ? textBlock.data.content 
        : JSON.stringify(textBlock.data.content)
      return content.length > 200 ? content.substring(0, 200) + '...' : content
    }
    
    // Default description
    return `Professional brochure from ${companyName}. View our latest inventory and offerings.`
  }
  
  const previewImage = getPreviewImage()
  const previewDescription = getPreviewDescription()
  const brochureTitle = props.brochure.title || 'Property Brochure'
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Link copied!",
        description: "The brochure link has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      })
    }
  }
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${brochureTitle} - ${companyName}`)
    const body = encodeURIComponent(
      `${customMessage ? customMessage + '\n\n' : ''}I wanted to share this brochure with you:\n\n${brochureTitle}\n\n${previewDescription}\n\nView online: ${shareableLink}\n\nShared from ${companyName}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }
  
  const handleSMSShare = () => {
    const message = encodeURIComponent(
      `${customMessage ? customMessage + ' ' : ''}Check out this brochure: ${brochureTitle} - ${shareableLink}`
    )
    window.open(`sms:?body=${message}`)
  }
  
  const handleSocialShare = (platform: string) => {
    const title = encodeURIComponent(`${brochureTitle} - ${companyName}`)
    const description = encodeURIComponent(previewDescription)
    const url = encodeURIComponent(shareableLink)
    const image = encodeURIComponent(previewImage)
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${description}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=${encodeURIComponent(companyName)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}&source=${encodeURIComponent(companyName)}`
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Brochure
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Brochure Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt={brochureTitle}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{brochureTitle}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {previewDescription}
                </p>
                <div className="flex gap-1 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {props.brochure.templateName || 'Custom'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {props.brochure.blocks?.length || 0} sections
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input 
                value={shareableLink} 
                readOnly 
                className="flex-1"
              />
              <Button onClick={handleCopyLink} size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Message (Optional)</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="w-full p-2 border rounded-md resize-none h-20 text-sm"
            />
          </div>
          
          <Separator />
          
          {/* Quick Share Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Quick Share</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleEmailShare} variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button onClick={handleSMSShare} variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Social Media</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => handleSocialShare('facebook')} 
                variant="outline" 
                size="sm"
                title="Share on Facebook with preview"
              >
                <Facebook className="h-4 w-4 mr-1" />
                Facebook
              </Button>
              <Button 
                onClick={() => handleSocialShare('twitter')} 
                variant="outline" 
                size="sm"
                title="Share on Twitter with preview"
              >
                <Twitter className="h-4 w-4 mr-1" />
                Twitter
              </Button>
              <Button 
                onClick={() => handleSocialShare('linkedin')} 
                variant="outline" 
                size="sm"
                title="Share on LinkedIn with preview"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn
              </Button>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">QR Code</h4>
              <Button 
                onClick={() => setShowQR(!showQR)} 
                variant="ghost" 
                size="sm"
              >
                <QrCode className="h-4 w-4 mr-1" />
                {showQR ? 'Hide' : 'Show'} QR
              </Button>
            </div>
            
            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <QRCode value={shareableLink} size={128} />
              </div>
            )}
          </div>
          
          {/* Rich Social Previews Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Rich Social Previews</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Share with preview image and description from your brochure content.</p>
                <div className="space-y-1">
                  <p><strong>Title:</strong> {brochureTitle} ({brochureTitle.length} chars)</p>
                  <p><strong>Description:</strong> {previewDescription.substring(0, 50)}... ({previewDescription.length} chars)</p>
                  <p><strong>Preview Image:</strong> {previewImage.includes('api/brochure-preview') ? 'Generated preview' : 'From brochure content'}</p>
                </div>
                <p className="text-muted-foreground">Social platforms will show your brochure image, title, and description as a rich preview card.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}