import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Building2, Phone, Mail, Globe, MapPin, Edit, Plus, User } from 'lucide-react'
  ArrowLeft, 
  Edit, 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  User,
  Plus
  const [accountContacts, setAccountContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
import { useAccountManagement } from '../hooks/useAccountManagement'
import { mockContacts } from '@/mocks/contactsMock'
    if (accountId && !accountsLoading) {
import { EmptyState } from '@/components/ui/empty-state'
      if (foundAccount) {
        setAccount(foundAccount)
        
        // Get contacts for this account
        const relatedContacts = mockContacts.sampleContacts.filter(
          contact => contact.accountId === accountId
        )
        setAccountContacts(relatedContacts)
      } else {
        setAccount(null)
        setAccountContacts([])
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/accounts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Account Not Found</h3>
                <p className="text-muted-foreground">
                  The account you're looking for doesn't exist or has been deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const typeConfig = mockAccounts.accountTypes.find(t => t.value === account.type)

  return (
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/accounts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="ri-page-title">{account.name}</h1>
                <Badge className={typeConfig?.color}>
                  {typeConfig?.label}
                </Badge>
              </div>
              <p className="ri-page-description">
                {account.industry && `${account.industry} • `}
                Created {new Date(account.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to={`/accounts/${account.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Account
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={account.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {account.website}
                    </a>
                  </div>
                )}

                {account.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${account.email}`}
                      className="text-primary hover:underline"
                    >
                      {account.email}
                    </a>
                  </div>
                )}

                {account.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${account.phone}`}
                      className="text-primary hover:underline"
                    >
                      {account.phone}
                    </a>
                  </div>
                )}

                {account.address && (account.address.street || account.address.city) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      {account.address.street && <div>{account.address.street}</div>}
                      <div>
                        {account.address.city && account.address.city}
                        {account.address.city && account.address.state && ', '}
                        {account.address.state && account.address.state}
                        {account.address.zipCode && ` ${account.address.zipCode}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {account.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {account.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {account.notes && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Notes</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {account.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Associated Contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contacts ({accountContacts.length})
                </CardTitle>
                <Button size="sm" asChild>
                  <Link to={`/contacts/new?accountId=${account.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Link>
                </Button>
              </div>
              <CardDescription>
                People associated with this account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountContacts.length > 0 ? (
                <div className="space-y-3">
                  {accountContacts.map(contact => (
                    <Link key={contact.id} to={`/contacts/${contact.id}`}>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {contact.title && <span>{contact.title}</span>}
                              {contact.title && contact.department && <span>•</span>}
                              {contact.department && <span>{contact.department}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {contact.email || contact.phone || 'No contact info'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No contacts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add contacts to this account to track relationships and communication.
                  </p>
                  <Button asChild>
                    <Link to={`/contacts/new?accountId=${account.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Contact
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Service
              </Button>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contacts</span>
                <span className="font-medium">{accountContacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Open Deals</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Quotes</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Service Tickets</span>
                <span className="font-medium">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}