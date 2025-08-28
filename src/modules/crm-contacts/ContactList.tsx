import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ModernTable, ModernTableColumn, ModernTableAction } from '@/components/ui/modern-table'
import { FilterBar } from '@/components/ui/filter-bar'
import { PageHeader, StatsGrid, StatCard } from '@/components/ui/page-header'
import { EntityChip } from '@/components/ui/entity-chip'
import { StatusBadge } from '@/components/ui/status-badge'
import { BulkOperationsPanel } from '@/components/common/BulkOperationsPanel'
import { ImportExportActions } from '@/components/common/ImportExportActions'
import { AdvancedSearch } from '@/components/common/AdvancedSearch'
import { FilterPanel } from '@/components/common/FilterPanel'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Building2, 
  Calendar,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react'
import { Contact } from '@/types'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { useSavedFilters } from '@/hooks/useSavedFilters'
import { useActivityTracking } from '@/hooks/useActivityTracking'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ContactFilters {
  search: string
  hasAccount: string
  createdDateFrom: string
  createdDateTo: string
  assignee: string
  tags: string
  preferredContactMethod: string
}

export default function ContactList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { contacts, loading, deleteContact, createContact } = useContactManagement()
  const { accounts } = useAccountManagement()
  const { getActivitiesForEntity } = useActivityTracking()
  const { savedFilters, saveFilter, deleteFilter, setDefaultFilter } = useSavedFilters('contacts')

  // State management
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    hasAccount: '',
    createdDateFrom: '',
    createdDateTo: '',
    assignee: '',
    tags: '',
    preferredContactMethod: ''
  })

  // Helper function to get account by ID
  const getAccountById = (accountId: string) => {
    return accounts.find(account => account.id === accountId) || null
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalContacts = contacts.length
    const withAccounts = contacts.filter(contact => contact.accountId).length
    const recentContacts = contacts.filter(contact => {
      const createdDate = new Date(contact.createdAt)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return createdDate > thirtyDaysAgo
    }).length

    // Get recent activity count
    const recentActivity = contacts.reduce((count, contact) => {
      const activities = getActivitiesForEntity('contact', contact.id)
      const recentActivities = activities.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return activityDate > sevenDaysAgo
      })
      return count + recentActivities.length
    }, 0)

    return {
      totalContacts,
      withAccounts,
      recentContacts,
      recentActivity
    }
  }, [contacts, getActivitiesForEntity])

  // Filter contacts based on current filters
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
        const email = contact.email?.toLowerCase() || ''
        const phone = contact.phone?.toLowerCase() || ''
        
        if (!fullName.includes(searchTerm) && 
            !email.includes(searchTerm) && 
            !phone.includes(searchTerm)) {
          return false
        }
      }

      // Has Account filter
      if (filters.hasAccount === 'yes' && !contact.accountId) return false
      if (filters.hasAccount === 'no' && contact.accountId) return false

      // Created date filters
      if (filters.createdDateFrom) {
        const createdDate = new Date(contact.createdAt)
        const fromDate = new Date(filters.createdDateFrom)
        if (createdDate < fromDate) return false
      }
      if (filters.createdDateTo) {
        const createdDate = new Date(contact.createdAt)
        const toDate = new Date(filters.createdDateTo)
        if (createdDate > toDate) return false
      }

      // Assignee filter
      if (filters.assignee && contact.ownerId !== filters.assignee) return false

      // Tags filter
      if (filters.tags) {
        const tagFilter = filters.tags.toLowerCase()
        const contactTags = contact.tags?.map(tag => tag.toLowerCase()) || []
        if (!contactTags.some(tag => tag.includes(tagFilter))) return false
      }

      // Preferred contact method filter
      if (filters.preferredContactMethod && 
          contact.preferredContactMethod !== filters.preferredContactMethod) return false

      return true
    })
  }, [contacts, filters])

  // Table columns configuration
  const columns: ModernTableColumn<Contact>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, contact) => (
        <div className="font-medium">
          {contact.firstName} {contact.lastName}
          {contact.title && (
            <div className="text-xs text-muted-foreground">{contact.title}</div>
          )}
        </div>
      )
    },
    {
      key: 'account',
      label: 'Account',
      render: (_, contact) => {
        if (!contact.accountId) {
          return <span className="text-muted-foreground">N/A</span>
        }
        
        const account = getAccountById(contact.accountId)
        if (!account) {
          return <span className="text-muted-foreground">N/A</span>
        }

        return (
          <EntityChip
            type="account"
            id={account.id}
            name={account.name}
            email={account.email}
            industry={account.industry}
            linkTo={`/crm/accounts/${account.id}`}
            showHoverCard={true}
          />
        )
      }
    },
    {
      key: 'email',
      label: 'Email',
      render: (email) => email ? (
        <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
          {email}
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (phone) => phone ? (
        <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
          {phone}
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (_, contact) => (
        <div className="flex flex-wrap gap-1">
          {contact.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {contact.tags && contact.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{contact.tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (date) => formatDate(date)
    }
  ]

  // Table actions
  const actions: ModernTableAction<Contact>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (contact) => navigate(`/crm/contacts/${contact.id}`)
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (contact) => navigate(`/crm/contacts/${contact.id}/edit`)
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: (contact) => handleDelete(contact)
    }
  ]

  // Filter fields for the filter panel
  const filterFields = [
    {
      key: 'hasAccount',
      label: 'Has Account',
      type: 'select' as const,
      options: [
        { value: '', label: 'All' },
        { value: 'yes', label: 'Has Account' },
        { value: 'no', label: 'No Account' }
      ]
    },
    {
      key: 'createdDateFrom',
      label: 'Created From',
      type: 'date' as const
    },
    {
      key: 'createdDateTo',
      label: 'Created To',
      type: 'date' as const
    },
    {
      key: 'assignee',
      label: 'Assignee',
      type: 'select' as const,
      options: [
        { value: '', label: 'All' },
        { value: 'user-1', label: 'Admin User' },
        { value: 'user-2', label: 'Sales Rep' }
      ]
    },
    {
      key: 'preferredContactMethod',
      label: 'Preferred Contact Method',
      type: 'select' as const,
      options: [
        { value: '', label: 'All' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'sms', label: 'SMS' }
      ]
    }
  ]

  // Generate filter chips for active filters
  const filterChips = Object.entries(filters)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => {
      const field = filterFields.find(f => f.key === key)
      let displayValue = value
      
      if (field?.options) {
        const option = field.options.find(opt => opt.value === value)
        displayValue = option?.label || value
      }
      
      return {
        key,
        label: field?.label || key,
        value: displayValue
      }
    })

  const handleDelete = async (contact: Contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await deleteContact(contact.id)
        toast({
          title: 'Contact Deleted',
          description: `${contact.firstName} ${contact.lastName} has been deleted.`
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete contact.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleBulkImport = (importedData: any[]) => {
    importedData.forEach(async (data) => {
      try {
        await createContact(data)
      } catch (error) {
        console.error('Failed to import contact:', error)
      }
    })
    toast({
      title: 'Import Complete',
      description: `Imported ${importedData.length} contacts.`
    })
  }

  const handleAdvancedSearch = (criteria: any[]) => {
    // Convert advanced search criteria to filters
    const newFilters = { ...filters }
    criteria.forEach(criterion => {
      if (criterion.field && criterion.value) {
        newFilters[criterion.field as keyof ContactFilters] = criterion.value
      }
    })
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      hasAccount: '',
      createdDateFrom: '',
      createdDateTo: '',
      assignee: '',
      tags: '',
      preferredContactMethod: ''
    })
  }

  const removeFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage your contact database and relationships"
      >
        <div className="flex items-center gap-3">
          <ImportExportActions
            module="contacts"
            data={filteredContacts}
            onImport={handleBulkImport}
            sampleFields={['First Name', 'Last Name', 'Email', 'Phone', 'Account ID']}
          />
          <Button onClick={() => navigate('/crm/contacts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Contact
          </Button>
        </div>
      </PageHeader>

      {/* Statistics Grid */}
      <StatsGrid>
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={Users}
          onClick={() => navigate('/crm/contacts')}
        />
        <StatCard
          title="With Accounts"
          value={stats.withAccounts}
          change={`${Math.round((stats.withAccounts / stats.totalContacts) * 100)}% linked`}
          changeType="neutral"
          icon={Building2}
        />
        <StatCard
          title="New This Month"
          value={stats.recentContacts}
          change="+12% from last month"
          changeType="positive"
          icon={Calendar}
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity}
          change="Last 7 days"
          changeType="neutral"
          icon={TrendingUp}
        />
      </StatsGrid>

      {/* Filter Bar */}
      <FilterBar
        searchValue={filters.search}
        onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
        searchPlaceholder="Search contacts by name, email, or phone..."
        onFiltersClick={() => setShowFilters(true)}
        onAdvancedSearchClick={() => setShowAdvancedSearch(true)}
        filterChips={filterChips}
        onRemoveFilter={removeFilter}
        onClearAllFilters={clearFilters}
      >
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          savedFilters={savedFilters}
          onSaveFilter={saveFilter}
          onLoadFilter={(filter) => setFilters(filter.filters as ContactFilters)}
          onDeleteFilter={deleteFilter}
          onSetDefaultFilter={setDefaultFilter}
          filterFields={filterFields}
          module="contacts"
        />
      </FilterBar>

      {/* Advanced Search Dialog */}
      {showAdvancedSearch && (
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onClear={clearFilters}
          entityType="contacts"
        />
      )}

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ModernTable
            data={filteredContacts}
            columns={columns}
            loading={loading}
            selectable={true}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            actions={actions}
            onRowClick={(contact) => navigate(`/crm/contacts/${contact.id}`)}
            emptyState={{
              title: 'No contacts found',
              description: 'Get started by creating your first contact.',
              icon: Users,
              action: {
                label: 'Create Contact',
                onClick: () => navigate('/crm/contacts/new')
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Bulk Operations Panel */}
      <BulkOperationsPanel
        selectedIds={selectedIds}
        entityType="contacts"
        onClearSelection={() => setSelectedIds([])}
        onRefresh={() => window.location.reload()}
      />
    </div>
  )
}