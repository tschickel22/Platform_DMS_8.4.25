import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import Papa from 'papaparse'
import { Upload, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ImportModalProps<T> {
  isOpen: boolean
  onClose: () => void
  onImport: (data: T[]) => void
  schema: { key: string; label: string; required?: boolean; type?: 'string' | 'number' | 'boolean' }[]
  sampleCsvUrl?: string
  title?: string
  description?: string
}

export function ImportModal<T>({
  isOpen,
  onClose,
  onImport,
  schema,
  sampleCsvUrl,
  title = 'Import Data',
  description = 'Upload a CSV file to import new records or update existing ones.',
}: ImportModalProps<T>) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<T[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files) {
      const selectedFile = event.target.files
      if (selectedFile.type !== 'text/csv') {
        setErrors(['Please upload a valid CSV file.'])
        setFile(null)
        setParsedData([])
        return
      }
      setFile(selectedFile)
      setErrors([])
      parseCsv(selectedFile)
    } else {
      setFile(null)
      setParsedData([])
      setErrors([])
    }
  }

  const parseCsv = (file: File) => {
    setIsParsing(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: T[] = []
        const newErrors: string[] = []

        results.data.forEach((row: any, rowIndex) => {
          const rowData: any = {}
          let rowHasError = false

          schema.forEach(field => {
            let value = row[field.key]
            if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
              newErrors.push(`Row ${rowIndex + 1}: Missing required field '${field.label}'`)
              rowHasError = true
            }

            // Type conversion and basic validation
            if (value !== undefined && value !== null) {
              switch (field.type) {
                case 'number':
                  value = parseFloat(value)
                  if (isNaN(value)) {
                    newErrors.push(`Row ${rowIndex + 1}: Invalid number for '${field.label}'`)
                    rowHasError = true
                  }
                  break
                case 'boolean':
                  value = String(value).toLowerCase() === 'true' || String(value) === '1'
                  break
                case 'string':
                default:
                  value = String(value).trim()
                  break
              }
            }
            rowData[field.key] = value
          })

          if (!rowHasError) {
            data.push(rowData as T)
          }
        })

        setParsedData(data)
        setErrors(newErrors)
        setIsParsing(false)

        if (newErrors.length > 0) {
          toast({
            title: 'Import Warnings/Errors',
            description: `Found ${newErrors.length} issues in the CSV. Please review.`,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'CSV Parsed',
            description: `${data.length} records ready for import.`,
            variant: 'default',
          })
        }
      },
      error: (err: any) => {
        setErrors([`Failed to parse CSV: ${err.message}`])
        setIsParsing(false)
        toast({
          title: 'CSV Parsing Error',
          description: err.message,
          variant: 'destructive',
        })
      }
    })
  }

  const handleImportConfirm = () => {
    if (parsedData.length > 0 && errors.length === 0) {
      onImport(parsedData)
      toast({
        title: 'Import Started',
        description: `${parsedData.length} records are being imported.`,
        variant: 'default',
      })
      handleClose()
    } else {
      toast({
        title: 'Import Not Possible',
        description: 'Please fix errors or upload a valid CSV before importing.',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    setFile(null)
    setParsedData([])
    setErrors([])
    setIsParsing(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="csv-file" className="sr-only">
              CSV File
            </Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            <Button variant="outline" asChild>
              <a href={sampleCsvUrl} download={`${title.toLowerCase().replace(/\s/g, '_')}_sample.csv`}>
                Download Sample CSV
              </a>
            </Button>
          </div>

          {isParsing && (
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Upload className="h-5 w-5 animate-bounce" />
              <span>Parsing CSV...</span>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Errors found:</strong>
              <ul className="mt-2 list-disc list-inside">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedData.length > 0 && errors.length === 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Preview ({parsedData.length} records)</h4>
              <div className="max-h-60 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {schema.map(field => (
                        <TableHead key={field.key}>{field.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 5).map((row: any, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {schema.map(field => (
                          <TableCell key={field.key}>{String(row[field.key])}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {parsedData.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={schema.length} className="text-center text-muted-foreground">
                          ... {parsedData.length - 5} more rows
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImportConfirm} disabled={parsedData.length === 0 || errors.length > 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}