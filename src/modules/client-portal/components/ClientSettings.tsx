import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, User, Mail, Phone, Lock } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'

export function ClientSettings() {
  const { getDisplayName, getDisplayEmail } = usePortal()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and information
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Your basic account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={getDisplayName()} 
                readOnly 
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={getDisplayEmail()} 
                readOnly 
                className="bg-muted"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            To update your profile information, please contact customer support.
          </p>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Preferences
          </CardTitle>
          <CardDescription>
            How you'd like to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via text message</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded before payments are due</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              placeholder="Enter current password"
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              placeholder="Enter new password"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Confirm new password"
            />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Need Help?
          </CardTitle>
          <CardDescription>
            Contact our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">(555) 123-4567</p>
              </div>
              <Button variant="outline" size="sm">
                Call Now
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@renterinsight.com</p>
              </div>
              <Button variant="outline" size="sm">
                Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}