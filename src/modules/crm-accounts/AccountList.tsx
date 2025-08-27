import React from 'react'
import { Link } from 'react-router-dom'
import { useAccountManagement } from './hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusCircle, Loader2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

export default function AccountList() {
  const { accounts, loading, error, deleteAccount } = useAccountManagement()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id)
    }
  }

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

  if (accounts.length === 0) {
    return (
      <EmptyState
        title="No Accounts Found"
        description="Get started by creating a new account."
        icon={<PlusCircle className="h-12 w-12" />}
        action={{
          label: 'Create New Account',
          onClick: () => window.location.href = '/crm/accounts/new'
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Accounts</h1>
          <p className="ri-page-description">Manage your business accounts.</p>
        </div>
        <Button asChild>
          <Link to="/crm/accounts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Account
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>A list of all accounts in your CRM.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <Link to={`/crm/accounts/${account.id}`} className="text-primary hover:underline">
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>{account.industry}</TableCell>
                  <TableCell>{formatDateTime(account.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" asChild>
                      <Link to={`/crm/accounts/${account.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(account.id)}>
                      Delete
                    </Button>
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