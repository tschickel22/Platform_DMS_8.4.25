import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  ExternalLink,
  X,
  Home,
  Bed,
  Bath,
  Square
} from 'lucide-react'

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
  images: string[]
  amenities: string[]
  petPolicy: string
  contactInfo: {
    phone: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface ShareOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  listing: Listing | null
  baseUrl?: string
}

export function ShareOptionsModal({ 
  isOpen, 
  onClose, 
  listing,
  baseUrl = window.location.origin 
}: ShareOptionsModalProps) {
  const { toast } = useToast()

  if (!listing) return null

  // Generate the public listing URL
  // Generate the public listing URL
  // —–> use the path-with-id pattern, not a query param
  const listingUrl = `${baseUrl}/public/listings/${listing.id}`
  
  // Create sharing content
  const shareTitle = `${listing.title} - $${listing.rent.toLocaleString()}/month`
  const shareDescription = `${listing.bedrooms} bed, ${listing.bathrooms} bath ${listing.propertyType} in ${listing.address.split(',')[0]}. ${listing.description.substring(0, 100)}...`

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(listingUrl)
        toast({
          title: "Link copied!",
          description: "The listing link has been copied to your clipboard.",
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = listingUrl
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          toast({
            title: "Link copied!",
            description: "The listing link has been copied to your clipboard.",
          })
        } catch (err) {
          console.error('Fallback copy failed:', err)
          toast({
            title: "Copy failed",
            description: "Please manually copy the link from the text field.",
            variant: "destructive"
          })
        }
        document.body.removeChild(textArea)
      }
    } catch (err) {
      console.error('Copy failed:', err)
      toast({
        title: "Copy failed",
        description: "Please manually copy the link from the text field.",
        variant: "destructive"
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`Check out this listing:\n\n${shareDescription}\n\nView details: ${listingUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const handleSMSShare = () => {
    const message = encodeURIComponent(`Check out this listing: ${shareTitle}\n\n${listingUrl}`)
    window.open(`sms:?body=${message}`, '_blank')
  }

  const handleFacebookShare = () => {
    const url = encodeURIComponent(listingUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n\n${shareDescription}`)
    const url = encodeURIComponent(listingUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(listingUrl)
    const title = encodeURIComponent(shareTitle)
    const summary = encodeURIComponent(shareDescription)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank', 'width=600,height=400')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: listingUrl,
        })
        toast({
          title: "Shared successfully",
          description: "The listing has been shared using your device's sharing options.",
        })
      } catch (error) {
        // Only fallback to copy if user didn't cancel
        if (error.name !== 'AbortError') {
          console.error('Native share failed:', error)
          handleCopyLink()
        }
      }
    } else {
      // Fallback to copy link if native share not supported
      handleCopyLink()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Share Listing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Preview */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Preview</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Home className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg mb-1 truncate">{listing.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    ${listing.rent.toLocaleString()}/month • {listing.address}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {listing.bedrooms} bed
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {listing.bathrooms} bath
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {listing.squareFootage.toLocaleString()} sq ft
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shareable Link */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Shareable Link</h3>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all">
                {listingUrl}
              </div>
              <Button onClick={handleCopyLink} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Quick Share */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Share</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleEmailShare} variant="outline" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button onClick={handleSMSShare} variant="outline" className="justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Platforms</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={handleFacebookShare} variant="outline" className="justify-start">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button onClick={handleTwitterShare} variant="outline" className="justify-start">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button onClick={handleLinkedInShare} variant="outline" className="justify-start">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <div>
              <Button onClick={handleNativeShare} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Share via Device
              </Button>
            </div>
          )}

          {/* What's Shared */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">What's Shared</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Property Type:</span>
                <div className="font-medium capitalize">{listing.propertyType}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div>
                  <Badge 
                    variant={
                      listing.status === 'active' ? 'default' :
                      listing.status === 'pending' ? 'outline' :
                      listing.status === 'rented' ? 'secondary' :
                      'destructive'
                    }
                    className="capitalize"
                  >
                    {listing.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Rent:</span>
                <div className="font-medium">${listing.rent.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Pet Policy:</span>
                <div className="font-medium">{listing.petPolicy}</div>
              </div>
            </div>
            
            {listing.amenities.length > 0 && (
              <div className="mt-4">
                <span className="text-muted-foreground text-sm">Featured Amenities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.amenities.slice(0, 6).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {listing.amenities.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{listing.amenities.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}