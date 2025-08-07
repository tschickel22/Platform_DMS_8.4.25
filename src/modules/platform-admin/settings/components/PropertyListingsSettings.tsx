import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Globe, 
  MapPin, 
  DollarSign, 
  Image, 
  FileText,
  Plus,
  X
} from 'lucide-react'

export function PropertyListingsSettings() {
  const [settings, setSettings] = useState({
    // Syndication Settings
    enableMHVillageSyndication: true,
    enableZillowSyndication: true,
    enableCustomSyndication: false,
    syndicationFrequency: 'hourly',
    
    // Default Values
    defaultPropertyType: 'manufactured_home',
    defaultListingType: 'sale',
    defaultCurrency: 'USD',
    
    // Address & Location
    enableGeocoding: true,
    geocodingProvider: 'google',
    defaultCountry: 'US',
    requireCompleteAddress: true,
    
    // Media Settings
    maxImagesPerListing: 20,
    maxVideoSize: 100, // MB
    enableVirtualTours: true,
    enableFloorPlans: true,
    
    // MH Specific Settings
    requireMHDetails: true,
    enableDimensionCalculator: true,
    defaultFoundationType: 'permanent',
    
    // Contact Settings
    requireContactInfo: true,
    enableMultipleContacts: true,
    
    // Custom Fields
    customFields: [
      { name: 'HOA Fees', type: 'currency', required: false },
      { name: 'Pet Policy', type: 'text', required: false }
    ]
  })

  const [newCustomField, setNewCustomField] = useState({ name: '', type: 'text', required: false })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const addCustomField = () => {
    if (newCustomField.name.trim()) {
      setSettings(prev => ({
        ...prev,
        customFields: [...prev.customFields, { ...newCustomField }]
      }))
      setNewCustomField({ name: '', type: 'text', required: false })
    }
  }

  const removeCustomField = (index: number) => {
    setSettings(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving property listings settings:', settings)
    // Show success message
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Property Listings Settings</h2>
        <p className="text-muted-foreground">
          Configure property listing defaults, syndication, and custom fields
        </p>
      </div>

      {/* Syndication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Syndication Settings
          </CardTitle>
          <CardDescription>
            Configure automatic syndication to external platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mhvillage-sync">MHVillage Syndication</Label>
                <p className="text-sm text-muted-foreground">Automatically sync to MHVillage</p>
              </div>
              <Switch
                id="mhvillage-sync"
                checked={settings.enableMHVillageSyndication}
                onCheckedChange={(checked) => handleSettingChange('enableMHVillageSyndication', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="zillow-sync">Zillow Syndication</Label>
                <p className="text-sm text-muted-foreground">Automatically sync to Zillow</p>
              </div>
              <Switch
                id="zillow-sync"
                checked={settings.enableZillowSyndication}
                onCheckedChange={(checked) => handleSettingChange('enableZillowSyndication', checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sync-frequency">Syndication Frequency</Label>
            <Select
              value={settings.syndicationFrequency}
              onValueChange={(value) => handleSettingChange('syndicationFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Default Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Default Values
          </CardTitle>
          <CardDescription>
            Set default values for new property listings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-property-type">Default Property Type</Label>
              <Select
                value={settings.defaultPropertyType}
                onValueChange={(value) => handleSettingChange('defaultPropertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-listing-type">Default Listing Type</Label>
              <Select
                value={settings.defaultListingType}
                onValueChange={(value) => handleSettingChange('defaultListingType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-currency">Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => handleSettingChange('defaultCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address & Location Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address & Location Settings
          </CardTitle>
          <CardDescription>
            Configure address validation and geocoding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-geocoding">Enable Geocoding</Label>
                <p className="text-sm text-muted-foreground">Automatically calculate lat/lng from address</p>
              </div>
              <Switch
                id="enable-geocoding"
                checked={settings.enableGeocoding}
                onCheckedChange={(checked) => handleSettingChange('enableGeocoding', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-address">Require Complete Address</Label>
                <p className="text-sm text-muted-foreground">Require all address fields</p>
              </div>
              <Switch
                id="require-address"
                checked={settings.requireCompleteAddress}
                onCheckedChange={(checked) => handleSettingChange('requireCompleteAddress', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="geocoding-provider">Geocoding Provider</Label>
              <Select
                value={settings.geocodingProvider}
                onValueChange={(value) => handleSettingChange('geocodingProvider', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Maps</SelectItem>
                  <SelectItem value="mapbox">Mapbox</SelectItem>
                  <SelectItem value="opencage">OpenCage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-country">Default Country</Label>
              <Select
                value={settings.defaultCountry}
                onValueChange={(value) => handleSettingChange('defaultCountry', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="MX">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Media Settings
          </CardTitle>
          <CardDescription>
            Configure media upload limits and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-images">Max Images Per Listing</Label>
              <Input
                id="max-images"
                type="number"
                value={settings.maxImagesPerListing}
                onChange={(e) => handleSettingChange('maxImagesPerListing', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-video-size">Max Video Size (MB)</Label>
              <Input
                id="max-video-size"
                type="number"
                value={settings.maxVideoSize}
                onChange={(e) => handleSettingChange('maxVideoSize', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-virtual-tours">Enable Virtual Tours</Label>
                <p className="text-sm text-muted-foreground">Allow virtual tour uploads</p>
              </div>
              <Switch
                id="enable-virtual-tours"
                checked={settings.enableVirtualTours}
                onCheckedChange={(checked) => handleSettingChange('enableVirtualTours', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-floor-plans">Enable Floor Plans</Label>
                <p className="text-sm text-muted-foreground">Allow floor plan uploads</p>
              </div>
              <Switch
                id="enable-floor-plans"
                checked={settings.enableFloorPlans}
                onCheckedChange={(checked) => handleSettingChange('enableFloorPlans', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Fields
          </CardTitle>
          <CardDescription>
            Add custom fields to property listings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {settings.customFields.map((field, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{field.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{field.type}</Badge>
                      {field.required && <Badge variant="outline">Required</Badge>}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Add Custom Field</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Field name"
                value={newCustomField.name}
                onChange={(e) => setNewCustomField(prev => ({ ...prev, name: e.target.value }))}
              />
              <Select
                value={newCustomField.type}
                onValueChange={(value) => setNewCustomField(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={newCustomField.required}
                  onCheckedChange={(checked) => setNewCustomField(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="field-required">Required</Label>
              </div>
              <Button onClick={addCustomField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  )
}