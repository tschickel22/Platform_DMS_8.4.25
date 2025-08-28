import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '../crm-accounts/hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusCircle, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { BulkOperationsPanel } from '@/components/common/BulkOperationsPanel'
import { AdvancedSearch } from '@/components/common/AdvancedSearch'
import { FilterPanel } from '@/components/common/FilterPanel'
import { ImportExportActions } from '@/components/common/ImportExportActions'
import { useSavedFilters } from '@/hooks/useSavedFilters'
import type { Contact } from '@/types'

export default function ContactList() {
  const { contacts, loading, error, deleteContact, createContact } = useContactManagement()
  const { getAccountById, accounts } = useAccountManagement()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState<any[]>([])

  // Advanced search matcher
  const matchesAdvancedSearch = (contact: Contact, criteria: any[]) => {
    if (criteria.length === 0) return true
    return criteria.every((criterion) => {
      const fieldValue = (contact as any)[criterion.field]?.toString().toLowerCase() || ''
      const searchValue = String(criterion.value ?? '').toLowerCase()

      switch (criterion.operator) {
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
          return fieldValue === ''
        case 'is_not_empty':
          return fieldValue !== ''
        default:
          return true
      }
    })
  }

  const { savedFilters, saveFilter, deleteFilter, setDefaultFilter } = useSavedFilters('contacts')

  // Filter state
  const [filters, setFilters] = React.useState({
    search: searchParams.get('search') || '',
    accountId: searchParams.get('accountId') || '',
    hasAccount: searchParams.get('hasAccount') || '',
    createdAfter: searchParams.get('createdAfter') || '',
    createdBefore: searchParams.get('createdBefore') || ''
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(filteredContacts.map((c) => c.id))
    else setSelectedIds([])
  }

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) setSelectedIds((prev) => [...prev, contactId])
    else setSelectedIds((prev) => prev.filter((id) => id !== contactId))
  }

  const handleImport = (importedData: any[]) => {
    importedData.forEach((data) => {
      createContact(data)
    })
  }

  const csvFields = ['firstName', 'lastName', 'email', 'phone', 'accountId']

  // Update URL params when filters change
  React.useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value))
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  // Filter contacts based on current filters
  const filteredContacts = React.useMemo(() => {
    return contacts.filter((contact) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchLower) ||
          contact.email?.toLowerCase().includes(searchLower) ||
          contact.phone?.includes(filters.search)
        if (!matchesSearch) return false
      }

      if (filters.accountId && contact.accountId !== filters.accountId) return false

      if (filters.hasAccount === 'yes' && !contact.accountId) return false
      if (filters.hasAccount === 'no' && contact.accountId) return false

      if (filters.createdAfter) {
        const createdDate = new Date(contact.createdAt)
        const filterDate = new Date(filters.createdAfter)
        if (createdDate < filterDate) return false
      }

      if (filters.createdBefore) {
        const createdDate = new Date(contact.createdAt)
        const filterDate = new Date(filters.createdBefore)
        if (createdDate > filterDate) return false
      }

      // Advanced search
      return matchesAdvancedSearch(contact as Contact, advancedSearchCriteria)
    })
  }, [contacts, filters, advancedSearchCriteria])

  const accountOptions = React.useMemo(
    () => accounts.map((account) => ({ value: account.id, label: account.name })),
    [accounts]
  )

  const filterFields = [
    { key: 'search', label: 'Search', type: 'text' as const },
    { key: 'accountId', label: 'Account', type: 'select' as const, options: accountOptions },
    {
      key: 'hasAccount',
      label: 'Has Account',
      type: 'select' as const,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    { key: 'createdAfter', label: 'Created After', type: 'date' as const },
    { key: 'createdBefore', label: 'Created Before', type: 'date' as const }
  ]

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id)
    }
  }

  const sampleFields = ['firstName', 'lastName', 'email', 'phone', 'accountId']

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

  if (contacts.length === 0) {
    return (
      <EmptyState
        title="No Contacts Found"
        description="Get started by creating a new contact."
        icon={<PlusCircle className="h-12 w-12" />}
        action={{
          label: 'Create New Contact',
          onClick: () => (window.location.href = '/crm/contacts/new')
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Contacts</h1>
          <p className="ri-page-description">
            Manage your individual contacts. {filteredContacts.length} of {contacts.length} contacts shown.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ImportExportActions module="contacts" data={filteredContacts} onImport={handleImport} sampleFields={sampleFields} />
          <Button asChild>
            <Link to="/crm/contacts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Contact
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search contacts..."
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
          onSetDefaultFilter={setDefaultFilter}
          filterFields={filterFields}
          module="contacts"
        />
        <AdvancedSearch
          onSearch={setAdvancedSearchCriteria}
          onClear={() => setAdvancedSearchCriteria([])}
          entityType="contacts"
        />
      </div>

      {/* Selection Info */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            {selectedIds.length} contact{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>
            A list of all contacts in your CRM. Showing {filteredContacts.length} contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onCheckedChange={(v) => handleSelectAll(!!v)}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => {
                const account = contact.accountId ? getAccountById(contact.accountId) : null
                return (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectContact(contact.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link to={`/crm/contacts/${contact.id}`} className="text-primary hover:underline">
                        {contact.firstName} {contact.lastName}
                      </Link>
                      {contact.title && <p className="text-xs text-muted-foreground">{contact.title}</p>}
                    </TableCell>
                    <TableCell>
                      {account ? (
                        <Link to={`/crm/accounts/${account.id}`} className="text-muted-foreground hover:underline">
                          {account.name}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatDateTime(contact.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" asChild>
                        <Link to={`/crm/contacts/${contact.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(contact.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
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
