import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Image, 
  Type, 
  Grid, 
  Star, 
  DollarSign, 
  MousePointer, 
  FileText 
} from 'lucide-react'

interface BlockPickerProps {
  onSelectBlock: (blockType: string) => void
  onClose: () => void
}

const blockTypes = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Large banner with title, subtitle, and background image',
    icon: Image
  },
  {
    type: 'gallery',
    name: 'Property Gallery',
    description: 'Grid or list view of selected properties',
    icon: Grid
  },
  {
    type: 'features',
    name: 'Features List',
    description: 'Highlight key features or benefits',
    icon: Star
  },
  {
    type: 'specs',
    name: 'Specifications',
    description: 'Detailed property specifications table',
    icon: FileText
  },
  {
    type: 'price',
    name: 'Pricing Section',
    description: 'Pricing information and financing options',
    icon: DollarSign
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Contact form or action button',
    icon: MousePointer
  },
  {
    type: 'legal',
    name: 'Legal/Disclaimer',
    description: 'Legal text and disclaimers',
    icon: Type
  }
]

export function BlockPicker({ onSelectBlock, onClose }: BlockPickerProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Block</DialogTitle>
          <DialogDescription>
            Choose a block type to add to your template
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          {blockTypes.map((blockType) => (
            <Card 
              key={blockType.type}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectBlock(blockType.type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <blockType.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{blockType.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{blockType.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}