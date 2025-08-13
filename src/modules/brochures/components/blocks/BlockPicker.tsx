/**
 * Brochure Builder - Block Picker Component
 * 
 * Component for selecting and adding new blocks to a brochure template.
 * Lists available block types with friendly names and sample defaults.
 * 
 * Block Types:
 * - Hero: Title, subtitle, background image
 * - Gallery: Image grid with responsive layout
 * - Specs: Key-value specification pairs
 * - Price: Formatted pricing with currency
 * - Features: Bullet point feature list
 * - CTA: Call-to-action with button
 * - Legal: Fine print and disclaimers
 * 
 * Features:
 * - Visual block type previews
 * - Sample default data for each block
 * - Drag-and-drop ready structure
 * - Theme-aware styling
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Image, 
  Grid3X3, 
  List, 
  DollarSign, 
  CheckSquare, 
  MousePointer, 
  FileText,
  Plus
} from 'lucide-react'
import { BrochureBlock } from '../../types'
import { heroBlockDefaults } from './HeroBlock'
import { galleryBlockDefaults } from './GalleryBlock'
import { specsBlockDefaults } from './SpecsBlock'
import { priceBlockDefaults } from './PriceBlock'
import { featuresBlockDefaults } from './FeaturesBlock'
import { ctaBlockDefaults } from './CTABlock'
import { legalBlockDefaults } from './LegalBlock'

export interface BlockPickerProps {
  /** Callback when a block type is selected */
  onBlockAdd: (block: BrochureBlock) => void
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Show block descriptions */
  showDescriptions?: boolean
}

// Block type definitions with metadata
const BLOCK_TYPES = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Eye-catching header with title, subtitle, and background image',
    icon: <Image className="w-5 h-5" />,
    color: 'bg-blue-500',
    defaults: heroBlockDefaults,
    category: 'Header',
  },
  {
    type: 'gallery',
    name: 'Photo Gallery',
    description: 'Responsive image grid with lightbox support',
    icon: <Grid3X3 className="w-5 h-5" />,
    color: 'bg-green-500',
    defaults: galleryBlockDefaults,
    category: 'Media',
  },
  {
    type: 'specs',
    name: 'Specifications',
    description: 'Key-value pairs for technical details and features',
    icon: <List className="w-5 h-5" />,
    color: 'bg-purple-500',
    defaults: specsBlockDefaults,
    category: 'Content',
  },
  {
    type: 'price',
    name: 'Pricing',
    description: 'Formatted price display with currency and savings',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-600',
    defaults: priceBlockDefaults,
    category: 'Sales',
  },
  {
    type: 'features',
    name: 'Features List',
    description: 'Bullet point list of key features and benefits',
    icon: <CheckSquare className="w-5 h-5" />,
    color: 'bg-indigo-500',
    defaults: featuresBlockDefaults,
    category: 'Content',
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Action button with headline and contact information',
    icon: <MousePointer className="w-5 h-5" />,
    color: 'bg-red-500',
    defaults: ctaBlockDefaults,
    category: 'Sales',
  },
  {
    type: 'legal',
    name: 'Legal Text',
    description: 'Fine print, disclaimers, and legal information',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-gray-500',
    defaults: legalBlockDefaults,
    category: 'Footer',
  },
] as const

/**
 * Individual block type card component
 */
const BlockTypeCard: React.FC<{
  blockType: typeof BLOCK_TYPES[0]
  onAdd: () => void
  disabled?: boolean
  showDescription?: boolean
}> = ({ blockType, onAdd, disabled = false, showDescription = false }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onAdd}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${blockType.color} text-white`}>
            {blockType.icon}
          </div>
          <div>
            <CardTitle className="text-sm font-medium">
              {blockType.name}
            </CardTitle>
            <Badge variant="secondary" className="text-xs mt-1">
              {blockType.category}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onAdd()
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
    
    {showDescription && (
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 leading-relaxed">
          {blockType.description}
        </p>
      </CardContent>
    )}
  </Card>
)

/**
 * Block picker component
 */
export const BlockPicker: React.FC<BlockPickerProps> = ({
  onBlockAdd,
  disabled = false,
  showDescriptions = true,
}) => {
  // Handle block addition
  const handleAddBlock = (blockType: typeof BLOCK_TYPES[0]) => {
    if (disabled) return
    
    // Create a new block with default data and unique ID
    const newBlock: BrochureBlock = {
      ...blockType.defaults,
      id: `${blockType.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    } as BrochureBlock

    onBlockAdd(newBlock)
  }

  // Group blocks by category
  const blocksByCategory = BLOCK_TYPES.reduce((acc, blockType) => {
    if (!acc[blockType.category]) {
      acc[blockType.category] = []
    }
    acc[blockType.category].push(blockType)
    return acc
  }, {} as Record<string, typeof BLOCK_TYPES[0][]>)

  const categories = ['Header', 'Media', 'Content', 'Sales', 'Footer']

  return (
    <div className="block-picker space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          Add Block
        </h3>
        <Badge variant="outline" className="text-xs">
          {BLOCK_TYPES.length} types
        </Badge>
      </div>

      {/* Block types by category */}
      {categories.map((category) => {
        const categoryBlocks = blocksByCategory[category] || []
        if (categoryBlocks.length === 0) return null

        return (
          <div key={category} className="space-y-3">
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {category}
            </h4>
            <div className="space-y-2">
              {categoryBlocks.map((blockType) => (
                <BlockTypeCard
                  key={blockType.type}
                  blockType={blockType}
                  onAdd={() => handleAddBlock(blockType)}
                  disabled={disabled}
                  showDescription={showDescriptions}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Usage tips */}
      <div className="p-3 bg-blue-50 rounded-md">
        <div className="text-xs text-blue-800">
          <strong>Tips:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>Start with a Hero block for impact</li>
            <li>Use Gallery for visual appeal</li>
            <li>End with CTA for conversions</li>
            <li>Add Legal for compliance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BlockPicker