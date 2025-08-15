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

  return (
    <div className="min-h-screen bg-background">
      <BrochureRenderer 
        template={template}
        brochure={brochure}
        listings={listings}
        preview={false}
      />
    </div>
  )
}