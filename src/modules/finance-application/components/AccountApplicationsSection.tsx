import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { GripVertical, Plus, ExternalLink, Calendar } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type AppRec = {
  id: string
  accountId?: string
  templateId?: string
  status?: string
  submittedAt?: string | Date
  createdAt?: string | Date
  customerName?: string
}

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onCreate?: () => void
}

export default function AccountApplicationsSection({
  accountId,
  onRemove,
  isDragging,
  onCreate,
}: Props) {
  const all = loadFromLocalStorage<AppRec[]>('applications', []) || []
  const items = all.filter(a => a.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) return onCreate()
    // fallback route if parent didn’t wire a modal
    window.location.href = `/finance-application/new?accountId=${accountId}&returnTo=account`
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg">Finance Applications</CardTitle>
            <CardDescription>Credit/loan applications for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{items.length}</Badge>
          <Button variant="outline" size="sm" type="button" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create Application
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No applications"
            description="Create an application for this account"
            action={{ label: 'Create Application', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 5).map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.id}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{a.customerName || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{(a.status || 'draft').toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {a.submittedAt ? formatDate(a.submittedAt) : '—'}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/finance-application?focus=${a.id}`}>
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
