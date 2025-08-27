import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Filter, Save, Trash2, Star, StarOff } from 'lucide-react'
import { SavedFilter } from '@/types'

interface FilterConfig {
  [key: string]: any
}

interface FilterPanelProps {
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  savedFilters: SavedFilter[]
  onSaveFilter: (name: string, isDefault?: boolean) => void
  onLoadFilter: (filter: SavedFilter) => void
  onDeleteFilter: (filterId: string) => void
  onSetDefaultFilter: (filterId: string) => void
  filterFields: Array<{
    key: string
    label: string
    type: 'text' | 'select' | 'date'
    options?: Array<{ value: string; label: string }>
  }>
  module: 'accounts' | 'contacts'
}

export function FilterPanel({
  filters,
  onFiltersChange,
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  onSetDefaultFilter,
  filterFields,
  module
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [saveFilterName, setSaveFilterName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const activeFilterCount = Object.values(filters).filter(value => 
    value !== '' && value !== undefined && value !== null
  ).length

  const clearFilters = () => {
    const clearedFilters: FilterConfig = {}
    filterFields.forEach(field => {
      clearedFilters[field.key] = ''
    })
    onFiltersChange(clearedFilters)
  }

  const handleSaveFilter = (isDefault: boolean = false) => {
    if (saveFilterName.trim()) {
      onSaveFilter(saveFilterName.trim(), isDefault)
      setSaveFilterName('')
      setShowSaveDialog(false)
    }
  }

  const renderFilterField = (field: any) => {
    const value = filters[field.key] || ''

    switch (field.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={(newValue) => 
            onFiltersChange({ ...filters, [field.key]: newValue })
          }>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onFiltersChange({ ...filters, [field.key]: e.target.value })}
          />
        )
      
      default:
        return (
          <Input
            value={value}
            onChange={(e) => onFiltersChange({ ...filters, [field.key]: e.target.value })}
            placeholder={`Filter by ${field.label.toLowerCase()}`}
          />
        )
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter {module === 'accounts' ? 'Accounts' : 'Contacts'}</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Saved Filters</Label>
                <div className="space-y-2 mt-2">
                  {savedFilters.map((savedFilter) => (
                    <div key={savedFilter.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onLoadFilter(savedFilter)}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {savedFilter.name}
                        </button>
                        {savedFilter.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSetDefaultFilter(savedFilter.id)}
                          title={savedFilter.isDefault ? "Remove as default" : "Set as default"}
                        >
                          {savedFilter.isDefault ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteFilter(savedFilter.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Fields */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Filter Criteria</Label>
              {filterFields.map((field) => (
                <div key={field.key} className="grid gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {renderFilterField(field)}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" disabled={activeFilterCount === 0}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Current Filters
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Filter</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filterName">Filter Name</Label>
                      <Input
                        id="filterName"
                        value={saveFilterName}
                        onChange={(e) => setSaveFilterName(e.target.value)}
                        placeholder="Enter filter name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleSaveFilter(false)} disabled={!saveFilterName.trim()}>
                        Save Filter
                      </Button>
                      {module === 'accounts' && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleSaveFilter(true)} 
                          disabled={!saveFilterName.trim()}
                        >
                          Save as Default
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full" onClick={clearFilters} disabled={activeFilterCount === 0}>
                Clear All Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}