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
  ExternalLink,
  Image
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareListingModalProps {
  isOpen: boolean
  onClose: () => void
  listingUrl: string
  listing: {
    id: string
    title: string
    rent: number
    address: string
    bedrooms: number
    bathrooms: number
    squareFootage: number
    description: string
    images: string[]
    amenities: string[]
  }
}

export default function ShareListingModal({ 
  isOpen, 
  onClose, 
  listingUrl, 
  title = "Share Listing" 
}: ShareListingModalProps) {
  const [copied, setCopied] = useState(false)
  
  // Guard clause to prevent errors if listing is undefined
  if (!listing) {
    return null
  }
  const { toast } = useToast()
  const [customMessage, setCustomMessage] = useState('')

  // Generate rich sharing content
  const shareUrl = `${window.location.origin}/public-listings/${listing.id}`
  const mainImage = listing.images && listing.images.length > 0 ? listing.images[0] : null
  const features = listing.amenities?.slice(0, 3).join(', ') || 'Great amenities'
  const propertyDetails = `${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.squareFootage} sq ft`
  
  const defaultMessage = `🏠 ${listing.title}
💰 $${listing.rent.toLocaleString()}/month
📍 ${listing.address}
🛏️ ${propertyDetails}
✨ Features: ${features}

View details: ${shareUrl}`

  // Generate meta tags for social preview
  const generateMetaTags = () => {
    return {
      title: `${listing.title} - $${listing.rent.toLocaleString()}/month`,
      description: `${propertyDetails} • ${listing.description?.substring(0, 150)}...`,
      image: mainImage,
      url: shareUrl
    }
  }
  
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
    const subject = `🏠 Property Listing: ${listing.title}`
    const body = `Hi there!

I wanted to share this amazing property with you:

${defaultMessage}

Let me know what you think!

Best regards`
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
  }

  const handleSMSShare = () => {
    const smsMessage = `🏠 ${listing.title} - $${listing.rent.toLocaleString()}/month at ${listing.address}. ${propertyDetails}. View: ${shareUrl}`
    const message = customMessage || smsMessage
    const url = `sms:?body=${encodeURIComponent(message)}`
    window.location.href = url
  }

  const handleFacebookShare = () => {
    const metaTags = generateMetaTags()
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(customMessage || defaultMessage)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const twitterMessage = customMessage || `🏠 ${listing.title} - $${listing.rent.toLocaleString()}/month\n📍 ${listing.address}\n${propertyDetails}\n${shareUrl}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const metaTags = generateMetaTags()
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(metaTags.title)}&summary=${encodeURIComponent(metaTags.description)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Share Listing
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Listing Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex gap-4">
              {mainImage && (
                <div className="flex-shrink-0">
                  <img 
                    src={mainImage} 
                    alt={listing.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                <p className="text-2xl font-bold text-blue-600">${listing.rent.toLocaleString()}/month</p>
                <p className="text-sm text-gray-600 truncate">{listing.address}</p>
                <p className="text-sm text-gray-500">{propertyDetails}</p>
                {features && (
                  <p className="text-xs text-gray-500 mt-1">✨ {features}</p>
                )}
              </div>
            </div>
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Share URL</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => copyToClipboard(shareUrl)}
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

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <textarea
              id="custom-message"
              className="w-full p-3 border rounded-md resize-none"
              rows={4}
              placeholder={defaultMessage}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Preview shows how your listing will appear when shared
            </p>
          </div>

          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={shareViaEmail}
              variant="outline"
              className="justify-start gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              onClick={shareViaSMS}
              variant="outline"
              className="justify-start gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
            <Button
              onClick={shareOnFacebook}
              variant="outline"
              className="justify-start gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            <Button
              onClick={shareOnTwitter}
              variant="outline"
              className="justify-start gap-2"
            >
              <Twitter className="h-4 w-4 text-sky-500" />
              Twitter
            </Button>
            <Button
              onClick={shareOnLinkedIn}
              variant="outline"
              className="justify-start gap-2 col-span-2"
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>
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