import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, RotateCw, Crop, Palette } from 'lucide-react'

interface ImageEditorProps {
  src: string
  alt?: string
  onUpdate: (updates: { src?: string; alt?: string; filters?: any }) => void
}

export default function ImageEditor({ src, alt, onUpdate }: ImageEditorProps) {
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0
  })
  const [newAlt, setNewAlt] = useState(alt || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onUpdate({ src: result, alt: newAlt })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFilterChange = (filterType: string, value: number) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onUpdate({ filters: newFilters })
  }

  const resetFilters = () => {
    const resetFilters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      rotation: 0
    }
    setFilters(resetFilters)
    onUpdate({ filters: resetFilters })
  }

  const imageStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`,
    transform: `rotate(${filters.rotation}deg)`
  }

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Image Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {src ? (
              <img
                src={src}
                alt={newAlt}
                style={imageStyle}
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image selected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload New Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose New Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div>
              <Label htmlFor="image-url">Or enter image URL</Label>
              <Input
                id="image-url"
                value={src}
                onChange={(e) => onUpdate({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alt Text */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={newAlt}
              onChange={(e) => {
                setNewAlt(e.target.value)
                onUpdate({ alt: e.target.value })
              }}
              placeholder="Describe the image for screen readers"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Image Filters
            </span>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Brightness</Label>
              <Slider
                value={[filters.brightness]}
                onValueChange={([value]) => handleFilterChange('brightness', value)}
                min={0}
                max={200}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {filters.brightness}%
              </div>
            </div>

            <div>
              <Label>Contrast</Label>
              <Slider
                value={[filters.contrast]}
                onValueChange={([value]) => handleFilterChange('contrast', value)}
                min={0}
                max={200}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {filters.contrast}%
              </div>
            </div>

            <div>
              <Label>Saturation</Label>
              <Slider
                value={[filters.saturation]}
                onValueChange={([value]) => handleFilterChange('saturation', value)}
                min={0}
                max={200}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {filters.saturation}%
              </div>
            </div>

            <div>
              <Label>Rotation</Label>
              <Slider
                value={[filters.rotation]}
                onValueChange={([value]) => handleFilterChange('rotation', value)}
                min={-180}
                max={180}
                step={15}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {filters.rotation}°
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}