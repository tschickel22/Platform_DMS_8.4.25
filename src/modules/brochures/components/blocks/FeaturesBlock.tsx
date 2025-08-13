/**
 * Brochure Builder - Features Block Component
 * 
 * Features list block with bullet points and icons.
 * Deduplicates blank entries and provides clean formatting.
 * 
 * Props:
 * - features: Array of feature strings
 * - title: Optional section title
 * - columns: Number of columns (1-3)
 * - showIcons: Whether to show checkmark icons
 * - theme: Visual theme for styling
 * - branding: Company branding for colors
 * 
 * Features:
 * - Responsive column layout
 * - Automatic blank entry removal
 * - Icon support with theme styling
 * - Empty state handling
 * - Customizable column count
 */

import React from 'react'
import { ThemeId, BrandingProfile } from '../../types'
import { Check, Star, Zap, List } from 'lucide-react'

export interface FeaturesBlockProps {
  type: 'features'
  features?: string[]
  title?: string
  columns?: 1 | 2 | 3
  showIcons?: boolean
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * Individual feature item component
 */
const FeatureItem: React.FC<{
  feature: string
  showIcon: boolean
  theme: ThemeId
  accentColor?: string
}> = ({ feature, showIcon, theme, accentColor }) => {
  // Get icon based on theme
  const getIcon = () => {
    switch (theme) {
      case 'card':
        return <Check className="w-4 h-4 flex-shrink-0" />
      case 'poster':
        return <Star className="w-5 h-5 flex-shrink-0" />
      default:
        return <Zap className="w-4 h-4 flex-shrink-0" />
    }
  }

  // Theme-specific styling
  const getItemClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors',
          text: 'text-sm text-gray-700 leading-relaxed',
          icon: 'text-green-600 mt-0.5',
        }
      case 'poster':
        return {
          container: 'flex items-start space-x-4 p-3 bg-white bg-opacity-50 rounded-lg',
          text: 'text-base font-medium text-gray-800 leading-relaxed',
          icon: 'text-yellow-500 mt-0.5',
        }
      default: // sleek
        return {
          container: 'flex items-start space-x-2 py-1',
          text: 'text-sm text-gray-800 leading-relaxed',
          icon: 'text-blue-600 mt-0.5',
        }
    }
  }

  const itemClasses = getItemClasses()

  return (
    <div className={itemClasses.container}>
      {showIcon && (
        <div 
          className={itemClasses.icon}
          style={{ color: accentColor }}
        >
          {getIcon()}
        </div>
      )}
      <span className={itemClasses.text}>
        {feature}
      </span>
    </div>
  )
}

/**
 * Features block component
 */
export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  features = [],
  title = 'Features',
  columns = 2,
  showIcons = true,
  theme = 'sleek',
  branding,
}) => {
  // Filter out empty, null, or whitespace-only features and deduplicate
  const validFeatures = Array.from(new Set(
    features
      .filter(feature => 
        feature && 
        typeof feature === 'string' && 
        feature.trim().length > 0
      )
      .map(feature => feature.trim())
  ))

  // Get accent color from branding
  const getAccentColor = () => {
    if (branding?.primary) return branding.primary
    
    switch (theme) {
      case 'card':
        return '#059669' // green-600
      case 'poster':
        return '#EAB308' // yellow-500
      default:
        return '#2563EB' // blue-600
    }
  }

  const accentColor = getAccentColor()

  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-6 bg-white rounded-lg shadow-sm border border-gray-200',
          title: 'text-xl font-semibold mb-4 text-gray-800',
          grid: 'gap-2',
        }
      case 'poster':
        return {
          container: 'p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl',
          title: 'text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide',
          grid: 'gap-3',
        }
      default: // sleek
        return {
          container: 'p-4',
          title: 'text-lg font-medium mb-3 text-gray-900',
          grid: 'gap-1',
        }
    }
  }

  const themeClasses = getThemeClasses()

  // Grid column classes
  const getGridClasses = () => {
    const baseClasses = `${themeClasses.grid}`
    
    switch (columns) {
      case 1:
        return `space-y-2`
      case 3:
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${baseClasses}`
      default:
        return `grid grid-cols-1 md:grid-cols-2 ${baseClasses}`
    }
  }

  return (
    <div className={`features-block ${themeClasses.container}`}>
      {/* Title */}
      {title && (
        <h2 
          className={themeClasses.title}
          style={{ 
            fontFamily: branding?.fontFamily || 'inherit',
            color: accentColor
          }}
        >
          {title}
        </h2>
      )}

      {/* Features list */}
      {validFeatures.length > 0 ? (
        <div className={getGridClasses()}>
          {validFeatures.map((feature, index) => (
            <FeatureItem
              key={index}
              feature={feature}
              showIcon={showIcons}
              theme={theme}
              accentColor={accentColor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <List className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No features added yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add feature descriptions to highlight key benefits
          </p>
        </div>
      )}

      {/* Feature count indicator */}
      {validFeatures.length > 0 && (
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {validFeatures.length} feature{validFeatures.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const featuresBlockDefaults: FeaturesBlockProps = {
  type: 'features',
  title: 'Key Features',
  features: [
    'Premium interior finishes',
    'Energy-efficient appliances',
    'Spacious living area',
    'Modern kitchen with island',
    'Master bedroom with walk-in closet',
    'Full bathroom with shower',
    'Outdoor awning',
    'LED lighting throughout',
    'USB charging ports',
    'Bluetooth stereo system',
  ],
  columns: 2,
  showIcons: true,
}

export default FeaturesBlock