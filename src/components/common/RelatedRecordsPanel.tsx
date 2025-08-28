import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  FileText, 
  DollarSign, 
  Wrench, 
  Receipt,
  Plus,
  ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '@/lib/utils'

interface RelatedRecord {
  id: string
  title: string
  subtitle?: string
  status?: string
  amount?: number
  date?: string
  link?: string
}

interface RelatedRecordsPanelProps {
  accountId?: string
  contactId?: string
  leads?: RelatedRecord[]
  quotes?: RelatedRecord[]
  agreements?: RelatedRecord[]
  serviceTickets?: RelatedRecord[]
  invoices?: RelatedRecord[]
  onCreateNew?: (type: string) => void
}

export function RelatedRecordsPanel({
  accountId,
  contactId,
  leads = [],
  quotes = [],
  agreements = [],
  serviceTickets = [],
  invoices = [],
  onCreateNew
}: RelatedRecordsPanelProps) {
  const [activeTab, setActiveTab] = useState('leads')

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'current':
      case 'completed':
      case 'signed':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'in_progress':
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'cancelled':
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderRecordList = (records: RelatedRecord[], type: string, emptyMessage: string) => {
    if (records.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>{emptyMessage}</p>
          {onCreateNew && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => onCreateNew(type)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create {type.slice(0, -1)}
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {records.map((record) => (
          <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-sm">{record.title}</h4>
                {record.status && (
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                )}
              </div>
              {record.subtitle && (
                <p className="text-xs text-muted-foreground">{record.subtitle}</p>
              )}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                {record.amount && (
                  <span>{formatCurrency(record.amount)}</span>
                )}
                {record.date && (
                  <span>{formatDate(record.date)}</span>
                )}
              </div>
            </div>
            {record.link && (
              <Button variant="ghost" size="sm" asChild>
                <Link to={record.link}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    )
  }

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Users, count: leads.length },
    { id: 'quotes', label: 'Quotes', icon: FileText, count: quotes.length },
    { id: 'agreements', label: 'Agreements', icon: DollarSign, count: agreements.length },
    { id: 'service', label: 'Service', icon: Wrench, count: serviceTickets.length },
    { id: 'invoices', label: 'Invoices', icon: Receipt, count: invoices.length }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                <tab.icon className="h-3 w-3 mr-1" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="leads" className="mt-4">
            {renderRecordList(leads, 'leads', 'No leads associated with this record')}
          </TabsContent>

          <TabsContent value="quotes" className="mt-4">
            {renderRecordList(quotes, 'quotes', 'No quotes associated with this record')}
          </TabsContent>

          <TabsContent value="agreements" className="mt-4">
            {renderRecordList(agreements, 'agreements', 'No agreements associated with this record')}
          </TabsContent>

          <TabsContent value="service" className="mt-4">
            {renderRecordList(serviceTickets, 'service', 'No service tickets associated with this record')}
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            {renderRecordList(invoices, 'invoices', 'No invoices associated with this record')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}