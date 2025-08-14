import React from 'react'
import { BrochureTemplate, GeneratedBrochure } from '../types'
import { Card, CardContent } from '@/components/ui/card'

interface BrochureRendererProps {
  template: BrochureTemplate
  brochure?: GeneratedBrochure
  listings?: any[]
  preview?: boolean
}

export function BrochureRenderer({ template, brochure, listings = [], preview = false }: BrochureRendererProps) {
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'hero':
        return (
          <div 
            key={block.id}
            className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: `url(${block.config.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative text-center space-y-4">
              <h1 className="text-4xl font-bold">{block.config.title}</h1>
              <p className="text-xl">{block.config.subtitle}</p>
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div key={block.id} className="py-12 px-6">
            <h2 className="text-3xl font-bold text-center mb-8">{block.config.title}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.slice(0, 6).map((listing, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    {listing.media?.primaryPhoto ? (
                      <img 
                        src={listing.media.primaryPhoto} 
                        alt={`${listing.make} ${listing.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                    {block.config.showPrices && (
                      <p className="text-lg font-bold text-primary">
                        ${(listing.salePrice || listing.rentPrice || 0).toLocaleString()}
                      </p>
                    )}
                    {block.config.showSpecs && (
                      <div className="text-sm text-muted-foreground mt-2">
                        {listing.listingType === 'rv' ? (
                          <span>Sleeps {listing.sleeps} • {listing.length}ft</span>
                        ) : (
                          <span>{listing.bedrooms}BR/{listing.bathrooms}BA</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'features':
        return (
          <div key={block.id} className="py-12 px-6 bg-muted/30">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">{block.config.title}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {block.config.features.map((feature: string, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-foreground font-bold">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold">{feature}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'cta':
        return (
          <div key={block.id} className="py-12 px-6 bg-primary text-primary-foreground text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold">{block.config.title}</h2>
              <p className="text-xl opacity-90">{block.config.subtitle}</p>
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {block.config.buttonText}
              </button>
            </div>
          </div>
        )

      default:
        return (
          <div key={block.id} className="py-8 px-6 bg-muted/20 text-center">
            <p className="text-muted-foreground">Block type: {block.type}</p>
          </div>
        )
    }
  }

  return (
    <div className="bg-white">
      {template.blocks.map(renderBlock)}
    </div>
  )
}