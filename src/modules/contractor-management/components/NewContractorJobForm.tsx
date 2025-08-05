import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorJobType, ContractorTrade, Priority } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface NewContractorJobFormProps {
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

const getJobTypeDisplayName = (type: ContractorJobType): string => {
  const typeNames: Record<ContractorJobType, string> = {
    [ContractorJobType.INSTALLATION]: 'Installation',
    [ContractorJobType.REPAIR]: 'Repair',
    [ContractorJobType.MAINTENANCE]: 'Maintenance',
    [ContractorJobType.INSPECTION]: 'Inspection',
    [ContractorJobType.SETUP]: 'Setup',
    [ContractorJobType.REMOVAL]: 'Removal'
  }
  return typeNames[type] || type
}

export function NewContractorJobForm({ isOpen, onClose, onSuccess }: NewContractorJobFormProps) {
  const { addContractorJob } = useContractorManagement()
  const { toast } = useToast()

  const [unitAddress, setUnitAddress] = useState('')
  const [jobType, setJobType] = useState<ContractorJobType>(ContractorJobType.REPAIR)
  const [trade, setTrade] = useState<ContractorTrade>(ContractorTrade.GENERAL)
  const [scheduledDate, setScheduledDate] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState(4)
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addContractorJob({
        unitAddress,
        jobType,
        trade,
        scheduledDate: new Date(scheduledDate),
        estimatedDuration,
        description,
        priority,
        customerName,
        customerPhone,
        customerEmail,
        specialInstructions,
        photos: [],
        notes: '',
        status: 'pending', // New jobs start as pending
        customFields: {}
      })
      toast({
        title: 'Job Created',
        description: 'New contractor job has been successfully added.',
      })
      onSuccess?.()
      onClose()
      // Reset form
      setUnitAddress('')
      setJobType(ContractorJobType.REPAIR)
      setTrade(ContractorTrade.GENERAL)
      setScheduledDate('')
      setEstimatedDuration(4)
      setDescription('')
      setPriority(Priority.MEDIUM)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setSpecialInstructions('')
    } catch (error) {
      console.error('Failed to add contractor job:', error)
      toast({
        title: 'Error',
        description: 'Failed to create job. Please try again.',
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
          <DialogTitle>Create New Contractor Job</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new job for your contractors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unitAddress" className="text-right">
              Unit Address
            </Label>
            <Input
              id="unitAddress"
              value={unitAddress}
              onChange={(e) => setUnitAddress(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobType" className="text-right">
              Job Type
            </Label>
            <Select value={jobType} onValueChange={(value) => setJobType(value as ContractorJobType)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContractorJobType).map(type => (
                  <SelectItem key={type} value={type}>
                    {getJobTypeDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trade" className="text-right">
              Trade
            </Label>
            <Select value={trade} onValueChange={(value) => setTrade(value as ContractorTrade)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select trade" />
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
            <Label htmlFor="scheduledDate" className="text-right">
              Scheduled Date
            </Label>
            <Input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimatedDuration" className="text-right">
              Est. Duration (hours)
            </Label>
            <Input
              id="estimatedDuration"
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
              className="col-span-3"
              min="1"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Priority).map(p => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">
              Customer Name
            </Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerPhone" className="text-right">
              Customer Phone
            </Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerEmail" className="text-right">
              Customer Email
            </Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialInstructions" className="text-right">
              Special Instructions
            </Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Job...' : 'Create Job'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}