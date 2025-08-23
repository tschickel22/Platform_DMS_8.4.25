import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wrench, Eye, MessageSquare, Calendar } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatDate, formatCurrency } from '@/lib/utils'

export function ClientServiceTickets() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Filter service tickets for the current customer
  const customerTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.customerId === customerId || ticket.customerName === customerName
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Open':
        return 'bg-yellow-100 text-yellow-800'
      case 'Waiting for Parts':
        return 'bg-orange-100 text-orange-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-blue-100 text-blue-800'
      case 'Low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (customerTickets.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Service Tickets</h1>
          <p className="text-muted-foreground">
            Track your service requests and maintenance
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No service tickets found for your account</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Service Tickets</h1>
        <p className="text-muted-foreground">
          Track your service requests and maintenance
        </p>
      </div>

      <div className="grid gap-4">
        {customerTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Ticket #{ticket.id} • Created: {formatDate(ticket.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{ticket.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-medium">{ticket.vehicleInfo || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{ticket.assignedTechName || 'Unassigned'}</p>
                  </div>
                  {ticket.scheduledDate && (
                    <div>
                      <p className="text-muted-foreground">Scheduled</p>
                      <p className="font-medium">{formatDate(ticket.scheduledDate)}</p>
                    </div>
                  )}
                </div>

                {ticket.totalCost && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                      <span className="font-medium">{formatCurrency(ticket.totalCost)}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                  {ticket.status === 'Open' && (
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}