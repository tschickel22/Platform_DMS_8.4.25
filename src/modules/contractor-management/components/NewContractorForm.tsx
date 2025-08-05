import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorTrade } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface NewContractorFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const getTradeDisplayName = (trade: ContractorTrade): string => {
  const tradeNames: Record<ContractorTrade, string> = {
    [ContractorTrade.ELECTRICAL]: 'Electrical',
    [ContractorTrade.PLUMBING]: 'Plumbing',
    [ContractorTrade.SKIRTING]: 'Skirting',
    [ContractorTrade.HVAC]: 'HVAC',
    [ContractorTrade.FLOORING]: 'Flooring',
    [ContractorTrade.ROOFING]: 'Roofing',
    [ContractorTrade.GENERAL]: 'General',
    [ContractorTrade.LANDSCAPING]: 'Landscaping'
  }
  return tradeNames[trade] || trade
}

export function NewContractorForm({ isOpen, onClose, onSuccess }: NewContractorFormProps) {
  const { addContractor } = useContractorManagement()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [trade, setTrade] = useState<ContractorTrade>(ContractorTrade.GENERAL)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addContractor({
        name,
        trade,
        contactInfo: {
          email,
          phone,
          address
        },
        ratings: {
          averageRating: 0,
          reviewCount: 0
        },
        assignedJobIds: [],
        isActive: true,
        notes
      })
      toast({
        title: 'Contractor Added',
        description: 'New contractor has been successfully added to the directory.',
      })
      onSuccess?.()
      onClose()
      // Reset form
      setName('')
      setEmail('')
      setPhone('')
      setAddress('')
      setTrade(ContractorTrade.GENERAL)
      setNotes('')
    } catch (error) {
      console.error('Failed to add contractor:', error)
      toast({
        title: 'Error',
        description: 'Failed to add contractor. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Contractor</DialogTitle>
          <DialogDescription>
            Add a new contractor to your network. Fill in their details and trade specialization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trade" className="text-right">
              Trade
            </Label>
            <Select value={trade} onValueChange={(value) => setTrade(value as ContractorTrade)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select trade specialization" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContractorTrade).map(tradeOption => (
                  <SelectItem key={tradeOption} value={tradeOption}>
                    {getTradeDisplayName(tradeOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              rows={3}
              placeholder="Additional notes about the contractor..."
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding Contractor...' : 'Add Contractor'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}