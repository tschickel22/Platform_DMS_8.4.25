import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Image, 
  FileText, 
  Trash2, 
  Copy, 
  ExternalLink,
  Search,
  Grid,
  List
} from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Media } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface MediaManagerProps {
  siteId: string
  onSelectMedia?: (media: Media) => void
  selectionMode?: boolean
}

export default function MediaManager({ siteId, onSelectMedia, selectionMode = false }: MediaManagerProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  useEffect(() => {
    loadMedia()
  }, [siteId])

  const loadMedia = async () => {
    try {
      setLoading(true)
      const mediaList = await websiteService.getMedia(siteId)
      setMedia(mediaList)
    } catch (error) {
      handleError(error, 'loading media')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setUploading(true)
      
      for (const file of Array.from(files)) {
        // Validate file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} is larger than 2MB`,
            variant: 'destructive'
          })
          continue
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: `${file.name} is not a supported image format`,
            variant: 'destructive'
          })
          continue
        }

        const uploadedMedia = await websiteService.uploadMedia(siteId, file)
        setMedia(prev => [uploadedMedia, ...prev])
        
        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded`
        })
      }
    } catch (error) {
      handleError(error, 'uploading media')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    const mediaItem = media.find(m => m.id === mediaId)
    if (!mediaItem) return

    if (!confirm(`Are you sure you want to delete "${mediaItem.name}"?`)) return

    try {
      await websiteService.deleteMedia(siteId, mediaId)
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      
      toast({
        title: 'Media deleted',
        description: `${mediaItem.name} has been deleted`
      })
    } catch (error) {
      handleError(error, 'deleting media')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL copied',
      description: 'Media URL has been copied to clipboard'
    })
  }

  const handleMediaSelect = (mediaItem: Media) => {
    if (selectionMode && onSelectMedia) {
      onSelectMedia(mediaItem)
    } else {
      setSelectedMedia(selectedMedia === mediaItem.id ? null : mediaItem.id)
    }
  }

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading media...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media Library
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop images here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="media-upload"
              disabled={uploading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('media-upload')?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max file size: 2MB. Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Media Grid/List */}
          {filteredMedia.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchTerm ? 'No media found matching your search' : 'No media uploaded yet'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 gap-3' 
                : 'space-y-2'
            }>
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedMedia === item.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleMediaSelect(item)}
                >
                  {viewMode === 'grid' ? (
                    <div>
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(item.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(item.size)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyUrl(item.url)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(item.url, '_blank')
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMedia(item.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* External URL Input */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Add External Image</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const url = (e.target as HTMLInputElement).value
                    if (url) {
                      const externalMedia: Media = {
                        id: `external-${Date.now()}`,
                        name: url.split('/').pop() || 'External Image',
                        url,
                        type: 'image',
                        size: 0,
                        uploadedAt: new Date().toISOString()
                      }
                      setMedia(prev => [externalMedia, ...prev])
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="example.com"]') as HTMLInputElement
                  const url = input?.value
                  if (url) {
                    const externalMedia: Media = {
                      id: `external-${Date.now()}`,
                      name: url.split('/').pop() || 'External Image',
                      url,
                      type: 'image',
                      size: 0,
                      uploadedAt: new Date().toISOString()
                    }
                    setMedia(prev => [externalMedia, ...prev])
                    input.value = ''
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}