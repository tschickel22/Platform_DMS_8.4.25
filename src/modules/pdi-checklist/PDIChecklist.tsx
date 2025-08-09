import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, AlertTriangle, Clock, FileText, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react'
import { mockPDI } from '@/mocks/pdiMock'
import { usePDIManagement } from './hooks/usePDIManagement'
import { PDIInspectionForm } from './components/PDIInspectionForm'
import { PDIInspectionDetail } from './components/PDIInspectionDetail'
import { PDITemplateForm } from './components/PDITemplateForm'
import { PDINewInspectionForm } from './components/PDINewInspectionForm'

function PDIInspectionsList() {
  // Use mock data for now - replace with actual hook data when backend is ready
  const inspections = mockPDI.sampleInspections
  const templates = mockPDI.sampleTemplates
  const { createInspection, updateInspection, deleteInspection } = usePDIManagement()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [showInspectionDetail, setShowInspectionDetail] = useState(false)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [showNewInspectionForm, setShowNewInspectionForm] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inspections' | 'templates' | 'analytics'>('dashboard')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

  // Helper function to apply tile filters
  const applyTileFilter = (status: 'all' | 'pending' | 'completed' | 'failed') => {
    setActiveTab('inspections')
    setStatusFilter(status)
  }

  // Helper function to create tile props
  const tileProps = (handler: () => void) => ({
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter inspections based on search and status
  const filteredInspections = inspections
    .filter(inspection =>
      inspection.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(inspection => statusFilter === 'all' || inspection.status.toLowerCase() === statusFilter)

  const handleCreateInspection = () => {
    setSelectedInspection(null)
    setShowInspectionForm(true)
  }

  const handleEditInspection = (inspection: any) => {
    setSelectedInspection(inspection)
    setShowInspectionForm(true)
  }

  const handleViewInspection = (inspection: any) => {
    setSelectedInspection(inspection)
    setShowInspectionDetail(true)
  }

  const handleDeleteInspection = async (inspectionId: string) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      try {
        await deleteInspection(inspectionId)
      } catch (error) {
        console.error('Failed to delete inspection:', error)
      }
    }
  }

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setShowTemplateForm(true)
  }

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template)
    setShowTemplateForm(true)
  }

  return (
    <div className="space-y-8">
      {/* Modals */}
      {showInspectionForm && (
        <PDIInspectionForm
          inspection={selectedInspection}
          onClose={() => setShowInspectionForm(false)}
        />
      )}
      
      {showInspectionDetail && selectedInspection && (
        <PDIInspectionDetail
          inspection={selectedInspection}
          onClose={() => setShowInspectionDetail(false)}
        />
      )}
      
      {showTemplateForm && (
        <PDITemplateForm
          template={selectedTemplate}
          onClose={() => setShowTemplateForm(false)}
        />
      )}
      
      {showNewInspectionForm && (
        <PDINewInspectionForm
          onClose={() => setShowNewInspectionForm(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">PDI Checklist - Home/Vehicle</h1>
            <p className="ri-page-description">
              Manage pre-delivery inspections and quality control for homes and vehicles
            </p>
          </div>
          <Button className="shadow-sm" onClick={() => setShowNewInspectionForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card {...tileProps(() => applyTileFilter('all'))} className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Inspections</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{inspections.length}</div>
            <p className="text-xs text-blue-600">{inspections.filter(i => i.status.toLowerCase() === 'completed').length} completed</p>
          </CardContent>
        </Card>
        <Card {...tileProps(() => applyTileFilter('pending'))} className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{inspections.filter(i => i.status.toLowerCase() === 'pending').length}</div>
            <p className="text-xs text-yellow-600">Active inspections</p>
          </CardContent>
        </Card>
        <Card {...tileProps(() => applyTileFilter('failed'))} className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Open Defects</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{inspections.filter(i => i.status.toLowerCase() === 'failed').length}</div>
            <p className="text-xs text-red-600">{inspections.filter(i => i.status.toLowerCase() === 'failed').length} total defects</p>
          </CardContent>
        </Card>
        <Card {...tileProps(() => applyTileFilter('completed'))} className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Templates</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{templates.length}</div>
            <p className="text-xs text-green-600">{templates.filter(t => t.isActive).length} active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Recent Inspections</CardTitle>
                <CardDescription>Latest inspection activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspections.slice(0, 5).map((inspection) => (
                    <div key={inspection.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{inspection.vehicleId}</p>
                        <p className="text-sm text-muted-foreground">{inspection.inspectorName}</p>
                      </div>
                      <Badge className={getStatusColor(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setShowNewInspectionForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Inspection
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleCreateTemplate}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspections">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Inspections</CardTitle>
              <CardDescription>
                Manage vehicle pre-delivery inspections
              </CardDescription>
              {/* Filter Indicator */}
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    Filtered by: {statusFilter}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => applyTileFilter('all')}>
                    Clear Filter
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInspections.length > 0 ? (
                  filteredInspections.map((inspection) => (
                    <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{inspection.vehicleId}</h3>
                          <Badge className={getStatusColor(inspection.status)}>
                            {inspection.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Inspector: {inspection.inspectorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(inspection.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInspection(inspection)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInspection(inspection)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInspection(inspection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No inspections found</p>
                    <p className="text-sm">
                      {statusFilter !== 'all' 
                        ? `No inspections match the "${statusFilter}" filter`
                        : 'Try adjusting your search criteria'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Manage inspection templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Items: {template.items?.length || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No templates found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Inspection performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">Analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PDIChecklist() {
  return (
    <Routes>
      <Route path="/" element={<PDIInspectionsList />} />
      <Route path="/*" element={<PDIInspectionsList />} />
    </Routes>
  )
}