import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, Camera, X, ListTodo } from 'lucide-react'
import { PDIInspection, PDISignoff } from '../types'
import { Vehicle } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PDIInspectionDetailProps {
  inspection: PDIInspection
  vehicles: Vehicle[]
  onAddSignoff: (inspectionId: string, signoffData: Partial<PDISignoff>) => Promise<void>
  onClose: () => void
  onCreateTask?: (inspection: PDIInspection) => void
}

export function PDIInspectionDetail({ 
  inspection, 
  vehicles, 
  onAddSignoff, 
  onClose,
  onCreateTask 
}: PDIInspectionDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'passed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'na':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const vehicle = vehicles.find(v => v.id === inspection.vehicleId)
  const vehicleInfo = vehicle 
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : inspection.vehicleId

  const calculateProgress = () => {
    if (!inspection.items || inspection.items.length === 0) return 0
    const completedItems = inspection.items.filter(item => item.status !== 'pending').length
    return Math.round((completedItems / inspection.items.length) * 100)
  }

  const progress = calculateProgress()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">PDI Inspection Detail</CardTitle>
              <CardDescription>
                {vehicleInfo} - Inspection #{inspection.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {onCreateTask && (
                <Button onClick={() => onCreateTask(inspection)} size="sm" variant="outline">
                  <ListTodo className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inspection Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("ri-badge-status", getStatusColor(inspection.status))}>
              {inspection.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Progress:</span>
              <Progress value={progress} className="w-24" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
          </div>

          {/* Inspection Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="defects">
                Defects
                {inspection.defects.length > 0 && (
                  <Badge className="ml-2 bg-red-50 text-red-700 border-red-200">
                    {inspection.defects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="photos">
                Photos
                {inspection.photos.length > 0 && (
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                    {inspection.photos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Inspection Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <p className="font-medium">{vehicleInfo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Inspector</label>
                  <p className="font-medium">{inspection.inspectorId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Started</label>
                  <p className="font-medium">{formatDate(inspection.startedAt)}</p>
                </div>
                {inspection.completedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed</label>
                    <p className="font-medium">{formatDate(inspection.completedAt)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Template</label>
                  <p className="font-medium">{inspection.template?.name || 'Unknown Template'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Progress</label>
                  <div className="flex items-center space-x-2">
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {inspection.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{inspection.notes}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="checklist" className="space-y-4">
              <h3 className="text-lg font-semibold">Inspection Items</h3>
              
              {inspection.template?.sections.map((section) => (
                <Card key={section.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    {section.description && (
                      <CardDescription>{section.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((templateItem) => {
                        const inspectionItem = inspection.items.find(i => i.templateItemId === templateItem.id)
                        if (!inspectionItem) return null

                        return (
                          <div key={templateItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{templateItem.name}</span>
                                {templateItem.isRequired && (
                                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                    Required
                                  </Badge>
                                )}
                                <Badge className={cn("ri-badge-status text-xs", getItemStatusColor(inspectionItem.status))}>
                                  {inspectionItem.status.toUpperCase()}
                                </Badge>
                              </div>
                              {templateItem.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {templateItem.description}
                                </p>
                              )}
                              {inspectionItem.notes && (
                                <p className="text-sm text-muted-foreground mt-1 bg-muted/20 p-2 rounded-md">
                                  <span className="font-medium">Notes:</span> {inspectionItem.notes}
                                </p>
                              )}
                            </div>
                            <div className="ml-4">
                              {inspectionItem.status === 'passed' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : inspectionItem.status === 'failed' ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-600" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!inspection.template?.sections || inspection.template.sections.length === 0) && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No checklist items available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="defects" className="space-y-4">
              <h3 className="text-lg font-semibold">Defects</h3>
              
              {inspection.defects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500/50" />
                  <p>No defects found</p>
                  <p className="text-sm">This is a good sign!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inspection.defects.map((defect) => (
                    <Card key={defect.id} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{defect.title}</h4>
                            <Badge className={
                              defect.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                              defect.severity === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              defect.severity === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                            }>
                              {defect.severity.toUpperCase()}
                            </Badge>
                            <Badge className={
                              defect.status === 'open' ? 'bg-red-50 text-red-700 border-red-200' :
                              defect.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              defect.status === 'resolved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-green-50 text-green-700 border-green-200'
                            }>
                              {defect.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {defect.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {defect.assignedTo ? (
                              <span>Assigned to: {defect.assignedTo}</span>
                            ) : (
                              <span>Unassigned</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {formatDate(defect.createdAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              <h3 className="text-lg font-semibold">Photos</h3>
              
              {inspection.photos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No photos added</p>
                  <p className="text-sm">Photos will be added during the inspection</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {inspection.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || 'Inspection photo'} 
                        className="h-40 w-full object-cover rounded-md"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 truncate">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onCreateTask && (
              <Button variant="outline" onClick={() => onCreateTask(inspection)}>
                <ListTodo className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PDIInspectionDetail