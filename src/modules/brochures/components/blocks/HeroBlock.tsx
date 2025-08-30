/**
 * Brochure Builder - Hero Block Component
 * 
 * Hero section block with title, subtitle, and background image.
 * Uses branding for accent colors and handles missing fields gracefully.
 * 
 * Props:
 * - title: Main headline text
 * - subtitle: Supporting text below title
 * - imageUrl: Background image URL
 * - theme: Visual theme for styling
 * - branding: Company branding for colors/fonts
 * 
 * Features:
 * - Responsive text sizing
 * - Fallback for missing images
 * - Branding color integration
 * - Safe text rendering
 */

import React from 'react'
import { ThemeId, BrandingProfile } from '../../types'

export interface HeroBlockProps {
  type: 'hero'
  title?: string
  subtitle?: string
  imageUrl?: string
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * Hero block component
 */
export const HeroBlock: React.FC<HeroBlockProps> = ({
  title = 'Your Title Here',
  subtitle = 'Add a compelling subtitle to engage your audience',
  imageUrl,
  theme = 'sleek',
  branding,
}) => {
  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'rounded-lg shadow-md overflow-hidden',
          content: 'p-8 md:p-12',
          title: 'text-3xl md:text-4xl font-bold mb-4',
          subtitle: 'text-lg md:text-xl opacity-90',
        }
      case 'poster':
        return {
          container: 'rounded-xl shadow-lg overflow-hidden border-2',
          content: 'p-10 md:p-16',
          title: 'text-4xl md:text-5xl font-black mb-6 uppercase tracking-wide',
          subtitle: 'text-xl md:text-2xl font-semibold',
        }
      default: // sleek
        return {
          container: 'overflow-hidden',
          content: 'p-6 md:p-10',
          title: 'text-2xl md:text-3xl font-semibold mb-3',
          subtitle: 'text-base md:text-lg',
        }
    }
  }

  const themeClasses = getThemeClasses()

  // Get accent color from branding or use theme default
  const getAccentColor = () => {
    if (branding?.primary) {
      return branding.primary
    }
    
    switch (theme) {
      case 'card':
        return '#3B82F6' // blue-500
      case 'poster':
        return '#8B5CF6' // purple-500
      default:
        return '#1F2937' // gray-800
    }
  }

  const accentColor = getAccentColor()

  // Background image handling
  const backgroundStyle = imageUrl
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}25)`,
      }

  // Text color based on background
  const textColor = imageUrl ? 'text-white' : 'text-gray-900'

  return (
    <div 
      className={`hero-block relative min-h-[300px] md:min-h-[400px] flex items-center ${themeClasses.container}`}
      style={backgroundStyle}
    >
      {/* Overlay for better text readability */}
      {imageUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      )}
      
      {/* Content */}
      <div className={`relative z-10 w-full ${themeClasses.content}`}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 
            className={`${themeClasses.title} ${textColor}`}
            style={{ 
              fontFamily: branding?.fontFamily || 'inherit',
              color: imageUrl ? 'white' : accentColor 
            }}
          >
            {title || 'Your Title Here'}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p 
              className={`${themeClasses.subtitle} ${textColor} max-w-2xl mx-auto`}
              style={{ fontFamily: branding?.fontFamily || 'inherit' }}
            >
              {subtitle}
            </p>
          )}
          
          {/* Accent line for poster theme */}
          {theme === 'poster' && (
            <div 
              className="w-24 h-1 mx-auto mt-6 rounded-full"
              style={{ backgroundColor: imageUrl ? 'white' : accentColor }}
            />
          )}
        </div>
      </div>
      
      {/* Fallback for missing image */}
      {!imageUrl && (
        <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white bg-opacity-75 px-2 py-1 rounded">
          Add background image
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const heroBlockDefaults: HeroBlockProps = {
  type: 'hero',
  title: 'Welcome to Our Showcase',
  subtitle: 'Discover amazing products and services tailored just for you',
  imageUrl: '', // Will show gradient background
}

export default HeroBlock