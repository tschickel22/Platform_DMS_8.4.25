import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  X,
  Share2,
  Building2,
  DollarSign,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareAllListingsModalProps {
  isOpen: boolean
  onClose: () => void
  companyId: string
  companyName: string
  totalListings: number
  activeListings: number
  averagePrice: number
  totalValue: number
  featuredListings: string[]
}

export function ShareAllListingsModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  totalListings,
  activeListings,
  averagePrice,
  totalValue,
  featuredListings
}: ShareAllListingsModalProps) {
  const [shareableLink, setShareableLink] = useState('')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [socialPreviewUrl, setSocialPreviewUrl] = useState('')
  const { toast } = useToast()

  // Generate shareable link when modal opens
  useEffect(() => {
    if (isOpen && !shareableLink) {
      generateShareableLink()
      generateSocialPreview()
    }
  }, [isOpen])

  const generateShareableLink = async () => {
    setIsGeneratingLink(true)
    try {
      // In production, this would call your Netlify function
      // For now, we'll generate a mock link
      const mockToken = `catalog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const mockLink = `${window.location.origin}/${companyId}/l/${mockToken}`
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShareableLink(mockLink)
      
      // In production, you would make this call:
      /*
      const response = await fetch('/.netlify/functions/share-link-crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          type: 'catalog',
          title: `${companyName} - ${activeListings} Available Properties`,
          listingIds: [], // Empty for catalog view
          filters: {},
          watermark: false
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setShareableLink(data.urls.shortUrl)
      }
      */
    } catch (error) {
      console.error('Error generating shareable link:', error)
      toast({
        title: "Error",
        description: "Failed to generate shareable link. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const generateSocialPreview = async () => {
    try {
      // In production, this would call your OG image function
      // For now, we'll use a placeholder
      const mockPreviewUrl = `https://via.placeholder.com/400x200/667eea/ffffff?text=${encodeURIComponent(companyName + ' - ' + activeListings + ' Properties')}`
      setSocialPreviewUrl(mockPreviewUrl)
      
      // In production, you would make this call:
      /*
      const response = await fetch(`/.netlify/functions/og-image?companyId=${companyId}&format=url`)
      if (response.ok) {
        const data = await response.json()
        setSocialPreviewUrl(data.url)
      }
      */
    } catch (error) {
      console.error('Error generating social preview:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Copied!",
        description: "Shareable link copied to clipboard."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive"
      })
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out ${companyName} - ${activeListings} Available Properties`)
    const body = encodeURIComponent(`Hi,\n\nI wanted to share our current property listings with you. We have ${activeListings} properties available with an average price of $${averagePrice.toLocaleString()}.\n\nView all listings: ${shareableLink}\n\nBest regards`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Check out ${companyName} - ${activeListings} available properties: ${shareableLink}`)
    window.open(`sms:?body=${message}`)
  }

  const shareOnFacebook = () => {
    const url = encodeURIComponent(shareableLink)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out ${activeListings} available properties from ${companyName}`)
    const url = encodeURIComponent(shareableLink)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(shareableLink)
    const title = encodeURIComponent(`${companyName} - ${activeListings} Available Properties`)
    const summary = encodeURIComponent(`Browse ${activeListings} listings, average rent $${averagePrice.toLocaleString()}/mo`)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share All Listings
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Preview */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Preview</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {socialPreviewUrl && (
                    <img 
                      src={socialPreviewUrl} 
                      alt="Social preview" 
                      className="w-20 h-16 object-cover rounded-md bg-muted"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {companyName} – {activeListings} Available
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse {activeListings} listings, average rent ${averagePrice.toLocaleString()}/mo.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {activeListings} properties
                      </span>
                      <span>Avg. ${averagePrice.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shareable Link */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Shareable Link</h3>
            <div className="flex gap-2">
              <Input 
                value={shareableLink} 
                readOnly 
                className="flex-1"
                placeholder={isGeneratingLink ? "Generating link..." : ""}
              />
              <Button 
                variant="outline" 
                onClick={copyToClipboard}
                disabled={!shareableLink || isGeneratingLink}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Quick Share */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Share</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={shareViaEmail}
                disabled={!shareableLink}
                className="justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button 
                variant="outline" 
                onClick={shareViaSMS}
                disabled={!shareableLink}
                className="justify-start"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Platforms</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={shareOnFacebook}
                disabled={!shareableLink}
                className="justify-start"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                onClick={shareOnTwitter}
                disabled={!shareableLink}
                className="justify-start"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                onClick={shareOnLinkedIn}
                disabled={!shareableLink}
                className="justify-start"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>

          <Separator />

          {/* What's Shared */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">What's Shared</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Listings: <strong>{totalListings}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Active: <strong>{activeListings}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg. Rent: <strong>${averagePrice.toLocaleString()}/mo</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Value: <strong>${totalValue.toLocaleString()}</strong></span>
              </div>
            </div>

            {featuredListings.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Featured:</p>
                <div className="flex flex-wrap gap-2">
                  {featuredListings.slice(0, 3).map((listing, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {listing}
                    </Badge>
                  ))}
                  {featuredListings.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{featuredListings.length - 3} more
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