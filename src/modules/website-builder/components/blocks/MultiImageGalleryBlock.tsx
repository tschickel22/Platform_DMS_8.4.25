import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

export type MultiImageGalleryData = {
  title?: string
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  aspect?: 'square' | 'video' | 'wide' | 'auto'
  className?: string
}

export default function MultiImageGalleryBlock({ data }: { data: MultiImageGalleryData }) {
  const {
    title,
    images = [],
    columns = 3,
    aspect = 'auto',
    className = '',
  } = data || {}

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const aspectClass =
    aspect === 'square' ? 'aspect-square' :
    aspect === 'video' ? 'aspect-video' :
    aspect === 'wide' ? 'aspect-[3/2]' : 'aspect-auto'

  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-3`}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            className={`relative overflow-hidden rounded-xl group ${aspectClass} bg-muted`}
            aria-label={img.alt ?? `Image ${i + 1}`}
          >
            <img
              src={img.src}
              alt={img.alt ?? ''}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition"
              loading="lazy"
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                {img.caption}
              </div>
            )}
          </button>
        ))}
        {images.length === 0 && (
          <div className="text-sm text-muted-foreground">Add some images to this gallery…</div>
        )}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(v) => !v && setOpenIndex(null)}>
        <DialogContent className="max-w-4xl">
          {openIndex !== null && images[openIndex] && (
            <div className="w-full">
              <img
                src={images[openIndex].src}
                alt={images[openIndex].alt ?? ''}
                className="w-full h-auto rounded-lg"
              />
              {images[openIndex].caption && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {images[openIndex].caption}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}