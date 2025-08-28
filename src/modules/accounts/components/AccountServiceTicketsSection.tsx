import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Wrench, Plus, ExternalLink, GripVertical } from 'lucide-react'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatDate } from '@/lib/utils'

interface AccountServiceTicketsSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
}

export function AccountServiceTicketsSection({ accountId, onRemove, isDragging }: AccountServiceTicketsSectionProps) {
  // Filter service tickets for this account
  const accountTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.accountId === accountId
  )

  const getStatusColor = (status: string) => {
    return mockServiceOps.statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    return mockServiceOps.priorityColors[priority] || 'bg-gray-100 text-gray-800'
  }

  const openTickets = accountTickets.filter(ticket => 
    ['Open', 'In Progress', 'Waiting for Parts'].includes(ticket.status)
  )
  const completedTickets = accountTickets.filter(ticket => 
    ticket.status === 'Completed'
  )

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Service Tickets
            </CardTitle>
            <CardDescription>
              Service requests and maintenance for this account
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{accountTickets.length}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {accountTickets.length === 0 ? (
          <EmptyState
            title="No service tickets found"
            description="Create a service ticket for this account to track maintenance and repairs"
            icon={<Wrench className="h-12 w-12" />}
            action={{
              label: "Create Service Ticket",
              onClick: () => window.location.href = `/service?accountId=${accountId}`
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{accountTickets.length}</p>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{openTickets.length}</p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedTickets.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Recent service activity
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/service?accountId=${accountId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Link>
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountTickets.slice(0, 5).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <Link 
                          to={`/service/${ticket.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {ticket.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.assignedTechName || 'Unassigned'}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/service/${ticket.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {accountTickets.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/service?accountId=${accountId}`}>
                    View All {accountTickets.length} Tickets
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}