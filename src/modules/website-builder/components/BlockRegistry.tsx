import React from 'react'
import { BlockType } from '../types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Type, 
  Image, 
  MousePointer, 
  Phone, 
  Images, 
  Package, 
  Home,
  Layout
} from 'lucide-react'

interface BlockRegistryProps {
  onSelectBlock: (blockType: BlockType) => void
  onClose: () => void
}

const blockTypes = [
  {
    type: BlockType.HERO,
    name: 'Hero Section',
    description: 'Large banner with title, subtitle, and call-to-action',
    icon: Layout,
    category: 'Layout'
  },
  {
    type: BlockType.TEXT,
    name: 'Text Content',
    description: 'Rich text content with HTML formatting',
    icon: Type,
    category: 'Content'
  },
  {
    type: BlockType.IMAGE,
    name: 'Image',
    description: 'Single image with caption and alt text',
    icon: Image,
    category: 'Media'
  },
  {
    type: BlockType.GALLERY,
    name: 'Image Gallery',
    description: 'Grid of images with lightbox functionality',
    icon: Images,
    category: 'Media'
  },
  {
    type: BlockType.CTA,
    name: 'Call to Action',
    description: 'Prominent button or link to drive conversions',
    icon: MousePointer,
    category: 'Marketing'
  },
  {
    type: BlockType.CONTACT,
    name: 'Contact Form',
    description: 'Contact form with customizable fields',
    icon: Phone,
    category: 'Forms'
  },
  {
    type: BlockType.INVENTORY,
    name: 'Inventory Showcase',
    description: 'Display RVs and manufactured homes from your inventory',
    icon: Package,
    category: 'Business'
  },
  {
    type: BlockType.LAND_HOME,
    name: 'Land & Home Deals',
    description: 'Showcase land and home packages with pricing',
    icon: Home,
    category: 'Business'
  }
]

const categories = ['All', 'Layout', 'Content', 'Media', 'Marketing', 'Forms', 'Business']

export function BlockRegistry({ onSelectBlock, onClose }: BlockRegistryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredBlocks = selectedCategory === 'All' 
    ? blockTypes 
    : blockTypes.filter(block => block.category === selectedCategory)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Block</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Block Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlocks.map(block => (
              <Card 
                key={block.type}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelectBlock(block.type)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <block.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">{block.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">
                    {block.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}