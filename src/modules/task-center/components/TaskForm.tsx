import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, ListTodo } from 'lucide-react'
import { Task, TaskStatus, TaskPriority, TaskModule } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'

interface TaskFormProps {
  task?: Task
  initialData?: Partial<Task>
  onSave: (taskData: Partial<Task>) => Promise<void>
  onCancel: () => void
}

export function TaskForm({ task, initialData, onSave, onCancel }: TaskFormProps) {
  const { toast } = useToast()
  const { salesReps } = useLeadManagement()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    module: TaskModule.CRM,
    assignedTo: '',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
    sourceId: '',
    sourceType: '',
    tags: [],
    customFields: {},
    ...initialData,
    ...task
  })

  useEffect(() => {
    if (task) {
      setFormData(task)
    } else if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [task, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Task title is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Task ${task ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${task ? 'update' : 'create'} task`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ListTodo className="h-5 w-5 mr-2 text-primary" />
                {task ? 'Edit Task' : 'Create Task'}
              </CardTitle>
              <CardDescription>
                {task ? 'Update task details' : 'Create a new task to track work'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Task Information</h3>
              
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe what needs to be done"
                  rows={3}
                />
              </div>
            </div>

            {/* Task Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Task Properties</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: TaskStatus) => updateFormData('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={TaskStatus.ON_HOLD}>On Hold</SelectItem>
                      <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={TaskStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: TaskPriority) => updateFormData('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                      <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                      <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="module">Module</Label>
                  <Select 
                    value={formData.module} 
                    onValueChange={(value: TaskModule) => updateFormData('module', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskModule.CRM}>CRM</SelectItem>
                      <SelectItem value={TaskModule.SERVICE}>Service</SelectItem>
                      <SelectItem value={TaskModule.DELIVERY}>Delivery</SelectItem>
                      <SelectItem value={TaskModule.FINANCE}>Finance</SelectItem>
                      <SelectItem value={TaskModule.WARRANTY}>Warranty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select 
                    value={formData.assignedTo || ''} 
                    onValueChange={(value) => updateFormData('assignedTo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {salesReps.map(rep => (
                        <SelectItem key={rep.id} value={rep.id}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateFormData('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Source Information (read-only if from another module) */}
            {(formData.sourceId || formData.sourceType) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Source Information</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <Label className="text-sm">Source Type</Label>
                      <p className="text-sm font-medium">{formData.sourceType?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Source ID</Label>
                      <p className="text-sm font-medium font-mono">{formData.sourceId}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {task ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {task ? 'Update Task' : 'Create Task'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}