import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Type, 
  Image, 
  MousePointer, 
  Phone, 
  Star,
  Grid3X3,
  Quote,
  Video,
  Map,
  Calendar
} from 'lucide-react'

interface AddBlockMenuProps {
  onSelectBlock: (blockType: string) => void
  onClose: () => void
}

const blockTypes = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Large banner with title, subtitle, and call-to-action',
    icon: MousePointer,
    category: 'Layout'
  },
  {
    type: 'text',
    name: 'Text Block',
    description: 'Rich text content with formatting options',
    icon: Type,
    category: 'Content'
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Single image with caption and alignment options',
    icon: Image,
    category: 'Media'
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'Grid of images with lightbox functionality',
    icon: Grid3X3,
    category: 'Media'
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Prominent section to drive user actions',
    icon: MousePointer,
    category: 'Marketing'
  },
  {
    type: 'contact',
    name: 'Contact Info',
    description: 'Contact details and contact form',
    icon: Phone,
    category: 'Business'
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Customer reviews and testimonials',
    icon: Quote,
    category: 'Social Proof'
  },
  {
    type: 'features',
    name: 'Features Grid',
    description: 'Highlight key features or services',
    icon: Star,
    category: 'Marketing'
  },
  {
    type: 'video',
    name: 'Video',
    description: 'Embedded video content',
    icon: Video,
    category: 'Media'
  },
  {
    type: 'map',
    name: 'Map',
    description: 'Interactive map with location marker',
    icon: Map,
    category: 'Business'
  }
]

const categories = ['All', 'Layout', 'Content', 'Media', 'Marketing', 'Business', 'Social Proof']

export default function AddBlockMenu({ onSelectBlock, onClose }: AddBlockMenuProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredBlocks = selectedCategory === 'All' 
    ? blockTypes 
    : blockTypes.filter(block => block.category === selectedCategory)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {filteredBlocks.map((blockType) => (
              <Card
                key={blockType.type}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectBlock(blockType.type)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <blockType.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{blockType.name}</CardTitle>
                      <div className="text-xs text-muted-foreground">{blockType.category}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">
                    {blockType.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No blocks found in this category</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}