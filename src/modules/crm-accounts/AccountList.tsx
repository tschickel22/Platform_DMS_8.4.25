import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Plus, 
  Building2, 
  Users, 
  FileText, 
  MoreHorizontal,
  Filter,
  Download,
  Upload,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar
} from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { FilterPanel } from '@/components/common/FilterPanel'
import { AdvancedSearch } from '@/components/common/AdvancedSearch'
import { ImportExportActions } from '@/components/common/ImportExportActions'
import { BulkOperationsPanel } from '@/components/common/BulkOperationsPanel'
import { useSavedFilters } from '@/hooks/useSavedFilters'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function AccountList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    industry: searchParams.get('industry') || '',
    status: searchParams.get('status') || '',
    createdAfter: searchParams.get('createdAfter') || '',
    createdBefore: searchParams.get('createdBefore') || ''
  })

  const { accounts, createAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { savedFilters, saveFilter, loadFilter, deleteFilter, setDefaultFilter } = useSavedFilters('accounts')

  // Calculate account metrics
  const accountMetrics = useMemo(() => {
    const totalAccounts = accounts.length
    const recentAccounts = accounts.filter(account => {
      const createdDate = new Date(account.createdAt)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return createdDate > thirtyDaysAgo
    }).length
    
    const accountsWithContacts = accounts.filter(account => 
      contacts.some(contact => contact.accountId === account.id)
    ).length
    
    const industriesCount = new Set(accounts.map(acc => acc.industry).filter(Boolean)).size

    return {
      totalAccounts,
      recentAccounts,
      accountsWithContacts,
      industriesCount
    }
  }, [accounts, contacts])

  // Filter accounts based on search and filters
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = searchTerm === '' || 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.address?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesIndustry = filters.industry === '' || account.industry === filters.industry
      
      const matchesDateRange = (!filters.createdAfter || new Date(account.createdAt) >= new Date(filters.createdAfter)) &&
                              (!filters.createdBefore || new Date(account.createdAt) <= new Date(filters.createdBefore))

      return matchesSearch && matchesIndustry && matchesDateRange
    })
  }, [accounts, searchTerm, filters])

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    // Update URL params
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    if (searchTerm) params.set('search', searchTerm)
    setSearchParams(params)
  }

  const handleAdvancedSearch = (criteria: any[]) => {
    // Convert advanced search criteria to filters
    const newFilters = { ...filters }
    criteria.forEach(criterion => {
      if (criterion.field && criterion.value) {
        newFilters[criterion.field as keyof typeof filters] = criterion.value
      }
    })
    handleFiltersChange(newFilters)
  }

  const handleImport = (importedData: any[]) => {
    importedData.forEach(accountData => {
      createAccount(accountData)
    })
    toast({
      title: 'Import Successful',
      description: `Successfully imported ${importedData.length} accounts.`
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredAccounts.map(acc => acc.id) : [])
  }

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked 
        ? [...prev, accountId]
        : prev.filter(id => id !== accountId)
    )
  }

  const filterFields = [
    {
      key: 'industry',
      label: 'Industry',
      type: 'select' as const,
      options: [
        { value: 'RV Dealership', label: 'RV Dealership' },
        { value: 'Manufactured Home Dealer', label: 'Manufactured Home Dealer' },
        { value: 'RV Rental', label: 'RV Rental' },
        { value: 'Service Provider', label: 'Service Provider' }
      ]
    },
    {
      key: 'createdAfter',
      label: 'Created After',
      type: 'date' as const
    },
    {
      key: 'createdBefore',
      label: 'Created Before', 
      type: 'date' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
              <p className="text-muted-foreground">
                Manage your business accounts. {filteredAccounts.length} of {accounts.length} accounts shown.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ImportExportActions
                module="accounts"
                data={filteredAccounts}
                onImport={handleImport}
                sampleFields={['Account Name', 'Email', 'Phone', 'Address', 'Website', 'Industry']}
              />
              <Button onClick={() => navigate('/crm/accounts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header Tiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-primary">{accountMetrics.totalAccounts}</div>
              <p className="text-xs text-muted-foreground">
                +{accountMetrics.recentAccounts} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-success">{accountMetrics.accountsWithContacts}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((accountMetrics.accountsWithContacts / accountMetrics.totalAccounts) * 100)}% coverage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industries</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-info">{accountMetrics.industriesCount}</div>
              <p className="text-xs text-muted-foreground">
                Unique industries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-warning">{accountMetrics.recentAccounts}</div>
              <p className="text-xs text-muted-foreground">
                New accounts this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              savedFilters={savedFilters}
              onSaveFilter={saveFilter}
              onLoadFilter={(filter) => handleFiltersChange(filter.filters)}
              onDeleteFilter={deleteFilter}
              onSetDefaultFilter={setDefaultFilter}
              filterFields={filterFields}
              module="accounts"
            />
            <AdvancedSearch
              onSearch={handleAdvancedSearch}
              onClear={() => handleFiltersChange({ industry: '', status: '', createdAfter: '', createdBefore: '' })}
              entityType="accounts"
            />
          </div>
        </div>

        {/* Accounts Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>
                  A list of all accounts in your CRM. Showing {filteredAccounts.length} accounts.
                </CardDescription>
              </div>
              {selectedIds.length > 0 && (
                <Badge variant="secondary">
                  {selectedIds.length} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredAccounts.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || Object.values(filters).some(f => f) 
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first account'
                  }
                </p>
                <Button onClick={() => navigate('/crm/accounts/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center space-x-2 mb-4 pb-4 border-b">
                  <Checkbox
                    checked={selectedIds.length === filteredAccounts.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all {filteredAccounts.length} accounts
                  </span>
                </div>

                {/* Accounts Grid */}
                <div className="grid gap-4">
                  {filteredAccounts.map((account) => {
                    const accountContacts = contacts.filter(c => c.accountId === account.id)
                    const primaryContact = accountContacts.find(c => c.isPrimary)
                    
                    return (
                      <div key={account.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedIds.includes(account.id)}
                            onCheckedChange={(checked) => handleSelectAccount(account.id, checked as boolean)}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Link 
                                    to={`/crm/accounts/${account.id}`}
                                    className="text-lg font-semibold text-primary hover:underline"
                                  >
                                    {account.name}
                                  </Link>
                                  {account.industry && (
                                    <Badge variant="outline" className="text-xs">
                                      {account.industry}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                                  {account.email && (
                                    <div className="flex items-center space-x-1">
                                      <Mail className="h-3 w-3" />
                                      <span className="truncate">{account.email}</span>
                                    </div>
                                  )}
                                  {account.phone && (
                                    <div className="flex items-center space-x-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{account.phone}</span>
                                    </div>
                                  )}
                                  {account.website && (
                                    <div className="flex items-center space-x-1">
                                      <Globe className="h-3 w-3" />
                                      <span className="truncate">{account.website}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(account.createdAt)}</span>
                                  </div>
                                </div>

                                {account.address && (
                                  <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{account.address}</span>
                                  </div>
                                )}

                                {/* Contact Summary */}
                                {accountContacts.length > 0 && (
                                  <div className="mt-3 pt-3 border-t">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2 text-sm">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          {accountContacts.length} contact{accountContacts.length !== 1 ? 's' : ''}
                                        </span>
                                        {primaryContact && (
                                          <span className="text-foreground">
                                            • {primaryContact.firstName} {primaryContact.lastName}
                                          </span>
                                        )}
                                      </div>
                                      <Button variant="ghost" size="sm" asChild>
                                        <Link to={`/crm/contacts?accountId=${account.id}`}>
                                          View Contacts
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/crm/accounts/${account.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/crm/accounts/${account.id}/edit`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
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
    </div>
  )
}