import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { LandForm } from './components/LandForm'
import { LandList } from './components/LandList'
import { useLandManagement } from './hooks/useLandManagement'
import { useToast } from '@/hooks/use-toast'

export default function LandManagement() {
  const { lands, addLand, updateLand, deleteLand } = useLandManagement()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingLand, setEditingLand] = useState(null)

  const handleAddNew = () => {
    setIsAdding(true)
    setEditingLand(null)
  }

  const handleEdit = (land) => {
    setEditingLand(land)
    setIsAdding(false)
  }

  const handleSave = async (landData) => {
    try {
      if (editingLand) {
        await updateLand(editingLand.id, landData)
        toast({
          title: "Success",
          description: "Land parcel updated successfully",
        })
      } else {
        await addLand(landData)
        toast({
          title: "Success", 
          description: "Land parcel added successfully",
        })
      }
      setIsAdding(false)
      setEditingLand(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save land parcel",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingLand(null)
  }

  const handleDelete = async (landId) => {
    try {
      await deleteLand(landId)
      toast({
        title: "Success",
        description: "Land parcel deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete land parcel",
        variant: "destructive",
      })
    }
  }

  // Show form when adding or editing
  if (isAdding || editingLand) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {editingLand ? 'Edit Land Parcel' : 'Add New Land Parcel'}
            </h1>
            <p className="text-muted-foreground">
              {editingLand ? 'Update land parcel information' : 'Add a new land parcel to your inventory'}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <LandForm
              initialData={editingLand}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Land Management</h1>
          <p className="text-muted-foreground">
            Manage your land inventory and parcels
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Land Parcel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Land Parcels</CardTitle>
          <CardDescription>
            View and manage all your land parcels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LandList
            lands={lands}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}