/**
 * Brochure Builder - Specs Block Component
 * 
 * Specifications display block with key-value pairs in a grid layout.
 * Safely handles missing data and provides clean formatting.
 * 
 * Props:
 * - specs: Object with key-value specification pairs
 * - title: Optional section title
 * - columns: Number of columns (1-3)
 * - theme: Visual theme for styling
 * - branding: Company branding for colors
 * 
 * Features:
 * - Responsive grid layout
 * - Safe value stringification
 * - Empty state handling
 * - Customizable column count
 * - Theme-aware styling
 */

import React from 'react'
import { ThemeId, BrandingProfile } from '../../types'
import { Info } from 'lucide-react'

export interface SpecsBlockProps {
  type: 'specs'
  specs?: Record<string, any>
  title?: string
  columns?: 1 | 2 | 3
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * Individual specification item component
 */
const SpecItem: React.FC<{
  label: string
  value: any
  theme: ThemeId
  accentColor?: string
}> = ({ label, value, theme, accentColor }) => {
  // Safely stringify value
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '—'
    if (typeof val === 'boolean') return val ? 'Yes' : 'No'
    if (typeof val === 'number') {
      // Format numbers with commas for readability
      return val.toLocaleString()
    }
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val)
      } catch {
        return String(val)
      }
    }
    return String(val).trim() || '—'
  }

  // Theme-specific styling
  const getItemClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-3 bg-gray-50 rounded-md border border-gray-200',
          label: 'text-sm font-medium text-gray-700 mb-1',
          value: 'text-sm text-gray-900',
        }
      case 'poster':
        return {
          container: 'p-4 bg-white rounded-lg shadow-sm border-l-4',
          label: 'text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide',
          value: 'text-base font-semibold text-gray-900',
        }
      default: // sleek
        return {
          container: 'py-2 border-b border-gray-200 last:border-b-0',
          label: 'text-sm font-medium text-gray-600',
          value: 'text-sm text-gray-900 mt-1',
        }
    }
  }

  const itemClasses = getItemClasses()
  const formattedValue = formatValue(value)

  return (
    <div 
      className={itemClasses.container}
      style={theme === 'poster' ? { borderLeftColor: accentColor } : undefined}
    >
      <div className={itemClasses.label}>
        {label}
      </div>
      <div 
        className={itemClasses.value}
        title={formattedValue} // Show full value on hover
      >
        {formattedValue}
      </div>
    </div>
  )
}

/**
 * Specs block component
 */
export const SpecsBlock: React.FC<SpecsBlockProps> = ({
  specs = {},
  title = 'Specifications',
  columns = 2,
  theme = 'sleek',
  branding,
}) => {
  // Filter out empty/invalid specs
  const validSpecs = Object.entries(specs).filter(([key, value]) => {
    return key && key.trim() && value !== undefined && value !== null && value !== ''
  })

  // Get accent color from branding
  const getAccentColor = () => {
    if (branding?.primary) return branding.primary
    
    switch (theme) {
      case 'card':
        return '#3B82F6' // blue-500
      case 'poster':
        return '#8B5CF6' // purple-500
      default:
        return '#6B7280' // gray-500
    }
  }

  const accentColor = getAccentColor()

  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-6 bg-white rounded-lg shadow-sm',
          title: 'text-xl font-semibold mb-4 text-gray-800',
          grid: 'gap-3',
        }
      case 'poster':
        return {
          container: 'p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl',
          title: 'text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide',
          grid: 'gap-4',
        }
      default: // sleek
        return {
          container: 'p-4',
          title: 'text-lg font-medium mb-3 text-gray-900',
          grid: 'gap-0',
        }
    }
  }

  const themeClasses = getThemeClasses()

  // Grid column classes
  const getGridClasses = () => {
    const baseClasses = `${themeClasses.grid}`
    
    if (theme === 'sleek') {
      // Sleek theme uses a simple list layout
      return 'space-y-0'
    }
    
    switch (columns) {
      case 1:
        return `grid grid-cols-1 ${baseClasses}`
      case 3:
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${baseClasses}`
      default:
        return `grid grid-cols-1 md:grid-cols-2 ${baseClasses}`
    }
  }

  return (
    <div className={`specs-block ${themeClasses.container}`}>
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

      {/* Specifications grid/list */}
      {validSpecs.length > 0 ? (
        <div className={getGridClasses()}>
          {validSpecs.map(([key, value]) => (
            <SpecItem
              key={key}
              label={key}
              value={value}
              theme={theme}
              accentColor={accentColor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No specifications added yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add key-value pairs to display product details
          </p>
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const specsBlockDefaults: SpecsBlockProps = {
  type: 'specs',
  title: 'Specifications',
  specs: {
    'Year': 2024,
    'Make': 'Example Brand',
    'Model': 'Premium Series',
    'Length': '32 ft',
    'Width': '8 ft',
    'Weight': '8,500 lbs',
    'Sleeps': 6,
    'Fuel Type': 'Gasoline',
    'Engine': 'V8 6.2L',
    'Transmission': 'Automatic',
    'Features': 'Air Conditioning, Generator, Solar Ready',
  },
  columns: 2,
}

export default SpecsBlock