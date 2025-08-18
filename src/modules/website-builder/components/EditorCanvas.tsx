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
  currentPageId?: string
  onSelectPage: (pageId: string) => void
  onCreatePage: () => void
  onEditPage: (pageId: string) => void
  onDeletePage: (pageId: string) => void
  onDuplicatePage: (pageId: string) => void
}

export default function PageList({
  pages,
  currentPageId,
  onSelectPage,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onDuplicatePage
    const isSelected = selectedBlockId === block.id
    const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
    const bag = bagKey ? (block as any)[bagKey] : {}

}: PageListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredPages = pages.filter(page =>
          <section 
            key={block.id} 
            className={cn(
              "relative bg-gray-900 text-white min-h-[400px] cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
            {bag.backgroundImage && (
  )
import { debounce } from '@/lib/utils'
                style={{ backgroundImage: `url(${bag.backgroundImage})` }}
  const getPageIcon = (page: Page) => {
    if (page.isHomePage) return <Home className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }
  // Auto-select first page if none selected and pages exist
  React.useEffect(() => {
                {bag.title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <span
                      contentEditable={!!onBlockUpdate}
                      suppressContentEditableWarning
                      onBlur={(e) => handleInlineEdit(block.id, 'title', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className={onBlockUpdate ? 'outline-none focus:bg-white/10 rounded px-1' : ''}
                    >
                      {bag.title}
                    </span>
    e.stopPropagation()
    if (onSelectBlock) {
                {bag.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    <span
                      contentEditable={!!onBlockUpdate}
                      suppressContentEditableWarning
                      onBlur={(e) => handleInlineEdit(block.id, 'subtitle', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className={onBlockUpdate ? 'outline-none focus:bg-white/10 rounded px-1' : ''}
                    >
                      {bag.subtitle}
                    </span>

  const handleInlineEdit = (blockId: string, field: string, value: string) => {
                {bag.ctaText && (
    
    const block = activePage.blocks.find(b => b.id === blockId)
    if (!block) return
                    onClick={() => bag.ctaLink && (window.location.href = bag.ctaLink)}
    const bagKey = 'props' in block ? 'props' : ('data' in block ? 'data' : null)
                    <span
                      contentEditable={!!onBlockUpdate}
                      suppressContentEditableWarning
                      onBlur={(e) => handleInlineEdit(block.id, 'ctaText', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className={onBlockUpdate ? 'outline-none focus:bg-white/10 rounded px-1' : ''}
                    >
                      {bag.ctaText}
                    </span>
    
    const bag = (block as any)[bagKey] || {}
    const updatedBag = { ...bag, [field]: value }
    
    onBlockUpdate(blockId, { [bagKey]: updatedBag })
  }

    }

          <section 
            key={block.id} 
            className={cn(
              "py-16 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
    <div className="space-y-4">
      {/* Header */}
                className={`prose prose-lg max-w-none ${bag.alignment || 'text-left'}`}
                contentEditable={!!onBlockUpdate}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const content = e.currentTarget.innerHTML
                  handleInlineEdit(block.id, 'html' in bag ? 'html' : 'text', content)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
                className={onBlockUpdate ? 'outline-none focus:bg-gray-50 rounded p-2' : ''}
                dangerouslySetInnerHTML={{ __html: bag.html || bag.text || '' }}
        <Button size="sm" onClick={onCreatePage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <div className="relative">
          <section 
            key={block.id} 
            className={cn(
              "py-16 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
        <Input
              <div className={`text-${bag.alignment || 'center'}`}>
          value={searchTerm}
                  src={bag.src || bag.imageUrl} 
                  alt={bag.alt || ''} 
        />
      </div>
                {bag.caption && (
                  <p className="mt-4 text-gray-600 text-sm">
                    <span
                      contentEditable={!!onBlockUpdate}
                      suppressContentEditableWarning
                      onBlur={(e) => handleInlineEdit(block.id, 'caption', e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                      className={onBlockUpdate ? 'outline-none focus:bg-gray-100 rounded px-1' : ''}
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
            className={cn(
              "py-16 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            style={{ backgroundColor: `${primaryColor}10` }}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
                  <Plus className="h-4 w-4 mr-2" />
              {bag.title && (
                <h2 className="text-3xl font-bold mb-4">
                  <span
                    contentEditable={!!onBlockUpdate}
                    suppressContentEditableWarning
                    onBlur={(e) => handleInlineEdit(block.id, 'title', e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.blur()
                      }
                    }}
                    className={onBlockUpdate ? 'outline-none focus:bg-white/20 rounded px-1' : ''}
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
              {bag.description && (
                <p className="text-lg text-gray-600 mb-8">
                  <span
                    contentEditable={!!onBlockUpdate}
                    suppressContentEditableWarning
                    onBlur={(e) => handleInlineEdit(block.id, 'description', e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.blur()
                      }
                    }}
                    className={onBlockUpdate ? 'outline-none focus:bg-white/20 rounded px-1' : ''}
                  >
                    {bag.description}
                  </span>
                </p>
                            <Trash2 className="h-4 w-4 mr-2" />
              {bag.buttonText && (
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                  onClick={() => bag.buttonLink && (window.location.href = bag.buttonLink)}
                  </div>
                  <span
                    contentEditable={!!onBlockUpdate}
                    suppressContentEditableWarning
                    onBlur={(e) => handleInlineEdit(block.id, 'buttonText', e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.blur()
                      }
                    }}
                    className={onBlockUpdate ? 'outline-none focus:bg-white/10 rounded px-1' : ''}
                  >
                    {bag.buttonText}
                  </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      case 'heading':
        return (
          <section 
            key={block.id} 
            className={cn(
              "py-8 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 
                className={`text-3xl font-bold ${bag.alignment === 'center' ? 'text-center' : bag.alignment === 'right' ? 'text-right' : 'text-left'}`}
                contentEditable={!!onBlockUpdate}
                suppressContentEditableWarning
                onBlur={(e) => handleInlineEdit(block.id, 'text', e.currentTarget.textContent || '')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
                className={onBlockUpdate ? 'outline-none focus:bg-gray-50 rounded px-2 py-1' : ''}
              >
                {bag.text || bag.title || 'Heading'}
              </h2>
            </div>
          </section>
        )

      case 'paragraph':
        return (
          <section 
            key={block.id} 
            className={cn(
              "py-8 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <p 
                className={`text-lg leading-relaxed ${bag.alignment === 'center' ? 'text-center' : bag.alignment === 'right' ? 'text-right' : 'text-left'}`}
                contentEditable={!!onBlockUpdate}
                suppressContentEditableWarning
                onBlur={(e) => handleInlineEdit(block.id, 'text', e.currentTarget.textContent || '')}
                className={onBlockUpdate ? 'outline-none focus:bg-gray-50 rounded px-2 py-1' : ''}
              >
                {bag.text || 'Paragraph text'}
              </p>
            </div>
          <div 
            key={block.id} 
            className={cn(
              "py-8 px-4 bg-yellow-50 border border-yellow-200 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
        )

      case 'button':
        return (
          <section 
            key={block.id} 
            className={cn(
              "py-8 cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            data-block-id={block.id}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <button 
      onClick={() => onSelectBlock && onSelectBlock('')} // Deselect when clicking empty space
                className="px-6 py-3 font-semibold rounded-lg transition-colors"
                style={{ 
                  backgroundColor: bag.variant === 'outline' ? 'transparent' : primaryColor, 
                  color: bag.variant === 'outline' ? primaryColor : 'white',
                  border: bag.variant === 'outline' ? `2px solid ${primaryColor}` : 'none'
                }}
                onClick={() => bag.href && (window.location.href = bag.href)}
              >
                <span
                  contentEditable={!!onBlockUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => handleInlineEdit(block.id, 'label', e.currentTarget.textContent || '')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                  className={onBlockUpdate ? 'outline-none focus:bg-white/10 rounded px-1' : ''}
                >
                  {bag.label || bag.text || 'Button'}
                </span>
              </button>
            </div>
          </section>
        )

      {/* Quick Stats */}
      {pages.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {pages.length} page{pages.length !== 1 ? 's' : ''} • {pages.filter(p => p.isPublished).length} published
        </div>
      )}
    </div>
  )
}