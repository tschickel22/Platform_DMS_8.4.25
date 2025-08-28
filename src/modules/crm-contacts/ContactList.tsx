import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageHeader, StatsGrid, StatCard } from '@/components/ui/page-header'
import { FilterBar } from '@/components/ui/filter-bar'
import { ModernTable, ModernTableColumn, ModernTableAction } from '@/components/ui/modern-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { EntityChip } from '@/components/ui/entity-chip'
import { RouteGuard } from '@/components/ui/route-guard'
import { Plus, User, Building2, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { useSavedFilters } from '@/hooks/useSavedFilters'
import { Contact } from '@/types'
import { logger } from '@/utils/logger'

export default function ContactList() {
  const navigate = useNavigate()
  const { contacts, loading, deleteContact } = useContactManagement()
  const { getAccountById } = useAccountManagement()
  const { savedFilters, saveFilter, deleteFilter, setDefaultFilter } = useSavedFilters('contacts')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    hasAccount: '',
    preferredContactMethod: '',
    createdAfter: '',
    owner: '',
    isPrimary: ''
  })

  React.useEffect(() => {
    logger.pageView('/crm/contacts')
  }, [])

  // Calculate metrics from live data
  const metrics = useMemo(() => {
    const totalContacts = contacts.length
    const contactsWithAccounts = contacts.filter(contact => contact.accountId).length
    const primaryContacts = contacts.filter(contact => contact.isPrimary).length
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentContacts = contacts.filter(contact => 
      new Date(contact.createdAt) > thirtyDaysAgo
    ).length

    return {
      totalContacts,
      contactsWithAccounts,
      primaryContacts,
      recentContacts
    }
  }, [contacts])

  // Filter contacts based on search and filters
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Search filter
      const matchesSearch = !searchTerm || 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.title?.toLowerCase().includes(searchTerm.toLowerCase())

      // Has account filter
      const matchesHasAccount = !filters.hasAccount || 
        (filters.hasAccount === 'yes' && contact.accountId) ||
        (filters.hasAccount === 'no' && !contact.accountId)

      // Preferred contact method filter
      const matchesContactMethod = !filters.preferredContactMethod || 
        contact.preferredContactMethod === filters.preferredContactMethod

      // Created after filter
      const matchesCreatedAfter = !filters.createdAfter || 
        new Date(contact.createdAt) >= new Date(filters.createdAfter)

      // Owner filter
      const matchesOwner = !filters.owner || contact.ownerId === filters.owner

      // Is primary filter
      const matchesIsPrimary = !filters.isPrimary || 
        (filters.isPrimary === 'yes' && contact.isPrimary) ||
        (filters.isPrimary === 'no' && !contact.isPrimary)

      return matchesSearch && matchesHasAccount && matchesContactMethod && 
             matchesCreatedAfter && matchesOwner && matchesIsPrimary
    })
  }, [contacts, searchTerm, filters])

  // Table columns
  const columns: ModernTableColumn<Contact>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, contact) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{contact.firstName} {contact.lastName}</span>
            {contact.isPrimary && (
              <StatusBadge status="Primary" variant="info" />
            )}
          </div>
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
          return <span className="text-muted-foreground text-sm">No account</span>
        }
        
        const account = getAccountById(contact.accountId)
        return (
          <EntityChip
            type="account"
            id={contact.accountId}
            name={account?.name}
            email={account?.email}
            industry={account?.industry}
            linkTo={`/crm/accounts/${contact.accountId}`}
          />
        )
      }
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value ? (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => value ? (
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    {
      key: 'preferredContactMethod',
      label: 'Preferred Contact',
      render: (value) => value ? (
        <StatusBadge status={value} />
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
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
      label: 'Edit Contact',
      icon: Edit,
      onClick: (contact) => navigate(`/crm/contacts/${contact.id}/edit`)
    },
    {
      label: 'Delete Contact',
      icon: Trash2,
      variant: 'destructive',
      onClick: async (contact) => {
        if (window.confirm(`Are you sure you want to delete "${contact.firstName} ${contact.lastName}"?`)) {
          await deleteContact(contact.id)
        }
      }
    }
  ]

  // Filter chips for display
  const filterChips = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      value: value
    }))

  const handleRemoveFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
  }

  const handleClearAllFilters = () => {
    setFilters({
      hasAccount: '',
      preferredContactMethod: '',
      createdAfter: '',
      owner: '',
      isPrimary: ''
    })
    setSearchTerm('')
  }

  return (
    <RouteGuard moduleName="Contacts">
      <div className="space-y-6">
        <PageHeader
          title="Contacts"
          description="Manage individual contacts and their relationships"
        >
          <Button onClick={() => navigate('/crm/contacts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Contact
          </Button>
        </PageHeader>

        {/* Metrics */}
        <StatsGrid>
          <StatCard
            title="Total Contacts"
            value={metrics.totalContacts}
            icon={User}
          />
          <StatCard
            title="With Accounts"
            value={metrics.contactsWithAccounts}
            change={`${Math.round((metrics.contactsWithAccounts / metrics.totalContacts) * 100)}%`}
            changeType="positive"
            icon={Building2}
          />
          <StatCard
            title="Primary Contacts"
            value={metrics.primaryContacts}
            icon={Users}
          />
          <StatCard
            title="New This Month"
            value={metrics.recentContacts}
            icon={Calendar}
          />
        </StatsGrid>

        {/* Filters */}
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search contacts..."
          filterChips={filterChips}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
        />

        {/* Table */}
        <ModernTable
          data={filteredContacts}
          columns={columns}
          loading={loading}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={actions}
          getRowId={(contact) => contact.id}
          onRowClick={(contact) => navigate(`/crm/contacts/${contact.id}`)}
          emptyState={{
            title: 'No contacts found',
            description: 'Get started by creating your first contact',
            icon: User,
            action: {
              label: 'Create Contact',
              onClick: () => navigate('/crm/contacts/new')
            }
          }}
        />
      </div>
    </RouteGuard>
  )
}