import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, AlertTriangle, Clock, FolderSync as Sync } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SyncStatus {
  module: string
  lastSync: Date
  status: 'synced' | 'syncing' | 'error' | 'pending'
  eventCount: number
  errorMessage?: string
}

interface EventSyncStatusProps {
  syncStatuses: SyncStatus[]
  onRefreshSync: (module: string) => Promise<void>
  onRefreshAll: () => Promise<void>
}

export function EventSyncStatus({ syncStatuses, onRefreshSync, onRefreshAll }: EventSyncStatusProps) {
  const { toast } = useToast()
  const [refreshing, setRefreshing] = React.useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'syncing':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleRefreshModule = async (module: string) => {
    setRefreshing(module)
    try {
      await onRefreshSync(module)
      toast({
        title: 'Sync Refreshed',
        description: `${module} events have been refreshed`,
      })
    } catch (error) {
      toast({
        title: 'Sync Error',
        description: `Failed to refresh ${module} events`,
        variant: 'destructive'
      })
    } finally {
      setRefreshing(null)
    }
  }

  const handleRefreshAll = async () => {
    setRefreshing('all')
    try {
      await onRefreshAll()
      toast({
        title: 'All Syncs Refreshed',
        description: 'All module events have been refreshed',
      })
    } catch (error) {
      toast({
        title: 'Sync Error',
        description: 'Failed to refresh all events',
        variant: 'destructive'
      })
    } finally {
      setRefreshing(null)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sync className="h-5 w-5 mr-2 text-primary" />
              Sync Status
            </CardTitle>
            <CardDescription>
              Real-time synchronization status with source modules
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshAll}
            disabled={refreshing === 'all'}
          >
            {refreshing === 'all' ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {syncStatuses.map((status) => (
            <div key={status.module} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.status)}
                <div>
                  <div className="font-medium capitalize">{status.module}</div>
                  <div className="text-sm text-muted-foreground">
                    {status.eventCount} events • Last sync: {status.lastSync.toLocaleTimeString()}
                  </div>
                  {status.errorMessage && (
                    <div className="text-xs text-red-600 mt-1">{status.errorMessage}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(status.status)}>
                  {status.status.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRefreshModule(status.module)}
                  disabled={refreshing === status.module}
                >
                  {refreshing === status.module ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}