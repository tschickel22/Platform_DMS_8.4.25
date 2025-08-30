/**
 * Brochure Builder - Gallery Block Component
 * 
 * Image gallery block with responsive grid layout.
 * Shows placeholder tiles for empty states and handles missing images.
 * 
 * Props:
 * - images: Array of image URLs
 * - title: Optional gallery title
 * - columns: Number of columns (2-4)
 * - theme: Visual theme for styling
 * - branding: Company branding for colors
 * 
 * Features:
 * - Responsive grid layout
 * - Image lazy loading
 * - Placeholder tiles for empty slots
 * - Lightbox-ready structure
 * - Safe image URL handling
 */

import React, { useState } from 'react'
import { ThemeId, BrandingProfile } from '../../types'
import { Image, Plus } from 'lucide-react'

export interface GalleryBlockProps {
  type: 'gallery'
  images?: string[]
  title?: string
  columns?: 2 | 3 | 4
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * Individual gallery image component
 */
const GalleryImage: React.FC<{
  src: string
  alt: string
  index: number
  onClick?: (index: number) => void
  theme: ThemeId
}> = ({ src, alt, index, onClick, theme }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => setImageLoading(false)
  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  // Theme-specific styling
  const getImageClasses = () => {
    switch (theme) {
      case 'card':
        return 'rounded-lg shadow-md hover:shadow-lg transition-shadow'
      case 'poster':
        return 'rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105'
      default:
        return 'hover:opacity-90 transition-opacity'
    }
  }

  return (
    <div 
      className={`
        relative aspect-square bg-gray-100 overflow-hidden cursor-pointer
        ${getImageClasses()}
      `}
      onClick={() => onClick?.(index)}
    >
      {!imageError && src ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <Image className="w-8 h-8 mb-2" />
          <span className="text-xs text-center px-2">
            {imageError ? 'Failed to load' : 'No image'}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Placeholder tile for empty gallery slots
 */
const PlaceholderTile: React.FC<{ theme: ThemeId }> = ({ theme }) => {
  const getPlaceholderClasses = () => {
    switch (theme) {
      case 'card':
        return 'rounded-lg border-2 border-dashed border-gray-300'
      case 'poster':
        return 'rounded-xl border-2 border-dashed border-gray-400'
      default:
        return 'border border-dashed border-gray-300'
    }
  }

  return (
    <div className={`
      relative aspect-square bg-gray-50 flex flex-col items-center justify-center
      ${getPlaceholderClasses()}
    `}>
      <Plus className="w-6 h-6 text-gray-400 mb-1" />
      <span className="text-xs text-gray-400">Add Image</span>
    </div>
  )
}

/**
 * Gallery block component
 */
export const GalleryBlock: React.FC<GalleryBlockProps> = ({
  images = [],
  title,
  columns = 3,
  theme = 'sleek',
  branding,
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Filter out empty/invalid URLs
  const validImages = images.filter(img => img && typeof img === 'string' && img.trim())

  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-6 bg-white rounded-lg',
          title: 'text-xl font-semibold mb-4 text-gray-800',
          grid: 'gap-4',
        }
      case 'poster':
        return {
          container: 'p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl',
          title: 'text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide',
          grid: 'gap-6',
        }
      default: // sleek
        return {
          container: 'p-4',
          title: 'text-lg font-medium mb-3 text-gray-900',
          grid: 'gap-3',
        }
    }
  }

  const themeClasses = getThemeClasses()

  // Grid column classes
  const getGridClasses = () => {
    const baseClasses = `grid ${themeClasses.grid}`
    switch (columns) {
      case 2:
        return `${baseClasses} grid-cols-2`
      case 4:
        return `${baseClasses} grid-cols-2 md:grid-cols-4`
      default:
        return `${baseClasses} grid-cols-2 md:grid-cols-3`
    }
  }

  // Calculate how many placeholder tiles to show
  const minTiles = columns * 2 // Show at least 2 rows
  const totalTiles = Math.max(validImages.length, minTiles)
  const placeholderCount = Math.max(0, minTiles - validImages.length)

  return (
    <div className={`gallery-block ${themeClasses.container}`}>
      {/* Title */}
      {title && (
        <h2 
          className={themeClasses.title}
          style={{ 
            fontFamily: branding?.fontFamily || 'inherit',
            color: branding?.primary || 'inherit'
          }}
        >
          {title}
        </h2>
      )}

      {/* Gallery grid */}
      <div className={getGridClasses()}>
        {/* Valid images */}
        {validImages.map((image, index) => (
          <GalleryImage
            key={index}
            src={image}
            alt={`Gallery image ${index + 1}`}
            index={index}
            onClick={setSelectedImage}
            theme={theme}
          />
        ))}

        {/* Placeholder tiles */}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <PlaceholderTile 
            key={`placeholder-${index}`} 
            theme={theme} 
          />
        ))}
      </div>

      {/* Empty state */}
      {validImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No images added yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add images to create a beautiful gallery
          </p>
        </div>
      )}

      {/* Simple lightbox overlay (for future enhancement) */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-4xl p-4">
            <img
              src={validImages[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const galleryBlockDefaults: GalleryBlockProps = {
  type: 'gallery',
  title: 'Photo Gallery',
  images: [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  ],
  columns: 3,
}

export default GalleryBlock