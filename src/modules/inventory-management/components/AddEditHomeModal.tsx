import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MHInventoryForm from '../forms/MHInventoryForm'

interface AddEditHomeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function AddEditHomeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: AddEditHomeModalProps) {
  // Radix Dialog's onOpenChange passes (open:boolean) => void
  // We just close when it flips to false.
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Manufactured Home' : 'Add Manufactured Home'}
          </DialogTitle>
        </DialogHeader>

        <MHInventoryForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
