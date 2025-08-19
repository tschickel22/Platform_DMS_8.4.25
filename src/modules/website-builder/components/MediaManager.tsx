import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Upload, Image, FileText, Trash2, Copy, ExternalLink } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Media } from '../types'
import { useToast } from '@/hooks/use-toast'
import { formatFileSize } from '../utils/formatters'

interface MediaManagerProps {
  siteId: string
  selectionMode?: boolean
  onSelectMedia?: (media: Media) => void
}

export default function MediaManager({ 
  siteId, 
  selectionMode = false, 
  onSelectMedia 
}: MediaManagerProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    loadMedia()
  }, [siteId])

  const loadMedia = async () => {
    try {
      setLoading(true)
      const mediaList = await websiteService.getMedia(siteId)
      setMedia(mediaList)
    } catch (error) {
      console.error('Failed to load media:', error)
      toast({
        title: 'Load failed',
        description: 'Failed to load media files.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    try {
      setUploading(true)
      const uploadPromises = Array.from(files).map(file => 
        websiteService.uploadMedia(siteId, file)
      )
      
      const uploadedMedia = await Promise.all(uploadPromises)
      setMedia(prev => [...uploadedMedia, ...prev])
      
      toast({
        title: 'Upload successful',
        description: `${uploadedMedia.length} file(s) uploaded successfully.`
      })
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload files. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await websiteService.deleteMedia(siteId, mediaId)
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      setSelectedMedia(null)
      
      toast({
        title: 'Media deleted',
        description: 'Media file has been deleted successfully.'
      })
    } catch (error) {
      console.error('Delete failed:', error)
      toast({
        title: 'Delete failed',
        description: 'Failed to delete media file.',
        variant: 'destructive'
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'URL copied to clipboard.'
    })
  }

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const imageMedia = filteredMedia.filter(m => m.type === 'image')
  const documentMedia = filteredMedia.filter(m => m.type === 'document')

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading media...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Media Library</CardTitle>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
            <Button size="sm" disabled={uploading}>
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </label>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <Input
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Images */}
        {imageMedia.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images ({imageMedia.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {imageMedia.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'relative group border rounded-lg overflow-hidden cursor-pointer transition-all',
                    selectionMode ? 'hover:ring-2 hover:ring-primary' : ''
                  )}
                  onClick={() => {
                    if (selectionMode && onSelectMedia) {
                      onSelectMedia(item)
                    } else {
                      setSelectedMedia(item)
                    }
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary">
                        {selectionMode ? 'Select' : 'View'}
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {documentMedia.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents ({documentMedia.length})
            </h4>
            <div className="space-y-1">
              {documentMedia.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(item.size)}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMedia.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📁</div>
            <p>No media files</p>
            <p className="text-sm">Upload images and documents to get started</p>
          </div>
        )}
      </CardContent>

      {/* Media Detail Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Media Details</DialogTitle>
          </DialogHeader>
          
          {selectedMedia && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="text-center">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.name}
                    className="max-w-full max-h-64 object-contain mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">File Name</label>
                  <p className="text-sm text-muted-foreground">{selectedMedia.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Size</label>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedMedia.size)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Uploaded</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={selectedMedia.url}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedMedia.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedMedia.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteMedia(selectedMedia.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                
                {selectionMode && onSelectMedia && (
                  <Button onClick={() => onSelectMedia(selectedMedia)}>
                    Select This Media
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}