import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, BarChart3 } from 'lucide-react'
import { InventoryStats as StatsType } from '../types'
import { formatCurrency } from '@/lib/utils'

interface InventoryStatsProps {
  stats: StatsType
}

export function InventoryStats({ stats }: InventoryStatsProps) {
  const statCards = [
    {
      title: 'Total Units',
      value: stats.totalUnits.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Available',
      value: stats.availableUnits.toString(),
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'Sold This Month',
      value: stats.soldUnits.toString(),
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: BarChart3,
      color: 'text-emerald-600'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.title === 'Total Value' && (
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(stats.averagePrice)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}