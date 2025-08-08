import React from 'react'
import { Button } from '@/components/ui/button'
import { Listing } from '@/types/listings'

interface FormActionsProps {
  listing?: Listing
  onCancel: () => void
  handleSubmit: (e: React.FormEvent) => void
}

export default function FormActions({
  listing,
  onCancel,
  handleSubmit
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-6">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" onClick={handleSubmit}>
        {listing ? 'Update Listing' : 'Create Listing'}
      </Button>
    </div>
  )
}