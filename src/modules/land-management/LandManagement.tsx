import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
          <Plus className="mr-2 h-4 w-4" />
    <Routes>
      <Route path="/" element={<LandOverview />} />
      <Route path="/new" element={<LandFormPage />} />
      <Route path="/edit/:id" element={<LandFormPage />} />
      <Route path="/detail/:id" element={<LandDetail />} />
      <Route path="*" element={<Navigate to="/land/" replace />} />
    </Routes>
  )
}

function LandOverview() {
  const { lands, deleteLand } = useLandManagement()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      await deleteLand(id)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Land Management</h1>
          <p className="text-muted-foreground">
            Manage your land parcels and properties
          </p>
        </div>
        <Button asChild>
          <Link to="/land/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Land Parcel
          </Link>
        </Button>
      </div>

      <LandList
        lands={lands}
        onDelete={handleDelete}
      />
    </div>
  )
}

function LandFormPage() {
  const { addLand, updateLand, getLandById } = useLandManagement()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id } = useParams()
  
  const editingLand = id ? getLandById(id) : null

  const handleSave = async (landData: any) => {
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
      navigate('/land')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save land parcel",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    navigate('/land')
  }

  return (
    <LandForm
      initialData={editingLand}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}