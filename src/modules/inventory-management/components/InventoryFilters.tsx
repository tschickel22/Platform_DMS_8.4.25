import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Download, Upload } from 'lucide-react'
import { InventoryFilter } from '../types'

interface InventoryFiltersProps {
  filter: InventoryFilter
  onFilterChange: (filter: InventoryFilter) => void
  onExport: () => void
  onImport: () => void
  resultCount: number
  totalCount: number
}

export function InventoryFilters({
  filter,
  onFilterChange,
  onExport,
  onImport,
  resultCount,
  totalCount
}: InventoryFiltersProps) {
  const updateFilter = (updates: Partial<InventoryFilter>) => {
    onFilterChange({ ...filter, ...updates })
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, VIN, or inventory ID..."
            value={filter.searchTerm}
            onChange={(e) => updateFilter({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter.status}
            onChange={(e) => updateFilter({ status: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="service">Service</option>
          </select>
          
          <select
            value={filter.type}
            onChange={(e) => updateFilter({ type: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="rv">RV</option>
            <option value="manufactured_home">Manufactured Home</option>
          </select>
        </div>
      </div>

      {/* Results and Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} of {totalCount} vehicles
        </p>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
    </div>
  )
}