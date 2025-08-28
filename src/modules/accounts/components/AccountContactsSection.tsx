import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlusCircle, User } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { TableRowSkeleton } from '@/components/ui/loading-skeleton'

interface AccountContactsSectionProps {
  accountId: string
  title: string
}

export function AccountContactsSection({ accountId, title }: AccountContactsSectionProps) {
  const { contacts, loading, error } = useContactManagement()

  const associatedContacts = contacts.filter(contact => contact.accountId === accountId)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading associated contacts...</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRowSkeleton columns={3} />
              <TableRowSkeleton columns={3} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Error loading contacts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load contacts: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Contacts associated with this account.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/contacts/new?accountId=${accountId}`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Contact
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {associatedContacts.length === 0 ? (
          <EmptyState
            icon={<User className="h-12 w-12" />}
            title="No contacts found"
            description="This account does not have any associated contacts yet."
            action={{
              label: 'Add New Contact',
              onClick: () => window.location.href = `/contacts/new?accountId=${accountId}`
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Link to={`/contacts/${contact.id}`} className="text-blue-600 hover:underline">
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}