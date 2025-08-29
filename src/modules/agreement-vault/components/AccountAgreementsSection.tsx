// src/modules/agreement-vault/components/AccountAgreementsSection.tsx
import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Plus, ExternalLink, GripVertical, Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'

type Agreement = {
  id: string
  accountId?: string
  type?: string
  status?: string
  effectiveDate?: string | Date
  expirationDate?: string | Date
  name?: string
  templateName?: string
}

interface Props {
  accountId: string
  onCreate?: () => void           // AccountDetail wires this to open the modal
  onRemove?: () => void
  isDragging?: boolean
}

const AccountAgreementsSection: React.FC<Props> = ({
  accountId,
  onCreate,
  onRemove,
  isDragging,
}) => {
  const items = useMemo(() => {
    const all = loadFromLocalStorage<Agreement[]>('agreements', []) || []
    return all.filter(a => a.accountId === accountId)
  }, [accountId])

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onCreate) {
      onCreate()                       // opens the AgreementForm modal from AccountDetail
    } else {
      // ultra-safe fallback so the button never appears to do nothing
      window.location.href = `/agreements/new?accountId=${encodeURIComponent(accountId)}&returnTo=account`
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
              Agreements
            </CardTitle>
            <CardDescription>Recorded agreements for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{items.length}</Badge>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleAdd}
            aria-label="Create Agreement"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Agreement
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Remove section">
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No agreements"
            description="Create an agreement for this account"
            icon={<FileText className="h-12 w-12" />}
            action={{ label: 'Create Agreement', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective → Expires</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 5).map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name || a.id}</TableCell>
                    <TableCell>{a.type || '—'}</TableCell>
                    <TableCell>{(a.status || 'draft').toUpperCase()}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {a.effectiveDate ? formatDate(a.effectiveDate) : '—'}
                        </span>
                        <span>→</span>
                        <span>{a.expirationDate ? formatDate(a.expirationDate) : '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/agreements?focus=${a.id}`}>
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
export { AccountAgreementsSection }
