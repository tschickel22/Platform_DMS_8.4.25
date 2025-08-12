import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  ExternalLink
} from 'lucide-react'

interface ShareListingModalProps {
  // ShadCN pattern
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // Legacy compatibility
  isOpen?: boolean
  onClose?: () => void
  // Data
  listing: any
  company?: { id?: string; name?: string; slug?: string }
}

export function ShareListingModal(props: ShareListingModalProps) {
  // Normalize props for ShadCN pattern
  const open = props.open ?? props.isOpen ?? false
  const onOpenChange = props.onOpenChange ?? ((o: boolean) => { if (!o) props.onClose?.() })
  
  const { toast } = useToast()
  const [customMessage, setCustomMessage] = useState('')
  
  if (!props.listing) return null
  
  // Company info with defaults
  const companySlug = props.company?.slug ?? 'demo'
  const companyName = props.company?.name ?? 'Demo RV Dealership'
  
  // Generate shareable link
  const shareableLink = `${window.location.origin}/${companySlug}/listing/${props.listing.id}`
  
  // Format listing info
  const listingTitle = `${props.listing.year} ${props.listing.make} ${props.listing.model}`
  const price = props.listing.salePrice || props.listing.rentPrice || 0
  const formattedPrice = Number.isFinite(price) ? price.toLocaleString() : '0'
  const priceLabel = props.listing.offerType === 'for_rent' ? '/month' : ''
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Link copied!",
        description: "The listing link has been copied to your clipboard.",
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
    const subject = encodeURIComponent(`Check out this ${listingTitle}`)
    const body = encodeURIComponent(
      `${customMessage ? customMessage + '\n\n' : ''}I thought you might be interested in this listing:\n\n${listingTitle}\n$${formattedPrice}${priceLabel}\n\n${shareableLink}\n\nShared from ${companyName}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }
  
  const handleSMSShare = () => {
    const message = encodeURIComponent(
      `${customMessage ? customMessage + ' ' : ''}Check out this ${listingTitle} - $${formattedPrice}${priceLabel}: ${shareableLink}`
    )
    window.open(`sms:?body=${message}`)
  }
  
  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Check out this ${listingTitle} - $${formattedPrice}${priceLabel}`)
    const url = encodeURIComponent(shareableLink)
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Listing
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Listing Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              {props.listing.media?.primaryPhoto && (
                <img 
                  src={props.listing.media.primaryPhoto} 
                  alt={listingTitle}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{listingTitle}</h4>
                <p className="text-lg font-bold text-primary">
                  ${formattedPrice}{priceLabel}
                </p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {props.listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {props.listing.condition || 'Used'}
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
              >
                <Facebook className="h-4 w-4 mr-1" />
                Facebook
              </Button>
              <Button 
                onClick={() => handleSocialShare('twitter')} 
                variant="outline" 
                size="sm"
              >
                <Twitter className="h-4 w-4 mr-1" />
                Twitter
              </Button>
              <Button 
                onClick={() => handleSocialShare('linkedin')} 
                variant="outline" 
                size="sm"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn
              </Button>
            </div>
          </div>
          
          {/* Analytics Preview */}
          <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
            <div className="flex items-center gap-1 mb-1">
              <ExternalLink className="h-3 w-3" />
              Link Analytics
            </div>
            <p>Track clicks, views, and engagement when you share this link.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}