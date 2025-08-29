// src/modules/agreement-vault/components/AccountAgreementsSection.tsx
import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Plus, ExternalLink, GripVertical, Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type Agreement = {
  id: string
  accountId?: string
  type?: string
  status?: string
  title?: string
  effectiveDate?: string
  link?: string
}

interface Props {
  accountId: string
  onCreate?: () => void
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
      onCreate() // open modal from AccountDetail
    } else {
      // safe fallback: never let the button be a no-op
      window.location.href = `/agreements/new?accountId=${encodeURIComponent(accountId)}&returnTo=account`
    }
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
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
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create Agreement
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove} title="Hide section">Hide</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No agreements yet"
            description="Create your first agreement for this account."
            actionLabel="Create Agreement"
            onAction={handleAdd}
            icon={FileText}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(row => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.title || 'Untitled'}</TableCell>
                  <TableCell>{row.type || '—'}</TableCell>
                  <TableCell>{row.status || '—'}</TableCell>
                  <TableCell>
                    {row.effectiveDate ? (
                      <span className="inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(row.effectiveDate)}
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.link ? (
                      <a className="inline-flex items-center text-sm underline" href={row.link} target="_blank" rel="noreferrer">
                        Open <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No file</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountAgreementsSection
