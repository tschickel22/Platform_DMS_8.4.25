import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Listing } from '@/types/listings'

interface ListingFormHeaderProps {
  listing?: Listing
  isEditing?: boolean
  listingId?: string
  formData?: any
  onCancel?: () => void
  onSave?: (data: any) => void
  onSubmit?: (data: any) => void
}

export default function ListingFormHeader({
  listing,
  isEditing,
  formData,
  onSubmit,
  onSave,
  onCancel
}: ListingFormHeaderProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSave = () => {
    if (onSave && formData) {
      onSave(formData)
    }
    toast({
      title: "Draft Saved",
      description: "Your listing has been saved as a draft.",
    })
  }

  const handleCreateListing = () => {
    if (onSubmit && formData) {
    }
    // Trigger the form submission
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {listing ? 'Edit Listing' : 'Create New Listing'}
        </CardTitle>
        <CardDescription>
          {listing ? 'Update the listing details below' : 'Fill in the details to create a new property listing'}
        </CardDescription>
      </CardHeader>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          type="button"
          onClick={handleCreateListing}
        >
          {isEditing ? 'Update Listing' : 'Create Listing'}
        </Button>
      </div>
    </div>
  )
}