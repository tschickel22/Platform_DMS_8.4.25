import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash, Users, Building2, Phone, Mail, TrendingUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Contact } from '@/types'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { mockContacts } from '@/mocks/contactsMock'
import { useToast } from '@/hooks/use-toast'
import { ExportButton } from '@/components/common/ExportButton'
import { formatCurrency } from '@/lib/utils'

export default function ContactList() {
  const navigate = useNavigate()
  const { contacts, deleteContact } = useContactManagement()
  const { accounts } = useAccountManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')

  const { toast } = useToast()

  const filteredContacts = useMemo(() => {
    let filtered = contacts

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm)
      )
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(contact => contact.department === departmentFilter)
    }

    if (accountFilter !== 'all') {
      filtered = filtered.filter(contact => contact.accountId === accountFilter)
    }

    if (tagFilter !== 'all') {
      filtered = filtered.filter(contact => contact.tags.includes(tagFilter))
    }

    return filtered
  }, [contacts, searchTerm, departmentFilter, accountFilter, tagFilter])

  const contactMetrics = useMemo(() => {
    const totalContacts = filteredContacts.length
    const contactsWithEmail = filteredContacts.filter(c => c.email).length
    const contactsWithPhone = filteredContacts.filter(c => c.phone).length
    const newThisMonth = filteredContacts.filter(c => {
      const createdDate = new Date(c.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length

    return {
      totalContacts,
      contactsWithEmail,
      contactsWithPhone,
      newThisMonth
    }
  }, [filteredContacts])

  const allDepartments = useMemo(() => {
    const departments = new Set<string>()
    contacts.forEach(contact => {
      if (contact.department) departments.add(contact.department)
    })
    return Array.from(departments)
  }, [contacts])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [contacts])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id)
      toast({
        title: 'Contact Deleted',
        description: 'The contact has been successfully removed.',
        variant: 'default',
      })
    }
  }

  const handleExport = () => {
    toast({
      title: 'Exporting Contacts',
      description: 'Your contact data is being prepared for download.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and their information
          </p>
        </div>
        <Button onClick={() => navigate('new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Metrics Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMetrics.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              Overall number of contacts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMetrics.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New contacts created in current month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts with Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMetrics.contactsWithEmail}</div>
            <p className="text-xs text-muted-foreground">
              Contacts with an email address
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts with Phone</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMetrics.contactsWithPhone}</div>
            <p className="text-xs text-muted-foreground">
              Contacts with a phone number
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {mockContacts.departmentOptions.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ExportButton data={filteredContacts} filename="contacts" onExport={handleExport} />
        {/* Import Button will be added here */}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <Link to={`${contact.id}`} className="hover:underline">
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    {contact.accountId ? (
                      <Link to={`/accounts/${contact.accountId}`} className="text-blue-600 hover:underline">
                        {accounts.find(acc => acc.id === contact.accountId)?.name || 'N/A'}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
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
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`${contact.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}