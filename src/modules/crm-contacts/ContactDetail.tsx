import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useContactManagement } from './hooks/useContactManagement'
import { useAccountManagement } from '../crm-accounts/hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Edit, Trash2 } from 'lucide-react'
import { Loader2, Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { NotesSection } from '@/components/common/NotesSection'
import { TasksSection } from '@/components/common/TasksSection'
import { CommunicationActions } from '@/components/common/CommunicationActions'

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getContactById, loading, error, deleteContact, addNoteToContact, updateNoteInContact, deleteNoteFromContact } = useContactManagement()
  const { getAccountById } = useAccountManagement()
  const contact = getContactById(id || '')

  const account = contact?.accountId ? getAccountById(contact.accountId) : null

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      const success = deleteContact(id || '')
      if (success) {
        navigate('/crm/contacts')
      }
    }
  }

  const handleAddNote = (content: string) => {
    if (id) {
      addNoteToContact(id, content)
    }
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    if (id) {
      updateNoteInContact(id, noteId, content)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (id) {
      deleteNoteFromContact(id, noteId)
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

  if (!contact) {
    return (
      <EmptyState
        title="Contact Not Found"
        description="The contact you are looking for does not exist or has been deleted."
        icon={<Trash2 className="h-12 w-12" />}
        action={{
          label: 'Back to Contacts',
          onClick: () => navigate('/crm/contacts')
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ri-page-header">
          <h1 className="ri-page-title">{contact.firstName} {contact.lastName}</h1>
          <p className="ri-page-description">Details for this contact.</p>
        </div>
        <div className="flex space-x-2">
          <CommunicationActions contact={contact} />
          <Button variant="outline" asChild>
            <Link to={`/crm/contacts/${contact.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Contact
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Contact
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>General details about {contact.firstName} {contact.lastName}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{contact.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{contact.phone || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Associated Account</p>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {account ? (
                  <Link to={`/crm/accounts/${account.id}`} className="text-primary hover:underline">
                    {account.name}
                  </Link>
                ) : (
                  <p className="text-base">N/A</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-base">{formatDateTime(contact.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-base">{formatDateTime(contact.updatedAt)}</p>
            </div>
            {contact.tags && contact.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <NotesSection
        notes={contact.notes}
        onAddNote={handleAddNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        title="Contact Notes"
        description="Internal notes and comments about this contact"
      />
    </div>
  )
}