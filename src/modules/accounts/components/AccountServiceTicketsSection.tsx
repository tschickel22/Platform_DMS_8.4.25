import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlusCircle, Wrench } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { TableRowSkeleton } from '@/components/ui/loading-skeleton'
import { Badge } from '@/components/ui/badge'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatDate } from '@/lib/utils'

interface AccountServiceTicketsSectionProps {
  accountId: string
  title: string
}

export function AccountServiceTicketsSection({ accountId, title }: AccountServiceTicketsSectionProps) {
  const { tickets, loading, error } = useServiceManagement()

  const associatedTickets = tickets.filter(ticket => ticket.customerId === accountId) // Assuming customerId in ticket maps to accountId

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading associated service tickets...</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRowSkeleton columns={4} />
              <TableRowSkeleton columns={4} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Error loading service tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load service tickets: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Service tickets associated with this account.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/service/new?customerId=${accountId}`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Ticket
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {associatedTickets.length === 0 ? (
          <EmptyState
            icon={<Wrench className="h-12 w-12" />}
            title="No service tickets found"
            description="This account does not have any associated service tickets yet."
            action={{
              label: 'Create New Ticket',
              onClick: () => window.location.href = `/service/new?customerId=${accountId}`
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Scheduled Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedTickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Link to={`/service/${ticket.id}`} className="text-blue-600 hover:underline">
                      {ticket.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: mockServiceOps.statusColors[ticket.status] }}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: mockServiceOps.priorityColors[ticket.priority] }}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}