import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Truck, Plus, ExternalLink, GripVertical, Calendar, MapPin } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type Delivery = {
  id: string
  accountId?: string
  customerId: string
  vehicleId: string
  status: string
  scheduledDate: string | Date
  deliveredDate?: string | Date
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country?: string
  }
  notes?: string
}

interface AccountDeliveriesSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  /** Clicking "Schedule Delivery" should open the modal in AccountDetail */
  onAddDelivery?: () => void
}

export function AccountDeliveriesSection({
  accountId,
  onRemove,
  isDragging,
  onAddDelivery,
}: AccountDeliveriesSectionProps) {
  // pull persisted deliveries (AccountDetail saves to this key)
  const all = loadFromLocalStorage<Delivery[]>('deliveries', [])
  const deliveries = (all || []).filter(d => d.accountId === accountId)

  const handleAdd = () => {
    if (onAddDelivery) return onAddDelivery()
    // fallback route if modal isn’t wired
    window.location.href = `/delivery/list?accountId=${accountId}&returnTo=account`
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Deliveries
            </CardTitle>
            <CardDescription>Recent deliveries and scheduling</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{deliveries.length}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {deliveries.length === 0 ? (
          <EmptyState
            title="No deliveries yet"
            description="Schedule your first delivery for this account"
            icon={<Truck className="h-12 w-12" />}
            action={{ label: 'Schedule Delivery', onClick: handleAdd }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Recent deliveries</p>
              <Button size="sm" variant="outline" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Delivery
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.slice(0, 5).map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">#{d.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{d.status.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(d.scheduledDate)}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {d.deliveredDate ? formatDate(d.deliveredDate) : '—'}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate">
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                          <span className="text-sm text-muted-foreground truncate">
                            {d.address.street}, {d.address.city}, {d.address.state} {d.address.zipCode}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/delivery/list?focus=${d.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {deliveries.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/delivery/list?accountId=${accountId}`}>View All {deliveries.length} Deliveries</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountDeliveriesSection
