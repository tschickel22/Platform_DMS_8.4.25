import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, BarChart3, FileText, Download, TrendingUp, Users, DollarSign, Calendar, X, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { mockReportingSuite } from '@/mocks/reportingSuiteMock'
import { ReportGeneratorForm } from './components/ReportGeneratorForm'
import { ReportDisplayTable } from './components/ReportDisplayTable'

function ReportingSuiteMain() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [showGeneratedReport, setShowGeneratedReport] = useState(false)
  const [generatedReports, setGeneratedReports] = useState<any[]>([])
  const [savedReports, setSavedReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const availableReports = mockReportingSuite.availableReports

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const generateMockReportData = (reportData: any) => {
    return mockReportingSuite.sampleReportResults[reportData.type] || {
      chartType: 'table',
      title: reportData.name,
      data: [],
      summary: {}
    }
  }

  const handleGenerateReport = async (reportData: any) => {
    setLoading(true)
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock report data based on the selected report type
      const mockReportData = generateMockReportData(reportData)
      
      const newReport = {
        id: Math.random().toString(36).substr(2, 9),
        name: reportData.name,
        type: reportData.type,
        data: mockReportData,
        generatedAt: new Date(),
        generatedBy: 'Admin User'
      }
      
      setGeneratedReport(newReport)
      setShowReportGenerator(false)
      setShowGeneratedReport(true)
      setGeneratedReports(prev => [newReport, ...prev])
      
      toast({
        title: 'Report Generated',
        description: 'Your report has been generated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReport = () => {
    setShowReportGenerator(false)
  }

  const handleCloseGeneratedReport = () => {
    setShowGeneratedReport(false)
    setGeneratedReport(null)
  }

  const handleQuickGenerate = (reportId: string) => {
    setLoading(true)
    try {
      const report = availableReports.find(r => r.id === reportId)
      const reportResult = mockReportingSuite.sampleReportResults[reportId]
      
      if (reportResult) {
        const newReport = {
          id: Math.random().toString(36).substr(2, 9),
          name: report.name,
          type: reportId,
          data: reportResult,
          generatedAt: new Date(),
          generatedBy: 'Admin User'
        }
        
        setGeneratedReport(newReport)
        setShowGeneratedReport(true)
        setGeneratedReports(prev => [newReport, ...prev])
        
        toast({
          title: 'Report Generated',
          description: 'Your report has been generated successfully.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = mockReportingSuite.availableReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Report Generator Modal */}
      {showReportGenerator && (
        <ReportGeneratorForm
          onGenerate={handleGenerateReport}
          onCancel={handleCancelReport}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Reporting Suite</h1>
            <p className="ri-page-description">
              Generate comprehensive reports and analytics across all modules
            </p>
          </div>
          <Button onClick={() => setShowReportGenerator(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Available Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockReportingSuite.availableReports.length}</div>
            <p className="text-xs text-blue-600">
              Report templates
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Generated Today</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{savedReports.length}</div>
            <p className="text-xs text-green-600">
              Reports created
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockReportingSuite.scheduledReports.length}</div>
            <p className="text-xs text-purple-600">
              Automated reports
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Export Downloads</CardTitle>
            <Download className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">156</div>
            <p className="text-xs text-orange-600">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Widgets */}
          <div className="grid gap-6 md:grid-cols-2">
            {mockReportingSuite.dashboardWidgets.map((widget) => (
              <Card key={widget.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{widget.title}</CardTitle>
                  <CardDescription>
                    Based on {widget.reportId} data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {widget.title} visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {mockReportingSuite.reportCategories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Available Reports */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card 
                key={report.id} 
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    
                    <Badge variant="outline">{report.category}</Badge>
                    
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => handleQuickGenerate(report.id)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Generator Modal */}
          {showReportGenerator && (
            <ReportGeneratorForm
              onGenerate={handleGenerateReport}
              onCancel={handleCancelReport}
            />
          )}

          {/* Generated Report Display */}
          {showGeneratedReport && generatedReport && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{generatedReport.name || generatedReport.data?.title}</CardTitle>
                      <CardDescription>
                        Generated on {formatDateTime(generatedReport.generatedAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCloseGeneratedReport}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Report Content */}
                  {generatedReport.data?.chartType === 'numberCard' && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {generatedReport.data.data.map((item: any, index: number) => (
                        <Card key={index} className="shadow-sm">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                <p className="text-2xl font-bold">{item.value}</p>
                                {item.trend && (
                                  <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {item.trend}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {generatedReport.data?.chartType === 'bar' && (
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>{generatedReport.data.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedReport.data.data.map((item: any, index: number) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">{item.label}</span>
                                <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <div
                                  className="bg-primary h-3 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${(item.value / Math.max(...generatedReport.data.data.map((d: any) => d.value))) * 100}%`,
                                    backgroundColor: item.color || '#3b82f6'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {generatedReport.data?.chartType === 'pie' && (
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>{generatedReport.data.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            {generatedReport.data.data.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-4 h-4 rounded-full" 
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm">{item.label}</span>
                                </div>
                                <span className="text-sm font-bold">{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-primary mb-2">
                                {generatedReport.data.data.reduce((sum: number, item: any) => sum + item.value, 0)}
                              </div>
                              <div className="text-sm text-muted-foreground">Total Items</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {generatedReport.data?.chartType === 'line' && (
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>{generatedReport.data.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-end space-x-2 h-64">
                            {generatedReport.data.data.map((item: any, index: number) => {
                              const maxValue = Math.max(...generatedReport.data.data.map((d: any) => d.value))
                              const height = (item.value / maxValue) * 100
                              
                              return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div
                                    className="w-full bg-primary rounded-t transition-all duration-300"
                                    style={{ 
                                      height: `${height}%`,
                                      backgroundColor: item.color || '#3b82f6'
                                    }}
                                    title={`${item.label}: ${item.value}`}
                                  />
                                  <div className="text-xs text-muted-foreground mt-2 text-center">
                                    {item.label}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Report Summary */}
                  {generatedReport.data?.summary && (
                    <Card className="shadow-sm bg-muted/30">
                      <CardHeader>
                        <CardTitle>Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          {Object.entries(generatedReport.data.summary).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {typeof value === 'number' && key.toLowerCase().includes('rate') 
                                  ? `${value}%` 
                                  : typeof value === 'number' && (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('value'))
                                  ? formatCurrency(value as number)
                                  : value?.toString()}
                              </div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Generated Reports ({generatedReports.length})</h3>
              <p className="text-sm text-muted-foreground">
                View and manage previously generated reports
              </p>
            </div>
            <Button onClick={() => setShowReportGenerator(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Report
            </Button>
          </div>

          {generatedReports.length > 0 ? (
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <Card key={report.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{report.name}</h4>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Generated on {formatDateTime(report.generatedAt)} by {report.generatedBy}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGeneratedReport(report)
                            setShowGeneratedReport(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Generated Reports</h3>
                <p className="text-muted-foreground text-center">
                  Generated reports will appear here after you create them
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automatically generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportingSuite.scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.frequency} • Next run: {new Date(report.nextRun).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={report.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {report.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ReportingSuite() {
  return (
    <Routes>
      <Route path="/" element={<ReportingSuiteMain />} />
      <Route path="/*" element={<ReportingSuiteMain />} />
    </Routes>
  )
}