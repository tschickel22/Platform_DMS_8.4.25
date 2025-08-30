import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Handshake, Plus, ExternalLink, GripVertical, Calendar } from 'lucide-react'
import { loadFromLocalStorage } from '@/lib/utils'

type AgreementStatus = 'active' | 'pending' | 'cancelled' | 'expired'

type Agreement = {
  id: string
  accountId: string
  agreementNumber: string
  type: string // Retail Installment, Lease, Service Contract, etc.
  provider?: string
  startDate?: string
  endDate?: string
  amount?: number
  status?: AgreementStatus
  notes?: string
}

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onCreate?: () => void
}

export function AccountAgreementsSection({ accountId, onRemove, isDragging, onCreate }: Props) {
  const all = loadFromLocalStorage<Agreement[]>('agreements', []) || []
  const agreements = all.filter(a => a.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) onCreate()
    else window.location.href = `/finance/agreements?accountId=${accountId}&returnTo=account`
  }

  const statusTone = (s?: AgreementStatus) => {
    switch (s) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      case 'expired': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <Handshake className="h-5 w-5 mr-2" />
              Agreements
            </CardTitle>
            <CardDescription>Retail/lease agreements & service contracts</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{agreements.length}</Badge>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Record Agreement
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {agreements.length === 0 ? (
          <EmptyState
            title="No agreements yet"
            description="Record an agreement for this account"
            icon={<Handshake className="h-12 w-12" />}
            action={{ label: 'Record Agreement', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.slice(0, 5).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.agreementNumber || a.id}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{a.type || '—'}</TableCell>
                    <TableCell>{a.provider || '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {a.startDate || '—'}
                        </span>
                        <span>→</span>
                        <span>{a.endDate || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusTone(a.status)}>{(a.status || 'active').toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/finance/agreements?focus=${a.id}`}>
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

export default AccountAgreementsSection
