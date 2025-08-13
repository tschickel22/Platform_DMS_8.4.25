/**
 * Brochure Builder - Brochure Renderer
 * 
 * Core rendering component that displays brochures with theme support.
 * Maintains a registry of block components and handles unknown types gracefully.
 * Applies token resolution to textual properties before rendering.
 * 
 * Resilience Guarantees:
 * - Never crashes on missing blocks, unknown types, or malformed props
 * - Unknown block types render as fallback chips
 * - Missing data shows placeholder content
 * - Token resolution failures return original text
 * 
 * Export Mode: Uses default export to prevent import conflicts
 */

import React from 'react'
import { BrochureTemplate, BrochureBlock, ThemeId } from '../types'
import { resolveTokens } from '../utils/tokens'
import { HeroBlock } from './blocks/HeroBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { SpecsBlock } from './blocks/SpecsBlock'
import { PriceBlock } from './blocks/PriceBlock'
import { FeaturesBlock } from './blocks/FeaturesBlock'
import { CTABlock } from './blocks/CTABlock'
import { LegalBlock } from './blocks/LegalBlock'

// Block component registry - maps block types to their components
const BLOCK_REGISTRY = {
  hero: HeroBlock,
  gallery: GalleryBlock,
  specs: SpecsBlock,
  price: PriceBlock,
  features: FeaturesBlock,
  cta: CTABlock,
  legal: LegalBlock,
} as const

// Fallback component for unknown block types
const UnknownBlock: React.FC<{ block: BrochureBlock }> = ({ block }) => (
  <div className="p-4 bg-gray-100 border border-gray-300 rounded-md text-center">
    <div className="text-sm text-gray-600 mb-2">
      Unknown block type: <code className="bg-gray-200 px-1 rounded">{block.type}</code>
    </div>
    <div className="text-xs text-gray-500">
      This block type is not supported in the current version
    </div>
  </div>
)

// Theme-specific CSS classes
const THEME_CLASSES = {
  sleek: {
    container: 'bg-white font-sans',
    spacing: 'space-y-0',
    borders: 'border-none',
    typography: 'text-gray-900',
  },
  card: {
    container: 'bg-gray-50 font-sans',
    spacing: 'space-y-6',
    borders: 'border border-gray-200 rounded-lg shadow-sm',
    typography: 'text-gray-800',
  },
  poster: {
    container: 'bg-gradient-to-br from-blue-50 to-purple-50 font-bold',
    spacing: 'space-y-8',
    borders: 'border-2 border-blue-200 rounded-xl shadow-lg',
    typography: 'text-gray-900',
  },
} as const

export interface BrochureRendererProps {
  /** Template data to render */
  data: BrochureTemplate
  /** Theme override (uses template.theme if not provided) */
  theme?: ThemeId
  /** Context data for token resolution */
  binding?: Record<string, any>
  /** Additional CSS classes */
  className?: string
  /** Whether to show edit controls (for editor mode) */
  editable?: boolean
  /** Callback when a block is selected (editor mode) */
  onBlockSelect?: (blockIndex: number) => void
  /** Currently selected block index (editor mode) */
  selectedBlockIndex?: number
}

/**
 * Main brochure renderer component
 * Renders a complete brochure with theme styling and token resolution
 */
const BrochureRenderer: React.FC<BrochureRendererProps> = ({
  data,
  theme,
  binding = {},
  className = '',
  editable = false,
  onBlockSelect,
  selectedBlockIndex,
}) => {
  // Use theme from props or template data, fallback to 'sleek'
  const activeTheme = theme || data.theme || 'sleek'
  const themeClasses = THEME_CLASSES[activeTheme] || THEME_CLASSES.sleek

  // Safely handle missing or invalid blocks array
  const blocks = Array.isArray(data.blocks) ? data.blocks : []

  // Apply token resolution to a block's props
  const resolveBlockTokens = (block: BrochureBlock): BrochureBlock => {
    try {
      // Create a deep copy to avoid mutating original data
      const resolvedBlock = JSON.parse(JSON.stringify(block))
      
      // Recursively resolve tokens in string properties
      const resolveInObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return resolveTokens(obj, binding)
        }
        if (Array.isArray(obj)) {
          return obj.map(resolveInObject)
        }
        if (obj && typeof obj === 'object') {
          const resolved: any = {}
          for (const [key, value] of Object.entries(obj)) {
            resolved[key] = resolveInObject(value)
          }
          return resolved
        }
        return obj
      }

      return resolveInObject(resolvedBlock)
    } catch (error) {
      console.warn('Token resolution failed for block:', block.type, error)
      return block // Return original block if resolution fails
    }
  }

  // Render a single block with error boundary
  const renderBlock = (block: BrochureBlock, index: number) => {
    try {
      // Resolve tokens in block props
      const resolvedBlock = resolveBlockTokens(block)
      
      // Get component from registry
      const BlockComponent = BLOCK_REGISTRY[block.type as keyof typeof BLOCK_REGISTRY]
      
      if (!BlockComponent) {
        return <UnknownBlock key={index} block={block} />
      }

      // Render block with selection handling for editor mode
      const blockElement = (
        <BlockComponent
          key={index}
          {...resolvedBlock}
          theme={activeTheme}
          branding={data.branding}
        />
      )

      // Wrap with selection handler for editor mode
      if (editable && onBlockSelect) {
        const isSelected = selectedBlockIndex === index
        return (
          <div
            key={index}
            className={`
              relative cursor-pointer transition-all duration-200
              ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'}
            `}
            onClick={() => onBlockSelect(index)}
          >
            {blockElement}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Selected
              </div>
            )}
          </div>
        )
      }

      return blockElement
    } catch (error) {
      console.error('Block render error:', error, block)
      return (
        <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600 text-sm">
            Error rendering block: {block.type}
          </div>
        </div>
      )
    }
  }

  return (
    <div 
      className={`
        brochure-renderer
        ${themeClasses.container}
        ${themeClasses.typography}
        ${className}
      `}
      data-theme={activeTheme}
    >
      <div className={`
        ${themeClasses.spacing}
        ${editable ? 'p-4' : 'p-0'}
      `}>
        {blocks.length > 0 ? (
          blocks.map((block, index) => renderBlock(block, index))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-lg mb-2">No blocks added yet</div>
            <div className="text-sm">
              {editable ? 'Add blocks from the left panel to get started' : 'This brochure is empty'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrochureRenderer