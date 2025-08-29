import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react'
import { Account } from '@/types'
import { mockAccounts } from '@/mocks/accountsMock'
import { NotesSection } from '@/components/common/NotesSection'
import AccountForm from '@/modules/accounts/components/AccountForm'
import { useToast } from '@/hooks/use-toast'

export default function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [account, setAccount] = useState<Account | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (accountId) {
      // Find account in mock data
      const foundAccount = mockAccounts.sampleAccounts.find(acc => acc.id === accountId)
      setAccount(foundAccount || null)
    }
    setLoading(false)
  }, [accountId])

  const handleSave = (updatedAccount: Account) => {
    setAccount(updatedAccount)
    setIsEditing(false)
    toast({
      title: 'Success',
      description: 'Account updated successfully'
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      toast({
        title: 'Success',
        description: 'Account deleted successfully'
      })
      navigate('/accounts')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Account not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel Edit
          </Button>
        </div>
        <AccountForm
          account={account}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  const typeConfig = mockAccounts.accountTypes.find(t => t.value === account.type)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{account.name}</h1>
            <p className="text-muted-foreground">Account Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Account Information</CardTitle>
                <Badge className={typeConfig?.color}>
                  {typeConfig?.label || account.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{account.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-sm">{typeConfig?.label || account.type}</p>
                </div>
                {account.industry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="text-sm">{account.industry}</p>
                  </div>
                )}
                {account.website && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <a 
                      href={account.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {account.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="space-y-2">
                  {account.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{account.phone}</span>
                    </div>
                  )}
                  {account.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{account.email}</span>
                    </div>
                  )}
                  {account.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p>{account.address.street}</p>
                        <p>{account.address.city}, {account.address.state} {account.address.zipCode}</p>
                        <p>{account.address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {account.tags && account.tags.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {account.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {account.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Notes</h4>
                  <p className="text-sm text-muted-foreground">{account.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <NotesSection 
            entityId={account.id} 
            entityType="account"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}