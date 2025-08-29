import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { GripVertical, FileSignature, Plus, ExternalLink, Calendar, DollarSign } from 'lucide-react'
import { loadFromLocalStorage, formatDate } from '@/lib/utils'

type ApplicationStatus = 'draft' | 'submitted' | 'approved' | 'declined' | 'funded'

type FinanceApplication = {
  id: string
  accountId?: string
  customerId: string
  vehicleId?: string
  amount: number
  status: ApplicationStatus
  submittedDate?: string | Date
  notes?: string
}

interface Props {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  /** from AccountDetail wiring; open modal when present */
  onCreate?: () => void
}

export default function AccountApplicationsSection({
  accountId,
  onRemove,
  isDragging,
  onCreate,
}: Props) {
  const all = loadFromLocalStorage<FinanceApplication[]>('applications', []) || []
  const apps = all.filter(a => a.accountId === accountId)

  const handleAdd = () => {
    if (onCreate) onCreate()
    else window.location.href = `/finance/applications/new?accountId=${accountId}&returnTo=account`
  }

  const statusTone = (s: ApplicationStatus) => {
    switch (s) {
      case 'draft': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'submitted': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'approved': return 'bg-green-50 text-green-700 border-green-200'
      case 'funded': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'declined': return 'bg-red-50 text-red-700 border-red-200'
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
              <FileSignature className="h-5 w-5 mr-2" />
              Finance Applications
            </CardTitle>
            <CardDescription>Credit/loan applications for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{apps.length}</Badge>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Record Application
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {apps.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Record the first finance application for this account"
            icon={<FileSignature className="h-12 w-12" />}
            action={{ label: 'Record Application', onClick: handleAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.slice(0, 5).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">#{a.id}</TableCell>
                    <TableCell>
                      <Badge className={statusTone(a.status)}>
                        {a.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {a.submittedDate ? formatDate(a.submittedDate) : '—'}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(a.amount || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/finance/applications?focus=${a.id}`}>
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
