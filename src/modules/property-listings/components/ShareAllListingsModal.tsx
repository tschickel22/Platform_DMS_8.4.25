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
  Share2,
  ExternalLink,
  BarChart3
} from 'lucide-react'

interface ShareAllListingsModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  listings: any[]
  summaryStats: { totalListings: number; activeListings: number; averagePrice: number }
  company?: { id?: string; name?: string; slug?: string }
}

export function ShareAllListingsModal(props: ShareAllListingsModalProps) {
  const { toast } = useToast()
  const [customMessage, setCustomMessage] = useState('')
  
  // Derive display fields internally
  const activeListings = props.summaryStats.activeListings ?? props.listings.filter(l => l?.status === 'active').length
  const averagePrice = Number.isFinite(props.summaryStats.averagePrice) ? props.summaryStats.averagePrice : 0
  const companyName = props.company?.name ?? 'Demo RV Dealership'
  const companySlug = props.company?.slug ?? 'demo'
  
  // Guard toLocaleString calls
  const formatMoney = (n?: number) => Number.isFinite(n) ? n!.toLocaleString() : '0'
  
  // Generate shareable link (mock for now)
  const token = `catalog_${Date.now()}_${Math.random().toString(36).slice(2,9)}`
  const shareableLink = `${window.location.origin}/${companySlug}/l/${token}`
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Link copied!",
        description: "The catalog link has been copied to your clipboard.",
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
    const subject = encodeURIComponent(`${companyName} - Property Listings Catalog`)
    const body = encodeURIComponent(
      `${customMessage ? customMessage + '\n\n' : ''}Check out our current inventory:\n\n` +
      `📊 ${props.summaryStats.totalListings} Total Listings\n` +
      `✅ ${activeListings} Currently Available\n` +
      `💰 Average Price: $${formatMoney(averagePrice)}\n\n` +
      `Browse all listings: ${shareableLink}\n\n` +
      `Shared from ${companyName}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }
  
  const handleSMSShare = () => {
    const message = encodeURIComponent(
      `${customMessage ? customMessage + ' ' : ''}Check out ${companyName}'s inventory - ${activeListings} available listings, avg $${formatMoney(averagePrice)}: ${shareableLink}`
    )
    window.open(`sms:?body=${message}`)
  }
  
  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Check out ${companyName}'s inventory - ${activeListings} available listings!`)
    const url = encodeURIComponent(shareableLink)
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share All Listings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Catalog Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h4 className="font-medium">{companyName} Catalog</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {props.summaryStats.totalListings}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {activeListings}
                </div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ${formatMoney(averagePrice)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Price</div>
              </div>
            </div>
            
            <div className="flex gap-1 mt-3 justify-center">
              <Badge variant="secondary" className="text-xs">
                RVs & Manufactured Homes
              </Badge>
              <Badge variant="outline" className="text-xs">
                Updated Daily
              </Badge>
            </div>
          </div>
          
          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Catalog Share Link</label>
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
              placeholder="Add a personal message about your inventory..."
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
            <p>Track catalog views, clicks, and lead generation from shared links.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}