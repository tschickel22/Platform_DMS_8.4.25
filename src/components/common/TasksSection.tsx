import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Edit, Trash2, Save, X, Calendar, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Task, TaskStatus, TaskPriority, TaskModule } from '@/types'
import { useTasks } from '@/hooks/useTasks'

interface TasksSectionProps {
  contactId?: string
  accountId?: string
  title?: string
  description?: string
}

export function TasksSection({
  contactId,
  accountId,
  title = 'Tasks',
  description = 'Tasks and follow-ups'
}: TasksSectionProps) {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  // Filter tasks for this contact/account
  const relatedTasks = tasks.filter(task => 
    (contactId && task.contactId === contactId) || 
    (accountId && task.accountId === accountId)
  )

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
        contactId,
        accountId,
        module: TaskModule.CRM,
        sourceId: contactId || accountId || '',
        sourceType: contactId ? 'contact' : 'account'
      })
      
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskPriority(TaskPriority.MEDIUM)
      setNewTaskDueDate('')
      setIsAddingTask(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case TaskStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800'
      case TaskStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'bg-red-100 text-red-800'
      case TaskPriority.HIGH:
        return 'bg-orange-100 text-orange-800'
      case TaskPriority.MEDIUM:
        return 'bg-blue-100 text-blue-800'
      case TaskPriority.LOW:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingTask(true)}
            disabled={isAddingTask}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        {isAddingTask && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input
                  id="taskTitle"
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">Description (Optional)</Label>
                <Input
                  id="taskDescription"
                  placeholder="Enter task description..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="taskPriority">Priority</Label>
                  <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as TaskPriority)}>
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
                <div className="grid gap-2">
                  <Label htmlFor="taskDueDate">Due Date (Optional)</Label>
                  <Input
                    id="taskDueDate"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingTask(false)
                    setNewTaskTitle('')
                    setNewTaskDescription('')
                    setNewTaskDueDate('')
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {relatedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks yet.</p>
            <p className="text-sm">Click "Add Task" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {relatedTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {task.dueDate && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {formatDateTime(task.dueDate)}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Created: {formatDateTime(task.createdAt)}
                      </div>
                      {task.assignedToName && (
                        <div>Assigned to: {task.assignedToName}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}