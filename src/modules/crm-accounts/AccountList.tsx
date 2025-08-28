import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccountManagement } from './hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusCircle, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { FilterPanel } from '@/components/common/FilterPanel'
import { ImportExportActions } from '@/components/common/ImportExportActions'
import { BulkOperationsPanel } from '@/components/common/BulkOperationsPanel'
import { AdvancedSearch } from '@/components/common/AdvancedSearch'
import { useSavedFilters } from '@/hooks/useSavedFilters'

export default function AccountList() {
  const { accounts, loading, error, deleteAccount, createAccount } = useAccountManagement()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState<any[]>([])
  const { savedFilters, saveFilter, deleteFilter, setDefaultFilter, getDefaultFilter } = useSavedFilters('accounts')
  
    // Basic search
  // Filter state
  const [filters, setFilters] = React.useState({
    search: searchParams.get('search') || '',
    industry: searchParams.get('industry') || '',
    createdAfter: searchParams.get('createdAfter') || '',
    
    // Advanced search
    const matchesAdvanced = advancedSearchCriteria.length === 0 || 
      advancedSearchCriteria.every(criteria => {
        const fieldValue = (account as any)[criteria.field]?.toString().toLowerCase() || ''
        const searchValue = criteria.value.toLowerCase()
        
        switch (criteria.operator) {
          case 'contains':
            return fieldValue.includes(searchValue)
          case 'equals':
            return fieldValue === searchValue
          case 'starts_with':
            return fieldValue.startsWith(searchValue)
          case 'ends_with':
            return fieldValue.endsWith(searchValue)
          case 'not_equals':
            return fieldValue !== searchValue
          case 'is_empty':
            return !fieldValue
          case 'is_not_empty':
            return !!fieldValue
          default:
            return true
        }
      })
    
    return matchesSearch && matchesAdvanced
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAccounts.map(account => account.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, accountId])
    } else {
      setSelectedIds(prev => prev.filter(id => id !== accountId))
    }
  }

  const handleImport = (importedData: any[]) => {
    importedData.forEach(data => {
      createAccount(data)
    })
  }

  const csvFields = ['name', 'email', 'phone', 'address', 'website', 'industry']

  // Load default filter on mount
  React.useEffect(() => {
    const defaultFilter = getDefaultFilter()
    if (defaultFilter && Object.keys(filters).every(key => !filters[key])) {
      setFilters(defaultFilter.filters)
    }
  }, [getDefaultFilter])

  // Update URL params when filters change
  React.useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  // Filter accounts based on current filters
  const filteredAccounts = React.useMemo(() => {
    return accounts.filter(account => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          account.name.toLowerCase().includes(searchLower) ||
          account.email?.toLowerCase().includes(searchLower) ||
          account.phone?.includes(filters.search) ||
          account.industry?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      
      if (filters.industry && account.industry !== filters.industry) {
        return false
      }
      
      if (filters.createdAfter) {
        const createdDate = new Date(account.createdAt)
        const filterDate = new Date(filters.createdAfter)
        if (createdDate < filterDate) return false
      }
      
      if (filters.createdBefore) {
        const createdDate = new Date(account.createdAt)
        const filterDate = new Date(filters.createdBefore)
        if (createdDate > filterDate) return false
      }
      
      return true
    })
  }, [accounts, filters])

  const industries = React.useMemo(() => {
    const uniqueIndustries = [...new Set(accounts.map(acc => acc.industry).filter(Boolean))]
    return uniqueIndustries.map(industry => ({ value: industry!, label: industry! }))
  }, [accounts])

  const filterFields = [
    { key: 'search', label: 'Search', type: 'text' as const },
    { key: 'industry', label: 'Industry', type: 'select' as const, options: industries },
    { key: 'createdAfter', label: 'Created After', type: 'date' as const },
    { key: 'createdBefore', label: 'Created Before', type: 'date' as const }
  ]

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id)
    }
  }

  const handleImport = (importedData: any[]) => {
    importedData.forEach(accountData => {
      createAccount(accountData)
    })
  }

  const sampleFields = ['name', 'email', 'phone', 'address', 'website', 'industry']

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (accounts.length === 0) {
    return (
      <EmptyState
        title="No Accounts Found"
        description="Get started by creating a new account."
        icon={<PlusCircle className="h-12 w-12" />}
        action={{
          label: 'Create New Account',
          onClick: () => window.location.href = '/crm/accounts/new'
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Accounts</h1>
          <p className="ri-page-description">
            Manage your business accounts. {filteredAccounts.length} of {accounts.length} accounts shown.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ImportExportActions
            module="accounts"
            data={filteredAccounts}
            onImport={handleImport}
            sampleFields={sampleFields}
          />
          <Button asChild>
            <Link to="/crm/accounts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Account
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search accounts..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="ri-search-input"
          />
        </div>
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          savedFilters={savedFilters}
          onSaveFilter={(name, isDefault) => saveFilter(name, filters, isDefault)}
          onLoadFilter={(filter) => setFilters(filter.filters)}
          onDeleteFilter={deleteFilter}
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(account.id)}
                        onCheckedChange={(checked) => handleSelectAccount(account.id, checked as boolean)}
                      />
                    </TableCell>
          onSetDefaultFilter={setDefaultFilter}
              Manage your business accounts. {filteredAccounts.length} of {accounts.length} accounts shown.
          module="accounts"
        />
      </div>
            <ImportExportActions
              module="accounts"
              data={filteredAccounts}
              onImport={handleImport}
              sampleFields={csvFields}
            />

      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>
            A list of all accounts in your CRM. Showing {filteredAccounts.length} accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <AdvancedSearch
            onSearch={setAdvancedSearchCriteria}
            onClear={() => setAdvancedSearchCriteria([])}
            entityType="accounts"
          />
            <TableBody>
              {filteredAccounts.map((account) => (
          )
          )
          }
        {/* Selection Info */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              {selectedIds.length} account{selectedIds.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <Link to={`/crm/accounts/${account.id}`} className="text-primary hover:underline">
                      {account.name}
                    </Link>
              A list of all accounts in your CRM. Showing {filteredAccounts.length} accounts.
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>{account.industry}</TableCell>
                  <TableCell>{formatDateTime(account.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" asChild>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredAccounts.length && filteredAccounts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                      <Link to={`/crm/accounts/${account.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(account.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Operations Panel */}
      <BulkOperationsPanel
        selectedIds={selectedIds}
        entityType="accounts"
        onClearSelection={() => setSelectedIds([])}
        onRefresh={() => window.location.reload()}
      />
    </div>
  )
}