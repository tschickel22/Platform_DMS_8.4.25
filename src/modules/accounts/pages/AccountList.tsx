import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Building,
  UserCheck,
  Briefcase,
  Handshake
} from 'lucide-react'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { AccountType } from '@/types'
import { mockAccounts } from '@/mocks/accountsMock'

export default function AccountList() {
  const { accounts, loading, metrics } = useAccountManagement()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')

  // Get unique values for filters
  const uniqueIndustries = useMemo(() => {
    const industries = accounts.map(acc => acc.industry).filter(Boolean)
    return [...new Set(industries)].sort()
  }, [accounts])

  const uniqueTags = useMemo(() => {
    const allTags = accounts.flatMap(acc => acc.tags)
    return [...new Set(allTags)].sort()
  }, [accounts])

  // Filter accounts based on current filters
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesSearch = 
          account.name.toLowerCase().includes(term) ||
          account.email?.toLowerCase().includes(term) ||
          account.phone?.includes(term) ||
          account.industry?.toLowerCase().includes(term) ||
          account.tags.some(tag => tag.toLowerCase().includes(term))
        if (!matchesSearch) return false
      }

      // Type filter
      if (typeFilter !== 'all' && account.type !== typeFilter) return false

      // Industry filter
      if (industryFilter !== 'all' && account.industry !== industryFilter) return false

      // Tag filter
      if (tagFilter !== 'all' && !account.tags.includes(tagFilter)) return false

      return true
    })
  }, [accounts, searchTerm, typeFilter, industryFilter, tagFilter])

  // Calculate filtered metrics
  const filteredMetrics = useMemo(() => {
    const total = filteredAccounts.length
    const customers = filteredAccounts.filter(acc => acc.type === AccountType.CUSTOMER).length
    const prospects = filteredAccounts.filter(acc => acc.type === AccountType.PROSPECT).length
    const vendors = filteredAccounts.filter(acc => acc.type === AccountType.VENDOR).length
    const partners = filteredAccounts.filter(acc => acc.type === AccountType.PARTNER).length

    return { total, customers, prospects, vendors, partners }
  }, [filteredAccounts])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Accounts</h1>
          <p className="ri-page-description">Loading accounts...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="ri-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="ri-page-title">Accounts</h1>
            <p className="ri-page-description">
              Manage customer accounts, prospects, vendors, and partners
            </p>
          </div>
          <Button asChild>
            <Link to="/accounts/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Tiles */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-primary">{filteredMetrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.newThisMonth > 0 && `+${metrics.newThisMonth} this month`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-success">{filteredMetrics.customers}</div>
            <p className="text-xs text-muted-foreground">
              Active customer accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-warning">{filteredMetrics.prospects}</div>
            <p className="text-xs text-muted-foreground">
              Potential customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners & Vendors</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-info">{filteredMetrics.vendors + filteredMetrics.partners}</div>
            <p className="text-xs text-muted-foreground">
              Business relationships
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {mockAccounts.accountTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {uniqueIndustries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {uniqueTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Accounts ({filteredAccounts.length})</CardTitle>
              <CardDescription>
                Manage and track your business relationships
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAccounts.map((account) => {
              const typeConfig = mockAccounts.accountTypes.find(t => t.value === account.type)
              
              return (
                <Link key={account.id} to={`/accounts/${account.id}`}>
                  <div className="ri-table-row">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {account.name}
                          </p>
                          <Badge className={typeConfig?.color}>
                            {typeConfig?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {account.industry && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {account.industry}
                            </span>
                          )}
                          {account.email && (
                            <span>{account.email}</span>
                          )}
                          {account.phone && (
                            <span>{account.phone}</span>
                          )}
                        </div>
                        {account.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {account.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {account.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{account.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(account.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )
            })}

            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No accounts found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || typeFilter !== 'all' || industryFilter !== 'all' || tagFilter !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by creating your first account.'
                  }
                </p>
                <Button asChild>
                  <Link to="/accounts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}