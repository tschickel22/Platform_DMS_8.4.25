import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Copy, ExternalLink, Mail, MessageSquare, Globe } from 'lucide-react'
import { ShareSettings } from '../types'
import { propertyListingsService } from '../services/propertyListingsService'
import { useToast } from '@/hooks/use-toast'

interface ShareAllListingsModalProps {
  isOpen: boolean
  onClose: () => void
  totalListings: number
}

export function ShareAllListingsModal({ isOpen, onClose, totalListings }: ShareAllListingsModalProps) {
  const { toast } = useToast()
  const [shareUrl, setShareUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<ShareSettings>({
    type: 'all',
    expiresIn: 30,
    includeContact: true,
    allowLeadCapture: true,
    trackViews: true
  })

  const handleGenerateUrl = async () => {
    try {
      setLoading(true)
      const url = await propertyListingsService.generateShareAllUrl(settings)
      setShareUrl(url)
      
      toast({
        title: 'Share URL Generated',
        description: `Shareable catalog with ${totalListings} listings created successfully.`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate share URL. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: 'Copied!',
      description: 'Share URL copied to clipboard.'
    })
  }

  const handleEmailShare = () => {
    const subject = 'Check out our property listings'
    const body = `We have ${totalListings} properties available for sale and rent. Browse our complete catalog:\n\n${shareUrl}\n\n${settings.customMessage || ''}`
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleSmsShare = () => {
    const message = `Check out our ${totalListings} available properties: ${shareUrl}`
    window.open(`sms:?body=${encodeURIComponent(message)}`)
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = `Check out our ${totalListings} available properties!`
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Share All Listings
          </DialogTitle>
          <DialogDescription>
            Generate a shareable catalog page with all {totalListings} active listings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Expiration */}
          <div>
            <Label htmlFor="expires">Link expires in</Label>
            <Select 
              value={settings.expiresIn.toString()} 
              onValueChange={(value) => setSettings({ ...settings, expiresIn: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="0">Never expires</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeContact"
                checked={settings.includeContact}
                onCheckedChange={(checked) => setSettings({ ...settings, includeContact: !!checked })}
              />
              <Label htmlFor="includeContact">Include contact information</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allowLeadCapture"
                checked={settings.allowLeadCapture}
                onCheckedChange={(checked) => setSettings({ ...settings, allowLeadCapture: !!checked })}
              />
              <Label htmlFor="allowLeadCapture">Allow visitors to submit inquiries</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="trackViews"
                checked={settings.trackViews}
                onCheckedChange={(checked) => setSettings({ ...settings, trackViews: !!checked })}
              />
              <Label htmlFor="trackViews">Track views and analytics</Label>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="customMessage">Welcome message (optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a welcome message to appear at the top of your catalog..."
              value={settings.customMessage || ''}
              onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
              rows={3}
            />
          </div>

          {/* Generate URL */}
          {!shareUrl && (
            <Button onClick={handleGenerateUrl} disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate Catalog URL'}
            </Button>
          )}

          {/* Share URL Result */}
          {shareUrl && (
            <div className="space-y-4">
              <div>
                <Label>Shareable Catalog URL</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="flex-1 text-sm" />
                  <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Share Options */}
              <div className="space-y-2">
                <Label>Share via</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleEmailShare}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSmsShare}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSocialShare('facebook')}>
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSocialShare('twitter')}>
                    Twitter
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open(shareUrl, '_blank')} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Catalog
                </Button>
              </div>

              {/* Analytics Info */}
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  This link will expire in {settings.expiresIn} days and 
                  {settings.trackViews ? ' will track' : ' will not track'} visitor analytics.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}