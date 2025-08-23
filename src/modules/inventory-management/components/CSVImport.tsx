import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, AlertCircle } from 'lucide-react'

interface CSVImportProps {
  onImport: (vehicles: any[]) => Promise<void>
  onCancel: () => void
}

export function CSVImport({ onImport, onCancel }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row')
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const vehicles = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const vehicle: any = {}

        headers.forEach((header, index) => {
          const value = values[index] || ''
          
          // Map common CSV headers to vehicle properties
          switch (header) {
            case 'year':
            case 'model year':
              vehicle.year = parseInt(value) || new Date().getFullYear()
              break
            case 'make':
            case 'manufacturer':
              vehicle.make = value
              break
            case 'model':
              vehicle.model = value
              break
            case 'vin':
            case 'vehicle identification number':
              vehicle.vin = value
              break
            case 'serial number':
            case 'serial':
              vehicle.serialNumber = value
              break
            case 'price':
            case 'sale price':
            case 'asking price':
              vehicle.price = parseFloat(value) || 0
              break
            case 'rent price':
            case 'rental price':
              vehicle.rentPrice = parseFloat(value) || 0
              break
            case 'type':
            case 'vehicle type':
              vehicle.type = value.toLowerCase().includes('rv') ? 'rv' : 'manufactured_home'
              break
            case 'status':
              vehicle.status = value || 'available'
              break
            case 'condition':
              vehicle.condition = value || 'used'
              break
            case 'bedrooms':
            case 'beds':
              vehicle.bedrooms = parseInt(value) || 0
              break
            case 'bathrooms':
            case 'baths':
              vehicle.bathrooms = parseFloat(value) || 0
              break
            case 'sleeps':
              vehicle.sleeps = parseInt(value) || 0
              break
            case 'length':
              vehicle.length = parseFloat(value) || 0
              break
            case 'slides':
              vehicle.slides = parseInt(value) || 0
              break
            case 'city':
              vehicle.city = value
              break
            case 'state':
              vehicle.state = value
              break
            case 'description':
              vehicle.description = value
              break
            default:
              // Store any other fields as custom data
              if (value) {
                vehicle[header] = value
              }
          }
        })

        if (vehicle.make || vehicle.model || vehicle.vin || vehicle.serialNumber) {
          vehicles.push(vehicle)
        }
      }

      if (vehicles.length === 0) {
        throw new Error('No valid vehicle records found in CSV file')
      }

      await onImport(vehicles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Inventory from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload CSV File</CardTitle>
              <CardDescription>
                Select a CSV file containing your inventory data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="space-y-2">
                    <label htmlFor="csv-file" className="cursor-pointer">
                      <span className="text-sm font-medium">Choose CSV file</span>
                      <input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Supports .csv files up to 10MB
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || loading}
            >
              {loading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}