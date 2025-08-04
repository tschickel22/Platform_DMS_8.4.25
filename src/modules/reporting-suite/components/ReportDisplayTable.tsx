import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Download, Filter, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ReportData {
  id: string
  name?: string
  category?: string
  value?: number
  date?: string
  status?: string
  [key: string]: any
}

interface ReportDisplayTableProps {
  data: ReportData[]
  title: string
  description?: string
  columns: Array<{
    key: string
    label: string
    type?: 'text' | 'number' | 'currency' | 'date' | 'badge'
  }>
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
}

export function ReportDisplayTable({
  data = [],
  title,
  description,
  columns = [],
  searchable = true,
  filterable = true,
  exportable = true
}: ReportDisplayTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Get unique categories and statuses for filters
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(
      data.map(item => item.category).filter(Boolean)
    ))
    return uniqueCategories
  }, [data])

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(
      data.map(item => item.status).filter(Boolean)
    ))
    return uniqueStatuses
  }, [data])

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter - safely handle undefined values
      const matchesSearch = !searchTerm || columns.some(column => {
        const value = item[column.key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })

      // Category filter - safely handle undefined values
      const matchesCategory = categoryFilter === 'all' || 
        (item.category && item.category === categoryFilter)

      // Status filter - safely handle undefined values  
      const matchesStatus = statusFilter === 'all' || 
        (item.status && item.status === statusFilter)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [data, searchTerm, categoryFilter, statusFilter, columns])

  const handleExport = () => {
    // Create CSV content
    const headers = columns.map(col => col.label).join(',')
    const rows = filteredData.map(item => 
      columns.map(col => {
        const value = item[col.key]
        if (value === null || value === undefined) return ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    ).join('\n')
    
    const csvContent = `${headers}\n${rows}`
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const renderCellValue = (item: ReportData, column: any) => {
    const value = item[column.key]
    
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>
    }

    switch (column.type) {
      case 'currency':
        return formatCurrency(Number(value) || 0)
      case 'date':
        return formatDate(new Date(value))
      case 'number':
        return Number(value).toLocaleString()
      case 'badge':
        return (
          <Badge variant="outline" className="capitalize">
            {String(value)}
          </Badge>
        )
      default:
        return String(value)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              {title}
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {exportable && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        {(searchable || filterable) && (
          <div className="flex gap-4">
            {searchable && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            
            {filterable && categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {filterable && statuses.length > 0 && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {renderCellValue(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No data available</p>
                    {searchTerm && (
                      <p className="text-sm">Try adjusting your search criteria</p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredData.length} of {data.length} records
            </span>
            {searchTerm && (
              <span>
                Filtered by: "{searchTerm}"
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}