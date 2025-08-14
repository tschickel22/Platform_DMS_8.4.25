import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Share2, 
  Eye,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react'
import { BrochureRenderer } from '../components/BrochureRenderer'
import { useBrochureStore } from '../store/useBrochureStore'
import { BrochureTemplate } from '../types'
import { useToast } from '@/hooks/use-toast'

export default function PublicBrochureView() {
  const { publicId } = useParams<{ publicId: string }>()
  const { toast } = useToast()
  const { getPublicBrochure } = useBrochureStore()
  
  const [brochure, setBrochure] = useState<{
    template: BrochureTemplate
    data: any
    metadata: any
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    if (publicId) {
      loadBrochure()
    }
  }, [publicId])

  const loadBrochure = async () => {
    if (!publicId) return

    setIsLoading(true)
    try {
      const brochureData = getPublicBrochure(publicId)
      if (brochureData) {
        setBrochure(brochureData)
        // Track view
        setViewCount(prev => prev + 1)
      } else {
        toast({
          title: 'Brochure not found',
          description: 'The requested brochure could not be found.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error loading brochure',
        description: 'Failed to load the brochure. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    toast({
      title: 'Download started',
      description: 'Your brochure download will begin shortly.'
    })
    // TODO: Implement actual download functionality
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: brochure?.metadata?.title || 'Property Brochure',
          text: brochure?.metadata?.description || 'Check out this property listing',
          url: window.location.href
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link copied',
          description: 'The brochure link has been copied to your clipboard.'
        })
      } catch (error) {
        toast({
          title: 'Share failed',
          description: 'Unable to share the brochure.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleContactAction = (type: 'phone' | 'email', value: string) => {
    if (type === 'phone') {
      window.location.href = `tel:${value}`
    } else if (type === 'email') {
      window.location.href = `mailto:${value}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading brochure...</p>
        </div>
      </div>
    )
  }

  if (!brochure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground/50 mb-4">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Brochure Not Found</h2>
            <p className="text-muted-foreground">
              The brochure you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-lg font-semibold">
                  {brochure.metadata?.title || 'Property Brochure'}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{brochure.metadata?.location || 'Location'}</span>
                  <Badge variant="outline" className="text-xs">
                    {viewCount} views
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <BrochureRenderer
          template={brochure.template}
          data={brochure.data}
          className="shadow-lg"
        />
      </div>

      {/* Contact Footer */}
      {brochure.metadata?.contact && (
        <div className="bg-white border-t mt-8">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Interested in this property?</h3>
              <div className="flex items-center justify-center space-x-4">
                {brochure.metadata.contact.phone && (
                  <Button
                    onClick={() => handleContactAction('phone', brochure.metadata.contact.phone)}
                    className="flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call {brochure.metadata.contact.phone}</span>
                  </Button>
                )}
                {brochure.metadata.contact.email && (
                  <Button
                    variant="outline"
                    onClick={() => handleContactAction('email', brochure.metadata.contact.email)}
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Us</span>
                  </Button>
                )}
                {brochure.metadata.contact.website && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(brochure.metadata.contact.website, '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Visit Website</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}