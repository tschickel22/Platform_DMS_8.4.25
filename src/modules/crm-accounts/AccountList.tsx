import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/loading-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Users,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'

export default function AccountList() {
  const { accounts, loading, deleteAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  // Apply URL filters
  const filteredAccounts = useMemo(() => {
    let filtered = accounts || []

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(account => 
        account.name.toLowerCase().includes(term) ||
        (account.email && account.email.toLowerCase().includes(term)) ||
        (account.phone && account.phone.includes(term)) ||
        (account.industry && account.industry.toLowerCase().includes(term))
      )
    }

    return filtered
  }, [accounts, searchTerm])

  // Calculate header metrics
  const metrics = useMemo(() => {
    const totalAccounts = accounts?.length || 0
    const accountsWithContacts = accounts?.filter(account => 
      contacts?.some(contact => contact.accountId === account.id)
    ).length || 0
    
    const industries = new Set(accounts?.map(account => account.industry).filter(Boolean))
    const uniqueIndustries = industries.size
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentAccounts = accounts?.filter(account => 
      new Date(account.createdAt) > thirtyDaysAgo
    ).length || 0

    return {
      totalAccounts,
      accountsWithContacts,
      uniqueIndustries,
      recentAccounts
    }
  }, [accounts, contacts])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('search', value)
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const handleDeleteAccount = async (accountId: string, accountName: string) => {
    if (window.confirm(`Are you sure you want to delete "${accountName}"? This action cannot be undone.`)) {
      await deleteAccount(accountId)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="ri-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ModuleErrorBoundary moduleName="Accounts">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="ri-page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ri-page-title">Accounts</h1>
              <p className="ri-page-description">
                Manage your business accounts and relationships
              </p>
            </div>
            <Button asChild>
              <Link to="/crm/accounts/new">
                <Plus className="h-4 w-4 mr-2" />
                New Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Header Stats */}
        <div className="ri-stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-primary">{metrics.totalAccounts}</div>
              <p className="text-xs text-muted-foreground">
                Active business accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-success">{metrics.accountsWithContacts}</div>
              <p className="text-xs text-muted-foreground">
                Have associated contacts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-info">{metrics.uniqueIndustries}</div>
              <p className="text-xs text-muted-foreground">
                Different industries
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-warning">{metrics.recentAccounts}</div>
              <p className="text-xs text-muted-foreground">
                New this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>
                  {filteredAccounts.length} of {accounts?.length || 0} accounts
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="ri-search-bar">
                  <Search className="ri-search-icon" />
                  <Input
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="ri-search-input"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAccounts.length === 0 ? (
              searchTerm ? (
                <EmptyState
                  title="No accounts found"
                  description={`No accounts match "${searchTerm}". Try adjusting your search terms.`}
                  icon={<Search className="h-12 w-12" />}
                  action={{
                    label: 'Clear Search',
                    onClick: () => handleSearch('')
                  }}
                />
              ) : (
                <EmptyState
                  title="No accounts yet"
                  description="Get started by creating your first business account."
                  icon={<Building2 className="h-12 w-12" />}
                  action={{
                    label: 'Create Account',
                    onClick: () => window.location.href = '/crm/accounts/new'
                  }}
                />
              )
            ) : (
              <div className="space-y-2">
                {filteredAccounts.map((account) => {
                  const accountContacts = contacts?.filter(contact => contact.accountId === account.id) || []
                  
                  return (
                    <div key={account.id} className="ri-table-row">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium">{account.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              {account.email && <span>{account.email}</span>}
                              {account.phone && <span>{account.phone}</span>}
                              {account.industry && (
                                <Badge variant="outline">{account.industry}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span>{accountContacts.length} contacts</span>
                          <span>Created {formatDate(account.createdAt)}</span>
                          {account.tags && account.tags.length > 0 && (
                            <div className="flex space-x-1">
                              {account.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {account.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{account.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ri-action-buttons">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/crm/accounts/${account.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/crm/accounts/${account.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAccount(account.id, account.name)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleErrorBoundary>
  )
}