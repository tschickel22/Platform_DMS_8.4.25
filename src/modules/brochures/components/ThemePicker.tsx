/**
 * Brochure Builder - Theme Picker
 * 
 * Component for selecting brochure themes with live preview.
 * Updates template.theme immediately when selection changes.
 * 
 * Theme Visual Rules:
 * - Sleek: Minimal spacing, no borders, clean typography, subtle shadows
 * - Card: Card-based layout, medium spacing, soft shadows, rounded corners
 * - Poster: Bold typography, large spacing, gradient backgrounds, strong borders
 */

import React from 'react'
import { ThemeId } from '../types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface ThemePickerProps {
  /** Currently selected theme */
  selectedTheme: ThemeId
  /** Callback when theme changes */
  onThemeChange: (theme: ThemeId) => void
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Show theme descriptions */
  showDescriptions?: boolean
}

// Theme definitions with metadata
const THEMES = [
  {
    id: 'sleek' as ThemeId,
    name: 'Sleek',
    description: 'Modern, minimal design with clean lines',
    preview: {
      background: 'bg-white',
      accent: 'bg-gray-900',
      text: 'text-gray-900',
      spacing: 'compact',
      borders: 'none',
    },
    features: ['Minimal spacing', 'Clean typography', 'Subtle shadows', 'Professional'],
  },
  {
    id: 'card' as ThemeId,
    name: 'Card',
    description: 'Card-based layout with soft shadows',
    preview: {
      background: 'bg-gray-50',
      accent: 'bg-blue-600',
      text: 'text-gray-800',
      spacing: 'medium',
      borders: 'rounded',
    },
    features: ['Card layouts', 'Medium spacing', 'Soft shadows', 'Friendly'],
  },
  {
    id: 'poster' as ThemeId,
    name: 'Poster',
    description: 'Bold, poster-style with strong visual impact',
    preview: {
      background: 'bg-gradient-to-br from-blue-50 to-purple-50',
      accent: 'bg-purple-600',
      text: 'text-gray-900',
      spacing: 'large',
      borders: 'bold',
    },
    features: ['Bold typography', 'Large spacing', 'Gradient backgrounds', 'Eye-catching'],
  },
] as const

/**
 * Theme preview component showing visual style
 */
const ThemePreview: React.FC<{ theme: typeof THEMES[0]; isSelected: boolean }> = ({ 
  theme, 
  isSelected 
}) => (
  <div className={`
    relative p-3 rounded-lg border-2 transition-all duration-200
    ${isSelected 
      ? 'border-blue-500 bg-blue-50' 
      : 'border-gray-200 hover:border-gray-300 bg-white'
    }
  `}>
    {/* Theme preview mockup */}
    <div className={`
      ${theme.preview.background} 
      rounded-md p-3 mb-3 min-h-[80px] relative overflow-hidden
    `}>
      {/* Header bar */}
      <div className={`
        ${theme.preview.accent} 
        h-2 rounded-full mb-2 w-3/4
      `} />
      
      {/* Content lines */}
      <div className="space-y-1">
        <div className={`
          ${theme.preview.text === 'text-gray-900' ? 'bg-gray-300' : 'bg-gray-400'} 
          h-1 rounded w-full
        `} />
        <div className={`
          ${theme.preview.text === 'text-gray-900' ? 'bg-gray-300' : 'bg-gray-400'} 
          h-1 rounded w-2/3
        `} />
      </div>
      
      {/* Accent element */}
      <div className={`
        absolute bottom-2 right-2 w-4 h-4 rounded
        ${theme.preview.accent}
      `} />
      
      {/* Theme-specific styling indicators */}
      {theme.preview.borders === 'rounded' && (
        <div className="absolute top-1 right-1 w-2 h-2 border border-gray-400 rounded-full" />
      )}
      {theme.preview.borders === 'bold' && (
        <div className="absolute top-1 right-1 w-2 h-2 border-2 border-purple-400" />
      )}
    </div>
    
    {/* Theme name and selection indicator */}
    <div className="flex items-center justify-between">
      <span className="font-medium text-sm">{theme.name}</span>
      {isSelected && (
        <Badge variant="default" className="text-xs">
          Selected
        </Badge>
      )}
    </div>
  </div>
)

/**
 * Main theme picker component
 */
export const ThemePicker: React.FC<ThemePickerProps> = ({
  selectedTheme,
  onThemeChange,
  disabled = false,
  showDescriptions = false,
}) => {
  return (
    <div className="theme-picker">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Choose Theme
        </h3>
        {showDescriptions && (
          <p className="text-xs text-gray-600">
            Select a visual style for your brochure. You can change this anytime.
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {THEMES.map((theme) => (
          <Button
            key={theme.id}
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent"
            disabled={disabled}
            onClick={() => onThemeChange(theme.id)}
          >
            <ThemePreview 
              theme={theme} 
              isSelected={selectedTheme === theme.id} 
            />
          </Button>
        ))}
      </div>
      
      {showDescriptions && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm">
            <strong>{THEMES.find(t => t.id === selectedTheme)?.name} Theme:</strong>
            <p className="text-gray-600 mt-1">
              {THEMES.find(t => t.id === selectedTheme)?.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {THEMES.find(t => t.id === selectedTheme)?.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemePicker