// src/modules/property-listings/components/ShareAllListingsModal.tsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Copy,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Check,
  ExternalLink,
  Home,
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'

interface ShareAllListingsModalProps {
  isOpen: boolean
  onClose: () => void
  listings: Array<{ status: string; rent: number; title: string; images?: string[] }>
}

export function ShareAllListingsModal({
  isOpen,
  onClose,
  listings,
}: ShareAllListingsModalProps) {
  const { tenant } = useTenant()
  const [copied, setCopied] = useState(false)

  // Build URLs
  const baseUrl = window.location.origin
  const listingsUrl = `${baseUrl}/public/listings`

  // Compute preview stats
  const activeListings = listings.filter((l) => l.status === 'active')
  const totalValue = activeListings.reduce((sum, l) => sum + l.rent, 0)
  const avgRent =
    activeListings.length > 0
      ? Math.round(totalValue / activeListings.length)
      : 0

  // Preview data
  const previewData = {
    title: `${tenant?.name || 'Properties'} – ${activeListings.length} Available`,
    description: `Browse ${activeListings.length} listings, average rent $${avgRent}/mo.`,
    image:
      activeListings[0]?.images?.[0] ||
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
  }

  // Handlers
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(listingsUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(previewData.title)
    const body = encodeURIComponent(
      `${previewData.description}\n\nView all: ${listingsUrl}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const handleSMSShare = () => {
    const body = encodeURIComponent(`${previewData.title}\n${listingsUrl}`)
    window.open(`sms:?&body=${body}`, '_blank')
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = encodeURIComponent(listingsUrl)
    const text = encodeURIComponent(`${previewData.title}: ${previewData.description}`)
    const hashtags = encodeURIComponent('RealEstate,Rental')
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Share All Listings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Social Preview
            </h3>
            <Card className="border-2">
              <CardContent className="p-4 flex gap-4">
                <img
                  src={previewData.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                    {previewData.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {previewData.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Home className="h-3 w-3" />
                    <span>{activeListings.length} properties</span>
                    <span>• Avg. ${avgRent}/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Shareable Link
            </h3>
            <div className="flex gap-2">
              <Input value={listingsUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Share */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Quick Share
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleEmailShare} variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button onClick={handleSMSShare} variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                SMS
              </Button>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Social Platforms
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleSocialShare('facebook')}
                variant="outline"
              >
                <Facebook className="h-4 w-4 mr-1" />
                Facebook
              </Button>
              <Button
                onClick={() => handleSocialShare('twitter')}
                variant="outline"
              >
                <Twitter className="h-4 w-4 mr-1" />
                Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare('linkedin')}
                variant="outline"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              What’s Shared
            </h3>
            <Card className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Listings:</span>{' '}
                  <span className="font-medium">{listings.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active:</span>{' '}
                  <span className="font-medium">{activeListings.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg. Rent:</span>{' '}
                  <span className="font-medium">${avgRent}/mo</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Value:</span>{' '}
                  <span className="font-medium">${totalValue}</span>
                </div>
              </div>
              {activeListings.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-2">
                    Featured:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeListings.slice(0, 3).map((l, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {l.title}
                      </Badge>
                    ))}
                    {activeListings.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{activeListings.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareAllListingsModal
