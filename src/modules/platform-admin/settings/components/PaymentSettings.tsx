import React, { useState } from 'react'
import { Switch } from '../../../../components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CreditCard, DollarSign, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function PaymentSettings({ settings, onChange }: PaymentSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ];
  const [paymentSettings, setPaymentSettings] = useState({
    processor: settings?.payment?.processor || 'none',
    stripePublishableKey: settings?.payment?.stripePublishableKey || '',
    stripeSecretKey: settings?.payment?.stripeSecretKey || '',
    stripeWebhookSecret: settings?.payment?.stripeWebhookSecret || '',
    paypalClientId: settings?.payment?.paypalClientId || '',
    paypalClientSecret: settings?.payment?.paypalClientSecret || '',
    squareApplicationId: settings?.payment?.squareApplicationId || '',
    squareAccessToken: settings?.payment?.squareAccessToken || '',
    testMode: settings?.payment?.testMode || true,
  });

  const paymentGateways = [
    { value: 'none', label: 'None' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'square', label: 'Square' }
  ];

  const handlePaymentUpdate = (field: string, value: any) => {
    const updated = { ...paymentSettings, [field]: value };
    setPaymentSettings(updated);
    onChange({ payment: updated });
  };

  const getProcessorStatus = () => {
    switch (paymentSettings.processor) {
      case 'stripe':
        return paymentSettings.stripePublishableKey && paymentSettings.stripeSecretKey 
          ? { status: 'configured', color: 'default' } 
          : { status: 'incomplete', color: 'destructive' };
      case 'paypal':
        return paymentSettings.paypalClientId && paymentSettings.paypalClientSecret 
          ? { status: 'configured', color: 'default' } 
          : { status: 'incomplete', color: 'destructive' };
      case 'square':
        return paymentSettings.squareApplicationId && paymentSettings.squareAccessToken 
          ? { status: 'configured', color: 'default' } 
          : { status: 'incomplete', color: 'destructive' };
      case 'none':
      default:
        return { status: 'disabled', color: 'secondary' };
    }
  };

  const processorStatus = getProcessorStatus();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="currency">Default Currency</Label>
            <Badge variant={processorStatus.color as any}>
              {processorStatus.status === 'configured' && <CheckCircle className="w-3 h-3 mr-1" />}
              {processorStatus.status === 'incomplete' && <AlertCircle className="w-3 h-3 mr-1" />}
              {processorStatus.status.charAt(0).toUpperCase() + processorStatus.status.slice(1)}
            </Badge>
            <Select
              value={settings.currency || 'USD'}
              onValueChange={(value) => handleChange('currency', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input
              id="currencySymbol"
              value={settings.currencySymbol || '$'}
              onChange={(e) => handleChange('currencySymbol', e.target.value)}
              className="max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              value={(settings.taxRate * 100) || 0}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) / 100)}
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Gateway Integration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentGateway">Select Payment Gateway</Label>
            <Select
              value={settings.paymentGateway || 'none'}
              onValueChange={(value) => handleChange('paymentGateway', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentGateways.map(gateway => (
                  <SelectItem key={gateway.value} value={gateway.value}>
                    {gateway.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {settings.paymentGateway === 'stripe' && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Stripe Configuration</h4>
              <div>
                <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
                <Input
                  id="stripePublishableKey"
                  value={settings.stripePublishableKey || ''}
                  onChange={(e) => handleChange('stripePublishableKey', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey || ''}
                  onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                  className="max-w-md"
                />
              </div>
            </div>
          )}

          {/* Payment Processor Selection */}
          <div className="space-y-2">
            <Label htmlFor="processor">Payment Processor</Label>
            <Select
              value={paymentSettings.processor}
              onValueChange={(value) => handlePaymentUpdate('processor', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment processor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Disabled)</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="test-mode">Test Mode</Label>
              <p className="text-sm text-gray-600">Use sandbox/test environment for payments</p>
            </div>
            <Switch
              id="test-mode"
              checked={paymentSettings.testMode}
              onCheckedChange={(checked) => handlePaymentUpdate('testMode', checked)}
            />
          </div>

          <Separator />

          {/* Stripe Configuration */}
          {paymentSettings.processor === 'stripe' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Stripe Configuration</h3>
                <p className="text-sm text-gray-600">Configure your Stripe payment gateway</p>
              </div>
              
              <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
                  <Input
                    id="stripe-publishable-key"
                    type="text"
                    value={paymentSettings.stripePublishableKey}
                    onChange={(e) => handlePaymentUpdate('stripePublishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret-key">Secret Key</Label>
                  <Input
                    id="stripe-secret-key"
                    type="password"
                    value={paymentSettings.stripeSecretKey}
                    onChange={(e) => handlePaymentUpdate('stripeSecretKey', e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                  <Input
                    id="stripe-webhook-secret"
                    type="password"
                    value={paymentSettings.stripeWebhookSecret}
                    onChange={(e) => handlePaymentUpdate('stripeWebhookSecret', e.target.value)}
                    placeholder="whsec_..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableSubscriptions"
              checked={settings.enableSubscriptions || false}
              onCheckedChange={(checked) => handleChange('enableSubscriptions', !!checked)}
            />
            <Label htmlFor="enableSubscriptions">Enable Subscription Payments</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableInvoiceGeneration"
              checked={settings.enableInvoiceGeneration || false}
              onCheckedChange={(checked) => handleChange('enableInvoiceGeneration', !!checked)}
            />
            <Label htmlFor="enableInvoiceGeneration">Enable Invoice Generation</Label>
          </div>

          {/* PayPal Configuration */}
          {paymentSettings.processor === 'paypal' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">PayPal Configuration</h3>
                <p className="text-sm text-gray-600">Configure your PayPal payment gateway</p>
              </div>
              
              <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input
                    id="paypal-client-id"
                    type="text"
                    value={paymentSettings.paypalClientId}
                    onChange={(e) => handlePaymentUpdate('paypalClientId', e.target.value)}
                    placeholder="Your PayPal Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-secret">Client Secret</Label>
                  <Input
                    id="paypal-client-secret"
                    type="password"
                    value={paymentSettings.paypalClientSecret}
                    onChange={(e) => handlePaymentUpdate('paypalClientSecret', e.target.value)}
                    placeholder="Your PayPal Client Secret"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Square Configuration */}
          {paymentSettings.processor === 'square' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Square Configuration</h3>
                <p className="text-sm text-gray-600">Configure your Square payment gateway</p>
              </div>
              
              <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="square-app-id">Application ID</Label>
                  <Input
                    id="square-app-id"
                    type="text"
                    value={paymentSettings.squareApplicationId}
                    onChange={(e) => handlePaymentUpdate('squareApplicationId', e.target.value)}
                    placeholder="Your Square Application ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square-access-token">Access Token</Label>
                  <Input
                    id="square-access-token"
                    type="password"
                    value={paymentSettings.squareAccessToken}
                    onChange={(e) => handlePaymentUpdate('squareAccessToken', e.target.value)}
                    placeholder="Your Square Access Token"
                  />
                </div>
              </div>
            </div>
          )}

          {/* No Processor Selected */}
          {paymentSettings.processor === 'none' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Payment Processing Disabled</h4>
                  <p className="text-sm text-yellow-700">
                    Select a payment processor above to enable payment processing in your application.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Security Settings */}
      <div>
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security & Compliance</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PCI Compliance</Label>
              <p className="text-sm text-gray-600">
                Payment processors handle PCI compliance automatically
              </p>
            </div>
            <div className="space-y-2">
              <Label>Data Encryption</Label>
              <p className="text-sm text-gray-600">
                All payment data is encrypted in transit and at rest
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}