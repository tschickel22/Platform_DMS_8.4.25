import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MultiTextBlockData, TextSection } from '../MultiTextBlock'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function MultiTextBlockEditor({
  value,
  onChange,
}: {
  value: MultiTextBlockData
  onChange: (v: MultiTextBlockData) => void
}) {
  const [draft, setDraft] = useState<MultiTextBlockData>(value || { sections: [] })

  const update = (patch: Partial<MultiTextBlockData>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    onChange(next)
  }

  const updateSection = (idx: number, patch: Partial<TextSection>) => {
    const sections = [...(draft.sections ?? [])]
    sections[idx] = { ...sections[idx], ...patch }
    update({ sections })
  }

  const addSection = () => update({ sections: [...(draft.sections ?? []), { heading: '', body: '' }] })
  const removeSection = (idx: number) => {
    const sections = [...(draft.sections ?? [])]
    sections.splice(idx, 1)
    update({ sections })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Label>Title (optional)</Label>
          <Input
            value={draft.title ?? ''}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Details"
          />
        </div>
        <div>
          <Label>Columns</Label>
          <Select
            value={String(draft.columns ?? 2)}
            onValueChange={(v) => update({ columns: Number(v) as 1 | 2 | 3 })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={!!draft.showDividers}
          onCheckedChange={(v) => update({ showDividers: v })}
          id="mtb-dividers"
        />
        <Label htmlFor="mtb-dividers">Show vertical dividers</Label>
      </div>

      <div className="space-y-3">
        {(draft.sections ?? []).map((sec, idx) => (
          <div key={idx} className="rounded-lg border p-3 space-y-2">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Heading</Label>
                <Input
                  value={sec.heading ?? ''}
                  onChange={(e) => updateSection(idx, { heading: e.target.value })}
                />
              </div>
              <div className="col-span-7">
                <Label>Body (HTML or plain text)</Label>
                <Textarea
                  rows={4}
                  value={sec.body ?? ''}
                  onChange={(e) => updateSection(idx, { body: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <Button variant="outline" className="w-full mt-6" onClick={() => removeSection(idx)}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={addSection}>Add Section</Button>
      </div>
    </div>
  )
}