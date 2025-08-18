import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Image, 
  FileText, 
  Trash2, 
  Search,
  Grid,
  List,
  Download,
  Eye
} from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Media } from '../types'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useToast } from '@/hooks/use-toast'

interface MediaManagerProps {
  siteId: string
  onSelectMedia?: (media: Media) => void
  selectedMediaId?: string
  allowMultiSelect?: boolean
}

export default function MediaManager({ 
  siteId, 
  onSelectMedia, 
  selectedMediaId,
  allowMultiSelect = false 
}: MediaManagerProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const { handleError } = useErrorHandler()
  const { toast } = useToast()

  useEffect(() => {
    loadMedia()
  }, [siteId])

  const loadMedia = async () => {
    try {
      setLoading(true)
      const mediaData = await websiteService.getMedia(siteId)
      setMedia(mediaData)
    } catch (error) {
      handleError(error, 'loading media')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          toast({
            title: 'Invalid File Type',
            description: `${file.name} is not a supported media type`,
            variant: 'destructive'
          })
          continue
        }

        // Validate file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: 'File Too Large',
            description: `${file.name} exceeds the 2MB size limit`,
            variant: 'destructive'
          })
          continue
        }

        const uploadedMedia = await websiteService.uploadMedia(siteId, file)
        setMedia(prev => [uploadedMedia, ...prev])
      }

      toast({
        title: 'Upload Complete',
        description: `${files.length} file(s) uploaded successfully`
      })
    } catch (error) {
      handleError(error, 'uploading media')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return

    try {
      await websiteService.deleteMedia(siteId, mediaId)
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      setSelectedMedia(prev => prev.filter(id => id !== mediaId))
      
      toast({
        title: 'Media Deleted',
        description: 'The media file has been deleted successfully'
      })
    } catch (error) {
      handleError(error, 'deleting media')
    }
  }

  const handleMediaClick = (mediaItem: Media) => {
    if (allowMultiSelect) {
      setSelectedMedia(prev => 
        prev.includes(mediaItem.id)
          ? prev.filter(id => id !== mediaItem.id)
          : [...prev, mediaItem.id]
      )
    } else {
      if (onSelectMedia) {
        onSelectMedia(mediaItem)
      }
    }
  }

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getMediaIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.startsWith('video/')) return FileText
    return FileText
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Media Library</h3>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            onClick={() => document.getElementById('media-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
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

      {/* Hidden file input */}
      <input
        id="media-upload"
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <Image className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No media files</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Upload images and videos to use in your website. Supported formats: JPG, PNG, GIF, MP4, WebM.
            </p>
            <Button onClick={() => document.getElementById('media-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Media
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedMediaId === item.id || selectedMedia.includes(item.id)
            const MediaIcon = getMediaIcon(item.type)
            
            return (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleMediaClick(item)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded mb-2 flex items-center justify-center overflow-hidden">
                    {item.type.startsWith('image/') ? (
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MediaIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {item.type.split('/')[1]?.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(item.size)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(item.url, '_blank')
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        const link = document.createElement('a')
                        link.href = item.url
                        link.download = item.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMedia(item.id)
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((item) => {
            const isSelected = selectedMediaId === item.id || selectedMedia.includes(item.id)
            const MediaIcon = getMediaIcon(item.type)
            
            return (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleMediaClick(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.type.startsWith('image/') ? (
                        <img 
                          src={item.url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MediaIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.type.split('/')[1]?.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(item.size)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(item.url, '_blank')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const link = document.createElement('a')
                          link.href = item.url
                          link.download = item.name
                          link.click()
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMedia(item.id)
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}