import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Edit, Key, Trash2, User, Mail, Phone, Calendar } from 'lucide-react'
import { PortalAdminUserForm } from './PortalAdminUserForm'

interface PortalUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  createdAt: string
  permissions: {
    canViewLoans: boolean
    canViewAgreements: boolean
    canViewInvoices: boolean
    canMakePayments: boolean
    canUpdateProfile: boolean
  }
  portalAccess: {
    enabled: boolean
    features: string[]
  }
}

interface PortalAdminUserListProps {
  users: PortalUser[]
  onUserUpdate?: (user: PortalUser) => void
  onUserDelete?: (userId: string) => void
}

export function PortalAdminUserList({ users, onUserUpdate, onUserDelete }: PortalAdminUserListProps) {
  const { toast } = useToast()
  const [editingUser, setEditingUser] = useState<PortalUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<PortalUser | null>(null)

  const handleEditUser = (user: PortalUser) => {
    console.log('Edit user clicked:', user)
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleResetPassword = (user: PortalUser) => {
    console.log('Reset password clicked:', user)
    setResetPasswordUser(user)
    setIsResetPasswordDialogOpen(true)
  }

  const handleEditSubmit = (userData: any) => {
    if (editingUser) {
      const updatedUser = { ...editingUser, ...userData }
      onUserUpdate?.(updatedUser)
      
      toast({
        title: "User updated",
        description: `${userData.firstName} ${userData.lastName} has been updated successfully.`,
      })
    }
    
    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const handleEditCancel = () => {
    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const confirmResetPassword = () => {
    if (resetPasswordUser) {
      // Here you would typically call an API to reset the password
      toast({
        title: "Password reset sent",
        description: `A password reset email has been sent to ${resetPasswordUser.email}`,
      })
    }
    
    setIsResetPasswordDialogOpen(false)
    setResetPasswordUser(null)
  }

  const cancelResetPassword = () => {
    setIsResetPasswordDialogOpen(false)
    setResetPasswordUser(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'user': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No portal users found</p>
            <p>Portal users will appear here once they are added to the system.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portal Users</CardTitle>
          <CardDescription>
            Manage client portal user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="ri-table-row">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetPassword(user)}
                    >
                      <Key className="h-4 w-4 mr-1" />
                      Reset Password
                    </Button>
                    {onUserDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUserDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Portal User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <PortalAdminUserForm
              initialData={editingUser}
              onSubmit={handleEditSubmit}
              onCancel={handleEditCancel}
              submitLabel="Update User"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the password for this user?
            </DialogDescription>
          </DialogHeader>
          {resetPasswordUser && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{resetPasswordUser.firstName} {resetPasswordUser.lastName}</p>
                <p className="text-sm text-muted-foreground">{resetPasswordUser.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                A password reset email will be sent to the user's email address. They will be able to create a new password using the link in the email.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={cancelResetPassword}>
                  Cancel
                </Button>
                <Button onClick={confirmResetPassword}>
                  Send Reset Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}