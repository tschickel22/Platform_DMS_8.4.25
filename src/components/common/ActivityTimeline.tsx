import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  FileText, 
  DollarSign,
  Wrench,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Activity, ActivityType } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface ActivityTimelineProps {
  activities: Activity[]
  title?: string
  description?: string
  maxItems?: number
  showEntityLinks?: boolean
}

export function ActivityTimeline({
  activities,
  title = 'Activity Timeline',
  description = 'Recent activity and interactions',
  maxItems = 20,
  showEntityLinks = false
}: ActivityTimelineProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CALL:
        return <Phone className="h-4 w-4" />
      case ActivityType.EMAIL:
        return <Mail className="h-4 w-4" />
      case ActivityType.SMS:
        return <MessageSquare className="h-4 w-4" />
      case ActivityType.MEETING:
        return <Calendar className="h-4 w-4" />
      case ActivityType.NOTE:
        return <FileText className="h-4 w-4" />
      case ActivityType.QUOTE_SENT:
        return <DollarSign className="h-4 w-4" />
      case ActivityType.SERVICE_SCHEDULED:
        return <Wrench className="h-4 w-4" />
      case ActivityType.TASK_COMPLETED:
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CALL:
        return 'bg-blue-100 text-blue-800'
      case ActivityType.EMAIL:
        return 'bg-green-100 text-green-800'
      case ActivityType.SMS:
        return 'bg-purple-100 text-purple-800'
      case ActivityType.MEETING:
        return 'bg-orange-100 text-orange-800'
      case ActivityType.TASK_COMPLETED:
        return 'bg-emerald-100 text-emerald-800'
      case ActivityType.QUOTE_SENT:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxItems)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
            <p className="text-sm">Activity will appear here as you interact with records</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{formatDateTime(activity.timestamp)}</span>
                    <span>by {activity.userName}</span>
                    {showEntityLinks && activity.accountId && (
                      <span>Account: {activity.accountId}</span>
                    )}
                    {showEntityLinks && activity.contactId && (
                      <span>Contact: {activity.contactId}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}