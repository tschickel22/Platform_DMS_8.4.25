import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { GripVertical, CreditCard, DollarSign, ExternalLink, CalendarHash as Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate, formatCurrency } from '@/lib/utils'

type Payment = {
  id: string
  accountId?: string
  date: string | Date
  amount: number
  method?: 'card' | 'ach' | 'cash' | 'check' | 'other'
  status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
  reference?: string
  notes?: string
}

interface AccountPaymentsSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  /** Provided by AccountDetail — navigate to create flow if present */
  onCreate?: () => void
}

export function AccountPaymentsSection({
  accountId,
  onRemove,
  isDragging,
  onCreate,
}: AccountPaymentsSectionProps) {
  // Demo/local persistence (mirrors Deliveries/Warranty approach)
  const all = loadFromLocalStorage<Payment[]>('payments', [])
  const payments = (all || []).filter((p) => p.accountId === accountId)

  const total = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  const statusTone = (s?: Payment['status']) => {
    switch (s) {
      case 'succeeded':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'refunded':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleAdd = () => {
    if (onCreate) {
      onCreate()
    } else {
      // Fallback: finance module list with account context
      window.location.href = `/finance/payments?accountId=${accountId}&returnTo=account`
    }
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payments
            </CardTitle>
            <CardDescription>Recorded payments for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{payments.length}</Badge>
          <div className="text-sm text-muted-foreground hidden sm:block">
            <span className="mr-2">Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <Button variant="outline" size="sm" onClick={handleAdd} type="button">
            <DollarSign className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {payments.length === 0 ? (
          <EmptyState
            title="No payments yet"
            description="Record a payment for this account"
            icon={<CreditCard className="h-12 w-12" />}
            action={{ label: 'Record Payment', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 6).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(p.date)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="capitalize">{p.method || '—'}</TableCell>
                    <TableCell>
                      <Badge className={statusTone(p.status)}>
                        {(p.status || 'succeeded').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">{p.reference || '—'}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/finance/payments?focus=${p.id}`}>
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

export default AccountPaymentsSection
