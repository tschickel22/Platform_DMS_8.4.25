/**
 * Brochure Builder - Share Brochure Modal
 * 
 * Modal component for sharing brochures via multiple channels.
 * Creates publicId if missing, tracks share events, shows preview.
 * 
 * Share Options:
 * - Copy Link: Creates public URL and copies to clipboard
 * - Email: Opens mailto with brochure link and description
 * - SMS: Opens SMS with brochure link
 * - Social: Facebook, X (Twitter), LinkedIn sharing
 * - Download: PNG and PDF export options
 * 
 * Features:
 * - Tiny brochure preview
 * - Client-side share link disclaimer
 * - Analytics tracking for all share events
 * - Web Share API support where available
 */

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
  Download,
  Image,
  FileText,
  Share2,
  ExternalLink,
  Check
} from 'lucide-react'
import { Brochure, BrochureTemplate } from '../types'
import { useBrochureStore } from '../store/useBrochureStore'
import { buildEmailLink, buildSMSLink, buildSocialLinks, canUseWebShare, shareViaWebAPI } from '../utils/sharing'
import { track } from '../utils/analytics'
import { toPNG, toPDF, downloadExport } from '../utils/exporters'
import BrochureRenderer from './BrochureRenderer'

export interface ShareBrochureModalProps {
  /** Whether modal is open */
  open: boolean
  /** Callback to close modal */
  onClose: () => void
  /** Brochure to share */
  brochure: Brochure
  /** Template data for preview */
  template: BrochureTemplate
  /** Base URL for public links */
  baseUrl?: string
}

/**
 * Share option button component
 */
const ShareOption: React.FC<{
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}> = ({ icon, label, description, onClick, disabled = false, loading = false }) => (
  <Button
    variant="outline"
    className="h-auto p-4 flex items-start space-x-3 text-left hover:bg-gray-50"
    onClick={onClick}
    disabled={disabled || loading}
  >
    <div className="flex-shrink-0 mt-0.5">
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        icon
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-600 mt-1">{description}</div>
    </div>
  </Button>
)

/**
 * Main share modal component
 */
export const ShareBrochureModal: React.FC<ShareBrochureModalProps> = ({
  open,
  onClose,
  brochure,
  template,
  baseUrl = window.location.origin,
}) => {
  const { updateBrochure } = useBrochureStore()
  const [publicUrl, setPublicUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [exportLoading, setExportLoading] = useState<{ png: boolean; pdf: boolean }>({
    png: false,
    pdf: false,
  })

  // Generate public URL when modal opens
  useEffect(() => {
    if (open && brochure) {
      let currentPublicId = brochure.publicId
      
      // Create publicId if missing
      if (!currentPublicId) {
        currentPublicId = `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        updateBrochure(brochure.id, { publicId: currentPublicId })
      }
      
      const url = `${baseUrl}/b/${currentPublicId}`
      setPublicUrl(url)
    }
  }, [open, brochure, baseUrl, updateBrochure])

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      track('brochure_share', { method: 'copy_link', brochureId: brochure.id })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = publicUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Email sharing
  const handleEmailShare = () => {
    const subject = `Check out this brochure: ${template.name}`
    const body = `I wanted to share this brochure with you:\n\n${publicUrl}\n\nView it online or download for offline viewing.`
    
    const emailUrl = buildEmailLink('', subject, body)
    window.open(emailUrl, '_blank')
    
    track('brochure_share', { method: 'email', brochureId: brochure.id })
  }

  // SMS sharing
  const handleSMSShare = () => {
    const message = `Check out this brochure: ${publicUrl}`
    const smsUrl = buildSMSLink('', message)
    window.open(smsUrl, '_blank')
    
    track('brochure_share', { method: 'sms', brochureId: brochure.id })
  }

  // Social media sharing
  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const socialLinks = buildSocialLinks(
      publicUrl,
      `Check out this brochure: ${template.name}`,
      `View this interactive brochure online`
    )
    
    window.open(socialLinks[platform], '_blank', 'width=600,height=400')
    track('brochure_share', { method: platform, brochureId: brochure.id })
  }

  // Web Share API
  const handleWebShare = async () => {
    if (canUseWebShare()) {
      try {
        await shareViaWebAPI(
          `Brochure: ${template.name}`,
          'Check out this interactive brochure',
          publicUrl
        )
        track('brochure_share', { method: 'web_share', brochureId: brochure.id })
      } catch (error) {
        console.error('Web share failed:', error)
      }
    }
  }

  // Export handlers
  const handleExport = async (format: 'png' | 'pdf') => {
    setExportLoading(prev => ({ ...prev, [format]: true }))
    
    try {
      const previewElement = document.querySelector('.brochure-preview-export') as HTMLElement
      if (!previewElement) {
        throw new Error('Preview element not found')
      }

      let result
      if (format === 'png') {
        result = await toPNG(previewElement, { quality: 0.9, scale: 2 })
      } else {
        result = await toPDF(previewElement, { 
          format: 'A4', 
          filename: `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` 
        })
      }

      downloadExport(result)
      track('brochure_download', { format, brochureId: brochure.id })
      
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error)
      // TODO: Show error toast
    } finally {
      setExportLoading(prev => ({ ...prev, [format]: false }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Brochure</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Share options */}
          <div className="space-y-6">
            {/* Public link */}
            <div>
              <h3 className="font-medium text-sm mb-3">Public Link</h3>
              <div className="flex space-x-2">
                <Input
                  value={publicUrl}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Anyone with this link can view the brochure. No account required.
              </p>
            </div>

            <Separator />

            {/* Share options */}
            <div>
              <h3 className="font-medium text-sm mb-3">Share Via</h3>
              <div className="space-y-2">
                {canUseWebShare() && (
                  <ShareOption
                    icon={<Share2 className="w-5 h-5 text-blue-600" />}
                    label="Share"
                    description="Use your device's native sharing options"
                    onClick={handleWebShare}
                  />
                )}
                
                <ShareOption
                  icon={<Mail className="w-5 h-5 text-green-600" />}
                  label="Email"
                  description="Send via your default email app"
                  onClick={handleEmailShare}
                />
                
                <ShareOption
                  icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
                  label="SMS"
                  description="Send via text message"
                  onClick={handleSMSShare}
                />
                
                <div className="grid grid-cols-3 gap-2">
                  <ShareOption
                    icon={<Facebook className="w-5 h-5 text-blue-700" />}
                    label="Facebook"
                    description="Share on Facebook"
                    onClick={() => handleSocialShare('facebook')}
                  />
                  <ShareOption
                    icon={<Twitter className="w-5 h-5 text-blue-500" />}
                    label="X"
                    description="Share on X"
                    onClick={() => handleSocialShare('twitter')}
                  />
                  <ShareOption
                    icon={<Linkedin className="w-5 h-5 text-blue-800" />}
                    label="LinkedIn"
                    description="Share on LinkedIn"
                    onClick={() => handleSocialShare('linkedin')}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Download options */}
            <div>
              <h3 className="font-medium text-sm mb-3">Download</h3>
              <div className="space-y-2">
                <ShareOption
                  icon={<Image className="w-5 h-5 text-purple-600" />}
                  label="Download PNG"
                  description="High-quality image file"
                  onClick={() => handleExport('png')}
                  loading={exportLoading.png}
                />
                
                <ShareOption
                  icon={<FileText className="w-5 h-5 text-red-600" />}
                  label="Download PDF"
                  description="Printable document format"
                  onClick={() => handleExport('pdf')}
                  loading={exportLoading.pdf}
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-blue-50 rounded-md">
              <div className="flex items-start space-x-2">
                <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <strong>Client-side sharing:</strong> Links are generated locally and stored in your browser. 
                  Recipients can view the brochure without creating an account.
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Preview */}
          <div>
            <h3 className="font-medium text-sm mb-3">Preview</h3>
            <Card>
              <CardContent className="p-4">
                <div className="brochure-preview-export transform scale-50 origin-top-left w-[200%] h-[400px] overflow-hidden">
                  <BrochureRenderer
                    data={template}
                    binding={brochure.snapshot}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-3 text-center">
              <Badge variant="secondary" className="text-xs">
                {template.name}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareBrochureModal