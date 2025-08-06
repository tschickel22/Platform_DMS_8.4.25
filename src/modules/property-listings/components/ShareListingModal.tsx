import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  Check,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareListingModalProps {
  isOpen: boolean
  onClose: () => void
  listingUrl: string
  title?: string
}

export default function ShareListingModal({ 
  isOpen, 
  onClose, 
  listingUrl, 
  title = "Share Listing" 
}: ShareListingModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Create full URL (in a real app, this would use the actual domain)
  const fullUrl = `${window.location.origin}${listingUrl}`
  
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Check out this property listing")
    const body = encodeURIComponent(`I thought you might be interested in this property listing:\n\n${fullUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleSMSShare = () => {
    const message = encodeURIComponent(`Check out this property listing: ${fullUrl}`)
    window.open(`sms:?body=${message}`)
  }

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent("Check out this property listing!")
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* URL Display and Copy */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Share Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={fullUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Direct Sharing Options */}
          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleEmailShare}
                variant="outline"
                className="justify-start gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                onClick={handleSMSShare}
                variant="outline"
                className="justify-start gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                SMS
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <Label>Social Media</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleFacebookShare}
                variant="outline"
                size="sm"
                className="justify-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                onClick={handleTwitterShare}
                variant="outline"
                size="sm"
                className="justify-center gap-2"
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                Twitter
              </Button>
              <Button
                onClick={handleLinkedInShare}
                variant="outline"
                size="sm"
                className="justify-center gap-2"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}