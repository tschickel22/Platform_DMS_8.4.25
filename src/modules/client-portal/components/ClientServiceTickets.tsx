import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wrench, Calendar, User } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockServiceOps } from '@/mocks/serviceOpsMock'

export function ClientServiceTickets() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  const customerServiceTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.customerId === customerId || ticket.customerName === getDisplayName()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Service Tickets</h1>
        <p className="text-muted-foreground">
          View and track your service requests
        </p>
      </div>

      <div className="grid gap-4">
        {customerServiceTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {ticket.title}
                </CardTitle>
                <Badge variant={ticket.status === 'Completed' ? 'default' : 'secondary'}>
                  {ticket.status}
                </Badge>
              </div>
              <CardDescription>
                Ticket #{ticket.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {ticket.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned: {ticket.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {customerServiceTickets.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No service tickets found</p>
                <p className="text-sm">Service requests will appear here when created</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}