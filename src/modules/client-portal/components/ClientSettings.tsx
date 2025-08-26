import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, User, Mail, Phone } from 'lucide-react'
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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your basic account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={getDisplayName()} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={getDisplayEmail()} 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact your account manager to update your profile information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Communication Preferences
            </CardTitle>
            <CardDescription>
              How you'd like to receive updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Communication preferences coming soon</p>
              <p className="text-sm">You'll be able to manage your notification settings here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}