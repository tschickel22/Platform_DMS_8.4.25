import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/loading-skeleton'
import { NotesSection } from '@/components/common/NotesSection'
import { 
  ArrowLeft, 
  Edit, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Users,
  Plus,
  ExternalLink
} from 'lucide-react'
import { useAccountManagement } from './hooks/useAccountManagement'
import { useContactManagement } from '@/modules/crm-contacts/hooks/useContactManagement'
import { Account } from '@/types'
import { formatDate } from '@/lib/utils'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAccountById, addNote, updateNote, deleteNote } = useAccountManagement()
  const { contacts } = useContactManagement()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate('/crm/accounts')
      return
    }

    try {
      const accountData = getAccountById(id)
      if (!accountData) {
        navigate('/crm/accounts')
        return
      }
      setAccount(accountData)
    } catch (error) {
      console.error('Error loading account:', error)
      navigate('/crm/accounts')
    } finally {
      setLoading(false)
    }
  }, [id, getAccountById, navigate])

  // Get contacts for this account
  const accountContacts = contacts?.filter(contact => contact.accountId === id) || []

  const handleAddNote = async (content: string) => {
    if (account) {
      const success = await addNote(account.id, content)
      if (success) {
        // Refresh account data to show new note
        const updatedAccount = getAccountById(account.id)
        if (updatedAccount) {
          setAccount(updatedAccount)
        }
      }
    }
  }

  const handleUpdateNote = async (noteId: string, content: string) => {
    if (account) {
      const success = await updateNote(account.id, noteId, content)
      if (success) {
        // Refresh account data to show updated note
        const updatedAccount = getAccountById(account.id)
        if (updatedAccount) {
          setAccount(updatedAccount)
        }
      }
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (account) {
      const success = await deleteNote(account.id, noteId)
      if (success) {
        // Refresh account data to remove deleted note
        const updatedAccount = getAccountById(account.id)
        if (updatedAccount) {
          setAccount(updatedAccount)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/crm/accounts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Account Not Found</h3>
              <p className="text-muted-foreground">
                The account you're looking for doesn't exist or has been deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ModuleErrorBoundary moduleName="Account Detail">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/crm/accounts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <p className="text-muted-foreground">Account Details</p>
            </div>
          </div>
          <Button asChild>
            <Link to={`/crm/accounts/${account.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Account
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {account.industry && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Industry</span>
                    <Badge variant="outline">{account.industry}</Badge>
                  </div>
                )}
                {account.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="default">{account.status}</Badge>
                  </div>
                )}
                {account.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${account.email}`} className="text-sm hover:text-primary">
                        {account.email}
                      </a>
                    </div>
                  </div>
                )}
                {account.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${account.phone}`} className="text-sm hover:text-primary">
                        {account.phone}
                      </a>
                    </div>
                  </div>
                )}
                {account.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Website</span>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-3 w-3" />
                      <a 
                        href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary"
                      >
                        {account.website}
                        <ExternalLink className="h-3 w-3 ml-1 inline" />
                      </a>
                    </div>
                  </div>
                )}
                {account.address && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <div className="flex items-start space-x-2 text-right">
                      <MapPin className="h-3 w-3 mt-0.5" />
                      <span className="text-sm">{account.address}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDate(account.createdAt)}</span>
                </div>
                {account.tags && account.tags.length > 0 && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {account.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contacts for this Account */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contacts ({accountContacts.length})
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/crm/contacts/new?accountId=${account.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {accountContacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No contacts for this account</p>
                  <p className="text-sm">Add a contact to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accountContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </h4>
                          {contact.isPrimary && (
                            <Badge variant="outline" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {contact.title && <span>{contact.title}</span>}
                          {contact.email && <span>{contact.email}</span>}
                          {contact.phone && <span>{contact.phone}</span>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/crm/contacts/${contact.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <NotesSection
          notes={account.notes || []}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          title="Account Notes"
          description="Internal notes and comments about this account"
        />
      </div>
    </ModuleErrorBoundary>
  )
}