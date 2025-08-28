import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { User, Phone, Mail, ExternalLink, Plus, GripVertical } from 'lucide-react'
import { useContactManagement } from '@/modules/contacts/hooks/useContactManagement'
import { formatDate } from '@/lib/utils'

interface AccountContactsSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
}

export function AccountContactsSection({ accountId, onRemove, isDragging }: AccountContactsSectionProps) {
  const { getContactsByAccount } = useContactManagement()
  const contacts = getContactsByAccount(accountId)

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Associated Contacts
            </CardTitle>
            <CardDescription>
              Contacts linked to this account
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{contacts.length}</Badge>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <EmptyState
            title="No contacts found"
            description="Add contacts to this account to see them here"
            icon={<User className="h-12 w-12" />}
            action={{
              label: "Add Contact",
              onClick: () => window.location.href = `/contacts?accountId=${accountId}`
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/contacts?accountId=${accountId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Link>
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Link 
                          to={`/contacts/${contact.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {contact.firstName} {contact.lastName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {contact.title && (
                          <Badge variant="outline">{contact.title}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.email && (
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-primary hover:underline flex items-center"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            {contact.email}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.phone && (
                          <a 
                            href={`tel:${contact.phone}`}
                            className="text-primary hover:underline flex items-center"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            {contact.phone}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/contacts/${contact.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}