import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Building, 
  Users, 
  Mail, 
  Plus, 
  X,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';

interface WarrantySettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export default function WarrantySettings({ 
  settings, 
  onSettingsChange 
}: WarrantySettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings?.warranty || {
    companyInfo: {
      dealershipName: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      dealerNumber: ''
    },
    customManufacturers: [],
    approvalWorkflow: {
      requireManagerApproval: false,
      managerApprovalThreshold: 1000,
      autoApproveUnder: 250
    },
    emailTemplates: {
      claimSubmissionTemplate: '',
      approvalNotificationTemplate: '',
      denialNotificationTemplate: ''
    },
    preferences: {
      defaultApprovalTimeout: 72, // hours
      enableAutomaticFollowup: true,
      followupInterval: 24 // hours
    }
  });

  const [newManufacturer, setNewManufacturer] = useState({
    name: '',
    contactEmail: '',
    approvalThreshold: 500
  });

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

  const addCustomManufacturer = () => {
    if (newManufacturer.name.trim()) {
      const currentManufacturers = localSettings.customManufacturers || [];
      const manufacturerWithId = {
        ...newManufacturer,
        id: `custom-${Date.now()}`,
        isCustom: true
      };
      updateSetting('customManufacturers', [...currentManufacturers, manufacturerWithId]);
      setNewManufacturer({ name: '', contactEmail: '', approvalThreshold: 500 });
    }
  };

  const removeCustomManufacturer = (index: number) => {
    const currentManufacturers = localSettings.customManufacturers || [];
    const updated = currentManufacturers.filter((_, i) => i !== index);
    updateSetting('customManufacturers', updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Company Warranty Settings</h2>
      </div>
      <p className="text-sm text-gray-600">
        Configure your company's warranty service tracking and manufacturer relationships.
      </p>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Company Information</span>
          </CardTitle>
          <CardDescription>
            Your dealership information for warranty communications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dealership Name</Label>
              <Input
                value={localSettings.companyInfo?.dealershipName || ''}
                onChange={(e) => updateSetting('companyInfo.dealershipName', e.target.value)}
                placeholder="Your Dealership Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Dealer Number</Label>
              <Input
                value={localSettings.companyInfo?.dealerNumber || ''}
                onChange={(e) => updateSetting('companyInfo.dealerNumber', e.target.value)}
                placeholder="Dealer ID/Number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={localSettings.companyInfo?.contactPerson || ''}
                onChange={(e) => updateSetting('companyInfo.contactPerson', e.target.value)}
                placeholder="Primary warranty contact"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={localSettings.companyInfo?.contactEmail || ''}
                onChange={(e) => updateSetting('companyInfo.contactEmail', e.target.value)}
                placeholder="warranty@yourcompany.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input
              value={localSettings.companyInfo?.contactPhone || ''}
              onChange={(e) => updateSetting('companyInfo.contactPhone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Manufacturers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Custom Manufacturers</span>
          </CardTitle>
          <CardDescription>
            Add manufacturers specific to your dealership beyond the platform defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Custom Manufacturers */}
          {(localSettings.customManufacturers || []).length > 0 && (
            <div className="space-y-2">
              <Label>Your Custom Manufacturers</Label>
              <div className="space-y-2">
                {localSettings.customManufacturers.map((manufacturer: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{manufacturer.name}</div>
                      <div className="text-sm text-gray-500">
                        {manufacturer.contactEmail} • Threshold: ${manufacturer.approvalThreshold}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomManufacturer(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Add New Manufacturer */}
          <div className="space-y-3">
            <Label>Add New Manufacturer</Label>
            <div className="grid grid-cols-3 gap-3">
              <Input
                placeholder="Manufacturer name"
                value={newManufacturer.name}
                onChange={(e) => setNewManufacturer({ ...newManufacturer, name: e.target.value })}
              />
              <Input
                placeholder="Contact email"
                type="email"
                value={newManufacturer.contactEmail}
                onChange={(e) => setNewManufacturer({ ...newManufacturer, contactEmail: e.target.value })}
              />
              <div className="flex space-x-2">
                <Input
                  placeholder="Threshold"
                  type="number"
                  value={newManufacturer.approvalThreshold}
                  onChange={(e) => setNewManufacturer({ ...newManufacturer, approvalThreshold: parseInt(e.target.value) })}
                />
                <Button onClick={addCustomManufacturer} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Approval Workflow</span>
          </CardTitle>
          <CardDescription>
            Configure internal approval requirements for warranty claims.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Manager Approval</Label>
              <p className="text-sm text-gray-500">
                Internal approval required before submitting to manufacturer
              </p>
            </div>
            <Switch
              checked={localSettings.approvalWorkflow?.requireManagerApproval}
              onCheckedChange={(checked) => updateSetting('approvalWorkflow.requireManagerApproval', checked)}
            />
          </div>

          {localSettings.approvalWorkflow?.requireManagerApproval && (
            <>
              <div className="space-y-2">
                <Label>Manager Approval Threshold</Label>
                <Input
                  type="number"
                  value={localSettings.approvalWorkflow?.managerApprovalThreshold || 1000}
                  onChange={(e) => updateSetting('approvalWorkflow.managerApprovalThreshold', parseInt(e.target.value))}
                  className="w-32"
                />
                <p className="text-sm text-gray-500">
                  Claims above this amount require manager approval
                </p>
              </div>

              <div className="space-y-2">
                <Label>Auto-Approve Under</Label>
                <Input
                  type="number"
                  value={localSettings.approvalWorkflow?.autoApproveUnder || 250}
                  onChange={(e) => updateSetting('approvalWorkflow.autoApproveUnder', parseInt(e.target.value))}
                  className="w-32"
                />
                <p className="text-sm text-gray-500">
                  Automatically approve claims under this amount
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email Templates</span>
          </CardTitle>
          <CardDescription>
            Customize email templates for warranty communications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Claim Submission Template</Label>
            <Textarea
              value={localSettings.emailTemplates?.claimSubmissionTemplate || ''}
              onChange={(e) => updateSetting('emailTemplates.claimSubmissionTemplate', e.target.value)}
              placeholder="Template for submitting claims to manufacturers..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Approval Notification Template</Label>
            <Textarea
              value={localSettings.emailTemplates?.approvalNotificationTemplate || ''}
              onChange={(e) => updateSetting('emailTemplates.approvalNotificationTemplate', e.target.value)}
              placeholder="Template for notifying when claims are approved..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Denial Notification Template</Label>
            <Textarea
              value={localSettings.emailTemplates?.denialNotificationTemplate || ''}
              onChange={(e) => updateSetting('emailTemplates.denialNotificationTemplate', e.target.value)}
              placeholder="Template for notifying when claims are denied..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Workflow Preferences</span>
          </CardTitle>
          <CardDescription>
            Configure timing and automation preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Approval Timeout (hours)</Label>
            <Input
              type="number"
              value={localSettings.preferences?.defaultApprovalTimeout || 72}
              onChange={(e) => updateSetting('preferences.defaultApprovalTimeout', parseInt(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-gray-500">
              How long to wait for manufacturer response before follow-up
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Automatic Follow-up</Label>
              <p className="text-sm text-gray-500">
                Automatically send follow-up emails for overdue claims
              </p>
            </div>
            <Switch
              checked={localSettings.preferences?.enableAutomaticFollowup}
              onCheckedChange={(checked) => updateSetting('preferences.enableAutomaticFollowup', checked)}
            />
          </div>

          {localSettings.preferences?.enableAutomaticFollowup && (
            <div className="space-y-2">
              <Label>Follow-up Interval (hours)</Label>
              <Input
                type="number"
                value={localSettings.preferences?.followupInterval || 24}
                onChange={(e) => updateSetting('preferences.followupInterval', parseInt(e.target.value))}
                className="w-32"
              />
              <p className="text-sm text-gray-500">
                How often to send follow-up reminders
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Configuration Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              {localSettings.companyInfo?.dealershipName && localSettings.companyInfo?.contactEmail ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Company Information</span>
            </div>
            <div className="flex items-center space-x-2">
              {(localSettings.customManufacturers || []).length > 0 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">Custom Manufacturers</span>
            </div>
            <div className="flex items-center space-x-2">
              {localSettings.emailTemplates?.claimSubmissionTemplate ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Email Templates</span>
            </div>
            <div className="flex items-center space-x-2">
              {localSettings.preferences?.defaultApprovalTimeout ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">Workflow Preferences</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}