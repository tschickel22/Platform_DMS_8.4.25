import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleMapBlockData } from '../GoogleMapBlock'

export default function GoogleMapBlockEditor({
  value,
  onChange,
}: {
  value: GoogleMapBlockData
  onChange: (v: GoogleMapBlockData) => void
}) {
  const [draft, setDraft] = useState<GoogleMapBlockData>(value || {})

  const update = (patch: Partial<GoogleMapBlockData>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Address</Label>
        <Input
          placeholder="1600 Amphitheatre Pkwy, Mountain View, CA"
          value={draft.address ?? ''}
          onChange={(e) => update({ address: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Provide either an address <em>or</em> latitude & longitude.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            value={draft.lat ?? ''}
            onChange={(e) => update({ lat: e.target.value === '' ? undefined : Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            value={draft.lng ?? ''}
            onChange={(e) => update({ lng: e.target.value === '' ? undefined : Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Zoom</Label>
          <Input
            type="number"
            min={0}
            max={21}
            value={draft.zoom ?? 14}
            onChange={(e) => update({ zoom: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Height (px)</Label>
          <Input
            type="number"
            min={120}
            value={draft.height ?? 360}
            onChange={(e) => update({ height: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label>Google Maps API Key (optional)</Label>
        <Input
          placeholder="AIza…"
          value={draft.apiKey ?? ''}
          onChange={(e) => update({ apiKey: e.target.value || undefined })}
        />
      </div>
    </div>
  )
}