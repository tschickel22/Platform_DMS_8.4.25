import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash, Users, Building2, DollarSign, TrendingUp, Upload } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Account, AccountType } from '@/types'
import { useAccountManagement } from '@/modules/accounts/hooks/useAccountManagement'
import { getStatusColor } from '@/utils/colorUtils'
import { formatCurrency } from '@/lib/utils'
import { mockAccounts } from '@/mocks/accountsMock'
import { useToast } from '@/hooks/use-toast'
import { ExportButton } from '@/components/common/ExportButton'
import { ImportModal } from '@/components/common/ImportModal'

export default function AccountList() {
  const navigate = useNavigate()

  const { accounts, getAccountTypeLabel, deleteAccount, createAccount } = useAccountManagement()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // Assuming accounts can have a status
  const [tagFilter, setTagFilter] = useState('all')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const { toast } = useToast()

  const filteredAccounts = useMemo(() => {
    let filtered = accounts

    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.phone?.includes(searchTerm)
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(account => account.type === typeFilter)
    }

    // Assuming a status field exists or can be derived
    if (statusFilter !== 'all') {
      // You'll need to define how account status is determined or add it to the mock
      // For now, let's assume a simple 'active' status for demonstration
      // filtered = filtered.filter(account => account.status === statusFilter);
    }

    if (tagFilter !== 'all') {
      filtered = filtered.filter(account => account.tags.includes(tagFilter))
    }

    return filtered
  }, [accounts, searchTerm, typeFilter, statusFilter, tagFilter])

  const accountMetrics = useMemo(() => {
    const totalAccounts = filteredAccounts.length
    const customerAccounts = filteredAccounts.filter(acc => acc.type === AccountType.CUSTOMER).length
    const prospectAccounts = filteredAccounts.filter(acc => acc.type === AccountType.PROSPECT).length
    const newThisMonth = filteredAccounts.filter(acc => {
      const createdDate = new Date(acc.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length

    // Example: Sum of estimated value from custom fields for prospects/customers
    const totalEstimatedValue = filteredAccounts.reduce((sum, acc) => {
      if (acc.type === AccountType.CUSTOMER || acc.type === AccountType.PROSPECT) {
        return sum + (acc.customFields?.estimatedValue || 0)
      }
      return sum
    }, 0)

    return {
      totalAccounts,
      customerAccounts,
      prospectAccounts,
      newThisMonth,
      totalEstimatedValue
    }
  }, [filteredAccounts])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    accounts.forEach(account => {
      account.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [accounts])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await deleteAccount(id)
      toast({
        title: 'Account Deleted',
        description: 'The account has been successfully removed.',
        variant: 'default',
      })
    }
  }

  const handleExport = () => {
    // This function will be passed to the ExportButton component
    // The ExportButton will handle the CSV conversion and download
    toast({
      title: 'Exporting Accounts',
      description: 'Your account data is being prepared for download.',
    })
  }

  const accountImportSchema = [
    { key: 'name', label: 'Account Name', required: true, type: 'string' },
    { key: 'type', label: 'Account Type', required: true, type: 'string' },
    { key: 'email', label: 'Email', required: false, type: 'string' },
    { key: 'phone', label: 'Phone', required: false, type: 'string' },
    { key: 'industry', label: 'Industry', required: false, type: 'string' },
    { key: 'website', label: 'Website', required: false, type: 'string' },
    { key: 'tags', label: 'Tags (comma-separated)', required: false, type: 'string' },
    // Add more fields as needed, matching the Account interface
  ]

  const handleImportAccounts = (importedData: any[]) => {
    // Process importedData
    // For simplicity, let's assume we create new accounts.
    // In a real app, you'd check for existing accounts (e.g., by email) and update them.
    importedData.forEach(async (item) => {
      const newAccount: Account = {
        ...mockAccounts.defaultAccount, // Start with defaults
        ...item,
        tags: item.tags ? item.tags.split(',').map((tag: string) => tag.trim()) : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await createAccount(newAccount)
    })
    toast({ title: 'Import Complete', description: `${importedData.length} accounts imported.` })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground">
          Manage your customer accounts, prospects, vendors, and partners
        </p>
        <Button onClick={() => navigate('new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Metrics Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountMetrics.totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              {accountMetrics.customerAccounts} Customers, {accountMetrics.prospectAccounts} Prospects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountMetrics.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New accounts created in current month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Est. Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(accountMetrics.totalEstimatedValue)}</div>
            <p className="text-xs text-muted-foreground">
              From customer and prospect accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Types</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(AccountType).length}</div>
            <p className="text-xs text-muted-foreground">
              Different types of accounts managed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(AccountType).map(type => (
              <SelectItem key={type} value={type}>{getAccountTypeLabel(type)}</SelectItem>
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
        {/* Add status filter if applicable */}
        {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select> */}
        <ExportButton data={filteredAccounts} filename="accounts" onExport={handleExport} />
        <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <Link to={`${account.id}`} className="hover:underline">
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getAccountTypeLabel(account.type)}</Badge>
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
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
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`${account.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(account.id)}
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

      <ImportModal<Account>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportAccounts}
        schema={accountImportSchema}
        sampleCsvUrl="/sample-accounts.csv" // You'll need to create this file in public/
      />
    </div>
  )
}