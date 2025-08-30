import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Plus, ExternalLink, GripVertical, Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type StoredInvoice = {
  id: string
  accountId?: string
  number?: string
  status?: string
  dueDate?: string | Date
  total?: number
}

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onCreate?: () => void
}

export function AccountInvoicesSection({ accountId, onRemove, isDragging, onCreate }: Props) {
  const all = loadFromLocalStorage<StoredInvoice[]>('invoices', []) || []
  const invoices = all.filter(i => i.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) onCreate()
    else window.location.href = `/invoices/list?accountId=${accountId}&returnTo=account`
  }

  const pill = (s?: string) => {
    switch ((s || '').toLowerCase()) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200'
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'overdue': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200' // draft/viewed/etc.
    }
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Invoices
            </CardTitle>
            <CardDescription>Invoices for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{invoices.length}</Badge>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Record Invoice
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Record an invoice for this account"
            icon={<FileText className="h-12 w-12" />}
            action={{ label: 'Record Invoice', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.slice(0, 5).map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.number || i.id}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {i.dueDate ? formatDate(i.dueDate) : '—'}
                      </div>
                    </TableCell>
                    <TableCell><Badge className={pill(i.status)}>{(i.status || 'draft').toUpperCase()}</Badge></TableCell>
                    <TableCell>
                      {typeof i.total === 'number' ? `$${i.total.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/invoices/list?focus=${i.id}`}>
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

export default AccountInvoicesSection
