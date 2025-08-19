import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Image, Trash2, ExternalLink, Search } from 'lucide-react'
import { websiteService } from '@/services/website/service'
import { Media } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface MediaManagerProps {
  siteId: string
}

export default function MediaManager({ siteId }: MediaManagerProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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
    } catch (err) {
      handleError(err, 'loading media')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setUploading(true)
      const file = files[0]
      
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 2MB',
          variant: 'destructive'
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive'
        })
        return
      }

      const newMedia = await websiteService.uploadMedia(siteId, file)
      setMedia(prev => [newMedia, ...prev])
      
      toast({
        title: 'Upload successful',
        description: 'Your image has been uploaded'
      })
    } catch (err) {
      handleError(err, 'uploading media')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      await websiteService.deleteMedia(siteId, mediaId)
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      
      toast({
        title: 'Image deleted',
        description: 'The image has been removed from your media library'
      })
    } catch (err) {
      handleError(err, 'deleting media')
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: 'URL copied',
        description: 'Image URL has been copied to clipboard'
      })
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy URL to clipboard',
        variant: 'destructive'
      })
    }
  }

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent>
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
        <CardTitle>Media Library</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="media-upload"
            disabled={uploading}
          />
          <label htmlFor="media-upload">
            <Button
              variant="outline"
              className="w-full h-20 border-dashed"
              disabled={uploading}
              asChild
            >
              <div className="cursor-pointer">
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max 2MB, JPG/PNG/GIF
                  </p>
                </div>
              </div>
            </Button>
          </label>
        </div>

        {/* Search */}
        {media.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredMedia.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(item.url)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMedia(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Image info */}
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No images found' : 'No media files'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'Upload images and documents to get started'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}