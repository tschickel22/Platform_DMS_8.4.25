import React from 'react'
import { Link } from 'react-router-dom'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '../crm-accounts/hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusCircle, Loader2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

export default function ContactList() {
  const { contacts, loading, error, deleteContact } = useContactManagement()
  const { getAccountById } = useAccountManagement()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id)
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
          <p className="ri-page-description">Manage your individual contacts.</p>
        </div>
        <Button asChild>
          <Link to="/crm/contacts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Contact
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>A list of all contacts in your CRM.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => {
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