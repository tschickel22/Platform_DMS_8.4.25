import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  listing: {
    id: string
    title: string
    address: string
    rent: number
    images: string[]
  }
  baseUrl?: string
}

export function ShareOptionsModal({ isOpen, onClose, listing, baseUrl }: ShareOptionsModalProps) {
  const { toast } = useToast()
  
  // Use provided baseUrl or fallback to current origin
  const publicBaseUrl = baseUrl || window.location.origin
  const listingUrl = `${publicBaseUrl}/listings/detail/${listing.id}`
  
  const shareText = `Check out this property: ${listing.title} - $${listing.rent.toLocaleString()}/month at ${listing.address}`
  const encodedShareText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent(listingUrl)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl)
      toast({
        title: "Link copied!",
        description: "The listing link has been copied to your clipboard.",
      })
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = listingUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      toast({
        title: "Link copied!",
        description: "The listing link has been copied to your clipboard.",
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Property Listing: ${listing.title}`)
    const body = encodeURIComponent(`${shareText}\n\nView listing: ${listingUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const handleSMSShare = () => {
    const message = encodeURIComponent(`${shareText} ${listingUrl}`)
    window.open(`sms:?body=${message}`, '_blank')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Property Listing: ${listing.title}`,
          text: shareText,
          url: listingUrl,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Listing
          </DialogTitle>
          <DialogDescription>
            Share "{listing.title}" with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <Label htmlFor="listing-url">Listing URL</Label>
            <div className="flex gap-2">
              <Input
                id="listing-url"
                value={listingUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyLink} size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quick Share Options */}
          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleEmailShare}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={handleSMSShare}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                SMS
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social Media Options */}
          <div className="space-y-3">
            <Label>Social Media</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={handleFacebookShare}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={handleLinkedInShare}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Native Share (if available) */}
          {navigator.share && (
            <>
              <Separator />
              <Button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                More sharing options
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}