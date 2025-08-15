import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Vehicle } from '@/types'

export interface CSVImportProps {
  onImport: (vehicles: Partial<Vehicle>[]) => void
  onCancel: () => void
}

export function CSVImport({ onImport, onCancel }: CSVImportProps) {
  const [raw, setRaw] = useState('')
  const parseCSV = (text: string): Partial<Vehicle>[] => {
    const lines = text.trim().split(/\r?\n/)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const out: Partial<Vehicle>[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim())
      if (!cols.length || !cols.some(Boolean)) continue
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => { row[h] = cols[idx] ?? '' })
      out.push({
        vin: row['vin'] || '',
        make: row['make'] || '',
        model: row['model'] || '',
        year: row['year'] ? Number(row['year']) : undefined,
        price: row['price'] ? Number(row['price']) : undefined,
        location: row['location'] || ''
      })
    }
    return out
  }
  const handleImport = () => onImport(parseCSV(raw))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader><CardTitle>Import Vehicles (CSV)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv">Paste CSV (first row = headers)</Label>
            <Textarea id="csv" rows={10} value={raw} onChange={(e) => setRaw(e.target.value)}
              placeholder="vin,year,make,model,price,location&#10;1HGB...,2024,Forest River,Georgetown,125000,Lot A" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={handleImport} disabled={!raw.trim()}>Import</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}