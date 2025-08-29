import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building, Calendar, User, Plus, Trash2 } from 'lucide-react'
import { TagInput } from '@/components/common/TagInput'
import { useToast } from '@/hooks/use-toast'
import { useReturnTargets } from '@/hooks/useReturnTargets'

import { mockAccounts } from '@/mocks/accountsMock'
import { mockContacts } from '@/mocks/contactsMock'
import { Account, Contact } from '@/types'
import { formatDate } from '@/lib/utils'

export default function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { afterSave } = useReturnTargets({})
  
  const [account, setAccount] = useState<Account | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountId) {
      navigate('/accounts')
      return
    }

    // Load account data
    const foundAccount = mockAccounts.sampleAccounts.find(acc => acc.id === accountId)
    if (!foundAccount) {
      toast({
        title: 'Account not found',
        description: 'The requested account could not be found.',
        variant: 'destructive'
      })
      navigate('/accounts')
      return
    }

    setAccount(foundAccount)
    
    // Load related contacts
    const accountContacts = mockContacts.sampleContacts.filter(contact => 
      contact.accountId === accountId
    )
    setContacts(accountContacts)
    
    setLoading(false)
  }, [accountId, navigate, toast])

  const handleEdit = () => {
    navigate(`/accounts/${accountId}/edit`)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      toast({
        title: 'Account deleted',
        description: 'The account has been successfully deleted.',
      })
      navigate('/accounts')
    }
  }

  const getTypeColor = (type: string) => {
    const typeConfig = mockAccounts.accountTypes.find(t => t.value === type)
    return typeConfig?.color || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account not found</h2>
        <p className="text-gray-600 mb-4">The requested account could not be found.</p>
        <Button onClick={() => navigate('/accounts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{account.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getTypeColor(account.type)}>
                {mockAccounts.accountTypes.find(t => t.value === account.type)?.label || account.type}
              </Badge>
              {account.industry && (
                <span className="text-muted-foreground">• {account.industry}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Account Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-sm">{mockAccounts.accountTypes.find(t => t.value === account.type)?.label || account.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Industry</label>
                <p className="text-sm">{account.industry || '—'}</p>
              </div>
            </div>
            
            {account.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={account.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {account.website}
                </a>
              </div>
            )}
            
            {account.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{account.phone}</span>
              </div>
            )}
            
            {account.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${account.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {account.email}
                </a>
              </div>
            )}
            
            {account.address && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p>{account.address.street}</p>
                  <p>{account.address.city}, {account.address.state} {account.address.zipCode}</p>
                  {account.address.country && account.address.country !== 'USA' && (
                    <p>{account.address.country}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Created</label>
                  <p>{formatDate(account.createdAt)}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Updated</label>
                  <p>{formatDate(account.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contacts ({contacts.length})
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/contacts/new?accountId=${accountId}&returnTo=account`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No contacts yet</p>
                <p className="text-sm">Add a contact to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                      {contact.title && (
                        <p className="text-sm text-muted-foreground">{contact.title}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-1">
                        {contact.email && (
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <span className="text-xs text-muted-foreground">{contact.phone}</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
                {contacts.length > 5 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/contacts?accountId=${accountId}`)}
                    >
                      View all {contacts.length} contacts
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for additional sections */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes">
          <NotesSection 
            entityId={accountId!}
            entityType="account"
          />
        </TabsContent>
        
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Organize and categorize this account with tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagInput
                tags={account.tags || []}
                onTagsChange={(newTags) => {
                  // In a real app, this would update the account
                  console.log('Tags updated:', newTags)
                  toast({
                    title: 'Tags updated',
                    description: 'Account tags have been updated successfully.'
                  })
                }}
                placeholder="Add tags..."
                suggestions={['VIP Customer', 'High Value', 'Commercial', 'Referral Source', 'Priority']}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}