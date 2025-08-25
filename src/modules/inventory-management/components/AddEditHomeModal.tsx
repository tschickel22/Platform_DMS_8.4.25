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
  const handleSubmit = (data: any) => {
    onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Manufactured Home' : 'Add New Manufactured Home'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MHInventoryForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}