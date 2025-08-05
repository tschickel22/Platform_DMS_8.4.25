import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Calendar, Link as LinkIcon, XCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface ExternalCalendarConnection {
  google: boolean
  outlook: boolean
}

export function ExternalCalendarIntegration() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [connections, setConnections] = useState<ExternalCalendarConnection>(() =>
    loadFromLocalStorage('external_calendar_connections', { google: false, outlook: false })
  )

  useEffect(() => {
    saveToLocalStorage('external_calendar_connections', connections)
  }, [connections])

  const handleConnect = async (provider: 'google' | 'outlook') => {
    setLoading(true)
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))

      setConnections(prev => ({ ...prev, [provider]: true }))
      toast({
        title: 'Connection Successful',
        description: `${provider === 'google' ? 'Google' : 'Outlook'} Calendar connected.`,
      })
    } catch {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect ${provider === 'google' ? 'Google' : 'Outlook'} Calendar.`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async (provider: 'google' | 'outlook') => {
    setLoading(true)
    try {
      // Simulate API call to revoke token
      await new Promise(resolve => setTimeout(resolve, 1000))

      setConnections(prev => ({ ...prev, [provider]: false }))
      toast({
        title: 'Disconnected',
        description: `${provider === 'google' ? 'Google' : 'Outlook'} Calendar disconnected.`,
      })
    } catch {
      toast({
        title: 'Disconnection Failed',
        description: `Failed to disconnect ${provider === 'google' ? 'Google' : 'Outlook'} Calendar.`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="h-5 w-5 mr-2 text-primary" />
          External Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your Google or Outlook calendar to sync events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Calendar */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <div>
              <h4 className="font-medium">Google Calendar</h4>
              <p className="text-sm text-muted-foreground">
                Sync events with your Google account.
              </p>
            </div>
          </div>
          {connections.google ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Connected</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDisconnect('google')}
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                <span className="ml-2">Disconnect</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConnect('google')}
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
              <span className="ml-2">Connect</span>
            </Button>
          )}
        </div>

        {/* Outlook Calendar */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-orange-500" />
            <div>
              <h4 className="font-medium">Outlook Calendar</h4>
              <p className="text-sm text-muted-foreground">
                Sync events with your Outlook account.
              </p>
            </div>
          </div>
          {connections.outlook ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Connected</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDisconnect('outlook')}
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                <span className="ml-2">Disconnect</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConnect('outlook')}
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
              <span className="ml-2">Connect</span>
            </Button>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Currently, this integration supports one-way export of events from Bolt to your external calendar.
            Two-way synchronization and advanced features are planned for future updates.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
