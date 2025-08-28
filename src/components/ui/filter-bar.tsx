import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterChip {
  key: string
  label: string
  value: string
}

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onFiltersClick?: () => void
  onAdvancedSearchClick?: () => void
  filterChips?: FilterChip[]
  onRemoveFilter?: (key: string) => void
  onClearAllFilters?: () => void
  children?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onFiltersClick,
  onAdvancedSearchClick,
  filterChips = [],
  onRemoveFilter,
  onClearAllFilters,
  children,
  className
}: FilterBarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="ri-filter-bar">
        <div className="ri-filter-left">
          <div className="ri-search-container">
            <Search className="ri-search-icon" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ri-search-input"
            />
          </div>
          {children}
        </div>
        
        <div className="ri-filter-right">
          {onFiltersClick && (
            <Button variant="outline" size="sm" onClick={onFiltersClick}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {filterChips.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filterChips.length}
                </Badge>
              )}
            </Button>
          )}
          {onAdvancedSearchClick && (
            <Button variant="outline" size="sm" onClick={onAdvancedSearchClick}>
              <Search className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      {filterChips.length > 0 && (
        <div className="ri-filter-chips">
          {filterChips.map((chip) => (
            <Badge
              key={chip.key}
              variant="secondary"
              className="ri-chip-removable"
            >
              <span className="text-xs">{chip.label}: {chip.value}</span>
              {onRemoveFilter && (
                <button
                  onClick={() => onRemoveFilter(chip.key)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          {onClearAllFilters && filterChips.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}