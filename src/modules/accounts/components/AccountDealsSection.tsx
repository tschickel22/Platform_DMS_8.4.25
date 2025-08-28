import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { DollarSign, Plus, ExternalLink, GripVertical } from 'lucide-react'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'
import { formatCurrency, formatDate } from '@/lib/utils'

export interface AccountDealsSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
  onAddDeal?: () => void
}

export function AccountDealsSection({
  accountId,
  onRemove,
  isDragging,
  onAddDeal,
}: AccountDealsSectionProps) {
  const accountDeals = mockCrmSalesDeal.sampleDeals.filter((d) => d.accountId === accountId)

  const getStageColor = (stage: string) =>
    (mockCrmSalesDeal.stageColors && mockCrmSalesDeal.stageColors[stage]) || 'bg-gray-100 text-gray-800'

  const totalValue = accountDeals.reduce((sum, d) => sum + d.amount, 0)
  const activeDeals = accountDeals.filter((d) => !['Closed Won', 'Closed Lost'].includes(d.stage))

  const handleAdd = () => {
    if (onAddDeal) return onAddDeal()
    window.location.href = `/deals/new?accountId=${accountId}&returnTo=account`
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Sales Deals
            </CardTitle>
            <CardDescription>Active and historical deals for this account</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{accountDeals.length}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {accountDeals.length === 0 ? (
          <EmptyState
            title="No deals found"
            description="Create a deal for this account to track sales progress"
            icon={<DollarSign className="h-12 w-12" />}
            action={{ label: 'Create Deal', onClick: handleAdd }}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{accountDeals.length}</p>
                <p className="text-sm text-muted-foreground">Total Deals</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{activeDeals.length}</p>
                <p className="text-sm text-muted-foreground">Active Deals</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Recent deals and opportunities</p>
              <Button size="sm" variant="outline" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stage</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountDeals.slice(0, 5).map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <Badge className={getStageColor(d.stage)}>{d.stage}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{d.vehicleInfo}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(d.amount)}</span>
                      </TableCell>
                      <TableCell>{formatDate(d.expectedCloseDate)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/deals/${d.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {accountDeals.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/deals?accountId=${accountId}`}>View All {accountDeals.length} Deals</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountDealsSection
