import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Contact } from '@/types/index'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  User,
  Users,
  Plus,
  Search,
  Filter,
  UserPlus,
  UserCheck,
  Building,
  Mail,
  Phone
} from 'lucide-react'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { mockContacts } from '@/mocks/contactsMock'

export default function ContactList() {
  const { contacts, loading, metrics } = useContactManagement()
  const { accounts } = useAccountManagement()
  const [searchTerm, setSearchTerm] = useState('')
  const [accountFilter, setAccountFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')

  // Get unique values for filters
  const uniqueDepartments = useMemo(() => {
    const departments = contacts.map(contact => contact.department).filter(Boolean)
    return [...new Set(departments)].sort()
  }, [contacts])

  const uniqueTags = useMemo(() => {
    const allTags = contacts.flatMap(contact => contact.tags)
    return [...new Set(allTags)].sort()
  }, [contacts])

  // Filter contacts based on current filters
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
        const matchesSearch =
          fullName.includes(term) ||
          contact.email?.toLowerCase().includes(term) ||
          contact.phone?.includes(term) ||
          contact.title?.toLowerCase().includes(term) ||
          contact.department?.toLowerCase().includes(term) ||
          contact.tags.some(tag => tag.toLowerCase().includes(term))
        if (!matchesSearch) return false
      }

      // Account filter
      if (accountFilter !== 'all') {
        if (accountFilter === 'unassigned' && contact.accountId) return false
        if (accountFilter !== 'unassigned' && contact.accountId !== accountFilter) return false
      }

      // Department filter
      if (departmentFilter !== 'all' && contact.department !== departmentFilter) return false

      // Tag filter
      if (tagFilter !== 'all' && !contact.tags.includes(tagFilter)) return false

      return true
    })
  }, [contacts, searchTerm, accountFilter, departmentFilter, tagFilter])

  // Calculate filtered metrics
  const filteredMetrics = useMemo(() => {
    const total = filteredContacts.length
    const assigned = filteredContacts.filter(contact => contact.accountId).length
    const unassigned = filteredContacts.filter(contact => !contact.accountId).length
    const withEmail = filteredContacts.filter(contact => contact.email).length
    const withPhone = filteredContacts.filter(contact => contact.phone).length

    return { total, assigned, unassigned, withEmail, withPhone }
  }, [filteredContacts])

  // Helper to get account name
  const getAccountName = (accountId: string | null) => {
    if (!accountId) return null
    const account = accounts.find(acc => acc.id === accountId)
    return account?.name || 'Unknown Account'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Contacts</h1>
          <p className="ri-page-description">Loading contacts...</p>
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
            <h1 className="ri-page-title">Contacts</h1>
            <p className="ri-page-description">
              Manage individual contacts and their account relationships
            </p>
          </div>
          <Button asChild>
            <Link to="/contacts/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Tiles */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-success">{filteredMetrics.assigned}</div>
            <p className="text-xs text-muted-foreground">Linked to accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-warning">{filteredMetrics.unassigned}</div>
            <p className="text-xs text-muted-foreground">Need account assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Methods</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stat-info">
              {filteredMetrics.withEmail + filteredMetrics.withPhone}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredMetrics.withEmail} email, {filteredMetrics.withPhone} phone
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input"
              />
            </div>

            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(department => (
                  <SelectItem key={department} value={department}>
                    {department}
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

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Contacts ({filteredContacts.length})</CardTitle>
              <CardDescription>Individual contacts and their details</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => {
              const accountName = getAccountName(contact.accountId)

              return (
                <Link key={contact.id} to={`/contacts/${contact.id}`}>
                  <div className="ri-table-row">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {contact.title && (
                            <Badge variant="outline" className="text-xs">
                              {contact.title}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {accountName && (
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {accountName}
                            </span>
                          )}
                          {contact.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          )}
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                        {contact.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {contact.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{contact.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(contact.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )
            })}

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No contacts found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || accountFilter !== 'all' || departmentFilter !== 'all' || tagFilter !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by creating your first contact.'}
                </p>
                <Button asChild>
                  <Link to="/contacts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
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
