import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Share2, Facebook, Twitter, Mail, MessageSquare, Copy, Check } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  status: string
  amenities: string[]
  petPolicy: string
  images: string[]
  contactInfo: {
    phone: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface ShareListingModalProps {
  isOpen: boolean
  onClose: () => void
  listing: Listing | null
}

export default function ShareListingModal({ isOpen, onClose, listing }: ShareListingModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)

  if (!listing) {
    return null
  }

  const listingUrl = `${window.location.origin}/listings/${listing.id}`
  
  const shareContent = {
    title: listing.title,
    description: listing.description,
    image: listing.images[0] || '',
    url: listingUrl
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const shareOnPlatform = (platform: string) => {
    let shareUrl = ''
    const encodedUrl = encodeURIComponent(listingUrl)
    const encodedTitle = encodeURIComponent(listing.title)
    const encodedDescription = encodeURIComponent(
      `${listing.title} - $${listing.rent}/month • ${listing.bedrooms}BR/${listing.bathrooms}BA • ${listing.squareFootage} sq ft`
    )

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedDescription}`
        break
      case 'email':
        const emailSubject = encodeURIComponent(`Check out this property: ${listing.title}`)
        const emailBody = encodeURIComponent(
          `I found this great property that might interest you:\n\n${listing.title}\n$${listing.rent}/month\n${listing.address}\n\n${listing.description}\n\nView details: ${listingUrl}`
        )
        shareUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`
        break
      case 'sms':
        const smsText = encodeURIComponent(
          `Check out this property: ${listing.title} - $${listing.rent}/month at ${listing.address}. ${listingUrl}`
        )
        shareUrl = `sms:?body=${smsText}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Listing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Listing Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                {listing.images[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                  <p className="text-lg font-bold text-primary">${listing.rent}/month</p>
                  <p className="text-xs text-muted-foreground truncate">{listing.address}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {listing.bedrooms}BR/{listing.bathrooms}BA
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {listing.squareFootage} sq ft
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Copy URL */}
          <div className="flex gap-2">
            <input
              type="text"
              value={listingUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              className="flex items-center gap-1"
            >
              {copiedUrl ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => shareOnPlatform('facebook')}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => shareOnPlatform('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => shareOnPlatform('email')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={() => shareOnPlatform('sms')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}