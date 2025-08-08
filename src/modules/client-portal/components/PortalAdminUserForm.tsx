import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, User, Shield, Settings, Eye, Edit, Trash2 } from 'lucide-react'

interface PortalAdminUserFormProps {
  initialData?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    status: string
    permissions: string[]
    portalAccess: boolean
    notes: string
  }
  onSubmit: (data: any) => void
  onCancel: () => void
  submitLabel?: string
}

export function PortalAdminUserForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitLabel = "Create User" 
}: PortalAdminUserFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'client',
    status: initialData?.status || 'active',
    permissions: initialData?.permissions || [] as string[],
    portalAccess: initialData?.portalAccess ?? true,
    sendInvitation: !initialData, // Only send invitation for new users
    invitationMethod: 'email',
    notes: initialData?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }))
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">

  const availablePermissions = [
    { id: 'view_documents', label: 'View Documents' },
    { id: 'upload_documents', label: 'Upload Documents' },
    { id: 'view_billing', label: 'View Billing' },
    { id: 'manage_profile', label: 'Manage Profile' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'contact_support', label: 'Contact Support' }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Portal User Management
          </CardTitle>
          <CardDescription>
            Create or edit portal user accounts and permissions
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
        <div className="space-y-3">
          <h3 className="text-base font-medium">Role & Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Role and Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Role & Status</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">User Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Account Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
        <div className="space-y-3">
          <h3 className="text-base font-medium">Portal Access</h3>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          Inactive
                        </div>
                      </SelectItem>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Permissions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          Suspended
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Portal Access */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Portal Access</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Portal Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow user to access the client portal
                  </p>
                </div>
                <Switch
                  checked={formData.portalAccess}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, portalAccess: checked }))}
                />
              </div>

              {formData.portalAccess && (
                <div className="space-y-3">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Invitation Settings */}
            {!initialData && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Invitation Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Invitation</Label>
                    <p className="text-sm text-muted-foreground">
                      Send login credentials to the user
                    </p>
                  </div>
                  <Switch
                    checked={formData.sendInvitation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendInvitation: checked }))}
                  />
                </div>

                {formData.sendInvitation && (
                  <div>
                    <Label htmlFor="invitationMethod">Invitation Method</Label>
                    <Select
                      value={formData.invitationMethod}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, invitationMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="both">Both Email & SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
          <div className="space-y-3">
            <h3 className="text-base font-medium">Invitation Settings</h3>
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this user..."
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                {submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}