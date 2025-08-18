import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Image } from 'lucide-react'
import MediaManager from './MediaManager'

interface ImagePickerButtonProps {
  onImageSelect: (url: string) => void
  buttonText?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  siteId?: string
}

export function ImagePickerButton({
  onImageSelect,
  buttonText = 'Choose Image',
  variant = 'outline',
  size = 'default',
  siteId
}: ImagePickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleImageSelect = (url: string) => {
    onImageSelect(url)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="w-full">
          <Image className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <MediaManager
            siteId={siteId || 'default'}
            onImageSelect={handleImageSelect}
            mode="picker"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}