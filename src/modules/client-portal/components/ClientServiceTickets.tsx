import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wrench, Calendar, Plus, Clock } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatDate, formatDateTime } from '@/lib/utils'

export function ClientServiceTickets() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  // Filter service tickets for the current customer
  const customerTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.customerId === customerId || ticket.customerName === getDisplayName()
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default'
      case 'in progress':
        return 'destructive'
      case 'open':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Tickets</h1>
          <p className="text-muted-foreground">
            Track your service requests and maintenance
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Service Request
        </Button>
      </div>

      {/* Service Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerTickets.length}</div>
            <p className="text-xs text-muted-foreground">
              All service requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {customerTickets.filter(t => t.status === 'In Progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active tickets
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customerTickets.filter(t => t.status === 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Resolved tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Tickets List */}
      <div className="space-y-4">
        {customerTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <CardDescription>
                    {ticket.vehicleInfo && `Vehicle: ${ticket.vehicleInfo} • `}
                    Created: {formatDate(ticket.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {ticket.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{ticket.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{ticket.assignedTechName || 'Unassigned'}</p>
                </div>
                {ticket.scheduledDate && (
                  <div>
                    <p className="text-muted-foreground">Scheduled</p>
                    <p className="font-medium">{formatDateTime(ticket.scheduledDate)}</p>
                  </div>
                )}
                {ticket.totalCost && (
                  <div>
                    <p className="text-muted-foreground">Total Cost</p>
                    <p className="font-medium">${ticket.totalCost.toFixed(2)}</p>
                  </div>
                )}
              </div>
              
              {ticket.notes && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{ticket.notes}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(ticket.updatedAt)}
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {customerTickets.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Service Tickets</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any service requests at this time.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Service Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}