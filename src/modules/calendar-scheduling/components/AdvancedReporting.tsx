import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Users,
  Target,
  Settings,
  Mail,
  Share
} from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { formatDate, formatCurrency } from '@/lib/utils'
import Papa from 'papaparse'

interface ReportConfig {
  name: string
  description: string
  dateRange: {
    start: Date
    end: Date
  }
  modules: string[]
  statuses: string[]
  assignees: string[]
  includeMetrics: boolean
  includeCharts: boolean
  format: 'pdf' | 'excel' | 'csv'
  schedule?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
  }
}

interface AdvancedReportingProps {
  events: CalendarEvent[]
  onGenerateReport: (config: ReportConfig) => Promise<void>
  onScheduleReport: (config: ReportConfig) => Promise<void>
}

export function AdvancedReporting({ events, onGenerateReport, onScheduleReport }: AdvancedReportingProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('builder')
  const [loading, setLoading] = useState(false)
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    modules: ['service', 'delivery', 'task', 'pdi'],
    statuses: [],
    assignees: [],
    includeMetrics: true,
    includeCharts: true,
    format: 'pdf',
    schedule: {
      enabled: false,
      frequency: 'weekly',
      recipients: []
    }
  })

  const [savedReports, setSavedReports] = useState([
    {
      id: '1',
      name: 'Weekly Operations Summary',
      description: 'Comprehensive weekly report for operations team',
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      format: 'pdf',
      isScheduled: true,
      frequency: 'weekly'
    },
    {
      id: '2',
      name: 'Service Performance Report',
      description: 'Monthly service department performance metrics',
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      format: 'excel',
      isScheduled: true,
      frequency: 'monthly'
    }
  ])

  const [newRecipient, setNewRecipient] = useState('')

  // Calculate report preview data
  const reportPreview = useMemo(() => {
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start)
      const inDateRange = eventDate >= reportConfig.dateRange.start && eventDate <= reportConfig.dateRange.end
      const inModules = reportConfig.modules.length === 0 || reportConfig.modules.includes(event.sourceModule)
      const inStatuses = reportConfig.statuses.length === 0 || reportConfig.statuses.includes(event.status)
      const inAssignees = reportConfig.assignees.length === 0 || (event.assignedTo && reportConfig.assignees.includes(event.assignedTo))
      
      return inDateRange && inModules && inStatuses && inAssignees
    })

    const metrics = {
      totalEvents: filteredEvents.length,
      completedEvents: filteredEvents.filter(e => ['completed', 'delivered', 'approved'].includes(e.status.toLowerCase())).length,
      cancelledEvents: filteredEvents.filter(e => ['cancelled', 'failed'].includes(e.status.toLowerCase())).length,
      overdueEvents: filteredEvents.filter(e => e.start < new Date() && !['completed', 'delivered', 'approved'].includes(e.status.toLowerCase())).length,
      avgDuration: filteredEvents.length > 0 
        ? filteredEvents.reduce((sum, e) => sum + (e.end.getTime() - e.start.getTime()), 0) / filteredEvents.length / (1000 * 60 * 60)
        : 0
    }

    return {
      events: filteredEvents,
      metrics
    }
  }, [events, reportConfig])

  const handleGenerateReport = async () => {
    if (!reportConfig.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a report name',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onGenerateReport(reportConfig)
      
      // Simulate report generation and download
      if (reportConfig.format === 'csv') {
        const csvData = reportPreview.events.map(event => ({
          'Event ID': event.id,
          'Title': event.title,
          'Module': event.sourceModule,
          'Status': event.status,
          'Start Date': formatDate(event.start),
          'End Date': formatDate(event.end),
          'Assigned To': event.metadata?.assignedToName || event.assignedTo || 'Unassigned',
          'Customer': event.metadata?.customerName || '',
          'Vehicle': event.metadata?.vehicleInfo || '',
          'Duration (hours)': ((event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60)).toFixed(2)
        }))

        const csv = Papa.unparse(csvData)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${reportConfig.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
      
      toast({
        title: 'Report Generated',
        description: `${reportConfig.name} has been generated and downloaded`,
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate report',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleReport = async () => {
    if (!reportConfig.schedule?.enabled) {
      toast({
        title: 'Scheduling Disabled',
        description: 'Please enable report scheduling first',
        variant: 'destructive'
      })
      return
    }

    if (reportConfig.schedule.recipients.length === 0) {
      toast({
        title: 'No Recipients',
        description: 'Please add at least one recipient for scheduled reports',
        variant: 'destructive'
      })
      return
    }

    try {
      await onScheduleReport(reportConfig)
      
      toast({
        title: 'Report Scheduled',
        description: `${reportConfig.name} will be sent ${reportConfig.schedule.frequency}`,
      })
    } catch (error) {
      toast({
        title: 'Scheduling Failed',
        description: 'Failed to schedule report',
        variant: 'destructive'
      })
    }
  }

  const addRecipient = () => {
    if (newRecipient.trim() && !reportConfig.schedule?.recipients.includes(newRecipient.trim())) {
      setReportConfig(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule!,
          recipients: [...prev.schedule!.recipients, newRecipient.trim()]
        }
      }))
      setNewRecipient('')
    }
  }

  const removeRecipient = (email: string) => {
    setReportConfig(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule!,
        recipients: prev.schedule!.recipients.filter(r => r !== email)
      }
    }))
  }

  const updateConfig = (field: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleModule = (module: string) => {
    setReportConfig(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Reporting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Reporting</h2>
          <p className="text-muted-foreground">
            Create custom reports and schedule automated delivery
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Report Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>
                    Configure your custom report settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reportName">Report Name *</Label>
                    <Input
                      id="reportName"
                      value={reportConfig.name}
                      onChange={(e) => updateConfig('name', e.target.value)}
                      placeholder="e.g., Monthly Operations Report"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reportDescription">Description</Label>
                    <Input
                      id="reportDescription"
                      value={reportConfig.description}
                      onChange={(e) => updateConfig('description', e.target.value)}
                      placeholder="Brief description of this report"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={reportConfig.dateRange.start.toISOString().split('T')[0]}
                        onChange={(e) => updateConfig('dateRange', {
                          ...reportConfig.dateRange,
                          start: new Date(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={reportConfig.dateRange.end.toISOString().split('T')[0]}
                        onChange={(e) => updateConfig('dateRange', {
                          ...reportConfig.dateRange,
                          end: new Date(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Include Modules</Label>
                    <div className="grid gap-2 md:grid-cols-2 mt-2">
                      {['service', 'delivery', 'task', 'pdi'].map(module => (
                        <label key={module} className="flex items-center space-x-2">
                          <Checkbox
                            checked={reportConfig.modules.includes(module)}
                            onCheckedChange={() => toggleModule(module)}
                          />
                          <span className="text-sm capitalize">{module}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Report Format</Label>
                      <Select 
                        value={reportConfig.format} 
                        onValueChange={(value: 'pdf' | 'excel' | 'csv') => updateConfig('format', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Report Options</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={reportConfig.includeMetrics}
                            onCheckedChange={(checked) => updateConfig('includeMetrics', !!checked)}
                          />
                          <span className="text-sm">Include performance metrics</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={reportConfig.includeCharts}
                            onCheckedChange={(checked) => updateConfig('includeCharts', !!checked)}
                          />
                          <span className="text-sm">Include charts and graphs</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduling Configuration */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Report Scheduling</CardTitle>
                  <CardDescription>
                    Automatically generate and send reports on a schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={reportConfig.schedule?.enabled || false}
                      onCheckedChange={(checked) => updateConfig('schedule', {
                        ...reportConfig.schedule,
                        enabled: !!checked
                      })}
                    />
                    <Label>Enable automatic report scheduling</Label>
                  </div>

                  {reportConfig.schedule?.enabled && (
                    <>
                      <div>
                        <Label>Frequency</Label>
                        <Select 
                          value={reportConfig.schedule.frequency} 
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                            updateConfig('schedule', {
                              ...reportConfig.schedule,
                              frequency: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Recipients</Label>
                        <div className="flex space-x-2 mt-2">
                          <Input
                            value={newRecipient}
                            onChange={(e) => setNewRecipient(e.target.value)}
                            placeholder="Enter email address"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addRecipient()
                              }
                            }}
                          />
                          <Button type="button" onClick={addRecipient}>
                            Add
                          </Button>
                        </div>

                        {reportConfig.schedule.recipients.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {reportConfig.schedule.recipients.map(email => (
                              <Badge key={email} variant="secondary" className="flex items-center space-x-1">
                                <span>{email}</span>
                                <button
                                  type="button"
                                  onClick={() => removeRecipient(email)}
                                  className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>
                    Preview of data that will be included
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Events:</span>
                      <span className="font-medium">{reportPreview.metrics.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed:</span>
                      <span className="font-medium text-green-600">{reportPreview.metrics.completedEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cancelled:</span>
                      <span className="font-medium text-red-600">{reportPreview.metrics.cancelledEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overdue:</span>
                      <span className="font-medium text-orange-600">{reportPreview.metrics.overdueEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Duration:</span>
                      <span className="font-medium">{reportPreview.metrics.avgDuration.toFixed(1)}h</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Modules Included:</h4>
                    <div className="flex flex-wrap gap-1">
                      {reportConfig.modules.map(module => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Date Range:</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(reportConfig.dateRange.start)} to {formatDate(reportConfig.dateRange.end)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={loading || !reportConfig.name.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>

                {reportConfig.schedule?.enabled && (
                  <Button 
                    variant="outline" 
                    onClick={handleScheduleReport}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automatically generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge className={report.isScheduled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {report.isScheduled ? 'SCHEDULED' : 'MANUAL'}
                        </Badge>
                        <Badge variant="outline">
                          {report.format.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Last generated: {formatDate(report.lastGenerated)}</span>
                        {report.isScheduled && (
                          <span>Frequency: {report.frequency}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Pre-configured report templates for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'Operations Summary',
                    description: 'Comprehensive overview of all calendar activities',
                    modules: ['service', 'delivery', 'task', 'pdi'],
                    frequency: 'weekly'
                  },
                  {
                    name: 'Service Performance',
                    description: 'Detailed service department metrics and KPIs',
                    modules: ['service'],
                    frequency: 'monthly'
                  },
                  {
                    name: 'Delivery Efficiency',
                    description: 'Delivery performance and route optimization data',
                    modules: ['delivery'],
                    frequency: 'weekly'
                  },
                  {
                    name: 'Team Productivity',
                    description: 'Individual and team performance metrics',
                    modules: ['service', 'delivery', 'task'],
                    frequency: 'monthly'
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {template.modules.map(module => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" variant="outline">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}