import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Settings, Save, RefreshCw, Calendar, Clock, Filter } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface SyncSettings {
  twoWaySync: boolean
  syncInterval: number // minutes
  conflictResolution: 'bolt_wins' | 'external_wins' | 'manual'
  syncModules: {
    service: boolean
    delivery: boolean
    tasks: boolean
    pdi: boolean
  }
  externalCalendars: {
    google: {
      enabled: boolean
      calendarId?: string
      syncDirection: 'export_only' | 'import_only' | 'bidirectional'
    }
    outlook: {
      enabled: boolean
      calendarId?: string
      syncDirection: 'export_only' | 'import_only' | 'bidirectional'
    }
  }
  filters: {
    onlyAssignedToMe: boolean
    excludeCompleted: boolean
    priorityFilter: string[]
    statusFilter: string[]
  }
}

export function SyncSettingsForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SyncSettings>(() =>
    loadFromLocalStorage('calendar_sync_settings', {
      twoWaySync: false,
      syncInterval: 15,
      conflictResolution: 'bolt_wins',
      syncModules: {
        service: true,
        delivery: true,
        tasks: true,
        pdi: true
      },
      externalCalendars: {
        google: {
          enabled: false,
          syncDirection: 'export_only'
        },
        outlook: {
          enabled: false,
          syncDirection: 'export_only'
        }
      },
      filters: {
        onlyAssignedToMe: false,
        excludeCompleted: true,
        priorityFilter: [],
        statusFilter: []
      }
    })
  )

  const [connections] = useState(() =>
    loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false })
  )

  useEffect(() => {
    saveToLocalStorage('calendar_sync_settings', settings)
  }, [settings])

  const updateSettings = (path: string, value: any) => {
    const keys = path.split('.')
    const newSettings = { ...settings }
    let current: any = newSettings
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Settings Saved',
        description: 'Calendar sync settings have been updated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save sync settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestSync = async () => {
    setLoading(true)
    try {
      // Simulate sync test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Sync Test Successful',
        description: 'All configured calendars are syncing properly',
      })
    } catch (error) {
      toast({
        title: 'Sync Test Failed',
        description: 'There was an issue with the sync configuration',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Sync Settings
            </CardTitle>
            <CardDescription>
              Configure how events sync with external calendars
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleTestSync} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Test Sync
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Sync Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Two-Way Synchronization</Label>
              <p className="text-sm text-muted-foreground">
                Allow external calendar events to be imported into Bolt
              </p>
            </div>
            <Switch
              checked={settings.twoWaySync}
              onCheckedChange={(checked) => updateSettings('twoWaySync', checked)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="syncInterval">Sync Interval</Label>
              <Select 
                value={settings.syncInterval.toString()} 
                onValueChange={(value) => updateSettings('syncInterval', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="240">Every 4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="conflictResolution">Conflict Resolution</Label>
              <Select 
                value={settings.conflictResolution} 
                onValueChange={(value: 'bolt_wins' | 'external_wins' | 'manual') => 
                  updateSettings('conflictResolution', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bolt_wins">Bolt Wins</SelectItem>
                  <SelectItem value="external_wins">External Wins</SelectItem>
                  <SelectItem value="manual">Manual Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Module Sync Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Module Sync</h3>
          <p className="text-sm text-muted-foreground">
            Choose which modules should sync events to external calendars
          </p>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Service Tickets</span>
              </div>
              <Checkbox
                checked={settings.syncModules.service}
                onCheckedChange={(checked) => updateSettings('syncModules.service', !!checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Deliveries</span>
              </div>
              <Checkbox
                checked={settings.syncModules.delivery}
                onCheckedChange={(checked) => updateSettings('syncModules.delivery', !!checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Tasks</span>
              </div>
              <Checkbox
                checked={settings.syncModules.tasks}
                onCheckedChange={(checked) => updateSettings('syncModules.tasks', !!checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium">PDI Inspections</span>
              </div>
              <Checkbox
                checked={settings.syncModules.pdi}
                onCheckedChange={(checked) => updateSettings('syncModules.pdi', !!checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* External Calendar Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">External Calendar Settings</h3>
          
          {/* Google Calendar */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Google Calendar</span>
                {connections.google ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">Connected</Badge>
                ) : (
                  <Badge variant="secondary">Not Connected</Badge>
                )}
              </div>
              <Switch
                checked={settings.externalCalendars.google.enabled && connections.google}
                onCheckedChange={(checked) => updateSettings('externalCalendars.google.enabled', checked)}
                disabled={!connections.google}
              />
            </div>
            
            {connections.google && settings.externalCalendars.google.enabled && (
              <div className="space-y-3">
                <div>
                  <Label>Sync Direction</Label>
                  <Select 
                    value={settings.externalCalendars.google.syncDirection} 
                    onValueChange={(value) => updateSettings('externalCalendars.google.syncDirection', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="export_only">Export Only (Bolt → Google)</SelectItem>
                      <SelectItem value="import_only">Import Only (Google → Bolt)</SelectItem>
                      <SelectItem value="bidirectional">Bidirectional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {!connections.google && (
              <p className="text-sm text-muted-foreground">
                Connect Google Calendar in the Integrations tab to enable sync
              </p>
            )}
          </div>

          {/* Outlook Calendar */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Outlook Calendar</span>
                {connections.outlook ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">Connected</Badge>
                ) : (
                  <Badge variant="secondary">Not Connected</Badge>
                )}
              </div>
              <Switch
                checked={settings.externalCalendars.outlook.enabled && connections.outlook}
                onCheckedChange={(checked) => updateSettings('externalCalendars.outlook.enabled', checked)}
                disabled={!connections.outlook}
              />
            </div>
            
            {connections.outlook && settings.externalCalendars.outlook.enabled && (
              <div className="space-y-3">
                <div>
                  <Label>Sync Direction</Label>
                  <Select 
                    value={settings.externalCalendars.outlook.syncDirection} 
                    onValueChange={(value) => updateSettings('externalCalendars.outlook.syncDirection', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="export_only">Export Only (Bolt → Outlook)</SelectItem>
                      <SelectItem value="import_only">Import Only (Outlook → Bolt)</SelectItem>
                      <SelectItem value="bidirectional">Bidirectional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {!connections.outlook && (
              <p className="text-sm text-muted-foreground">
                Connect Outlook Calendar in the Integrations tab to enable sync
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Sync Filters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sync Filters</h3>
          <p className="text-sm text-muted-foreground">
            Control which events are included in synchronization
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Only sync events assigned to me</Label>
                <p className="text-sm text-muted-foreground">
                  Exclude events assigned to other team members
                </p>
              </div>
              <Checkbox
                checked={settings.filters.onlyAssignedToMe}
                onCheckedChange={(checked) => updateSettings('filters.onlyAssignedToMe', !!checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Exclude completed events</Label>
                <p className="text-sm text-muted-foreground">
                  Don't sync events that are already completed
                </p>
              </div>
              <Checkbox
                checked={settings.filters.excludeCompleted}
                onCheckedChange={(checked) => updateSettings('filters.excludeCompleted', !!checked)}
              />
            </div>
          </div>
        </div>

        {/* Sync Status Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Current Sync Configuration</span>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Sync interval: Every {settings.syncInterval} minutes</p>
            <p>• Two-way sync: {settings.twoWaySync ? 'Enabled' : 'Disabled'}</p>
            <p>• Active modules: {Object.entries(settings.syncModules).filter(([_, enabled]) => enabled).length} of 4</p>
            <p>• Connected calendars: {Object.values(connections).filter(Boolean).length} of 2</p>
            {settings.twoWaySync && (
              <p>• Conflict resolution: {settings.conflictResolution.replace('_', ' ')}</p>
            )}
          </div>
        </div>

        {/* Warning for Two-Way Sync */}
        {settings.twoWaySync && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <RefreshCw className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">Two-Way Sync Warning</span>
            </div>
            <p className="text-sm text-yellow-800">
              Two-way synchronization can create conflicts if the same event is modified in multiple places. 
              Make sure your conflict resolution strategy is appropriate for your workflow.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}