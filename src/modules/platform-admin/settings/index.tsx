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

export default function PlatformAdminSettings() {
  const { toast } = useToast()
  const { settings, updateSettings, isLoading } = useSettings()

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
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="syndication">Syndication</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="warranty">Warranty</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    value={settings.platformName || ''}
                    onChange={(e) => handleSettingsChange('platformName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings.supportEmail || ''}
                    onChange={(e) => handleSettingsChange('supportEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to prevent user access
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode || false}
                  onCheckedChange={(checked) => handleSettingsChange('maintenanceMode', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Textarea
                  id="maintenance-message"
                  placeholder="Enter maintenance message..."
                  value={settings.maintenanceMessage || ''}
                  onChange={(e) => handleSettingsChange('maintenanceMessage', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="syndication">
          <SyndicationSettings />
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email service provider and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-provider">Email Provider</Label>
                <Select
                  value={settings.emailProvider || 'sendgrid'}
                  onValueChange={(value) => handleSettingsChange('emailProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    value={settings.smtpHost || ''}
                    onChange={(e) => handleSettingsChange('smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={settings.smtpPort || ''}
                    onChange={(e) => handleSettingsChange('smtpPort', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SSL/TLS</Label>
                  <p className="text-sm text-muted-foreground">
                    Use secure connection for email sending
                  </p>
                </div>
                <Switch
                  checked={settings.emailSSL || false}
                  onCheckedChange={(checked) => handleSettingsChange('emailSSL', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Settings</CardTitle>
              <CardDescription>
                Configure SMS service provider and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <Select
                  value={settings.smsProvider || 'twilio'}
                  onValueChange={(value) => handleSettingsChange('smsProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="nexmo">Nexmo</SelectItem>
                    <SelectItem value="textmagic">TextMagic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-api-key">API Key</Label>
                  <Input
                    id="sms-api-key"
                    type="password"
                    value={settings.smsApiKey || ''}
                    onChange={(e) => handleSettingsChange('smsApiKey', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-from-number">From Number</Label>
                  <Input
                    id="sms-from-number"
                    value={settings.smsFromNumber || ''}
                    onChange={(e) => handleSettingsChange('smsFromNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the platform to send SMS notifications
                  </p>
                </div>
                <Switch
                  checked={settings.smsEnabled || false}
                  onCheckedChange={(checked) => handleSettingsChange('smsEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice Settings</CardTitle>
              <CardDescription>
                Configure voice call service provider and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voice-provider">Voice Provider</Label>
                <Select
                  value={settings.voiceProvider || 'twilio'}
                  onValueChange={(value) => handleSettingsChange('voiceProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="nexmo">Nexmo</SelectItem>
                    <SelectItem value="plivo">Plivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-api-key">API Key</Label>
                  <Input
                    id="voice-api-key"
                    type="password"
                    value={settings.voiceApiKey || ''}
                    onChange={(e) => handleSettingsChange('voiceApiKey', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-from-number">From Number</Label>
                  <Input
                    id="voice-from-number"
                    value={settings.voiceFromNumber || ''}
                    onChange={(e) => handleSettingsChange('voiceFromNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Voice Calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the platform to make voice calls
                  </p>
                </div>
                <Switch
                  checked={settings.voiceEnabled || false}
                  onCheckedChange={(checked) => handleSettingsChange('voiceEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-provider">Payment Provider</Label>
                <Select
                  value={settings.paymentProvider || 'stripe'}
                  onValueChange={(value) => handleSettingsChange('paymentProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-public-key">Public Key</Label>
                  <Input
                    id="payment-public-key"
                    value={settings.paymentPublicKey || ''}
                    onChange={(e) => handleSettingsChange('paymentPublicKey', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-secret-key">Secret Key</Label>
                  <Input
                    id="payment-secret-key"
                    type="password"
                    value={settings.paymentSecretKey || ''}
                    onChange={(e) => handleSettingsChange('paymentSecretKey', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable test mode for payment processing
                  </p>
                </div>
                <Switch
                  checked={settings.paymentTestMode || false}
                  onCheckedChange={(checked) => handleSettingsChange('paymentTestMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty">
          <WarrantyIntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}