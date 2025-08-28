import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/loading-skeleton'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T = any> {
  key: string
  label: string
  width?: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

export interface DataTableAction<T = any> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: T) => void
  variant?: 'default' | 'destructive'
  show?: (row: T) => boolean
}

interface DataTableProps<T = any> {
  data: T[]
  columns: DataTableColumn<T>[]
  loading?: boolean
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  actions?: DataTableAction<T>[]
  emptyState?: {
    title: string
    description?: string
    icon?: React.ComponentType<{ className?: string }>
    action?: {
      label: string
      onClick: () => void
    }
  }
  getRowId?: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  actions = [],
  emptyState,
  getRowId = (row) => row.id,
  onRowClick,
  className
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    
    if (checked) {
      const allIds = data.map(getRowId)
      onSelectionChange(allIds)
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return
    
    if (checked) {
      onSelectionChange([...selectedIds, rowId])
    } else {
      onSelectionChange(selectedIds.filter(id => id !== rowId))
    }
  }

  const isAllSelected = data.length > 0 && selectedIds.length === data.length
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < data.length

  if (loading) {
    return (
      <div className={cn('ri-table-container', className)}>
        <Table>
          <TableHeader className="ri-table-header">
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className="ri-table-header-cell">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-12"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="ri-table-row">
                {selectable && (
                  <TableCell className="ri-table-cell">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key} className="ri-table-cell">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className="ri-table-cell">
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn('ri-table-container', className)}>
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          icon={emptyState.icon && <emptyState.icon className="ri-empty-icon" />}
          action={emptyState.action}
        />
      </div>
    )
  }

  return (
    <div className={cn('ri-table-container', className)}>
      <Table>
        <TableHeader className="ri-table-header">
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={cn('ri-table-header-cell', column.className)}
                style={{ width: column.width }}
              >
                {column.label}
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="w-12"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const rowId = getRowId(row)
            const isSelected = selectedIds.includes(rowId)
            const visibleActions = actions.filter(action => !action.show || action.show(row))
            
            return (
              <TableRow 
                key={rowId} 
                className={cn(
                  'ri-table-row',
                  onRowClick && 'cursor-pointer',
                  isSelected && 'bg-muted/50'
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable && (
                  <TableCell className="ri-table-cell" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                      aria-label={`Select row ${rowId}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell 
                    key={column.key} 
                    className={cn('ri-table-cell', column.className)}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] || '—'
                    }
                  </TableCell>
                ))}
                {visibleActions.length > 0 && (
                  <TableCell className="ri-table-cell" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {visibleActions.map((action, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(row)}
                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}