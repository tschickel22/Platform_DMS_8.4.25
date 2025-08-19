// src/modules/website-builder/components/SiteEditor.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Monitor, Smartphone, Globe } from 'lucide-react'
import PageList, { Page } from './PageList'

interface SiteEditorProps {
  pages?: Page[]
  currentPageId?: string
  onPagesChange?: (pages: Page[]) => void
  /** Optional prefix used for preview URLs (e.g. "/public-site") */
  previewBasePath?: string
}

const generateId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36)

export default function SiteEditor({
  pages: pagesProp,
  currentPageId: currentIdProp,
  onPagesChange,
  previewBasePath = ''
}: SiteEditorProps) {
  // Local pages state (kept in sync with props if provided)
  const [pages, setPages] = useState<Page[]>(pagesProp ?? [])

  useEffect(() => {
    if (pagesProp) setPages(pagesProp)
  }, [pagesProp])

  // Selection
  const [currentPageId, setCurrentPageId] = useState<string | undefined>(
    currentIdProp ?? pagesProp?.[0]?.id
  )
  useEffect(() => {
    if (currentIdProp) setCurrentPageId(currentIdProp)
  }, [currentIdProp])

  // Auto-select first page when list changes
  useEffect(() => {
    if (!currentPageId && pages.length) {
      setCurrentPageId(pages[0].id)
    }
  }, [pages, currentPageId])

  const currentPage = useMemo(
    () => pages.find((p) => p.id === currentPageId),
    [pages, currentPageId]
  )

  // Device preview width
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const deviceWidth = device === 'mobile' ? 375 : device === 'tablet' ? 768 : 1100

  // Push changes up if requested
  const commit = (next: Page[]) => {
    setPages(next)
    onPagesChange?.(next)
  }

  // Handlers passed to PageList
  const handleSelectPage = (id: string) => setCurrentPageId(id)

  const handleCreatePage = () => {
    const idx = pages.length + 1
    const newPage: Page = {
      id: generateId(),
      name: `New Page ${idx}`,
      slug: `new-page-${idx}`,
      isHomePage: pages.length === 0,
      isPublished: false,
      lastModified: new Date().toISOString(),
      template: undefined,
      seo: { title: `New Page ${idx}`, description: '' }
    }
    const next = [...pages, newPage]
    commit(next)
    setCurrentPageId(newPage.id)
  }

  const handleDeletePage = (id: string) => {
    const next = pages.filter((p) => p.id !== id)
    commit(next)
    if (currentPageId === id) setCurrentPageId(next[0]?.id)
  }

  const handleDuplicatePage = (id: string) => {
    const src = pages.find((p) => p.id === id)
    if (!src) return
    const dup: Page = {
      ...src,
      id: generateId(),
      name: `${src.name} Copy`,
      slug: `${src.slug}-copy`,
      isHomePage: false,
      isPublished: false,
      lastModified: new Date().toISOString()
    }
    commit([...pages, dup])
  }

  /** Optional: route to a full settings screen if you have one */
  const handleEditPage = (_id: string) => {
    // no-op; Quick Edit handled inside PageList
  }

  // Page updates from PageList (supports { name?, path?, seo? })
  const handlePageUpdate = (id: string, updates: Partial<Page> & { path?: string }) => {
    const next = pages.map((p) => {
      if (p.id !== id) return p
      const slug = updates.path != null ? updates.path.replace(/^\//, '') : p.slug
      return {
        ...p,
        ...(updates.name != null ? { name: updates.name } : {}),
        ...(updates.seo ? { seo: { ...p.seo, ...updates.seo } } : {}),
        ...(updates.path != null ? { slug } : {}),
        lastModified: new Date().toISOString()
      }
    })
    commit(next)
  }

  // Build preview URL (safe even if routes aren’t wired yet)
  const previewUrl =
    currentPage?.slug
      ? `${previewBasePath}/${currentPage.slug.replace(/^\//, '')}`
      : undefined

  return (
    <div className="grid gap-4 md:grid-cols-12">
      {/* Left: Pages */}
      <div className="md:col-span-4 lg:col-span-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <PageList
              pages={pages}
              currentPageId={currentPageId}
              onSelectPage={handleSelectPage}
              onCreatePage={handleCreatePage}
              onEditPage={handleEditPage}
              onDeletePage={handleDeletePage}
              onDuplicatePage={handleDuplicatePage}
              onPageUpdate={handlePageUpdate}
            />
          </CardContent>
        </Card>
      </div>

      {/* Center: Preview */}
      <div className="md:col-span-8 lg:col-span-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={device === 'desktop' ? 'default' : 'outline'}
                onClick={() => setDevice('desktop')}
                title="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={device === 'tablet' ? 'default' : 'outline'}
                onClick={() => setDevice('tablet')}
                title="Tablet"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={device === 'mobile' ? 'default' : 'outline'}
                onClick={() => setDevice('mobile')}
                title="Mobile"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              {currentPage && (
                <Badge variant="secondary" className="ml-2">
                  /{currentPage.slug.replace(/^\//, '')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center">
              <div
                className="border rounded-lg overflow-hidden bg-white"
                style={{ width: deviceWidth, height: 640 }}
              >
                {previewUrl ? (
                  <iframe title="page-preview" src={previewUrl} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                    Select or create a page to preview
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Details panel (placeholder for future use) */}
      <div className="hidden lg:block lg:col-span-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
