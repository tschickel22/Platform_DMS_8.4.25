import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { ShieldCheck, Plus, ExternalLink, GripVertical, Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type Warranty = {
  id: string
  accountId?: string
  policyNumber: string
  product?: string
  provider?: string
  status?: 'active' | 'expired' | 'pending' | 'cancelled'
  startDate?: string | Date
  endDate?: string | Date
  notes?: string
}

interface AccountWarrantySectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  /** Prefer this to open the New Claim modal from AccountDetail */
  onAddWarranty?: () => void
  /** Generic create fallback (kept for compatibility) */
  onCreate?: () => void
}

export function AccountWarrantySection({
  accountId,
  onRemove,
  isDragging,
  onAddWarranty,
  onCreate,
}: AccountWarrantySectionProps) {
  // Demo persistence — align with how Deliveries are handled
  const all = loadFromLocalStorage<Warranty[]>('warranties', [])
  const warranties = (all || []).filter(w => w.accountId === accountId)

  const handleAdd = () => {
    if (onAddWarranty) return onAddWarranty()
    if (onCreate) return onCreate()
    // Last-resort fallback: jump to warranty module list with account filter
    window.location.href = `/inventory/warranty?accountId=${accountId}&returnTo=account`
  }

  const statusTone = (s?: Warranty['status']) => {
    switch (s) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200'
      case 'expired': return 'bg-red-50 text-red-700 border-red-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200'
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
              <ShieldCheck className="h-5 w-5 mr-2" />
              Warranty
            </CardTitle>
            <CardDescription>Warranty registrations and coverage</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{warranties.length}</Badge>
          <Button variant="outline" size="sm" type="button" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Record Warranty
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {warranties.length === 0 ? (
          <EmptyState
            title="No warranties yet"
            description="Record a warranty for this account"
            icon={<ShieldCheck className="h-12 w-12" />}
            action={{ label: 'Record Warranty', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warranties.slice(0, 5).map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.policyNumber || w.id}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{w.product || '—'}</TableCell>
                    <TableCell>{w.provider || '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {w.startDate ? formatDate(w.startDate) : '—'}
                        </span>
                        <span>→</span>
                        <span>{w.endDate ? formatDate(w.endDate) : '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusTone(w.status)}>
                        {(w.status || 'active').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/inventory/warranty?focus=${w.id}`}>
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

export default AccountWarrantySection
