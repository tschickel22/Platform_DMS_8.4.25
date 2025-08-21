import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MultiImageGalleryData, GalleryImage } from '../MultiImageGalleryBlock'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'

export default function MultiImageGalleryEditor({
  value,
  onChange,
}: {
  value: MultiImageGalleryData
  onChange: (v: MultiImageGalleryData) => void
}) {
  const [draft, setDraft] = useState<MultiImageGalleryData>(value || { images: [] })

  const update = (patch: Partial<MultiImageGalleryData>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    onChange(next)
  }

  const updateImage = (idx: number, patch: Partial<GalleryImage>) => {
    const images = [...(draft.images ?? [])]
    images[idx] = { ...images[idx], ...patch }
    update({ images })
  }

  const addImage = () => update({ images: [...(draft.images ?? []), { src: '', alt: '' }] })
  const removeImage = (idx: number) => {
    const images = [...(draft.images ?? [])]
    images.splice(idx, 1)
    update({ images })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={draft.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Gallery"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Columns</Label>
          <Select
            value={String(draft.columns ?? 3)}
            onValueChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Aspect</Label>
          <Select
            value={draft.aspect ?? 'auto'}
            onValueChange={(v) => update({ aspect: v as any })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="video">16:9 Video</SelectItem>
              <SelectItem value="wide">3:2 Wide</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {(draft.images ?? []).map((img, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-7">
              <Label>Image URL</Label>
              <Input
                value={img.src}
                onChange={(e) => updateImage(idx, { src: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="col-span-3">
              <Label>Alt</Label>
              <Input
                value={img.alt ?? ''}
                onChange={(e) => updateImage(idx, { alt: e.target.value })}
                placeholder="Description"
              />
            </div>
            <div className="col-span-1">
              <Button variant="outline" className="w-full" onClick={() => removeImage(idx)}>
                Remove
              </Button>
            </div>
            <div className="col-span-12">
              <Label>Caption</Label>
              <Input
                value={img.caption ?? ''}
                onChange={(e) => updateImage(idx, { caption: e.target.value })}
                placeholder="Optional caption"
              />
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={addImage}>Add Image</Button>
      </div>
    </div>
  )
}