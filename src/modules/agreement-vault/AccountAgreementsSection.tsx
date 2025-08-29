import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { GripVertical, Plus, ExternalLink, Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type Agreement = {
  id: string
  accountId?: string
  type?: string
  status?: string
  effectiveDate?: string | Date
}

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onCreate?: () => void
}

export default function AccountAgreementsSection({
  accountId,
  onRemove,
  isDragging,
  onCreate,
}: Props) {
  const all = loadFromLocalStorage<Agreement[]>('agreements', []) || []
  const items = all.filter(a => a.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) return onCreate()
    window.location.href = `/agreements/new?accountId=${accountId}&returnTo=account`
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg">Agreements</CardTitle>
            <CardDescription>Recorded agreements for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{items.length}</Badge>
          <Button variant="outline" size="sm" type="button" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create Agreement
          </Button>
          {onRemove && <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No agreements"
            description="Create an agreement for this account"
            action={{ label: 'Create Agreement', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 5).map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.type || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{(a.status || 'draft').toUpperCase()}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Calendar className="h-3 w-3 mr-1 inline" />
                      {a.effectiveDate ? formatDate(a.effectiveDate) : '—'}
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
