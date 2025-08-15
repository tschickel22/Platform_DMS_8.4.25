import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SyndicationSettings from '@/modules/platform-admin/components/SyndicationSettings'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { WarrantyIntegrationSettings } from './components/WarrantyIntegrationSettings'
import { useSettings } from './utils/useSettings'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Settings, Mail, Phone, MessageSquare, CreditCard, Shield, Globe } from 'lucide-react'
import GeneralSettings from './components/GeneralSettings'
import EmailSettings from './components/EmailSettings'
import VoiceSettings from './components/VoiceSettings'
import SmsSettings from './components/SmsSettings'
import PaymentSettings from './components/PaymentSettings'
import PropertyListingsSettings from '../components/PropertyListingsSettings'

export default function PlatformAdminSettings() {
  const { toast } = useToast()
  const { settings, updateSettings, isLoading } = useSettings()
  const [activeTab, setActiveTab] = useState('general')

  const handleSettingsChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    toast({
      title: "Settings Updated",
      description: `${key} has been updated successfully.`,
    })
  }

  if (isLoading) {
    return <div>Loading settings...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure global platform settings and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="syndication" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Syndication
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="warranty" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Warranty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="syndication">
          <PropertyListingsSettings />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="sms">
          <SmsSettings />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceSettings />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="warranty">
          <WarrantyIntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}