import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useDealManagement } from '@/modules/crm-sales-deal/hooks/useDealManagement'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlusCircle, DollarSign } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { TableRowSkeleton } from '@/components/ui/loading-skeleton'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'

interface AccountDealsSectionProps {
  accountId: string
  title: string
}

export function AccountDealsSection({ accountId, title }: AccountDealsSectionProps) {
  const { deals, loading, error } = useDealManagement()

  const associatedDeals = deals.filter(deal => deal.customerId === accountId) // Assuming customerId in deal maps to accountId

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading associated deals...</CardDescription>
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
          <CardDescription>Error loading deals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load deals: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Sales deals associated with this account.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/deals/new?accountId=${accountId}`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Deal
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {associatedDeals.length === 0 ? (
          <EmptyState
            icon={<DollarSign className="h-12 w-12" />}
            title="No deals found"
            description="This account does not have any associated sales deals yet."
            action={{
              label: 'Add New Deal',
              onClick: () => window.location.href = `/deals/new?accountId=${accountId}`
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Expected Close</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedDeals.map(deal => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <Link to={`/deals/${deal.id}`} className="text-blue-600 hover:underline">
                      {deal.vehicleInfo || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: mockCrmSalesDeal.stageColors[deal.stage] }}>
                      {deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(deal.amount)}</TableCell>
                  <TableCell>{deal.expectedCloseDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}