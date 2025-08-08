import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useToast } from '@/hooks/use-toast'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home } from 'lucide-react'
import { Listing } from '@/types/listings'
import { Listing } from '@/types/listings'

interface ListingFormHeaderProps {
  listing?: Listing
  isEditing?: boolean
  listingId?: string
  listing?: Listing
  isEditing?: boolean
  listingId?: string
  onSubmit?: (data: any) => void
  onSave?: (data: any) => void
  onCancel?: () => void
  formData?: any
}

export default function ListingFormHeader({ listing, isEditing, onCancel, onSave, onSubmit, formData }: ListingFormHeaderProps) {
  listing,
  isEditing,
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSave = () => {
    console.log('Creating listing with data:', formData)
    if (onSave && formData) {
      onSave(formData)
    }
    toast({
      title: "Draft Saved",
      description: "Your listing has been saved as a draft.",
  onSave,
  onCancel
  }
  const navigate = useNavigate()
  const { toast } = useToast()
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(-1)
    }
  }

  const handleSave = () => {
    if (onSave && formData) {
      onSave(formData)
      toast({
        title: "Draft Saved",
        description: "Your listing has been saved as a draft.",
      })
    } else {
      toast({
        title: "Nothing to Save",
        description: "No draft handler is configured.",
        variant: 'warning'
      })
    }
  }

  const handleCreateOrUpdate = () => {
    if (onSubmit && formData) {
      onSubmit(formData)
      // after successful create/update, navigate back to listing overview
      navigate('/listings')
    } else {
      toast({
        title: isEditing ? "Nothing to Update" : "Nothing to Create",
        description: "No submission handler is configured.",
        variant: 'warning'
      })
    }
  }

        </CardDescription>
            {listing
              ? 'Update the listing details below'
              : 'Fill in the details to create a new property listing'}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
            {listing ? 'Edit Listing' : 'Create New Listing'}
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={handleCreateListing}
        <Button onClick={handleCreateOrUpdate}>
          {isEditing ? 'Update Listing' : 'Create Listing'}
        </Button>
      </div>
    </div>
  )
}