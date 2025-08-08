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
import { Mail, Phone, User, Shield, Settings, Eye, Edit, Trash2, UserPlus } from 'lucide-react'

interface PortalUserFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: string
  portalAccess: boolean
  permissions: {
    viewDocuments: boolean
    uploadDocuments: boolean
    viewBilling: boolean
    manageProfile: boolean
    viewReports: boolean
    contactSupport: boolean
  }
  sendInvitation: boolean
  invitationMethod: string
}

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
  const [formData, setFormData] = useState<PortalUserFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'Client',
    status: initialData?.status || 'Active',
    portalAccess: initialData?.portalAccess ?? true,
    permissions: initialData?.permissions || {
      viewDocuments: false,
      uploadDocuments: false,
      viewBilling: false,
      manageProfile: false,
      viewReports: false,
      contactSupport: false
    },
    sendInvitation: !initialData, // Only send invitation for new users
    invitationMethod: 'Email'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 pb-4 border-b">
        <div className="flex items-center justify-center mb-2">
          <User className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold">Portal User Management</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Create or edit portal user accounts and permissions
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="p-6 space-y-4">
        {/* Basic Information */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
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
            <Label htmlFor="email">Email Address *</Label>
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

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Role & Status */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Role & Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="role">User Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Account Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                      Inactive
                    </div>
                  </SelectItem>
                  <SelectItem value="Suspended">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      Suspended
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Portal Access */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Portal Access</h3>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="portalAccess" className="text-sm font-medium">Portal Access</Label>
              <p className="text-xs text-muted-foreground">Allow user to access the client portal</p>
            </div>
            <Switch
              id="portalAccess"
              checked={formData.portalAccess}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, portalAccess: checked }))}
            />
          </div>
        </div>

        {/* Permissions */}
        {formData.portalAccess && (
          <div className="space-y-3">
            <h3 className="text-base font-medium">Permissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries({
                viewDocuments: 'View Documents',
                uploadDocuments: 'Upload Documents',
                viewBilling: 'View Billing',
                manageProfile: 'Manage Profile',
                viewReports: 'View Reports',
                contactSupport: 'Contact Support'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData.permissions[key as keyof typeof formData.permissions]}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, [key]: checked }
                      }))
                    }
                  />
                  <Label htmlFor={key} className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invitation Settings - Only show for new users */}
        {!initialData && (
          <div className="space-y-3">
            <h3 className="text-base font-medium">Invitation Settings</h3>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="sendInvitation" className="text-sm font-medium">Send Invitation</Label>
                <p className="text-xs text-muted-foreground">Send login credentials to the user</p>
              </div>
              <Switch
                id="sendInvitation"
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
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        </div>
        </div>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t bg-background">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          <UserPlus className="h-4 w-4 mr-2" />
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
      <div className="border-t bg-background p-6">