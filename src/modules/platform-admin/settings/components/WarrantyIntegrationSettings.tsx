import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  DollarSign, 
  Settings, 
  Bell, 
  Mail, 
  Zap, 
  Plus, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface WarrantyIntegrationSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export default function WarrantyIntegrationSettings({ 
  settings, 
  onSettingsChange 
}: WarrantyIntegrationSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings?.warranty || {
    coverageTrackingEnabled: true,
    manufacturerApprovalRequiredThreshold: 500,
    allowUnapprovedRepairs: true,
    submitForReimbursement: true,
    manufacturerSettings: {
      allowEmailCommunication: true,
      allowApiIntegration: true,
      defaultManufacturers: ['Clayton Homes', 'Fleetwood RV'],
      customManufacturersPerCompany: true
    },
    reimbursementTracking: {
      enableStatusTracking: true,
      autoMarkPaid: false
    },
    serviceItemChecks: {
      showCoveredStatus: true,
      requireProofForSubmission: true
    },
    notifications: {
      notifyDealerOnApproval: true,
      notifyManufacturerOnSubmission: true,
      notifyCompanyAdminIfOverdue: true
    }
  });

  const [newManufacturer, setNewManufacturer] = useState('');

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...localSettings };
    let current = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setLocalSettings(updated);
    onSettingsChange({ ...settings, warranty: updated });
  };

  const addManufacturer = () => {
    if (newManufacturer.trim()) {
      const currentManufacturers = localSettings.manufacturerSettings.defaultManufacturers || [];
      updateSetting('manufacturerSettings.defaultManufacturers', [...currentManufacturers, newManufacturer.trim()]);
      setNewManufacturer('');
    }
  };

  const removeManufacturer = (index: number) => {
    const currentManufacturers = localSettings.manufacturerSettings.defaultManufacturers || [];
    const updated = currentManufacturers.filter((_, i) => i !== index);
    updateSetting('manufacturerSettings.defaultManufacturers', updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Warranty Service & Reimbursement Settings</h2>
      </div>
      <p className="text-sm text-gray-600">
        Configure how your platform tracks warranty service requests and manufacturer reimbursements.
      </p>

      {/* Core Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Core Warranty Tracking</span>
          </CardTitle>
          <CardDescription>
            Basic settings for warranty service tracking and approval workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Warranty Coverage Tracking</Label>
              <p className="text-sm text-gray-500">
                Track whether service items are covered under warranty
              </p>
            </div>
            <Switch
              checked={localSettings.coverageTrackingEnabled}
              onCheckedChange={(checked) => updateSetting('coverageTrackingEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Manufacturer Approval Required Threshold</Label>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <Input
                type="number"
                value={localSettings.manufacturerApprovalRequiredThreshold}
                onChange={(e) => updateSetting('manufacturerApprovalRequiredThreshold', parseInt(e.target.value))}
                className="w-32"
              />
            </div>
            <p className="text-sm text-gray-500">
              Service requests above this amount require manufacturer approval
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Unapproved Repairs</Label>
              <p className="text-sm text-gray-500">
                Dealers can proceed with repairs before manufacturer approval
              </p>
            </div>
            <Switch
              checked={localSettings.allowUnapprovedRepairs}
              onCheckedChange={(checked) => updateSetting('allowUnapprovedRepairs', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Submit for Reimbursement</Label>
              <p className="text-sm text-gray-500">
                Enable reimbursement request tracking
              </p>
            </div>
            <Switch
              checked={localSettings.submitForReimbursement}
              onCheckedChange={(checked) => updateSetting('submitForReimbursement', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manufacturer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Manufacturer Integration</span>
          </CardTitle>
          <CardDescription>
            Configure how dealers communicate with manufacturers for warranty claims.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Email Communication</Label>
              <p className="text-sm text-gray-500">
                Enable email-based warranty claim submissions
              </p>
            </div>
            <Switch
              checked={localSettings.manufacturerSettings?.allowEmailCommunication}
              onCheckedChange={(checked) => updateSetting('manufacturerSettings.allowEmailCommunication', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow API Integration</Label>
              <p className="text-sm text-gray-500">
                Enable direct API connections with manufacturers
              </p>
            </div>
            <Switch
              checked={localSettings.manufacturerSettings?.allowApiIntegration}
              onCheckedChange={(checked) => updateSetting('manufacturerSettings.allowApiIntegration', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Custom Manufacturers Per Company</Label>
              <p className="text-sm text-gray-500">
                Allow companies to add their own manufacturers
              </p>
            </div>
            <Switch
              checked={localSettings.manufacturerSettings?.customManufacturersPerCompany}
              onCheckedChange={(checked) => updateSetting('manufacturerSettings.customManufacturersPerCompany', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Default Manufacturers</Label>
            <div className="flex flex-wrap gap-2">
              {(localSettings.manufacturerSettings?.defaultManufacturers || []).map((manufacturer: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{manufacturer}</span>
                  <button
                    onClick={() => removeManufacturer(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add manufacturer name"
                value={newManufacturer}
                onChange={(e) => setNewManufacturer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addManufacturer()}
              />
              <Button onClick={addManufacturer} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursement Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Reimbursement Tracking</span>
          </CardTitle>
          <CardDescription>
            Settings for tracking manufacturer reimbursement payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Status Tracking</Label>
              <p className="text-sm text-gray-500">
                Track reimbursement status: submitted → approved → paid
              </p>
            </div>
            <Switch
              checked={localSettings.reimbursementTracking?.enableStatusTracking}
              onCheckedChange={(checked) => updateSetting('reimbursementTracking.enableStatusTracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Mark as Paid</Label>
              <p className="text-sm text-gray-500">
                Automatically mark reimbursements as paid when received
              </p>
            </div>
            <Switch
              checked={localSettings.reimbursementTracking?.autoMarkPaid}
              onCheckedChange={(checked) => updateSetting('reimbursementTracking.autoMarkPaid', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Item Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Service Item Validation</span>
          </CardTitle>
          <CardDescription>
            Configure validation requirements for warranty service items.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Coverage Status</Label>
              <p className="text-sm text-gray-500">
                Display warranty coverage status in service module
              </p>
            </div>
            <Switch
              checked={localSettings.serviceItemChecks?.showCoveredStatus}
              onCheckedChange={(checked) => updateSetting('serviceItemChecks.showCoveredStatus', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Proof for Submission</Label>
              <p className="text-sm text-gray-500">
                Dealers must upload documentation to request reimbursement
              </p>
            </div>
            <Switch
              checked={localSettings.serviceItemChecks?.requireProofForSubmission}
              onCheckedChange={(checked) => updateSetting('serviceItemChecks.requireProofForSubmission', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure automated notifications for warranty processes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notify Dealer on Approval</Label>
              <p className="text-sm text-gray-500">
                Send notification when manufacturer approves/denies claim
              </p>
            </div>
            <Switch
              checked={localSettings.notifications?.notifyDealerOnApproval}
              onCheckedChange={(checked) => updateSetting('notifications.notifyDealerOnApproval', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notify Manufacturer on Submission</Label>
              <p className="text-sm text-gray-500">
                Send notification to manufacturer when claim is submitted
              </p>
            </div>
            <Switch
              checked={localSettings.notifications?.notifyManufacturerOnSubmission}
              onCheckedChange={(checked) => updateSetting('notifications.notifyManufacturerOnSubmission', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notify Admin if Overdue</Label>
              <p className="text-sm text-gray-500">
                Alert company admin when claims are overdue for response
              </p>
            </div>
            <Switch
              checked={localSettings.notifications?.notifyCompanyAdminIfOverdue}
              onCheckedChange={(checked) => updateSetting('notifications.notifyCompanyAdminIfOverdue', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Configuration Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              {localSettings.coverageTrackingEnabled ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Warranty Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              {localSettings.manufacturerSettings?.allowEmailCommunication || localSettings.manufacturerSettings?.allowApiIntegration ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Manufacturer Communication</span>
            </div>
            <div className="flex items-center space-x-2">
              {localSettings.reimbursementTracking?.enableStatusTracking ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Reimbursement Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              {(localSettings.manufacturerSettings?.defaultManufacturers || []).length > 0 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Default Manufacturers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { WarrantyIntegrationSettings }