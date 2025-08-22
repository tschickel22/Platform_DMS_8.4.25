import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Copy, ExternalLink, Mail, MessageSquare } from 'lucide-react'
import { ShareSettings } from '../types'
import { propertyListingsService } from '../services/propertyListingsService'
import { useToast } from '@/hooks/use-toast'

interface ShareListingModalProps {
  isOpen: boolean
  onClose: () => void
  listingId?: string
  listingTitle?: string
  mode: 'single' | 'all'
}

export function ShareListingModal({ isOpen, onClose, listingId, listingTitle, mode }: ShareListingModalProps) {
  const { toast } = useToast()
  const [shareUrl, setShareUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<ShareSettings>({
    type: mode,
    expiresIn: 30,
    includeContact: true,
    allowLeadCapture: true,
    trackViews: true
  })

  const handleGenerateUrl = async () => {
    try {
      setLoading(true)
      
      let url: string
      if (mode === 'single' && listingId) {
        url = await propertyListingsService.generateShareUrl(listingId, settings)
      } else {
        url = await propertyListingsService.generateShareAllUrl(settings)
      }
      
      setShareUrl(url)
      
      toast({
        title: 'Share URL Generated',
        description: 'Your shareable URL has been created successfully.'
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
    const subject = mode === 'single' 
      ? `Check out this listing: ${listingTitle}`
      : 'Check out our latest property listings'
    
    const body = mode === 'single'
      ? `I thought you might be interested in this property listing:\n\n${listingTitle}\n\n${shareUrl}`
      : `Check out our latest property listings:\n\n${shareUrl}`
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleSmsShare = () => {
    const message = mode === 'single'
      ? `Check out this listing: ${listingTitle} ${shareUrl}`
      : `Check out our latest listings: ${shareUrl}`
    
    window.open(`sms:?body=${encodeURIComponent(message)}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Share {mode === 'single' ? 'Listing' : 'All Listings'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'single' 
              ? `Generate a shareable link for "${listingTitle}"`
              : 'Generate a shareable link for all your active listings'
            }
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
              <Label htmlFor="allowLeadCapture">Allow lead capture</Label>
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
            <Label htmlFor="customMessage">Custom message (optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a personal message to appear with the listing..."
              value={settings.customMessage || ''}
              onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
              rows={3}
            />
          </div>

          {/* Generate URL */}
          {!shareUrl && (
            <Button onClick={handleGenerateUrl} disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate Share URL'}
            </Button>
          )}

          {/* Share URL Result */}
          {shareUrl && (
            <div className="space-y-3">
              <div>
                <Label>Share URL</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Share Options */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEmailShare} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" onClick={handleSmsShare} className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(shareUrl, '_blank')} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
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