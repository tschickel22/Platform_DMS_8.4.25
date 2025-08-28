import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

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
  const [importWarnings, setImportWarnings] = useState<string[]>([])
  const [duplicateCheck, setDuplicateCheck] = useState<any[]>([])
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'mapping' | 'processing'>('upload')
  const [importProgress, setImportProgress] = useState(0)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
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

    const csvContent = [
      sampleFields.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sample_${module}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const detectDuplicates = (newData: any[]) => {
    const duplicates: any[] = []
    const existingEmails = new Set(data.map(item => item.email?.toLowerCase()).filter(Boolean))
    const existingNames = new Set(data.map(item => 
      module === 'accounts' ? item.name?.toLowerCase() : `${item.firstName} ${item.lastName}`.toLowerCase()
    ).filter(Boolean))

    newData.forEach((item, index) => {
      const email = item.email?.toLowerCase()
      const name = module === 'accounts' 
        ? item.name?.toLowerCase() 
        : `${item.firstName} ${item.lastName}`.toLowerCase()

      if (email && existingEmails.has(email)) {
        duplicates.push({ index, field: 'email', value: item.email, item })
      }
      if (name && existingNames.has(name)) {
        duplicates.push({ index, field: 'name', value: name, item })
      }
    })

    return duplicates
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

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      
      const errors: string[] = []
      const warnings: string[] = []
      const validData: any[] = []

      // Auto-detect column mapping
      const mapping: Record<string, string> = {}
      headers.forEach((header, index) => {
        const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, '')
        const fieldMap = module === 'accounts' ? {
          'name': 'name',
          'accountname': 'name',
          'companyname': 'name',
          'email': 'email',
          'emailaddress': 'email',
          'phone': 'phone',
          'phonenumber': 'phone',
          'address': 'address',
          'website': 'website',
          'industry': 'industry'
        } : {
          'firstname': 'firstName',
          'lastname': 'lastName',
          'email': 'email',
          'emailaddress': 'email',
          'phone': 'phone',
          'phonenumber': 'phone',
          'title': 'title',
          'jobtitle': 'title',
          'department': 'department',
          'accountid': 'accountId'
        }
        
        if (fieldMap[normalizedHeader]) {
          mapping[index] = fieldMap[normalizedHeader]
        }
      })
      setColumnMapping(mapping)
      lines.slice(1).forEach((line, index) => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim())
        
        if (module === 'accounts') {
          if (!values[0]) {
            errors.push(`Row ${index + 1}: Account name is required`)
          } else {
            validData.push({
              name: values[0],
              email: values[1] || '',
              phone: values[2] || '',
              address: values[3] || '',
              website: values[4] || '',
              industry: values[5] || ''
            })
          }
        } else {
          if (!values[0] || !values[1]) {
            errors.push(`Row ${index + 1}: First name and last name are required`)
          } else {
            const item = {
              firstName: values[0],
              lastName: values[1],
              email: values[2] || '',
              phone: values[3] || '',
              accountId: values[4] || undefined
            }
            
            // Validate email format if provided
            if (item.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
              warnings.push(`Row ${index + 1}: Invalid email format for ${item.firstName} ${item.lastName}`)
            }
            
            validData.push({
              firstName: values[0],
              lastName: values[1],
              email: values[2] || '',
              phone: values[3] || '',
              accountId: values[4] || undefined
            })
          }
        }
      })

      // Check for duplicates
      const duplicates = detectDuplicates(validData)
      setDuplicateCheck(duplicates)

      setImportData(validData)
      setImportErrors(errors)
      setImportWarnings(warnings)
      setImportStep('preview')
    }
    
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (importData.length > 0) {
      setImportStep('processing')
      setImportProgress(0)
      
      // Simulate processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      try {
        onImport(importData)
        toast({
          title: 'Import Successful',
          description: `Successfully imported ${importData.length} ${module}.`
        })
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'An error occurred during import. Please try again.',
          variant: 'destructive'
        })
        setImportStep('preview')
        return
      }
      
      setShowImportDialog(false)
      resetImportState()
    }
  }

  const resetImportState = () => {
    setImportData([])
    setImportErrors([])
    setImportWarnings([])
    setDuplicateCheck([])
    setImportStep('upload')
    setImportProgress(0)
    setColumnMapping({})
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

    // Enhanced export with more fields
    const csvContent = [
      sampleFields.join(','),
      ...data.map(item => {
        if (module === 'accounts') {
          return [
            item.name, 
            item.email || '', 
            item.phone || '', 
            item.address || '', 
            item.website || '', 
            item.industry || '',
            item.status || '',
            item.ownerId || '',
            (item.tags || []).join(';'),
            item.createdAt,
            item.updatedAt
          ]
            .map(cell => `"${cell || ''}"`)
            .join(',')
        } else {
          return [
            item.firstName, 
            item.lastName, 
            item.email || '', 
            item.phone || '', 
            item.accountId || '',
            item.title || '',
            item.department || '',
            item.preferredContactMethod || '',
            (item.tags || []).join(';'),
            item.createdAt,
            item.updatedAt
          ]
            .map(cell => `"${cell || ''}"`)
            .join(',')
        }
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import {module === 'accounts' ? 'Accounts' : 'Contacts'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Step 1: Upload */}
            {importStep === 'upload' && (
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
            )}

            {/* Step 2: Preview & Validation */}
            {importStep === 'preview' && (
              <>
                {/* Import Errors */}
                {importErrors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                        Import Errors ({importErrors.length})
                      </CardTitle>
                      <CardDescription>
                        These rows have errors and will not be imported
                      </CardDescription>
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

                {/* Import Warnings */}
                {importWarnings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                        Import Warnings ({importWarnings.length})
                      </CardTitle>
                      <CardDescription>
                        These issues were found but won't prevent import
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-32 overflow-y-auto">
                        <ul className="text-sm text-amber-600 space-y-1">
                          {importWarnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Duplicate Check */}
                {duplicateCheck.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                        Potential Duplicates ({duplicateCheck.length})
                      </CardTitle>
                      <CardDescription>
                        These records may already exist in your system
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {duplicateCheck.map((dup, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-amber-50 rounded">
                            <span className="text-sm">
                              Row {dup.index + 1}: {dup.field} "{dup.value}" may be duplicate
                            </span>
                            <Badge variant="outline" className="text-amber-700">
                              {dup.field}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Import Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Import Preview
                  </CardTitle>
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

                {/* Import Actions */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => {
                    setImportStep('upload')
                    resetImportState()
                  }}>
                    <X className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                  <Button 
                    onClick={handleImport} 
                    disabled={importData.length === 0 || importErrors.length > 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Import {importData.length} {module}
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Processing */}
            {importStep === 'processing' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Import</CardTitle>
                  <CardDescription>
                    Importing {importData.length} {module}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={importProgress} className="h-2" />
                  <div className="text-center text-sm text-muted-foreground">
                    {importProgress}% complete
                  </div>
                </CardContent>
              </Card>
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