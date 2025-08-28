import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageHeader, StatsGrid, StatCard } from '@/components/ui/page-header'
import { FilterBar } from '@/components/ui/filter-bar'
import { ModernTable, ModernTableColumn, ModernTableAction } from '@/components/ui/modern-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { EntityChip } from '@/components/ui/entity-chip'
import { RouteGuard } from '@/components/ui/route-guard'
import { Plus, Building2, Users, TrendingUp, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { useSavedFilters } from '@/hooks/useSavedFilters'
import { Account } from '@/types'
import { logger } from '@/utils/logger'

export default function AccountList() {
  const navigate = useNavigate()
  const { accounts, loading, deleteAccount } = useAccountManagement()
  const { contacts } = useContactManagement()
  const { savedFilters, saveFilter, deleteFilter, setDefaultFilter } = useSavedFilters('accounts')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    industry: '',
    status: '',
    hasContacts: '',
    createdAfter: '',
    owner: ''
  })

  React.useEffect(() => {
    logger.pageView('/crm/accounts')
  }, [])

  // Calculate metrics from live data
  const metrics = useMemo(() => {
    const totalAccounts = accounts.length
    const activeAccounts = accounts.filter(acc => acc.status === 'Active').length
    const accountsWithContacts = accounts.filter(acc => 
      contacts.some(contact => contact.accountId === acc.id)
    ).length
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentAccounts = accounts.filter(acc => 
      new Date(acc.createdAt) > thirtyDaysAgo
    ).length

    const industries = [...new Set(accounts.map(acc => acc.industry).filter(Boolean))].length

    return {
      totalAccounts,
      activeAccounts,
      accountsWithContacts,
      recentAccounts,
      industries
    }
  }, [accounts, contacts])

  // Filter accounts based on search and filters
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      // Search filter
      const matchesSearch = !searchTerm || 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.phone?.includes(searchTerm) ||
        account.industry?.toLowerCase().includes(searchTerm.toLowerCase())

      // Industry filter
      const matchesIndustry = !filters.industry || account.industry === filters.industry

      // Status filter
      const matchesStatus = !filters.status || account.status === filters.status

      // Has contacts filter
      const matchesHasContacts = !filters.hasContacts || 
        (filters.hasContacts === 'yes' && contacts.some(c => c.accountId === account.id)) ||
        (filters.hasContacts === 'no' && !contacts.some(c => c.accountId === account.id))

      // Created after filter
      const matchesCreatedAfter = !filters.createdAfter || 
        new Date(account.createdAt) >= new Date(filters.createdAfter)

      // Owner filter
      const matchesOwner = !filters.owner || account.ownerId === filters.owner

      return matchesSearch && matchesIndustry && matchesStatus && 
             matchesHasContacts && matchesCreatedAfter && matchesOwner
    })
  }, [accounts, contacts, searchTerm, filters])

  // Get unique industries for filter dropdown
  const industries = useMemo(() => 
    [...new Set(accounts.map(acc => acc.industry).filter(Boolean))].sort()
  , [accounts])

  // Table columns
  const columns: ModernTableColumn<Account>[] = [
    {
      key: 'name',
      label: 'Account Name',
      sortable: true,
      render: (value, account) => (
        <div className="space-y-1">
          <div className="font-medium">{value}</div>
          {account.industry && (
            <div className="text-xs text-muted-foreground">{account.industry}</div>
          )}
        </div>
      )
    },
    {
      key: 'contacts',
      label: 'Contacts',
      render: (_, account) => {
        const accountContacts = contacts.filter(c => c.accountId === account.id)
        return accountContacts.length > 0 ? (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{accountContacts.length}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )
      }
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value || <span className="text-muted-foreground">—</span>
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => value || <span className="text-muted-foreground">—</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value || 'Unknown'} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  // Table actions
  const actions: ModernTableAction<Account>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (account) => navigate(`/crm/accounts/${account.id}`)
    },
    {
      label: 'Edit Account',
      icon: Edit,
      onClick: (account) => navigate(`/crm/accounts/${account.id}/edit`)
    },
    {
      label: 'Delete Account',
      icon: Trash2,
      variant: 'destructive',
      onClick: async (account) => {
        if (window.confirm(`Are you sure you want to delete "${account.name}"?`)) {
          await deleteAccount(account.id)
        }
      }
    }
  ]

  // Filter chips for display
  const filterChips = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }))

  const handleRemoveFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
  }

  const handleClearAllFilters = () => {
    setFilters({
      industry: '',
      status: '',
      hasContacts: '',
      createdAfter: '',
      owner: ''
    })
    setSearchTerm('')
  }

  return (
    <RouteGuard moduleName="Accounts">
      <div className="space-y-6">
        <PageHeader
          title="Accounts"
          description="Manage your business accounts and relationships"
        >
          <Button onClick={() => navigate('/crm/accounts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </PageHeader>

        {/* Metrics */}
        <StatsGrid>
          <StatCard
            title="Total Accounts"
            value={metrics.totalAccounts}
            icon={Building2}
            onClick={() => {/* Could filter to show all */}}
          />
          <StatCard
            title="Active Accounts"
            value={metrics.activeAccounts}
            change={`${Math.round((metrics.activeAccounts / metrics.totalAccounts) * 100)}%`}
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="With Contacts"
            value={metrics.accountsWithContacts}
            change={`${Math.round((metrics.accountsWithContacts / metrics.totalAccounts) * 100)}%`}
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="New This Month"
            value={metrics.recentAccounts}
            icon={Calendar}
          />
        </StatsGrid>

        {/* Filters */}
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search accounts..."
          filterChips={filterChips}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
        />

        {/* Table */}
        <ModernTable
          data={filteredAccounts}
          columns={columns}
          loading={loading}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={actions}
          getRowId={(account) => account.id}
          onRowClick={(account) => navigate(`/crm/accounts/${account.id}`)}
          emptyState={{
            title: 'No accounts found',
            description: 'Get started by creating your first account',
            icon: Building2,
            action: {
              label: 'Create Account',
              onClick: () => navigate('/crm/accounts/new')
            }
          }}
        />
      </div>
    </RouteGuard>
  )
}