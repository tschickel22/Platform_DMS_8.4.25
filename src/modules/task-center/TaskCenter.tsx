import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  Search, 
  Filter,
  TrendingUp,
  ListTodo,
  Users,
  Target,
  Plus
} from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskStatus, TaskPriority, TaskModule } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { TaskForm } from './components/TaskForm'

export default function TaskCenter() {
  const { 
    tasks, 
    loading, 
    error, 
    metrics, 
    filterTasks, 
    getOverdueTasks,
    createTask
  } = useTasks()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [moduleFilter, setModuleFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedToName && task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesModule = moduleFilter === 'all' || task.module === moduleFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesOverdue = !showOverdueOnly || task.isOverdue
    
    // Apply active filter from stat cards
    let matchesActiveFilter = true
    if (activeFilter === 'overdue') {
      matchesActiveFilter = task.isOverdue
    } else if (activeFilter === 'in_progress') {
      matchesActiveFilter = task.status === TaskStatus.IN_PROGRESS
    } else if (activeFilter === 'completed') {
      matchesActiveFilter = task.status === TaskStatus.COMPLETED
    }

    return matchesSearch && matchesStatus && matchesModule && matchesPriority && matchesOverdue && matchesActiveFilter
  })

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case TaskStatus.ON_HOLD:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case TaskStatus.COMPLETED:
        return 'bg-green-50 text-green-700 border-green-200'
      case TaskStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'bg-red-50 text-red-700 border-red-200'
      case TaskPriority.HIGH:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case TaskPriority.MEDIUM:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case TaskPriority.LOW:
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getModuleColor = (module: TaskModule) => {
    switch (module) {
      case TaskModule.CRM:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case TaskModule.SERVICE:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case TaskModule.DELIVERY:
        return 'bg-green-50 text-green-700 border-green-200'
      case TaskModule.FINANCE:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case TaskModule.WARRANTY:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case TaskStatus.IN_PROGRESS:
        return <Target className="h-4 w-4" />
      case TaskStatus.ON_HOLD:
        return <AlertTriangle className="h-4 w-4" />
      case TaskStatus.COMPLETED:
        return <CheckSquare className="h-4 w-4" />
      case TaskStatus.CANCELLED:
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData)
      setShowTaskForm(false)
    } catch (error) {
      throw error
    }
  }

  const handleStatCardClick = (filterType: string) => {
    // Toggle filter if clicking the same card, otherwise set new filter
    if (activeFilter === filterType) {
      setActiveFilter('all')
    } else {
      setActiveFilter(filterType)
      // Reset other filters when using stat card filters
      setStatusFilter('all')
      setShowOverdueOnly(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Task Center</h1>
          <p className="ri-page-description">Loading tasks...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Task Center</h1>
          <p className="ri-page-description">Error loading tasks</p>
        </div>
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-700">Error Loading Tasks</h3>
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSave={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Task Center</h1>
            <p className="ri-page-description">
              Unified view of all tasks across modules
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              {filteredTasks.length} tasks
            </Badge>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setShowTaskForm(true)} className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              {metrics.overdueTasks > 0 && (
                <Badge className="bg-red-50 text-red-700 border-red-200">
                  {metrics.overdueTasks} overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'all' ? 'ring-2 ring-blue-300' : ''
          }`}
          onClick={() => handleStatCardClick('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{metrics.totalTasks}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All active tasks
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'overdue' ? 'ring-2 ring-red-300' : ''
          }`}
          onClick={() => handleStatCardClick('overdue')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{metrics.overdueTasks}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'in_progress' ? 'ring-2 ring-yellow-300' : ''
          }`}
          onClick={() => handleStatCardClick('in_progress')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">In Progress</CardTitle>
            <Target className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{metrics.inProgressTasks}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Target className="h-3 w-3 mr-1" />
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'completed' ? 'ring-2 ring-green-300' : ''
          }`}
          onClick={() => handleStatCardClick('completed')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{metrics.completedTasks}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <CheckSquare className="h-3 w-3 mr-1" />
              Recently finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="ri-search-bar flex-1">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.ON_HOLD}>On Hold</SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value={TaskModule.CRM}>CRM</SelectItem>
                  <SelectItem value={TaskModule.SERVICE}>Service</SelectItem>
                  <SelectItem value={TaskModule.DELIVERY}>Delivery</SelectItem>
                  <SelectItem value={TaskModule.FINANCE}>Finance</SelectItem>
                  <SelectItem value={TaskModule.WARRANTY}>Warranty</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant={showOverdueOnly ? "default" : "outline"} 
                onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                className="shadow-sm"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Overdue Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Tasks ({filteredTasks.length})</CardTitle>
          <CardDescription>
            Aggregated tasks from all modules requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task.id} className="ri-table-row">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <Badge className={cn("ri-badge-status", getStatusColor(task.status))}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status.replace('_', ' ').toUpperCase()}</span>
                        </Badge>
                        <Badge className={cn("ri-badge-status", getPriorityColor(task.priority))}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge className={cn("ri-badge-status", getModuleColor(task.module))}>
                          {task.module.toUpperCase()}
                        </Badge>
                        {task.isOverdue && (
                          <Badge className="bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2 text-blue-500" />
                          <span className="font-medium">Assigned:</span> 
                          <span className="ml-1">{task.assignedToName || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2 text-purple-500" />
                          <span className="font-medium">Due:</span> 
                          <span className={cn(
                            "ml-1",
                            task.isOverdue ? "text-red-600 font-medium" : ""
                          )}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ListTodo className="h-3 w-3 mr-2 text-green-500" />
                          <span className="font-medium">Source:</span> 
                          <span className="ml-1">{task.sourceType?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2 text-orange-500" />
                          <span className="font-medium">Created:</span> 
                          <span className="ml-1">{formatDate(task.createdAt)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ri-action-buttons">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => window.open(task.link, '_blank')}
                    >
                      View Source
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No tasks found</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== 'all' || moduleFilter !== 'all' || priorityFilter !== 'all' || showOverdueOnly
                    ? 'Try adjusting your filters'
                    : 'All tasks are up to date!'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Module Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tasks by Module</CardTitle>
            <CardDescription>
              Distribution of tasks across different modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.tasksByModule).map(([module, count]) => (
                <div key={module} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={cn("ri-badge-status", getModuleColor(module as TaskModule))}>
                      {module.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(metrics.tasksByModule).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks by module data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tasks by Priority</CardTitle>
            <CardDescription>
              Priority distribution of active tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.tasksByPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={cn("ri-badge-status", getPriorityColor(priority as TaskPriority))}>
                      {priority.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(metrics.tasksByPriority).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks by priority data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}