import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Plus, GripVertical, ExternalLink } from 'lucide-react'
import { loadFromLocalStorage } from '@/lib/utils'
import { Link } from 'react-router-dom'

type AppRow = {
  id: string
  accountId?: string
  customerName?: string
  status?: string
  templateId?: string
}

interface Props {
  accountId: string
  isDragging?: boolean
  onRemove?: () => void
  onCreate?: () => void
}

export default function AccountApplicationsSection({
  accountId,
  isDragging,
  onRemove,
  onCreate,
}: Props) {
  const all = loadFromLocalStorage<AppRow[]>('financeApplications', []) || []
  const apps = all.filter(a => a.accountId === accountId)

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Finance Applications
            </CardTitle>
            <CardDescription>Credit/loan applications for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{apps.length}</Badge>
          <Button variant="outline" size="sm" onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Application
          </Button>
          {onRemove && <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>}
        </div>
      </CardHeader>

      <CardContent>
        {apps.length === 0 ? (
          <EmptyState
            title="No applications"
            description="Create a finance application for this account"
            icon={<FileText className="h-12 w-12" />}
            action={{ label: 'Create Application', onClick: onCreate }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.slice(0, 5).map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.customerName || '—'}</TableCell>
                    <TableCell>{(a.status || 'draft').toUpperCase()}</TableCell>
                    <TableCell>{a.templateId || '—'}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/client-applications?focus=${a.id}`}>
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
