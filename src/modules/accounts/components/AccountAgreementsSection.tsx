// src/modules/agreement-vault/components/AccountAgreementsSection.tsx
import React from 'react'
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
  effectiveDate?: string | Date
  expirationDate?: string | Date
  templateName?: string
}

interface Props {
  accountId: string
  onCreate?: () => void
  onRemove?: () => void
  isDragging?: boolean
}

export default function AccountAgreementsSection({
  accountId,
  onCreate,
  onRemove,
  isDragging,
}: Props) {
  const all = loadFromLocalStorage<Agreement[]>('agreements', []) || []
  const agreements = all.filter(a => a.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) return onCreate()
    // fallback route if no modal was wired
    window.location.href = `/agreements/new?accountId=${accountId}&returnTo=account`
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
            <CardDescription>Contracts and signed documents</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{agreements.length}</Badge>
          <Button variant="outline" size="sm" type="button" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create Agreement
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
            description="Create an agreement for this account"
            icon={<FileText className="h-12 w-12" />}
            action={{ label: 'Create Agreement', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.slice(0, 5).map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.type || '—'}</TableCell>
                    <TableCell>{(a.status || 'draft').toUpperCase()}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{a.templateName || '—'}</TableCell>
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
                        <a href={`/agreements?focus=${a.id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </a>
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
