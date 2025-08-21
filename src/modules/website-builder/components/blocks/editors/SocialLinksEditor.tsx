import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { SocialLinksBlockData, SocialPlatform, SocialLink } from '../SocialLinksBlock'

const platforms: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'website', label: 'Website' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'github', label: 'GitHub' },
  { value: 'twitch', label: 'Twitch' },
]

export default function SocialLinksEditor({
  value,
  onChange,
}: {
  value: SocialLinksBlockData
  onChange: (v: SocialLinksBlockData) => void
}) {
  const [draft, setDraft] = useState<SocialLinksBlockData>(value || { links: [] })

  const update = (patch: Partial<SocialLinksBlockData>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    onChange(next)
  }

  const updateLink = (idx: number, patch: Partial<SocialLink>) => {
    const links = [...(draft.links ?? [])]
    links[idx] = { ...links[idx], ...patch }
    update({ links })
  }

  const addLink = () => {
    update({ links: [...(draft.links ?? []), { platform: 'website', url: '' }] })
  }

  const removeLink = (idx: number) => {
    const links = [...(draft.links ?? [])]
    links.splice(idx, 1)
    update({ links })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={draft.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Follow us"
        />
      </div>

      <div className="space-y-3">
        {(draft.links ?? []).map((link, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <Label>Platform</Label>
              <Select
                value={link.platform}
                onValueChange={(v) => updateLink(idx, { platform: v as SocialPlatform })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6">
              <Label>URL / Handle</Label>
              <Input
                value={link.url}
                onChange={(e) => updateLink(idx, { url: e.target.value })}
                placeholder="https://… or username"
              />
            </div>
            <div className="col-span-2">
              <Label>Label</Label>
              <Input
                value={link.label ?? ''}
                onChange={(e) => updateLink(idx, { label: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="col-span-1">
              <Button variant="outline" className="w-full" onClick={() => removeLink(idx)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={addLink}>Add Link</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Layout</Label>
          <Select
            value={draft.layout ?? 'row'}
            onValueChange={(v) => update({ layout: v as 'row' | 'grid' })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Row</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Align</Label>
          <Select
            value={draft.align ?? 'left'}
            onValueChange={(v) => update({ align: v as 'left' | 'center' | 'right' })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Size</Label>
          <Select
            value={draft.size ?? 'md'}
            onValueChange={(v) => update({ size: v as 'sm' | 'md' | 'lg' })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}