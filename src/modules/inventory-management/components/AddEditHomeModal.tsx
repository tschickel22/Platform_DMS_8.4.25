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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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