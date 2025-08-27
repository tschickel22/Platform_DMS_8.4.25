import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAccountManagement } from './hooks/useAccountManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AccountForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getAccountById, createAccount, updateAccount, loading, error } = useAccountManagement()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      const account = getAccountById(id)
      if (account) {
        setName(account.name || '')
        setAddress(account.address || '')
        setPhone(account.phone || '')
        setEmail(account.email || '')
        setWebsite(account.website || '')
        setIndustry(account.industry || '')
      } else if (!loading) {
        toast({
          title: 'Account Not Found',
          description: 'The account you are trying to edit does not exist.',
          variant: 'destructive'
        })
        navigate('/crm/accounts')
      }
    }
  }, [id, getAccountById, loading, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const accountData = { name, address, phone, email, website, industry }

    try {
      if (id) {
        await updateAccount(id, accountData)
        toast({
          title: 'Success',
          description: 'Account updated successfully.'
        })
      } else {
        await createAccount(accountData)
        toast({
          title: 'Success',
          description: 'Account created successfully.'
        })
      }
      navigate('/crm/accounts')
    } catch (submitError) {
      console.error('Submission error:', submitError)
      toast({
        title: 'Error',
        description: `Failed to save account: ${error || 'Unknown error'}`,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">{id ? 'Edit Account' : 'Create New Account'}</h1>
        <p className="ri-page-description">
          {id ? `Update details for ${name}` : 'Fill in the details for your new account.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Basic information about the account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Account'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/crm/accounts')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}