import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { Vehicle, CSVRow, CSVImportResult } from '../state/types'
import { getColumnMappings, detectVehicleType, csvRowToRV, csvRowToMH } from '../utils/adapters'
import { validateCSVRow } from '../utils/validators'

interface CSVSmartImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (result: CSVImportResult) => void
}

interface ParsedCSV {
  headers: string[]
  data: CSVRow[]
  vehicleType: 'RV' | 'MH' | 'unknown'
}

interface ColumnMapping {
  csvColumn: string
  vehicleField: string
  confidence: number
}

const STEP_TITLES = ['Upload CSV', 'Map Columns', 'Preview & Validate']

const CSVSmartImport: React.FC<CSVSmartImportProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [parsedCSV, setParsedCSV] = useState<ParsedCSV | null>(null)
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<{
    vehicles: Vehicle[]
    errors: Array<{ row: number; field: string; message: string }>
    willCreate: number
    willUpdate: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setCurrentStep(0)
      setParsedCSV(null)
      setColumnMappings({})
      setPreviewData(null)
      setIsProcessing(false)
    }
  }, [open])

  // Step 1: File Upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const data = results.data as CSVRow[]
        const vehicleType = detectVehicleType(headers)
        
        setParsedCSV({ headers, data, vehicleType })
        
        // Auto-generate column mappings
        const mappings = getColumnMappings(headers, vehicleType === 'unknown' ? 'RV' : vehicleType)
        const initialMappings: Record<string, string> = {}
        
        mappings.forEach(mapping => {
          if (mapping.confidence > 0.5 && mapping.suggestedField) {
            initialMappings[mapping.csvColumn] = mapping.suggestedField
          }
        })
        
        setColumnMappings(initialMappings)
        setCurrentStep(1)
        setIsProcessing(false)
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        setIsProcessing(false)
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1
  })

  // Step 2: Column Mapping
  const handleMappingChange = (csvColumn: string, vehicleField: string) => {
    setColumnMappings(prev => ({
      ...prev,
      [csvColumn]: vehicleField
    }))
  }

  const getAvailableFields = (vehicleType: 'RV' | 'MH'): string[] => {
    if (vehicleType === 'RV') {
      return [
        'vehicleIdentificationNumber', 'brand', 'model', 'modelDate', 'mileage',
        'bodyStyle', 'fuelType', 'vehicleTransmission', 'color', 'price',
        'priceCurrency', 'availability', 'description', 'sellerName',
        'sellerPhone', 'sellerEmail'
      ]
    } else {
      return [
        'askingPrice', 'homeType', 'make', 'model', 'year', 'bedrooms',
        'bathrooms', 'address1', 'address2', 'city', 'state', 'zip9',
        'serialNumber', 'color', 'width1', 'length1', 'sellerFirstName',
        'sellerLastName', 'sellerPhone', 'sellerEmail'
      ]
    }
  }

  // Step 3: Preview and Validation
  const generatePreview = () => {
    if (!parsedCSV) return

    setIsProcessing(true)
    
    const vehicles: Vehicle[] = []
    const errors: Array<{ row: number; field: string; message: string }> = []
    const vehicleType = parsedCSV.vehicleType === 'unknown' ? 'RV' : parsedCSV.vehicleType
    
    parsedCSV.data.slice(0, 20).forEach((row, index) => {
      // Validate row
      const rowErrors = validateCSVRow(row, index + 1, vehicleType)
      errors.push(...rowErrors)
      
      // Convert to vehicle
      try {
        let vehicle: Partial<Vehicle>
        
        if (vehicleType === 'RV') {
          vehicle = csvRowToRV(row, columnMappings)
        } else {
          vehicle = csvRowToMH(row, columnMappings)
        }
        
        if (vehicle && Object.keys(vehicle).length > 2) { // More than just type and status
          vehicles.push({
            ...vehicle,
            id: `import-${index}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Vehicle)
        }
      } catch (error) {
        errors.push({
          row: index + 1,
          field: 'general',
          message: 'Failed to convert row to vehicle'
        })
      }
    })
    
    setPreviewData({
      vehicles,
      errors,
      willCreate: vehicles.length,
      willUpdate: 0 // For now, assume all are new
    })
    
    setCurrentStep(2)
    setIsProcessing(false)
  }

  // Complete import
  const handleComplete = () => {
    if (!previewData || !parsedCSV) return

    setIsProcessing(true)
    
    // Process all rows, not just preview
    const allVehicles: Vehicle[] = []
    const allErrors: Array<{ row: number; field: string; message: string }> = []
    const vehicleType = parsedCSV.vehicleType === 'unknown' ? 'RV' : parsedCSV.vehicleType
    
    parsedCSV.data.forEach((row, index) => {
      const rowErrors = validateCSVRow(row, index + 1, vehicleType)
      allErrors.push(...rowErrors)
      
      try {
        let vehicle: Partial<Vehicle>
        
        if (vehicleType === 'RV') {
          vehicle = csvRowToRV(row, columnMappings)
        } else {
          vehicle = csvRowToMH(row, columnMappings)
        }
        
        if (vehicle && Object.keys(vehicle).length > 2) {
          allVehicles.push({
            ...vehicle,
            id: `import-${Date.now()}-${index}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Vehicle)
        }
      } catch (error) {
        allErrors.push({
          row: index + 1,
          field: 'general',
          message: 'Failed to convert row to vehicle'
        })
      }
    })
    
    const result: CSVImportResult = {
      vehicles: allVehicles,
      errors: allErrors,
      willCreate: allVehicles.length,
      willUpdate: 0
    }
    
    onComplete(result)
    onOpenChange(false)
    setIsProcessing(false)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your inventory CSV file, or click to browse
              </p>
              <Button variant="outline">
                Choose File
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>CSV files with headers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>RV inventory (VIN, Make, Model, Price, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manufactured Home inventory (Serial, Make, Address, etc.)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 1:
        if (!parsedCSV) return null
        
        const availableFields = getAvailableFields(parsedCSV.vehicleType === 'unknown' ? 'RV' : parsedCSV.vehicleType)
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Map CSV Columns to Fields</h3>
                <p className="text-sm text-muted-foreground">
                  Detected {parsedCSV.data.length} rows • Vehicle type: {parsedCSV.vehicleType === 'unknown' ? 'Auto-detect' : parsedCSV.vehicleType}
                </p>
              </div>
              <Badge variant="outline">
                {Object.keys(columnMappings).length} mapped
              </Badge>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CSV Column</TableHead>
                    <TableHead>Sample Data</TableHead>
                    <TableHead>Map to Field</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedCSV.headers.map((header) => {
                    const sampleValue = parsedCSV.data[0]?.[header] || ''
                    const mappings = getColumnMappings([header], parsedCSV.vehicleType === 'unknown' ? 'RV' : parsedCSV.vehicleType)
                    const confidence = mappings[0]?.confidence || 0
                    
                    return (
                      <TableRow key={header}>
                        <TableCell className="font-medium">{header}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {sampleValue}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={columnMappings[header] || ''}
                            onValueChange={(value) => handleMappingChange(header, value)}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select field..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No mapping</SelectItem>
                              {availableFields.map((field) => (
                                <SelectItem key={field} value={field}>
                                  {field}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {confidence > 0 && (
                            <Badge variant={confidence > 0.8 ? 'default' : confidence > 0.5 ? 'secondary' : 'outline'}>
                              {Math.round(confidence * 100)}%
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={generatePreview}
                disabled={Object.keys(columnMappings).length === 0}
              >
                Preview Import
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 2:
        if (!previewData) return null
        
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{previewData.willCreate}</div>
                  <p className="text-sm text-muted-foreground">Will Create</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{previewData.willUpdate}</div>
                  <p className="text-sm text-muted-foreground">Will Update</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{previewData.errors.length}</div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                </CardContent>
              </Card>
            </div>
            
            {previewData.errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Validation Errors
                  </CardTitle>
                  <CardDescription>
                    These rows have issues that need to be resolved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {previewData.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Row {error.row}:</span> {error.message}
                      </div>
                    ))}
                    {previewData.errors.length > 10 && (
                      <p className="text-sm text-muted-foreground">
                        ...and {previewData.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Preview (First 20 rows)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Identifier</TableHead>
                        <TableHead>Make/Brand</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.vehicles.map((vehicle, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant="outline">{vehicle.type}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {vehicle.type === 'RV' 
                              ? (vehicle as any).vehicleIdentificationNumber?.slice(-8) 
                              : (vehicle as any).serialNumber?.slice(-8)
                            }
                          </TableCell>
                          <TableCell>
                            {vehicle.type === 'RV' ? (vehicle as any).brand : (vehicle as any).make}
                          </TableCell>
                          <TableCell>
                            {(vehicle as any).model}
                          </TableCell>
                          <TableCell>
                            {vehicle.type === 'RV' ? (vehicle as any).modelDate : (vehicle as any).year}
                          </TableCell>
                          <TableCell>
                            ${vehicle.type === 'RV' 
                              ? (vehicle as any).price?.toLocaleString() 
                              : (vehicle as any).askingPrice?.toLocaleString()
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Mapping
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={previewData.vehicles.length === 0}
              >
                Import {previewData.willCreate} Vehicles
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Smart CSV Import</DialogTitle>
          <DialogDescription>
            Import your inventory from a CSV file with intelligent column mapping
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            {STEP_TITLES.map((title, index) => (
              <span 
                key={index}
                className={index <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}
              >
                {title}
              </span>
            ))}
          </div>
          <Progress value={(currentStep + 1) / STEP_TITLES.length * 100} />
        </div>
        
        {/* Step content */}
        <div className="mt-6">
          {isProcessing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Processing...</p>
              </div>
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CSVSmartImport