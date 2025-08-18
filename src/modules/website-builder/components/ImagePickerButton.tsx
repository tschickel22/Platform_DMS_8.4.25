import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Image } from 'lucide-react'
import MediaManager from './MediaManager'

interface ImagePickerButtonProps {
  onImageSelect: (url: string) => void
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function ImagePickerButton({ 
  onImageSelect, 
  children, 
  variant = 'outline',
  size = 'sm',
  className 
}: ImagePickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleImageSelect = (media: { url: string }) => {
    onImageSelect(media.url)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Image className="h-4 w-4 mr-2" />
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <MediaManager 
            siteId="current" 
            onSelect={handleImageSelect}
            selectionMode={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}