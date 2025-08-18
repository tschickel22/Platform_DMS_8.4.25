import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  FileText, 
  Home, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Page {
  id: string
  name: string
  slug: string
  isHomePage: boolean
  isPublished: boolean
  lastModified: string
  template?: string
}

interface PageListProps {
  pages: Page[]
    const isSelected = selectedBlockId === block.id
    const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
    const bag = bagKey ? (block as any)[bagKey] : {}
    
    const blockWrapperClass = `
      relative transition-all duration-200 cursor-pointer
      ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'}
    `

  currentPageId?: string
  onSelectPage: (pageId: string) => void
  onEditPage: (pageId: string) => void
          <section 
            key={block.id} 
            className={`relative bg-gray-900 text-white min-h-[400px] ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
            {bag.backgroundImage && (
}

                style={{ backgroundImage: `url(${bag.backgroundImage})` }}
  pages,
  currentPageId,
  onSelectPage,
  onCreatePage,
  onEditPage,
  onDeletePage,
                {bag.title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentEdit(block.id, 'title', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className="outline-none focus:bg-white/10 rounded px-2 py-1"
                    >
                      {bag.title}
                    </span>

  const filteredPages = pages.filter(page =>
                {bag.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentEdit(block.id, 'subtitle', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className="outline-none focus:bg-white/10 rounded px-2 py-1"
                    >
                      {bag.subtitle}
                    </span>

  const getPageIcon = (page: Page) => {
                {bag.ctaText && (
    return <FileText className="h-4 w-4" />
  }
                    onClick={() => bag.ctaLink && (window.location.href = bag.ctaLink)}
  React.useEffect(() => {
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentEdit(block.id, 'ctaText', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className="outline-none focus:bg-white/10 rounded px-1"
                    >
                      {bag.ctaText}
                    </span>
      onSelectPage(pages[0].id)
  const handleBlockClick = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectBlock?.(blockId)
  }

  const handleContentEdit = (blockId: string, field: string, content: string) => {
    if (!onBlockUpdate) return
    
    if (!block) return
          <section 
            key={block.id} 
            className={`py-16 ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
    const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
    if (!bagKey) return
                className={`prose prose-lg max-w-none ${bag.alignment || 'text-left'}`}
              >
                {bag.html ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(block.id, 'html', e.currentTarget.innerHTML || '')}
                    className="outline-none focus:bg-gray-50 rounded px-2 py-1 min-h-[2em]"
                    dangerouslySetInnerHTML={{ __html: bag.html }}
                  />
                ) : (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(block.id, 'text', e.currentTarget.textContent || '')}
                    className="outline-none focus:bg-gray-50 rounded px-2 py-1 min-h-[2em]"
                  >
                    {bag.text || 'Click to edit text...'}
                  </div>
                )}
              </div>
      [bagKey]: { ...bag, [field]: content }
    })
  }

    }
        const HeadingTag = `h${bag.level || 2}` as keyof JSX.IntrinsicElements
  return (
          <section 
            key={block.id} 
            className={`py-8 ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
      {/* Header */}
              <HeadingTag className={`font-bold ${bag.alignment || 'text-left'}`}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(block.id, 'text', e.currentTarget.textContent || '')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                  className="outline-none focus:bg-gray-50 rounded px-2 py-1"
                >
                  {bag.text || 'Click to edit heading...'}
                </span>
        <Button size="sm" onClick={onCreatePage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <div className="relative">
          <section 
            key={block.id} 
            className={`py-16 ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
        <Input
              <div className={`text-${bag.alignment || 'center'}`}>
                {bag.src || bag.imageUrl ? (
                  <img 
                    src={bag.src || bag.imageUrl} 
                    alt={bag.alt || ''} 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Click to add image</p>
                  </div>
                )}
                {bag.caption && (
                  <p className="mt-4 text-gray-600 text-sm">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentEdit(block.id, 'caption', e.currentTarget.textContent || '')}
                      className="outline-none focus:bg-gray-50 rounded px-2 py-1"
                    >
                      {bag.caption}
                    </span>
                  </p>
      <div className="space-y-2">
        {filteredPages.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No pages match your search' : 'No pages yet'}
              {!searchTerm && (
          <section 
            key={block.id} 
            className={`py-16 bg-gray-50 ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
                  <Plus className="h-4 w-4 mr-2" />
              {bag.title && (
                <h2 className="text-3xl font-bold mb-4">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(block.id, 'title', e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.blur()
                      }
                    }}
                    className="outline-none focus:bg-white/50 rounded px-2 py-1"
                  >
                    {bag.title}
                  </span>
                </h2>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPages.map((page) => (
            <Card 
              key={page.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                currentPageId === page.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectPage(page.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-muted-foreground">
                      {getPageIcon(page)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{page.name}</h4>
                        {page.isHomePage && (
                          <Badge variant="secondary" className="text-xs">
                            Home
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        /{page.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Modified {new Date(page.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={page.isPublished ? 'default' : 'secondary'} className="text-xs">
                      {page.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onEditPage(page.id)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onDuplicatePage(page.id)
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!page.isHomePage && (
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeletePage(page.id)
                            }}
                            className="text-destructive"
              {bag.description && (
                  <span
          <section 
            key={block.id} 
            className={`py-8 ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
                    suppressContentEditableWarning
              <div className={`text-${bag.alignment || 'center'}`}>
                    className="outline-none focus:bg-white/50 rounded px-2 py-1"
                  className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                    bag.variant === 'outline' 
                  </span>
                </p>
                            Delete
                  onClick={() => bag.href && (window.location.href = bag.href)}
                        )}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(block.id, 'label', e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.blur()
                      }
                    }}
                    className="outline-none focus:bg-white/10 rounded px-1"
                  >
                    {bag.label || 'Button'}
                  </span>
                  onClick={() => bag.buttonLink && (window.location.href = bag.buttonLink)}
                  </div>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(block.id, 'buttonText', e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
          <div 
            key={block.id} 
            className={`py-8 px-4 bg-yellow-50 border border-yellow-200 ${blockWrapperClass}`}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
                        e.currentTarget.blur()
                      }
                    }}
                    className="outline-none focus:bg-white/10 rounded px-1"
                  >
                    {bag.buttonText}
                  </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    <div 
      className="h-full overflow-y-auto bg-white"
      onClick={() => onSelectBlock?.(null)} // Deselect when clicking empty space
    >
      {/* Quick Stats */}
      {pages.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {pages.length} page{pages.length !== 1 ? 's' : ''} • {pages.filter(p => p.isPublished).length} published
        </div>
      )}
    </div>
  )
}