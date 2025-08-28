import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { GripVertical, Truck, Plus } from 'lucide-react'

import { loadFromLocalStorage } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { DeliveryStatus } from '@/types'

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  /** If provided, clicking "Schedule Delivery" opens a modal instead of routing */
  onAddDelivery?: () => void
}

export function AccountDeliveriesSection({
  accountId,
  onRemove,
  isDragging,
  onAddDelivery,
}: Props) {
  const all = loadFromLocalStorage<any[]>('deliveries', [])
  const deliveries = useMemo(
    () =>
      (all || []).filter((d) => d.accountId === accountId).sort((a, b) => {
        const ad = new Date(a.scheduledDate || a.createdAt).getTime()
        const bd = new Date(b.scheduledDate || b.createdAt).getTime()
        return bd - ad
      }),
    [all, accountId],
  )

  const { vehicles } = useInventoryManagement()
  const { contacts } = useContactManagement()

  const vehicleName = (id?: string) => {
    const v = vehicles.find((x) => x.id === id)
    return v ? `${v.year} ${v.make} ${v.model}` : '—'
  }

  const contactName = (id?: string) => {
    const c = contacts.find((x) => x.id === id)
    return c ? `${c.firstName} ${c.lastName}` : '—'
  }

  const getStatusColor = (s: string) => {
    const map: Record<string, string> = {
      [DeliveryStatus.SCHEDULED]: 'bg-blue-100 text-blue-700',
      [DeliveryStatus.IN_TRANSIT]: 'bg-yellow-100 text-yellow-800',
      [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-700',
      [DeliveryStatus.CANCELLED]: 'bg-red-100 text-red-700',
    }
    return map[s] || 'bg-gray-100 text-gray-800'
  }

  const totals = {
    total: deliveries.length,
    upcoming: deliveries.filter((d) => d.status === DeliveryStatus.SCHEDULED || d.status === DeliveryStatus.IN_TRANSIT).length,
    delivered: deliveries.filter((d) => d.status === DeliveryStatus.DELIVERED).length,
  }

  const handleAdd = () => {
    if (onAddDelivery) return onAddDelivery()
    // Fallback route (if you add a routed screen later)
    window.location.href = `/delivery/new?accountId=${accountId}&returnTo=account`
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
            <CardDescription>Delivery records and scheduling for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{totals.total}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/40 text-center">
            <div className="text-2xl font-bold">{totals.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-center">
            <div className="text-2xl font-bold text-blue-700">{totals.upcoming}</div>
            <div className="text-xs text-blue-700">Upcoming</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 text-center">
            <div className="text-2xl font-bold text-green-700">{totals.delivered}</div>
            <div className="text-xs text-green-700">Delivered</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Recent deliveries</p>
          <Button size="sm" variant="outline" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Delivery
          </Button>
        </div>

        {deliveries.length === 0 ? (
          <EmptyState
            title="No deliveries yet"
            description="Schedule your first delivery for this account"
            icon={<Truck className="h-12 w-12" />}
            action={{ label: 'Schedule Delivery', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.slice(0, 6).map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Badge className={getStatusColor(d.status)}>{d.status}</Badge>
                    </TableCell>
                    <TableCell>{contactName(d.customerId)}</TableCell>
                    <TableCell>{vehicleName(d.vehicleId)}</TableCell>
                    <TableCell>{formatDate(d.scheduledDate || d.createdAt)}</TableCell>
                    <TableCell>{d.driver || '—'}</TableCell>
                    <TableCell>
                      {/* Put a real detail route when you have one */}
                      <Button size="sm" variant="ghost" asChild>
                        <Link to="/delivery">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {deliveries.length > 6 && (
          <div className="text-center">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/delivery?accountId=${accountId}`}>View All {deliveries.length} Deliveries</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountDeliveriesSection
