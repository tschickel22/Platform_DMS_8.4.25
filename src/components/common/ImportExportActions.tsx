import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Download, FileText, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Papa from 'papaparse'

interface ImportExportActionsProps {
  module: 'accounts' | 'contacts'
  data: any[]
  onImport: (data: any[]) => void
  sampleFields: string[]
  className?: string
}

export function ImportExportActions({
  module,
  data,
  onImport,
  sampleFields,
  className = ""
}: ImportExportActionsProps) {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState<any[]>([])
  const [importErrors, setImportErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const generateSampleCSV = () => {
    const sampleData = module === 'accounts' 
      ? [
          ['RV World Inc.', 'info@rvworld.com', '(555) 111-2222', '123 Main St, Anytown, USA', 'www.rvworld.com', 'RV Dealership'],
          ['Mobile Home Solutions', 'sales@mhsolutions.com', '(555) 333-4444', '456 Oak Ave, Smallville, USA', 'www.mhsolutions.com', 'Manufactured Home Dealer']
        ]
      : [
          ['John', 'Smith', 'john.smith@email.com', '(555) 123-4567', 'acc-001'],
          ['Jane', 'Doe', 'jane.doe@email.com', '(555) 987-6543', '']
        ]

    const csv = Papa.unparse({
      fields: sampleFields,
      data: sampleData
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sample_${module}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a CSV file.',
        variant: 'destructive'
      })
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = []
        const validData: any[] = []

        results.data.forEach((row: any, index) => {
          // Basic validation
          if (module === 'accounts') {
            if (!row.name || row.name.trim() === '') {
              errors.push(`Row ${index + 1}: Account name is required`)
            } else {
              validData.push({
                name: row.name?.trim(),
                email: row.email?.trim() || '',
                phone: row.phone?.trim() || '',
                address: row.address?.trim() || '',
                website: row.website?.trim() || '',
                industry: row.industry?.trim() || ''
              })
            }
          } else {
            if (!row.firstName || row.firstName.trim() === '' || !row.lastName || row.lastName.trim() === '') {
              errors.push(`Row ${index + 1}: First name and last name are required`)
            } else {
              validData.push({
                firstName: row.firstName?.trim(),
                lastName: row.lastName?.trim(),
                email: row.email?.trim() || '',
                phone: row.phone?.trim() || '',
                accountId: row.accountId?.trim() || undefined
              })
            }
          }
        })

        setImportData(validData)
        setImportErrors(errors)
      },
      error: (error) => {
        toast({
          title: 'Import Error',
          description: `Failed to parse CSV file: ${error.message}`,
          variant: 'destructive'
        })
      }
    })
  }

  const handleImport = () => {
    if (importData.length > 0) {
      onImport(importData)
      setShowImportDialog(false)
      setImportData([])
      setImportErrors([])
      toast({
        title: 'Import Successful',
        description: `Successfully imported ${importData.length} ${module}.`
      })
    }
  }

  const exportData = () => {
    if (data.length === 0) {
      toast({
        title: 'No Data to Export',
        description: `There are no ${module} to export.`,
        variant: 'destructive'
      })
      return
    }

    const csv = Papa.unparse({
      fields: sampleFields,
      data: data.map(item => {
        if (module === 'accounts') {
          return [item.name, item.email, item.phone, item.address, item.website, item.industry]
        } else {
          return [item.firstName, item.lastName, item.email, item.phone, item.accountId || '']
        }
      })
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${module}_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Export Successful',
      description: `Exported ${data.length} ${module} to CSV file.`
    })
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import {module === 'accounts' ? 'Accounts' : 'Contacts'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload CSV File</CardTitle>
                <CardDescription>
                  Upload a CSV file with {module} data. Download the sample file to see the expected format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={generateSampleCSV}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download Sample CSV
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Import Preview */}
            {importData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Import Preview</CardTitle>
                  <CardDescription>
                    {importData.length} {module} ready to import
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="text-sm space-y-1">
                      {importData.slice(0, 5).map((item, index) => (
                        <div key={index} className="p-2 bg-muted rounded">
                          {module === 'accounts' 
                            ? `${item.name} - ${item.email}`
                            : `${item.firstName} ${item.lastName} - ${item.email}`
                          }
                        </div>
                      ))}
                      {importData.length > 5 && (
                        <div className="text-muted-foreground text-center">
                          ... and {importData.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Errors */}
            {importErrors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                    Import Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-sm text-destructive space-y-1">
                      {importErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Actions */}
            {importData.length > 0 && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowImportDialog(false)
                  setImportData([])
                  setImportErrors([])
                }}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>
                  Import {importData.length} {module}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm" onClick={exportData} disabled={data.length === 0}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  )
}