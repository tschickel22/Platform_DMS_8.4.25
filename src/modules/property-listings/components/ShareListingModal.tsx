import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface ShareListingModalProps {
  isOpen: boolean
  onClose: () => void
  listing: any // The specific listing to share
  companyId?: string
}

export function ShareListingModal({ isOpen, onClose, listing, companyId = 'demo-company' }: ShareListingModalProps) {
  const [shareableLink, setShareableLink] = useState('')
  const [socialPreviewUrl, setSocialPreviewUrl] = useState('')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  // Generate shareable link when modal opens
  useEffect(() => {
    if (isOpen && listing) {
      generateShareableLink()
      generateSocialPreview()
    }
  }, [isOpen, listing])

  const generateShareableLink = async () => {
    setIsGeneratingLink(true)
    setError('')
    
    try {
      // Mock implementation - replace with actual API call
      // const response = await fetch('/.netlify/functions/share-link-crud', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     companyId,
      //     type: 'single',
      //     listingIds: [listing.id],
      //     title: `${listing.year} ${listing.make} ${listing.model}`,
      //     watermark: false
      //   })
      // })
      // const data = await response.json()
      // setShareableLink(data.urls.shortUrl)

      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock shareable link
      const mockToken = Math.random().toString(36).substring(2, 15)
      const mockLink = `https://listings.renterinsight.com/${companyId}/p/${mockToken}`
      setShareableLink(mockLink)
      
    } catch (err) {
      console.error('Error generating shareable link:', err)
      setError('Failed to generate shareable link. Please try again.')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const generateSocialPreview = async () => {
    setIsGeneratingPreview(true)
    
    try {
      // Mock implementation - replace with actual API call
      // const response = await fetch(`/.netlify/functions/og-image?companyId=${companyId}&listingId=${listing.id}`)
      // const data = await response.json()
      // setSocialPreviewUrl(data.url)

      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate mock preview URL
      const mockPreviewUrl = `https://via.placeholder.com/600x315/667eea/ffffff?text=${encodeURIComponent(`${listing.year} ${listing.make} ${listing.model}`)}`
      setSocialPreviewUrl(mockPreviewUrl)
      
    } catch (err) {
      console.error('Error generating social preview:', err)
      // Don't show error for preview generation failure
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out this ${listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}: ${listing.year} ${listing.make} ${listing.model}`)
    const body = encodeURIComponent(`I thought you might be interested in this ${listing.listingType === 'manufactured_home' ? 'manufactured home' : 'RV'}:

${listing.year} ${listing.make} ${listing.model}
${listing.salePrice ? `$${listing.salePrice.toLocaleString()}` : listing.rentPrice ? `$${listing.rentPrice.toLocaleString()}/month` : 'Price available upon request'}
${listing.location?.city ? `${listing.location.city}, ${listing.location.state}` : ''}

${listing.description ? listing.description.substring(0, 200) + '...' : ''}

View full details: ${shareableLink}`)
    
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleSMSShare = () => {
    const message = encodeURIComponent(`Check out this ${listing.year} ${listing.make} ${listing.model} - ${shareableLink}`)
    window.open(`sms:?body=${message}`)
  }

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(shareableLink)
    const title = encodeURIComponent(`${listing.year} ${listing.make} ${listing.model}`)
    const description = encodeURIComponent(listing.searchResultsText || `${listing.year} ${listing.make} ${listing.model}`)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const formatPrice = (listing: any) => {
    if (listing.salePrice) {
      return `$${listing.salePrice.toLocaleString()}`
    } else if (listing.rentPrice) {
      return `$${listing.rentPrice.toLocaleString()}/month`
    }
    return 'Price available upon request'
  }

  const getListingSpecs = (listing: any) => {
    const specs = []
    if (listing.bedrooms) specs.push(`${listing.bedrooms} bed`)
    if (listing.bathrooms) specs.push(`${listing.bathrooms} bath`)
    if (listing.sleeps) specs.push(`Sleeps ${listing.sleeps}`)
    if (listing.slides) specs.push(`${listing.slides} slides`)
    if (listing.dimensions?.length_ft) specs.push(`${listing.dimensions.length_ft}ft`)
    return specs.join(' • ')
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
          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Social Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Social Preview</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {isGeneratingPreview ? (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={socialPreviewUrl || listing.media?.primaryPhoto || 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image'}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {listing.year} {listing.make} {listing.model}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPrice(listing)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {getListingSpecs(listing)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shareable Link */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Shareable Link</h3>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                placeholder={isGeneratingLink ? "Generating link..." : "Shareable link will appear here"}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shareableLink)}
                disabled={!shareableLink || isGeneratingLink}
              >
                {isGeneratingLink ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Share */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Share</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleEmailShare}
                disabled={!shareableLink}
                className="justify-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={handleSMSShare}
                disabled={!shareableLink}
                className="justify-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Social Platforms</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialShare('facebook')}
                disabled={!shareableLink}
                className="justify-center"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('twitter')}
                disabled={!shareableLink}
                className="justify-center"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('linkedin')}
                disabled={!shareableLink}
                className="justify-center"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* What's Shared */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">What's Shared</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">
                    {listing.listingType === 'manufactured_home' ? 'Manufactured Home' : 'RV'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Year:</span>
                  <span className="ml-2 font-medium">{listing.year}</span>
                </div>
                <div>
                  <span className="text-gray-600">Make/Model:</span>
                  <span className="ml-2 font-medium">{listing.make} {listing.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-2 font-medium">{formatPrice(listing)}</span>
                </div>
                {listing.location?.city && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">
                      {listing.location.city}, {listing.location.state}
                    </span>
                  </div>
                )}
              </div>
              
              {listing.features && Object.keys(listing.features).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">Featured:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(listing.features)
                      .filter(([_, value]) => value === true)
                      .slice(0, 6)
                      .map(([feature, _]) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}