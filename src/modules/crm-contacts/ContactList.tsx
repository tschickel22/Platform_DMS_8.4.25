import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '../crm-accounts/hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusCircle, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { FilterPanel } from '@/components/common/FilterPanel'
import { ImportExportActions } from '@/components/common/ImportExportActions'
import { useSavedFilters } from '@/hooks/useSavedFilters'

export default function ContactList() {
  const { contacts, loading, error, deleteContact, createContact } = useContactManagement()
  const { getAccountById, accounts } = useAccountManagement()
  const [searchParams, setSearchParams] = useSearchParams()
  const { savedFilters, saveFilter, deleteFilter, setDefaultFilter } = useSavedFilters('contacts')
  
  // Filter state
  const [filters, setFilters] = React.useState({
    search: searchParams.get('search') || '',
    accountId: searchParams.get('accountId') || '',
    hasAccount: searchParams.get('hasAccount') || '',
    createdAfter: searchParams.get('createdAfter') || '',
    createdBefore: searchParams.get('createdBefore') || ''
  })

  // Update URL params when filters change
  React.useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  // Filter contacts based on current filters
  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchLower) ||
          contact.email?.toLowerCase().includes(searchLower) ||
          contact.phone?.includes(filters.search)
        if (!matchesSearch) return false
      }
      
      if (filters.accountId && contact.accountId !== filters.accountId) {
        return false
      }
      
      if (filters.hasAccount === 'yes' && !contact.accountId) {
        return false
      }
      
      if (filters.hasAccount === 'no' && contact.accountId) {
        return false
      }
      
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
      
      return true
    })
  }, [contacts, filters])

  const accountOptions = React.useMemo(() => {
    return accounts.map(account => ({ value: account.id, label: account.name }))
  }, [accounts])

  const filterFields = [
    { key: 'search', label: 'Search', type: 'text' as const },
    { key: 'accountId', label: 'Account', type: 'select' as const, options: accountOptions },
    { key: 'hasAccount', label: 'Has Account', type: 'select' as const, options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { key: 'createdAfter', label: 'Created After', type: 'date' as const },
    { key: 'createdBefore', label: 'Created Before', type: 'date' as const }
  ]

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id)
    }
  }

  const handleImport = (importedData: any[]) => {
    importedData.forEach(contactData => {
      createContact(contactData)
    })
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
          onClick: () => window.location.href = '/crm/contacts/new'
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
          <ImportExportActions
            module="contacts"
            data={filteredContacts}
            onImport={handleImport}
            sampleFields={sampleFields}
          />
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
      </div>

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
                    <TableCell className="font-medium">
                      <Link to={`/crm/contacts/${contact.id}`} className="text-primary hover:underline">
                        {contact.firstName} {contact.lastName}
                      </Link>
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
    </div>
  )
}