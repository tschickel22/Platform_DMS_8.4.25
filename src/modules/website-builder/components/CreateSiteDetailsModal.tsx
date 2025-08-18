import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

// Lightweight structural type so we don't depend on exact utils path
export type WebsiteTemplateLite = {
  id: string
  name: string
  description?: string
  previewImage?: string
  category?: string
}

interface CreateSiteDetailsModalProps {
  template?: WebsiteTemplateLite | null
  onCreateSite: (args: {
    name: string
    subdomain?: string
    templateId: string
    template?: WebsiteTemplateLite
  }) => void
  onBackToTemplates: () => void
  onCancel: () => void
}

export function CreateSiteDetailsModal({
  template,
  onCreateSite,
  onBackToTemplates,
  onCancel
}: CreateSiteDetailsModalProps) {
  const [name, setName] = useState('')
  const [subdomain, setSubdomain] = useState('')

  // Reset defaults whenever the selected template changes
  useEffect(() => {
    setName(template?.name ? `${template.name} Site` : '')
    setSubdomain('')
  }, [template?.id])

  const isValid = Boolean(template && (name?.trim().length ?? 0) > 0)

  const handleCreate = () => {
    if (!template) return
    onCreateSite({
      name: name.trim() || `${template.name} Site`,
      subdomain: subdomain.trim() || undefined,
      templateId: template.id,
      template
    })
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {template?.name ? `Create site from "${template.name}"` : 'Select a template to continue'}
          </DialogTitle>
          <DialogDescription>
            {template?.description ?? 'Choose a template to start your site. You can customize everything later.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site name</Label>
                <Input
                  id="site-name"
                  placeholder={template?.name ? `${template.name} Site` : 'My New Website'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!template}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subdomain">Subdomain (optional)</Label>
                <Input
                  id="subdomain"
                  placeholder="e.g. demo"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  disabled={!template}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBackToTemplates}>Back</Button>
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
            <Button onClick={handleCreate} disabled={!isValid}>
              Create Website
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSiteDetailsModal