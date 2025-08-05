import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, RefreshCw, Wrench, Truck, ListTodo, ClipboardCheck } from 'lucide-react'
import { CalendarFilter } from '../types'

interface CalendarFiltersProps {
  filters: CalendarFilter
  onFiltersChange: (filters: CalendarFilter) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  filterOptions: {
    assignees: string[]
    statuses: string[]
    priorities: string[]
  }
  getAssigneeName: (id: string) => string
  stats: {
    total: number
    service: number
    delivery: number
    tasks: number
    pdi: number
  }
}

export function CalendarFilters({
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange,
  filterOptions,
  getAssigneeName,
  stats
}: CalendarFiltersProps) {
  const resetFilters = () => {
    onFiltersChange({
      showService: true,
      showDelivery: true,
      showTasks: true,
      showPDI: true,
      assignedToFilter: 'all',
      statusFilter: 'all',
      priorityFilter: 'all'
    })
    onSearchChange('')
  }

  const updateFilter = (key: keyof CalendarFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-primary" />
              Calendar Filters
            </CardTitle>
            <CardDescription>
              Filter and search calendar events
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search events, customers, vehicles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>

        {/* Event Type Toggles */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Event Types</Label>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={filters.showService}
                  onCheckedChange={(checked) => updateFilter('showService', !!checked)}
                />
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Service Tickets</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {stats.service}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={filters.showDelivery}
                  onCheckedChange={(checked) => updateFilter('showDelivery', !!checked)}
                />
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Deliveries</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {stats.delivery}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={filters.showTasks}
                  onCheckedChange={(checked) => updateFilter('showTasks', !!checked)}
                />
                <div className="flex items-center space-x-2">
                  <ListTodo className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Tasks</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {stats.tasks}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={filters.showPDI}
                  onCheckedChange={(checked) => updateFilter('showPDI', !!checked)}
                />
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">PDI Inspections</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {stats.pdi}
              </Badge>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Advanced Filters</Label>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="assignedToFilter" className="text-xs">Assigned To</Label>
              <Select 
                value={filters.assignedToFilter} 
                onValueChange={(value) => updateFilter('assignedToFilter', value)}
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {filterOptions.assignees.map(assigneeId => (
                    <SelectItem key={assigneeId} value={assigneeId}>
                      {getAssigneeName(assigneeId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="statusFilter" className="text-xs">Status</Label>
              <Select 
                value={filters.statusFilter} 
                onValueChange={(value) => updateFilter('statusFilter', value)}
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {filterOptions.statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priorityFilter" className="text-xs">Priority</Label>
              <Select 
                value={filters.priorityFilter} 
                onValueChange={(value) => updateFilter('priorityFilter', value)}
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {filterOptions.priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Showing {stats.total} events
            </span>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{stats.service} Service</span>
              <span>•</span>
              <span>{stats.delivery} Delivery</span>
              <span>•</span>
              <span>{stats.tasks} Tasks</span>
              <span>•</span>
              <span>{stats.pdi} PDI</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}