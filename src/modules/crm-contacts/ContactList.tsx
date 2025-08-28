import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/loading-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { 
  User, 
  Plus, 
  Search, 
  Filter,
  Building2,
  Users,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone
} from 'lucide-react'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '@/modules/crm-accounts/hooks/useAccountManagement'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'

export default function ContactList() {
  const { contacts, loading, deleteContact } = useContactManagement()
  const { getAccountById } = useAccountManagement()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  // Apply URL filters
  const filteredContacts = useMemo(() => {
    let filtered = contacts || []

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(contact => 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(term) ||
        (contact.email && contact.email.toLowerCase().includes(term)) ||
        (contact.phone && contact.phone.includes(term)) ||
        (contact.title && contact.title.toLowerCase().includes(term))
      )
    }

    return filtered
  }, [contacts, searchTerm])

  // Calculate header metrics
  const metrics = useMemo(() => {
    const totalContacts = contacts?.length || 0
    const contactsWithAccounts = contacts?.filter(contact => contact.accountId).length || 0
    const primaryContacts = contacts?.filter(contact => contact.isPrimary).length || 0
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentContacts = contacts?.filter(contact => 
      new Date(contact.createdAt) > thirtyDaysAgo
    ).length || 0

    return {
      totalContacts,
      contactsWithAccounts,
      primaryContacts,
      recentContacts
    }
  }, [contacts])

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

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    if (window.confirm(`Are you sure you want to delete "${contactName}"? This action cannot be undone.`)) {
      await deleteContact(contactId)
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
    <ModuleErrorBoundary moduleName="Contacts">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="ri-page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ri-page-title">Contacts</h1>
              <p className="ri-page-description">
                Manage individual contacts and their relationships
              </p>
            </div>
            <Button asChild>
              <Link to="/crm/contacts/new">
                <Plus className="h-4 w-4 mr-2" />
                New Contact
              </Link>
            </Button>
          </div>
        </div>

        {/* Header Stats */}
        <div className="ri-stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-primary">{metrics.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                Individual contacts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-success">{metrics.contactsWithAccounts}</div>
              <p className="text-xs text-muted-foreground">
                Linked to accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primary Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-info">{metrics.primaryContacts}</div>
              <p className="text-xs text-muted-foreground">
                Primary for accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold stat-warning">{metrics.recentContacts}</div>
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
                <CardTitle>All Contacts</CardTitle>
                <CardDescription>
                  {filteredContacts.length} of {contacts?.length || 0} contacts
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="ri-search-bar">
                  <Search className="ri-search-icon" />
                  <Input
                    placeholder="Search contacts..."
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
            {filteredContacts.length === 0 ? (
              searchTerm ? (
                <EmptyState
                  title="No contacts found"
                  description={`No contacts match "${searchTerm}". Try adjusting your search terms.`}
                  icon={<Search className="h-12 w-12" />}
                  action={{
                    label: 'Clear Search',
                    onClick: () => handleSearch('')
                  }}
                />
              ) : (
                <EmptyState
                  title="No contacts yet"
                  description="Get started by creating your first contact."
                  icon={<User className="h-12 w-12" />}
                  action={{
                    label: 'Create Contact',
                    onClick: () => window.location.href = '/crm/contacts/new'
                  }}
                />
              )
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => {
                  const linkedAccount = contact.accountId ? getAccountById(contact.accountId) : null
                  
                  return (
                    <div key={contact.id} className="ri-table-row">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium">
                              {contact.firstName} {contact.lastName}
                              {contact.isPrimary && (
                                <Badge variant="outline" className="ml-2 text-xs">Primary</Badge>
                              )}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              {linkedAccount ? (
                                <Link 
                                  to={`/crm/accounts/${linkedAccount.id}`}
                                  className="flex items-center space-x-1 hover:text-primary"
                                >
                                  <Building2 className="h-3 w-3" />
                                  <span>{linkedAccount.name}</span>
                                </Link>
                              ) : (
                                <span className="text-muted-foreground">No account</span>
                              )}
                              {contact.email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{contact.email}</span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          {contact.title && <span>{contact.title}</span>}
                          <span>Created {formatDate(contact.createdAt)}</span>
                          {contact.tags && contact.tags.length > 0 && (
                            <div className="flex space-x-1">
                              {contact.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {contact.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{contact.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ri-action-buttons">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/crm/contacts/${contact.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/crm/contacts/${contact.id}/edit`}>
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
                              onClick={() => handleDeleteContact(contact.id, `${contact.firstName} ${contact.lastName}`)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Contact
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