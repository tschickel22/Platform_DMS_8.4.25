import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { User, Mail, Phone, UserPlus } from 'lucide-react'

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
    // NOTE: incoming permissions as string[]; we’ll map these to flags
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
  submitLabel = 'Create User',
}: PortalAdminUserFormProps) {
  const defaultPerms = {
    viewDocuments: false,
    uploadDocuments: false,
    viewBilling: false,
    manageProfile: false,
    viewReports: false,
    contactSupport: false,
  }

  // Map string[] → permission flags if provided
  const mappedPerms =
    Array.isArray(initialData?.permissions)
      ? initialData!.permissions.reduce((acc: typeof defaultPerms, key) => {
          if (key in acc) (acc as any)[key] = true
          return acc
        }, { ...defaultPerms })
      : defaultPerms

  const [formData, setFormData] = useState<PortalUserFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'Client',
    status: initialData?.status || 'Active',
    portalAccess: initialData?.portalAccess ?? true,
    permissions: mappedPerms,
    sendInvitation: !initialData, // only for new users
    invitationMethod: 'Email',
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

      {/* Form (scrollable body + fixed-ish footer) */}
      <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
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
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
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
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
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
                  <Label htmlFor="portalAccess" className="text-sm font-medium">
                    Portal Access
                  </Label>
                </div>
                <Switch
                  id="portalAccess"
                  checked={formData.portalAccess}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, portalAccess: Boolean(checked) }))
                  }
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
                    contactSupport: 'Contact Support',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={
                          formData.permissions[key as keyof typeof formData.permissions]
                        }
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            permissions: {
                              ...prev.permissions,
                              [key]: Boolean(checked),
                            },
                          }))
                        }
                      />
                      <Label htmlFor={key} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invitation Settings - only for new users */}
            {!initialData && (
              <div className="space-y-3">
                <h3 className="text-base font-medium">Invitation Settings</h3>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="sendInvitation" className="text-sm font-medium">
                      Send Invitation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send login credentials to the user
                    </p>
                  </div>
                  <Switch
                    id="sendInvitation"
                    checked={formData.sendInvitation}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, sendInvitation: Boolean(checked) }))
                    }
                  />
                </div>

                {formData.sendInvitation && (
                  <div>
                    <Label htmlFor="invitationMethod">Invitation Method</Label>
                    <Select
                      value={formData.invitationMethod}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, invitationMethod: value }))
                      }
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

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t bg-background px-6 pb-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <UserPlus className="h-4 w-4 mr-2" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}
