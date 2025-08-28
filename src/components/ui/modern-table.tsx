import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { TableRowSkeleton } from '@/components/ui/loading-skeleton'
import { SafeList, SafeRender, coerceBoolean } from '@/components/ui/safe-render'
import { cn } from '@/lib/utils'

export interface ModernTableColumn<T = any> {
  key: string
  label: string
  width?: string
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface ModernTableAction<T = any> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: T) => void
  variant?: 'default' | 'destructive'
  show?: (row: T) => boolean
}

interface ModernTableProps<T = any> {
  data: T[]
  columns: ModernTableColumn<T>[]
  loading?: boolean
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  actions?: ModernTableAction<T>[]
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
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  stickyHeader?: boolean
  compact?: boolean
  className?: string
}

export function ModernTable<T extends Record<string, any>>({
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
  sortBy,
  sortDirection,
  onSort,
  stickyHeader = false,
  compact = false,
  className
}: ModernTableProps<T>) {
  const safeData = Array.isArray(data) ? data : []
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : []

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    
    const checkedValue = coerceBoolean(checked)
    if (checkedValue) {
      const allIds = safeData.map(getRowId)
      onSelectionChange(allIds)
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return
    
    const checkedValue = coerceBoolean(checked)
    if (checkedValue) {
      onSelectionChange([...safeSelectedIds, rowId])
    } else {
      onSelectionChange(safeSelectedIds.filter(id => id !== rowId))
    }
  }

  const isAllSelected = safeData.length > 0 && safeSelectedIds.length === safeData.length
  const isPartiallySelected = safeSelectedIds.length > 0 && safeSelectedIds.length < safeData.length

  const cellClassName = compact ? 'ri-table-cell-compact' : 'ri-table-cell'

  if (loading) {
    return (
      <div className={cn('ri-table-container', className)}>
        <Table>
          <TableHeader className={cn('ri-table-header', stickyHeader && 'sticky top-0 z-10')}>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <div className="ri-skeleton h-4 w-4" />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={cn('ri-table-header-cell', column.headerClassName)}
                  style={{ width: column.width }}
                >
                  <div className="ri-skeleton h-4 w-20" />
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-12"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} columns={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (safeData.length === 0 && emptyState) {
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
        <TableHeader className={cn('ri-table-header', stickyHeader && 'sticky top-0 z-10 bg-background')}>
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
                className={cn('ri-table-header-cell', column.headerClassName)}
                style={{ width: column.width }}
              >
                {column.sortable && onSort ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown className={cn(
                      'ml-2 h-3 w-3',
                      sortBy === column.key ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </Button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SafeList data={safeData} fallback={null}>
            {(items) => items.map((row, index) => {
              const rowId = getRowId(row)
              const isSelected = safeSelectedIds.includes(rowId)
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
                    <TableCell className={cellClassName} onClick={(e) => e.stopPropagation()}>
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
                      className={cn(cellClassName, column.className)}
                    >
                      <SafeRender data={row[column.key]} fallback="—">
                        {(value) => column.render 
                          ? column.render(value, row, index)
                          : value
                        }
                      </SafeRender>
                    </TableCell>
                  ))}
                  {visibleActions.length > 0 && (
                    <TableCell className={cellClassName} onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ri-interactive">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {visibleActions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={cn(
                                'ri-interactive',
                                action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                              )}
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
          </SafeList>
        </TableBody>
      </Table>
    </div>
  )
}