import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BrochureRenderer } from '../components/BrochureRenderer'
import { useBrochureStore } from '../store/useBrochureStore'
import { mockInventory } from '@/mocks/inventoryMock'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export function PublicBrochureView() {
  const { publicId } = useParams<{ publicId: string }>()
  const { brochures, templates, getBrochure, getTemplate } = useBrochureStore()
  const [brochure, setBrochure] = useState<any>(null)
  const [template, setTemplate] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicId) return

    // Find brochure by public ID
    const foundBrochure = brochures.find(b => b.publicId === publicId)
    if (!foundBrochure) {
      setLoading(false)
      return
    }

    setBrochure(foundBrochure)

    // Get template
    const foundTemplate = getTemplate(foundBrochure.templateId)
    if (foundTemplate) {
      setTemplate(foundTemplate)
    }

    // Get listings data
    const brochureListings = mockInventory.sampleVehicles.filter(vehicle =>
      foundBrochure.listingIds.includes(vehicle.id)
    )
    setListings(brochureListings)

    setLoading(false)
  }, [publicId, brochures, getTemplate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!brochure || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Brochure Not Found</h3>
            <p className="text-muted-foreground">
              The brochure you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Extract meta data for social sharing
  const getMetaDescription = () => {
    if (brochure.description) return brochure.description
    
    // Extract from hero block
    const heroBlock = brochure.blocks?.find(block => block.type === 'hero')
    if (heroBlock?.data?.description) return heroBlock.data.description
    
    // Extract from first text block
    const textBlock = brochure.blocks?.find(block => 
      block.type === 'features' && block.data?.description
    )
    if (textBlock?.data?.description) return textBlock.data.description
    
    return `Professional brochure featuring ${brochure.templateName || 'properties'} from ${brochure.companyName || 'our company'}`
  }
  
  const getMetaImage = () => {
    // Try hero block image first
    const heroBlock = brochure.blocks?.find(block => block.type === 'hero')
    if (heroBlock?.data?.image) return heroBlock.data.image
    
    // Try gallery block images
    const galleryBlock = brochure.blocks?.find(block => 
      block.type === 'gallery' && block.data?.images?.length > 0
    )
    if (galleryBlock?.data?.images?.[0]) return galleryBlock.data.images[0]
    
    // Fallback to generated preview
    return `${window.location.origin}/api/brochure-preview/${brochure.id}.jpg`
  }
  
  const metaTitle = `${brochure.title} - ${brochure.companyName || 'Brochure'}`
  const metaDescription = getMetaDescription().substring(0, 160) // Optimal length for social
  const metaImage = getMetaImage()
  const canonicalUrl = `${window.location.origin}/b/${publicId}`

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph Meta Tags for Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={brochure.companyName || 'Property Brochures'} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
        <meta name="twitter:site" content={`@${(brochure.companyName || '').replace(/\s+/g, '')}`} />
        
        {/* LinkedIn Meta Tags */}
        <meta property="linkedin:title" content={metaTitle} />
        <meta property="linkedin:description" content={metaDescription} />
        <meta property="linkedin:image" content={metaImage} />
        
        {/* Additional Meta Tags */}
        <meta name="author" content={brochure.companyName || 'Property Brochures'} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <BrochureRenderer 
        template={template}
        brochure={brochure}
        listings={listings}
        preview={false}
      />
    </div>
  )
}