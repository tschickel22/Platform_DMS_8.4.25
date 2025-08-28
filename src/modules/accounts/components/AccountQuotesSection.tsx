import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Plus, ExternalLink, GripVertical } from 'lucide-react'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatCurrency, formatDate } from '@/lib/utils'

interface AccountQuotesSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
}

export function AccountQuotesSection({ accountId, onRemove, isDragging }: AccountQuotesSectionProps) {
  // Filter quotes for this account (using sample quotes from agreements mock)
  const accountQuotes = mockAgreements.sampleQuotes?.filter(quote => 
    quote.accountId === accountId
  ) || []

  const totalValue = accountQuotes.reduce((sum, quote) => sum + quote.amount, 0)
  const pendingQuotes = accountQuotes.filter(quote => 
    quote.status === 'sent' || quote.status === 'viewed'
  )

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quotes
            </CardTitle>
            <CardDescription>
              Quotes and proposals for this account
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{accountQuotes.length}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {accountQuotes.length === 0 ? (
          <EmptyState
            title="No quotes found"
            description="Create a quote for this account to track proposals"
            icon={<FileText className="h-12 w-12" />}
            action={{
              label: "Create Quote",
              onClick: () => window.location.href = `/quotes?accountId=${accountId}`
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{accountQuotes.length}</p>
                <p className="text-sm text-muted-foreground">Total Quotes</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{pendingQuotes.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Recent quotes and proposals
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/quotes?accountId=${accountId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quote
                </Link>
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountQuotes.slice(0, 5).map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <Link 
                          to={`/quotes/${quote.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {quote.number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(quote.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {quote.status || 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(quote.createdAt || new Date())}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/quotes/${quote.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {accountQuotes.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/quotes?accountId=${accountId}`}>
                    View All {accountQuotes.length} Quotes
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}