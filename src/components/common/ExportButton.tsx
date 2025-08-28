import React from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import Papa from 'papaparse'

interface ExportButtonProps<T> {
  data: T[]
  filename: string
  onExport?: () => void
}

export function ExportButton<T>({ data, filename, onExport }: ExportButtonProps<T>) {
  const handleExport = () => {
    onExport?.()

    if (!data || data.length === 0) {
      console.warn('No data to export.')
      return
    }

    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={!data || data.length === 0}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  )
}