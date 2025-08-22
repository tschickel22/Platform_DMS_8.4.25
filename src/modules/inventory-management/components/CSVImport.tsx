import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Eye,
  X
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { VehicleInventory } from '../types'
import { useInventoryManagement } from '../hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'

interface CSVImportProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: (imported: VehicleInventory[]) => void
}

interface ImportResult {
  success: VehicleInventory[]
  errors: Array<{ row: number; error: string; data: any }>
  warnings: Array<{ row: number; warning: string; data: any }>
}

export default function CSVImport({ isOpen, onClose, onImportComplete }: CSVImportProps) {
  const { toast } = useToast()
  const { createVehicle } = useInventoryManagement()
  
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0]
    if (csvFile && csvFile.type === 'text/csv') {
      setFile(csvFile)
      setStep('preview')
      previewImport(csvFile)
    } else {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV file',
        variant: 'destructive'
      })
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  const previewImport = async (csvFile: File) => {
    try {
      const text = await csvFile.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const result: ImportResult = {
        success: [],
        errors: [],
        warnings: []
      }

      // Process each row
      for (let i = 1; i < Math.min(lines.length, 6); i++) { // Preview first 5 rows
        const values = lines[i].split(',').map(v => v.trim())
        const rowData: any = {}
        
        headers.forEach((header, index) => {
          rowData[header] = values[index]
        })

        try {
          const vehicle = mapCsvRowToVehicle(rowData, i + 1)
          result.success.push(vehicle)
        } catch (error) {
          result.errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: rowData
          })
        }
      }

      setImportResult(result)
    } catch (error) {
      toast({
        title: 'Preview Failed',
        description: 'Failed to preview CSV file',
        variant: 'destructive'
      })
    }
  }

  const mapCsvRowToVehicle = (row: any, rowNumber: number): VehicleInventory => {
    // Validate required fields
    if (!row.title && !row.make && !row.model) {
      throw new Error('Missing required fields: title or make/model')
    }

    const vehicle: VehicleInventory = {
      id: `imp-${Date.now()}-${rowNumber}`,
      listingType: (row.listingType || row.type || 'rv').toLowerCase() as 'rv' | 'manufactured_home',
      inventoryId: row.inventoryId || row.stockNumber || `INV-${rowNumber}`,
      title: row.title || `${row.year} ${row.make} ${row.model}`,
      year: parseInt(row.year) || new Date().getFullYear(),
      make: row.make || '',
      model: row.model || '',
      vin: row.vin || row.VIN || '',
      condition: (row.condition || 'used').toLowerCase() as 'new' | 'used' | 'certified',
      status: (row.status || 'available').toLowerCase() as 'available' | 'pending' | 'sold' | 'reserved',
      salePrice: parseFloat(row.salePrice) || undefined,
      rentPrice: parseFloat(row.rentPrice) || undefined,
      cost: parseFloat(row.cost) || undefined,
      offerType: (row.offerType || 'for_sale').toLowerCase() as 'for_sale' | 'for_rent' | 'both',
      description: row.description || '',
      location: {
        city: row.city || row['location.city'] || '',
        state: row.state || row['location.state'] || '',
        postalCode: row.postalCode || row['location.postalCode'] || ''
      },
      media: {
        primaryPhoto: row.primaryPhoto || '',
        photos: row.photos ? row.photos.split(';').filter(Boolean) : []
      },
      features: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add type-specific fields
    if (vehicle.listingType === 'rv') {
      vehicle.sleeps = parseInt(row.sleeps) || undefined
      vehicle.length = parseFloat(row.length) || undefined
      vehicle.slides = parseInt(row.slides) || undefined
      vehicle.fuelType = row.fuelType || undefined
      vehicle.engine = row.engine || undefined
      vehicle.transmission = row.transmission || undefined
    } else if (vehicle.listingType === 'manufactured_home') {
      vehicle.bedrooms = parseInt(row.bedrooms) || undefined
      vehicle.bathrooms = parseFloat(row.bathrooms) || undefined
      vehicle.dimensions = {
        sqft: parseInt(row.sqft) || parseInt(row.squareFeet) || undefined,
        width_ft: parseFloat(row.width) || undefined,
        length_ft: parseFloat(row.length) || undefined,
        sections: parseInt(row.sections) || undefined
      }
    }

    return vehicle
  }

  const handleImport = async () => {
    if (!file) return

    try {
      setImporting(true)
      setStep('importing')
      setProgress(0)

      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const result: ImportResult = {
        success: [],
        errors: [],
        warnings: []
      }

      // Process all rows
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const rowData: any = {}
        
        headers.forEach((header, index) => {
          rowData[header] = values[index]
        })

        try {
          const vehicle = mapCsvRowToVehicle(rowData, i + 1)
          await createVehicle(vehicle)
          result.success.push(vehicle)
        } catch (error) {
          result.errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: rowData
          })
        }

        // Update progress
        setProgress((i / (lines.length - 1)) * 100)
      }

      setImportResult(result)
      setStep('complete')
      
      if (result.success.length > 0) {
        onImportComplete(result.success)
        toast({
          title: 'Import Complete',
          description: `Successfully imported ${result.success.length} inventory items`
        })
      }
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import CSV file',
        variant: 'destructive'
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'title', 'listingType', 'year', 'make', 'model', 'vin', 'condition', 'status',
      'salePrice', 'rentPrice', 'cost', 'offerType', 'description',
      'city', 'state', 'postalCode',
      'sleeps', 'length', 'slides', 'fuelType', 'engine', 'transmission',
      'bedrooms', 'bathrooms', 'sqft', 'width', 'sections',
      'primaryPhoto', 'photos'
    ]
    
    const sampleData = [
      '2023 Forest River Cherokee', 'rv', '2023', 'Forest River', 'Cherokee', 'FR123456789', 'new', 'available',
      '45000', '', '38000', 'for_sale', 'Beautiful travel trailer perfect for family camping',
      'Phoenix', 'AZ', '85001',
      '4', '28', '1', 'gasoline', 'Ford V10', 'automatic',
      '', '', '', '', '',
      'https://example.com/photo1.jpg', 'https://example.com/photo1.jpg;https://example.com/photo2.jpg'
    ]

    const csvContent = [headers, sampleData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'inventory-import-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setFile(null)
    setImportResult(null)
    setProgress(0)
    setStep('upload')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Inventory from CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import inventory items. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'upload' && (
            <>
              {/* Template Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CSV Template</CardTitle>
                  <CardDescription>
                    Download the template to see the required format and column headers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upload CSV File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    {isDragActive ? (
                      <p className="text-lg">Drop the CSV file here...</p>
                    ) : (
                      <>
                        <p className="text-lg mb-2">Drag & drop a CSV file here</p>
                        <p className="text-muted-foreground">or click to select a file</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 'preview' && importResult && (
            <>
              {/* Preview Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Import Preview</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {importResult.success.length} valid
                    </Badge>
                    {importResult.errors.length > 0 && (
                      <Badge variant="destructive">
                        {importResult.errors.length} errors
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Success Preview */}
                {importResult.success.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Valid Items ({importResult.success.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {importResult.success.slice(0, 5).map((vehicle, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium">{vehicle.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </p>
                            </div>
                            <Badge variant="outline">{vehicle.listingType}</Badge>
                          </div>
                        ))}
                        {importResult.success.length > 5 && (
                          <p className="text-sm text-muted-foreground text-center">
                            ... and {importResult.success.length - 5} more items
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Errors */}
                {importResult.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Errors ({importResult.errors.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {importResult.errors.map((error, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertDescription>
                              <strong>Row {error.row}:</strong> {error.error}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={resetImport}>
                  <X className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleImport}
                    disabled={importResult.success.length === 0}
                  >
                    Import {importResult.success.length} Items
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 'importing' && (
            <div className="space-y-4">
              <div className="text-center">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Importing Inventory</h3>
                <p className="text-muted-foreground">Please wait while we import your inventory items...</p>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <p className="text-center text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {step === 'complete' && importResult && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Import Complete</h3>
                <p className="text-muted-foreground">
                  Successfully imported {importResult.success.length} inventory items
                </p>
              </div>

              {importResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {importResult.errors.length} items failed to import due to errors
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-center pt-4">
                <Button onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}