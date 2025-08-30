/**
 * Brochure Builder - CTA Block Component
 * 
 * Call-to-action block with headline, button, and optional link.
 * Tracks CTA clicks for analytics and provides theme-aware styling.
 * 
 * Props:
 * - headline: Main CTA headline text
 * - buttonText: Button label text
 * - link: Optional URL for button action
 * - description: Optional supporting text
 * - theme: Visual theme for styling
 * - branding: Company branding for colors
 * 
 * Features:
 * - Click tracking via analytics
 * - External link handling
 * - Theme-aware button styling
 * - Responsive text sizing
 * - Safe link validation
 */

import React from 'react'
import { ThemeId, BrandingProfile } from '../../types'
import { ExternalLink, Phone, Mail, MessageCircle } from 'lucide-react'
import { track } from '../../utils/analytics'

export interface CTABlockProps {
  type: 'cta'
  headline?: string
  buttonText?: string
  link?: string
  description?: string
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * CTA block component
 */
export const CTABlock: React.FC<CTABlockProps> = ({
  headline = 'Ready to Get Started?',
  buttonText = 'Contact Us Today',
  link,
  description,
  theme = 'sleek',
  branding,
}) => {
  // Handle CTA click
  const handleCTAClick = () => {
    // Track the click event
    track('cta_click', {
      headline,
      buttonText,
      link,
      theme,
      timestamp: new Date().toISOString(),
    })

    // Handle link action
    if (link) {
      try {
        const url = new URL(link)
        // Open external links in new tab
        if (url.hostname !== window.location.hostname) {
          window.open(link, '_blank', 'noopener,noreferrer')
        } else {
          window.location.href = link
        }
      } catch (error) {
        // If URL parsing fails, try as relative link
        if (link.startsWith('/') || link.startsWith('#')) {
          window.location.href = link
        } else if (link.startsWith('tel:') || link.startsWith('mailto:') || link.startsWith('sms:')) {
          window.location.href = link
        } else {
          console.warn('Invalid CTA link:', link)
        }
      }
    }
  }

  // Detect link type for appropriate icon
  const getLinkIcon = () => {
    if (!link) return null
    
    if (link.startsWith('tel:')) return <Phone className="w-4 h-4" />
    if (link.startsWith('mailto:')) return <Mail className="w-4 h-4" />
    if (link.startsWith('sms:')) return <MessageCircle className="w-4 h-4" />
    if (link.startsWith('http')) return <ExternalLink className="w-4 h-4" />
    
    return null
  }

  // Get accent color from branding
  const getAccentColor = () => {
    if (branding?.primary) return branding.primary
    
    switch (theme) {
      case 'card':
        return '#3B82F6' // blue-500
      case 'poster':
        return '#DC2626' // red-600
      default:
        return '#1F2937' // gray-800
    }
  }

  const accentColor = getAccentColor()

  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-center',
          headline: 'text-2xl md:text-3xl font-bold mb-3 text-gray-900',
          description: 'text-base text-gray-600 mb-6 max-w-2xl mx-auto',
          button: 'inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105',
        }
      case 'poster':
        return {
          container: 'p-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-center text-white shadow-xl',
          headline: 'text-3xl md:text-4xl font-black mb-4 uppercase tracking-wide',
          description: 'text-lg mb-8 max-w-2xl mx-auto opacity-90',
          button: 'inline-flex items-center space-x-3 px-10 py-5 bg-white text-red-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 hover:bg-gray-50',
        }
      default: // sleek
        return {
          container: 'p-6 text-center bg-gray-50 rounded-md',
          headline: 'text-xl md:text-2xl font-semibold mb-2 text-gray-900',
          description: 'text-sm text-gray-600 mb-4 max-w-xl mx-auto',
          button: 'inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-200',
        }
    }
  }

  const themeClasses = getThemeClasses()

  return (
    <div className={`cta-block ${themeClasses.container}`}>
      {/* Headline */}
      <h2 
        className={themeClasses.headline}
        style={{ fontFamily: branding?.fontFamily || 'inherit' }}
      >
        {headline}
      </h2>

      {/* Description */}
      {description && (
        <p 
          className={themeClasses.description}
          style={{ fontFamily: branding?.fontFamily || 'inherit' }}
        >
          {description}
        </p>
      )}

      {/* CTA Button */}
      <button
        className={themeClasses.button}
        onClick={handleCTAClick}
        style={theme !== 'poster' ? { backgroundColor: accentColor } : undefined}
        onMouseEnter={(e) => {
          if (theme !== 'poster') {
            e.currentTarget.style.backgroundColor = `${accentColor}dd`
          }
        }}
        onMouseLeave={(e) => {
          if (theme !== 'poster') {
            e.currentTarget.style.backgroundColor = accentColor
          }
        }}
      >
        <span>{buttonText}</span>
        {getLinkIcon()}
      </button>

      {/* Link preview for editors */}
      {link && (
        <div className="mt-3 text-xs opacity-60">
          <span className="font-mono bg-black bg-opacity-10 px-2 py-1 rounded">
            {link.length > 50 ? `${link.substring(0, 50)}...` : link}
          </span>
        </div>
      )}

      {/* No link warning */}
      {!link && (
        <div className="mt-3 text-xs text-gray-400">
          Add a link to make this button functional
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const ctaBlockDefaults: CTABlockProps = {
  type: 'cta',
  headline: 'Ready to Learn More?',
  buttonText: 'Get In Touch',
  description: 'Contact us today to discuss your needs and get a personalized quote.',
  link: 'tel:+1-555-123-4567',
}

export default CTABlock