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

export interface AccountServiceTicketsSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onAddService?: () => void
}

export function AccountServiceTicketsSection({
  accountId,
  onRemove,
  isDragging,
  onAddService,
}: AccountServiceTicketsSectionProps) {
  const all = mockServiceOps.sampleTickets || []
  const tickets = all.filter((t: any) => t.accountId === accountId)

  const handleAdd = () => {
    if (onAddService) return onAddService()
    window.location.href = `/service/new?accountId=${accountId}&returnTo=account`
  }

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
            <CardDescription>Service requests and maintenance for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{tickets.length}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {tickets.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="Create a service ticket for this account"
            icon={<Wrench className="h-12 w-12" />}
            action={{ label: 'Create Ticket', onClick: handleAdd }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Recent service activity</p>
              <Button size="sm" variant="outline" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.slice(0, 5).map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t.status}</Badge>
                      </TableCell>
                      <TableCell>{t.scheduledDate ? formatDate(t.scheduledDate) : '—'}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/service/${t.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {tickets.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/service?accountId=${accountId}`}>View All {tickets.length} Tickets</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountServiceTicketsSection
