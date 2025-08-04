import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Filter, BarChart3, Download, Play, X, Plus, Minus } from 'lucide-react'
import { TagSelector, TagFilter } from '@/modules/tagging-engine'
import { TagType, TagFilter as TagFilterType } from '@/modules/tagging-engine/types'
import { mockReportingSuite } from '@/mocks/reportingSuiteMock'
import { useToast } from '@/hooks/use-toast'

interface ReportGeneratorFormProps {
  onGenerate: (reportConfig: any) => void
  onCancel?: () => void
}

export function ReportGeneratorForm({ onGenerate, onCancel }: ReportGeneratorFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  const [reportConfig, setReportConfig] = useState({
    reportId: '',
    name: '',
    description: '',
    category: '',
    timeRange: 'last_30_days',
    customStartDate: '',
    customEndDate: '',
    groupBy: 'day',
    chartType: 'bar',
    exportFormat: 'pdf',
    
    // Entity filters
    salesReps: [] as string[],
    vehicleTypes: [] as string[],
    locations: [] as string[],
    customers: [] as string[],
    
    // Status filters
    leadStatuses: [] as string[],
    dealStages: [] as string[],
    serviceStatuses: [] as string[],
    
    // Value filters
    minValue: '',
    maxValue: '',
    minScore: '',
    maxScore: '',
    
    // Tag filters
    tagFilters: [] as TagFilterType[],
    
    // Advanced filters
    includeCustomFields: false,
    includeInactive: false,
    excludeTestData: true,
    
    // Columns to include
    selectedColumns: [] as string[]
  })

  const availableReports = mockReportingSuite.availableReports
  const timeRangeOptions = mockReportingSuite.timeRangeOptions
  const chartTypes = mockReportingSuite.chartTypes
  const exportFormats = mockReportingSuite.exportFormats
  const filterOptions = mockReportingSuite.filterOptions

  const handleReportSelect = (reportId: string) => {
    const report = availableReports.find(r => r.id === reportId)
    if (report) {
      setReportConfig(prev => ({
        ...prev,
        reportId,
        name: report.name,
        description: report.description,
        category: report.category
      }))
    }
  }

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const addTagFilter = () => {
    const newFilter: TagFilterType = {
      tagIds: [],
      operator: 'OR',
      exclude: false
    }
    setReportConfig(prev => ({
      ...prev,
      tagFilters: [...prev.tagFilters, newFilter]
    }))
  }

  const removeTagFilter = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      tagFilters: prev.tagFilters.filter((_, i) => i !== index)
    }))
  }

  const updateTagFilter = (index: number, filter: TagFilterType) => {
    setReportConfig(prev => ({
      ...prev,
      tagFilters: prev.tagFilters.map((f, i) => i === index ? filter : f)
    }))
  }

  const handleGenerate = async () => {
    if (!reportConfig.reportId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a report type',
        variant: 'destructive'
      })
      return
    }

    if (reportConfig.timeRange === 'custom' && (!reportConfig.customStartDate || !reportConfig.customEndDate)) {
      toast({
        title: 'Validation Error',
        description: 'Please select start and end dates for custom time range',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // Prepare filter data
      const reportFilters = {
        ...reportConfig,
        tagFilters: reportConfig.tagFilters,
        selectedSalesReps: reportConfig.salesReps,
      }
      
      const reportData = await generateReport(reportFilters)
      
      // Call the onGenerate callback with the report data
      onGenerate(reportData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive'
      })
      console.error('Report generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (filters: any) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock report data based on filters
    const reportData = {
      id: Math.random().toString(36).substr(2, 9),
      type: filters.reportType,
      title: getReportTitle(filters.reportType),
      timeRange: filters.timeRange,
      chartType: filters.chartType,
      filters: filters,
      data: generateMockReportData(filters),
      generatedAt: new Date(),
      totalRecords: Math.floor(Math.random() * 1000) + 100
    }
    
    return reportData
  }

  const getReportTitle = (reportType: string) => {
    const reportTitles: Record<string, string> = {
      'finance-summary': 'Finance Summary Report',
      'inventory-status': 'Inventory Status Report',
      'quote-conversions': 'Quote Conversion Report',
      'service-performance': 'Service Performance Report',
      'delivery-timelines': 'Delivery Timeline Report',
      'crm-pipeline': 'CRM Pipeline Report',
      'commission-summary': 'Commission Summary Report',
      'customer-satisfaction': 'Customer Satisfaction Report'
    }
    return reportTitles[reportType] || 'Custom Report'
  }

  const generateMockReportData = (filters: any) => {
    // Generate mock data based on report type and filters
    const baseData = []
    const recordCount = Math.floor(Math.random() * 50) + 20
    
    for (let i = 0; i < recordCount; i++) {
      baseData.push({
        id: i + 1,
        name: `Record ${i + 1}`,
        value: Math.floor(Math.random() * 100000) + 1000,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: ['Active', 'Pending', 'Completed', 'Cancelled'][Math.floor(Math.random() * 4)],
        category: ['Sales', 'Service', 'Finance', 'Operations'][Math.floor(Math.random() * 4)]
      })
    }
    
    return baseData
  }
  
  const getEntityTypeForReport = (category: string): TagType => {
    switch (category.toLowerCase()) {
      case 'crm': return TagType.LEAD
      case 'sales': return TagType.DEAL
      case 'inventory': return TagType.INVENTORY
      case 'finance': return TagType.CLIENT
      default: return TagType.LEAD
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                Generate Report
              </CardTitle>
              <CardDescription>
                Configure and generate custom reports with advanced filtering options
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="reportType">Report Type *</Label>
                  <Select value={reportConfig.reportId} onValueChange={handleReportSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableReports.map(report => (
                        <SelectItem key={report.id} value={report.id}>
                          <div>
                            <div className="font-medium">{report.name}</div>
                            <div className="text-sm text-muted-foreground">{report.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeRange">Time Range *</Label>
                  <Select value={reportConfig.timeRange} onValueChange={(value) => 
                    setReportConfig(prev => ({ ...prev, timeRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeRangeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {reportConfig.timeRange === 'custom' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={reportConfig.customStartDate}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, customStartDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={reportConfig.customEndDate}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, customEndDate: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="groupBy">Group By</Label>
                  <Select value={reportConfig.groupBy} onValueChange={(value) => 
                    setReportConfig(prev => ({ ...prev, groupBy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.groupBy.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="chartType">Chart Type</Label>
                  <Select value={reportConfig.chartType} onValueChange={(value) => 
                    setReportConfig(prev => ({ ...prev, chartType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select value={reportConfig.exportFormat} onValueChange={(value) => 
                    setReportConfig(prev => ({ ...prev, exportFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Sales Rep Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sales Representatives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.salesReps.map(rep => (
                        <div key={rep.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rep-${rep.value}`}
                            checked={reportConfig.salesReps.includes(rep.value)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange('salesReps', rep.value, !!checked)
                            }
                          />
                          <Label htmlFor={`rep-${rep.value}`} className="text-sm">
                            {rep.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Types Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vehicle Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.vehicleTypes.map(type => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type.value}`}
                            checked={reportConfig.vehicleTypes.includes(type.value)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange('vehicleTypes', type.value, !!checked)
                            }
                          />
                          <Label htmlFor={`type-${type.value}`} className="text-sm">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Status Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Statuses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(status => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lead-status-${status}`}
                            checked={reportConfig.leadStatuses.includes(status)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange('leadStatuses', status, !!checked)
                            }
                          />
                          <Label htmlFor={`lead-status-${status}`} className="text-sm">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Deal Stages Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deal Stages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Prospecting', 'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => (
                        <div key={stage} className="flex items-center space-x-2">
                          <Checkbox
                            id={`deal-stage-${stage}`}
                            checked={reportConfig.dealStages.includes(stage)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange('dealStages', stage, !!checked)
                            }
                          />
                          <Label htmlFor={`deal-stage-${stage}`} className="text-sm">
                            {stage}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Value Range Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Value Ranges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="minValue">Minimum Value</Label>
                      <Input
                        id="minValue"
                        type="number"
                        placeholder="0"
                        value={reportConfig.minValue}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, minValue: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxValue">Maximum Value</Label>
                      <Input
                        id="maxValue"
                        type="number"
                        placeholder="1000000"
                        value={reportConfig.maxValue}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, maxValue: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minScore">Minimum Lead Score</Label>
                      <Input
                        id="minScore"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={reportConfig.minScore}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, minScore: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxScore">Maximum Lead Score</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        placeholder="100"
                        min="0"
                        max="100"
                        value={reportConfig.maxScore}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, maxScore: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tags" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Tag Filters</CardTitle>
                      <CardDescription>
                        Filter data based on assigned tags
                      </CardDescription>
                    </div>
                    <Button onClick={addTagFilter} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tag Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportConfig.tagFilters.map((filter, index) => (
                      <Card key={index} className="border-dashed">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Tag Filter {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTagFilter(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <TagFilter
                            entityType={getEntityTypeForReport(reportConfig.category)}
                            filters={[filter]}
                            onFiltersChange={(filters) => updateTagFilter(index, filters[0])}
                            className="border-0 p-0"
                          />
                        </CardContent>
                      </Card>
                    ))}

                    {reportConfig.tagFilters.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No tag filters added</p>
                        <p className="text-sm">Add tag filters to include/exclude data based on tags</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tag Selector for Common Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Tag Selection</CardTitle>
                  <CardDescription>
                    Quickly add common tags to your report filter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TagSelector
                    entityId="report-filter"
                    entityType={getEntityTypeForReport(reportConfig.category)}
                    onTagsChange={(tags) => {
                      // Convert selected tags to a tag filter
                      if (tags.length > 0) {
                        const newFilter: TagFilterType = {
                          tagIds: tags.map(tag => tag.id),
                          operator: 'OR',
                          exclude: false
                        }
                        setReportConfig(prev => ({
                          ...prev,
                          tagFilters: [...prev.tagFilters, newFilter]
                        }))
                      }
                    }}
                    placeholder="Select tags to filter by..."
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCustomFields"
                        checked={reportConfig.includeCustomFields}
                        onCheckedChange={(checked) => 
                          setReportConfig(prev => ({ ...prev, includeCustomFields: !!checked }))
                        }
                      />
                      <Label htmlFor="includeCustomFields">Include Custom Fields</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeInactive"
                        checked={reportConfig.includeInactive}
                        onCheckedChange={(checked) => 
                          setReportConfig(prev => ({ ...prev, includeInactive: !!checked }))
                        }
                      />
                      <Label htmlFor="includeInactive">Include Inactive Records</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excludeTestData"
                        checked={reportConfig.excludeTestData}
                        onCheckedChange={(checked) => 
                          setReportConfig(prev => ({ ...prev, excludeTestData: !!checked }))
                        }
                      />
                      <Label htmlFor="excludeTestData">Exclude Test Data</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Column Selection</CardTitle>
                  <CardDescription>
                    Choose which columns to include in the report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-3">
                    {['ID', 'Name', 'Email', 'Phone', 'Status', 'Source', 'Value', 'Date Created', 'Last Updated', 'Assigned To', 'Tags'].map(column => (
                      <div key={column} className="flex items-center space-x-2">
                        <Checkbox
                          id={`column-${column}`}
                          checked={reportConfig.selectedColumns.includes(column)}
                          onCheckedChange={(checked) => 
                            handleMultiSelectChange('selectedColumns', column, !!checked)
                          }
                        />
                        <Label htmlFor={`column-${column}`} className="text-sm">
                          {column}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Selected Filters Summary */}
          {(reportConfig.salesReps.length > 0 || 
            reportConfig.vehicleTypes.length > 0 || 
            reportConfig.tagFilters.length > 0 ||
            reportConfig.leadStatuses.length > 0 ||
            reportConfig.dealStages.length > 0) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Active Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {reportConfig.salesReps.map(rep => (
                    <Badge key={rep} className="bg-blue-100 text-blue-800">
                      Rep: {filterOptions.salesReps.find(r => r.value === rep)?.label}
                    </Badge>
                  ))}
                  {reportConfig.vehicleTypes.map(type => (
                    <Badge key={type} className="bg-green-100 text-green-800">
                      Type: {filterOptions.vehicleTypes.find(t => t.value === type)?.label}
                    </Badge>
                  ))}
                  {reportConfig.leadStatuses.map(status => (
                    <Badge key={status} className="bg-yellow-100 text-yellow-800">
                      Lead: {status}
                    </Badge>
                  ))}
                  {reportConfig.dealStages.map(stage => (
                    <Badge key={stage} className="bg-purple-100 text-purple-800">
                      Deal: {stage}
                    </Badge>
                  ))}
                  {reportConfig.tagFilters.length > 0 && (
                    <Badge className="bg-orange-100 text-orange-800">
                      {reportConfig.tagFilters.length} Tag Filter(s)
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {reportConfig.reportId && (
                <span>
                  Report: {availableReports.find(r => r.id === reportConfig.reportId)?.name}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}