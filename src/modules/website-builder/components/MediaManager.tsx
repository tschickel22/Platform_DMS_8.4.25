import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Media } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Trash2, Copy, Image as ImageIcon } from 'lucide-react'
import { useMedia } from '../hooks/useSite'
import { useToast } from '@/hooks/use-toast'

interface MediaManagerProps {
  siteId: string
}

export function MediaManager({ siteId }: MediaManagerProps) {
  const { media, loading, uploadMedia, deleteMedia } = useMedia(siteId)
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // Check file size (2MB limit)
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-4 top-4"
            onClick={onClose}
          >
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 2MB. Please choose a smaller file.`,
          variant: 'destructive'
        })
        continue
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported image format.`,
          variant: 'destructive'
        })
        continue
      }

      await uploadMedia(file)
    }
  }, [uploadMedia, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  })

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copied',
      description: 'Image URL copied to clipboard'
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <Badge variant="secondary">
          {media.length} files
        </Badge>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-muted-foreground mb-2">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPEG, PNG, GIF, WebP (max 2MB each)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {loading && media.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md animate-pulse" />
                <div className="mt-2 h-4 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : media.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No media files yet</p>
            <p className="text-sm text-muted-foreground">Upload your first image to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.url)}
                      className="h-8 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMedia(item.id)}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}