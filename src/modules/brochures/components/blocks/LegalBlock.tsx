/**
 * Brochure Builder - Legal Block Component
 * 
 * Legal text block for disclaimers, terms, and fine print.
 * Provides safe text wrapping and clipping for long content.
 * 
 * Props:
 * - text: Legal text content
 * - title: Optional section title
 * - fontSize: Text size ('xs' | 'sm' | 'base')
 * - theme: Visual theme for styling
 * - branding: Company branding for colors
 * 
 * Features:
 * - Safe text wrapping and clipping
 * - Multiple font size options
 * - Theme-aware styling
 * - Expandable content for long text
 * - Proper legal text formatting
 */

import React, { useState } from 'react'
import { ThemeId, BrandingProfile } from '../../types'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'

export interface LegalBlockProps {
  type: 'legal'
  text?: string
  title?: string
  fontSize?: 'xs' | 'sm' | 'base'
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * Legal block component
 */
export const LegalBlock: React.FC<LegalBlockProps> = ({
  text = '',
  title = 'Legal Information',
  fontSize = 'xs',
  theme = 'sleek',
  branding,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Clean and validate text
  const cleanText = text?.trim() || ''
  const hasContent = cleanText.length > 0

  // Determine if text should be collapsible (longer than ~500 characters)
  const isLongText = cleanText.length > 500
  const shouldShowToggle = isLongText && !isExpanded

  // Get display text
  const displayText = shouldShowToggle 
    ? `${cleanText.substring(0, 500)}...`
    : cleanText

  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-4 bg-gray-50 rounded-md border border-gray-200',
          title: 'text-sm font-medium text-gray-700 mb-2',
          text: 'leading-relaxed text-gray-600',
          toggle: 'text-blue-600 hover:text-blue-700 font-medium',
        }
      case 'poster':
        return {
          container: 'p-6 bg-white bg-opacity-75 rounded-lg border border-gray-300',
          title: 'text-base font-bold text-gray-800 mb-3 uppercase tracking-wide',
          text: 'leading-relaxed text-gray-700',
          toggle: 'text-purple-600 hover:text-purple-700 font-bold',
        }
      default: // sleek
        return {
          container: 'p-3 border-t border-gray-200',
          title: 'text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide',
          text: 'leading-relaxed text-gray-500',
          toggle: 'text-gray-700 hover:text-gray-900 font-medium',
        }
    }
  }

  const themeClasses = getThemeClasses()

  // Font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'base':
        return 'text-base'
      case 'sm':
        return 'text-sm'
      default:
        return 'text-xs'
    }
  }

  const fontSizeClass = getFontSizeClass()

  return (
    <div className={`legal-block ${themeClasses.container}`}>
      {/* Title */}
      {title && (
        <h3 
          className={themeClasses.title}
          style={{ fontFamily: branding?.fontFamily || 'inherit' }}
        >
          {title}
        </h3>
      )}

      {/* Legal text content */}
      {hasContent ? (
        <div>
          <div 
            className={`${themeClasses.text} ${fontSizeClass} whitespace-pre-wrap`}
            style={{ fontFamily: branding?.fontFamily || 'inherit' }}
          >
            {displayText}
          </div>

          {/* Expand/collapse toggle */}
          {isLongText && (
            <button
              className={`mt-2 text-xs ${themeClasses.toggle} flex items-center space-x-1 transition-colors`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          <FileText className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">No legal text added yet</p>
          <p className="text-xs mt-1 opacity-75">
            Add disclaimers, terms, or other legal information
          </p>
        </div>
      )}

      {/* Character count for editors */}
      {hasContent && (
        <div className="mt-2 text-right">
          <span className="text-xs text-gray-400">
            {cleanText.length} characters
          </span>
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const legalBlockDefaults: LegalBlockProps = {
  type: 'legal',
  title: 'Important Information',
  text: `Prices and specifications are subject to change without notice. All information is believed to be accurate but is not guaranteed. Photos may not represent actual inventory. Some features may be optional or require additional cost. Financing is subject to credit approval. See dealer for complete details and current pricing.

This brochure is for informational purposes only and does not constitute an offer to sell. All sales are subject to availability and dealer terms and conditions. Manufacturer warranties apply where applicable.

Equal Housing Opportunity. All dimensions and weights are approximate. Actual specifications may vary by model year and options selected.`,
  fontSize: 'xs',
}

export default LegalBlock