import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Trash2, 
  Tag, 
  Mail, 
  MessageSquare, 
  UserPlus,
  Download,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { BulkOperationType, BulkOperationStatus } from '@/types'
import { useBulkOperations } from '@/hooks/useBulkOperations'
import { TagInput } from './TagInput'

interface BulkOperationsPanelProps {
  selectedIds: string[]
  entityType: 'accounts' | 'contacts' | 'leads'
  onClearSelection: () => void
  onRefresh?: () => void
}

export function BulkOperationsPanel({
  selectedIds,
  entityType,
  onClearSelection,
  onRefresh
}: BulkOperationsPanelProps) {
  const { startBulkOperation, currentOperation, cancelOperation } = useBulkOperations()
  const [showDialog, setShowDialog] = useState(false)
  const [operationType, setOperationType] = useState<BulkOperationType | ''>('')
  const [updateField, setUpdateField] = useState('')
  const [updateValue, setUpdateValue] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [smsMessage, setSmsMessage] = useState('')

  const operationOptions = [
    { value: BulkOperationType.UPDATE, label: 'Update Fields', icon: Settings },
    { value: BulkOperationType.TAG, label: 'Add Tags', icon: Tag },
    { value: BulkOperationType.EMAIL, label: 'Send Email', icon: Mail },
    { value: BulkOperationType.SMS, label: 'Send SMS', icon: MessageSquare },
    { value: BulkOperationType.EXPORT, label: 'Export Selected', icon: Download },
    { value: BulkOperationType.DELETE, label: 'Delete Selected', icon: Trash2 }
  ]

  const updateFieldOptions = entityType === 'accounts' 
    ? [
        { value: 'industry', label: 'Industry' },
        { value: 'status', label: 'Status' }
      ]
    : [
        { value: 'title', label: 'Title' },
        { value: 'department', label: 'Department' },
        { value: 'preferredContactMethod', label: 'Preferred Contact Method' }
      ]

  const handleStartOperation = async () => {
    if (!operationType || selectedIds.length === 0) return

    let parameters: Record<string, any> = {}

    switch (operationType) {
      case BulkOperationType.UPDATE:
        if (!updateField || !updateValue) return
        parameters = { field: updateField, value: updateValue }
        break
      case BulkOperationType.TAG:
        if (tags.length === 0) return
        parameters = { tags }
        break
      case BulkOperationType.EMAIL:
        if (!emailSubject || !emailBody) return
        parameters = { subject: emailSubject, body: emailBody }
        break
      case BulkOperationType.SMS:
        if (!smsMessage) return
        parameters = { message: smsMessage }
        break
    }

    try {
      await startBulkOperation(
        operationType,
        entityType,
        selectedIds,
        operationType,
        parameters
      )
      
      setShowDialog(false)
      resetForm()
      
      if (onRefresh) {
        setTimeout(onRefresh, 2000) // Refresh after operation completes
      }
    } catch (error) {
      console.error('Failed to start bulk operation:', error)
    }
  }

  const resetForm = () => {
    setOperationType('')
    setUpdateField('')
    setUpdateValue('')
    setTags([])
    setEmailSubject('')
    setEmailBody('')
    setSmsMessage('')
  }

  const getStatusColor = (status: BulkOperationStatus) => {
    switch (status) {
      case BulkOperationStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case BulkOperationStatus.RUNNING:
        return 'bg-blue-100 text-blue-800'
      case BulkOperationStatus.FAILED:
        return 'bg-red-100 text-red-800'
      case BulkOperationStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              {selectedIds.length} {entityType} selected
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Current Operation Status */}
          {currentOperation && currentOperation.status === BulkOperationStatus.RUNNING && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing...</span>
                <Badge className={getStatusColor(currentOperation.status)}>
                  {currentOperation.status}
                </Badge>
              </div>
              <Progress value={currentOperation.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentOperation.operation}</span>
                <span>{currentOperation.progress}%</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Bulk Operations</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label>Operation Type</Label>
                    <Select value={operationType} onValueChange={(value) => setOperationType(value as BulkOperationType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        {operationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <option.icon className="h-4 w-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Update Fields */}
                  {operationType === BulkOperationType.UPDATE && (
                    <>
                      <div>
                        <Label>Field to Update</Label>
                        <Select value={updateField} onValueChange={setUpdateField}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {updateFieldOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>New Value</Label>
                        <Input
                          value={updateValue}
                          onChange={(e) => setUpdateValue(e.target.value)}
                          placeholder="Enter new value"
                        />
                      </div>
                    </>
                  )}

                  {/* Tags */}
                  {operationType === BulkOperationType.TAG && (
                    <div>
                      <Label>Tags to Add</Label>
                      <TagInput
                        tags={tags}
                        onTagsChange={setTags}
                        placeholder="Add tags..."
                      />
                    </div>
                  )}

                  {/* Email */}
                  {operationType === BulkOperationType.EMAIL && (
                    <>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Email subject"
                        />
                      </div>
                      <div>
                        <Label>Message</Label>
                        <Textarea
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Email message"
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {/* SMS */}
                  {operationType === BulkOperationType.SMS && (
                    <div>
                      <Label>Message</Label>
                      <Textarea
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="SMS message"
                        rows={3}
                        maxLength={160}
                      />
                      <div className="text-xs text-muted-foreground text-right">
                        {smsMessage.length}/160 characters
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleStartOperation}>
                      Execute Operation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={onClearSelection}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Operation Results */}
          {currentOperation && currentOperation.status === BulkOperationStatus.COMPLETED && (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>
                  {currentOperation.results?.filter(r => r.success).length || 0} successful,{' '}
                  {currentOperation.results?.filter(r => !r.success).length || 0} failed
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}