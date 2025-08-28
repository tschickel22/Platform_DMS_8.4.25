import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useQuoteManagement } from '@/modules/crm-prospecting/hooks/useQuoteManagement' // Assuming this hook exists
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileText } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { TableRowSkeleton } from '@/components/ui/loading-skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { QuoteStatus } from '@/types'

interface AccountQuotesSectionProps {
  accountId: string
  title: string
}

export function AccountQuotesSection({ accountId, title }: AccountQuotesSectionProps) {
  const { quotes, loading, error } = useQuoteManagement() // Assuming this hook provides quotes

  const associatedQuotes = quotes.filter(quote => quote.customerId === accountId) // Assuming customerId in quote maps to accountId

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading associated quotes...</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRowSkeleton columns={4} />
              <TableRowSkeleton columns={4} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Error loading quotes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load quotes: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  const getStatusVariant = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.ACCEPTED: return 'default';
      case QuoteStatus.SENT:
      case QuoteStatus.VIEWED: return 'secondary';
      case QuoteStatus.REJECTED:
      case QuoteStatus.EXPIRED: return 'destructive';
      case QuoteStatus.DRAFT: return 'outline';
      default: return 'secondary';
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Quotes generated for this account.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/quotes/new?accountId=${accountId}`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Quote
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {associatedQuotes.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No quotes found"
            description="This account does not have any associated quotes yet."
            action={{
              label: 'Create New Quote',
              onClick: () => window.location.href = `/quotes/new?accountId=${accountId}`
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Valid Until</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedQuotes.map(quote => (
                <TableRow key={quote.id}>
                  <TableCell>
                    <Link to={`/quotes/${quote.id}`} className="text-blue-600 hover:underline">
                      {quote.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(quote.status)}>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(quote.total)}</TableCell>
                  <TableCell>{formatDate(quote.validUntil)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}