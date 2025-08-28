import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wrench, Calendar, User } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatDate } from '@/lib/utils'

export function ClientServiceTickets() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()

  // Filter service tickets for the current customer
  const customerServiceTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.customerId === customerId || ticket.customerName === customerName
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Service Tickets</h1>
        <p className="text-muted-foreground">
          Track your service requests and maintenance
        </p>
      </div>

      {customerServiceTickets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No service tickets found</p>
              <p className="text-sm">Service tickets will appear here when created</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {customerServiceTickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Ticket ID: {ticket.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {ticket.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {ticket.vehicleInfo && (
                    <div>
                      <p className="text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{ticket.vehicleInfo}</p>
                    </div>
                  )}
                  
                  {ticket.assignedTechName && (
                    <div>
                      <p className="text-muted-foreground">Assigned To</p>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{ticket.assignedTechName}</span>
                      </div>
                    </div>
                  )}
                  
                  {ticket.scheduledDate && (
                    <div>
                      <p className="text-muted-foreground">Scheduled</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">{formatDate(ticket.scheduledDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {ticket.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm">
                      <span className="font-medium">Notes:</span> {ticket.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}