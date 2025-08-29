import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { GripVertical, Plus, ExternalLink } from 'lucide-react'
import { loadFromLocalStorage, formatCurrency, formatDate } from '@/lib/utils'

type Invoice = {
  id: string
  accountId?: string
  number?: string
  status?: string
  total?: number
  dueDate?: string | Date
}

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onCreate?: () => void
}

export default function AccountInvoicesSection({
  accountId,
  onRemove,
  isDragging,
  onCreate,
}: Props) {
  const all = loadFromLocalStorage<Invoice[]>('invoices', []) || []
  const items = all.filter(i => i.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) return onCreate()
    window.location.href = `/invoices/new?accountId=${accountId}&returnTo=account`
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg">Invoices</CardTitle>
            <CardDescription>Invoices for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{items.length}</Badge>
          <Button variant="outline" size="sm" type="button" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          {onRemove && <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No invoices"
            description="Create an invoice for this account"
            action={{ label: 'Create Invoice', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 5).map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.number || inv.id}</TableCell>
                    <TableCell><Badge variant="outline">{(inv.status || 'draft').toUpperCase()}</Badge></TableCell>
                    <TableCell>{inv.dueDate ? formatDate(inv.dueDate) : '—'}</TableCell>
                    <TableCell>{formatCurrency(inv.total || 0)}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/invoice?focus=${inv.id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
