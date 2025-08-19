import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Crop as CropIcon, RotateCw, Palette, Download, Upload } from 'lucide-react'
import html2canvas from 'html2canvas'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageEditorProps {
  src: string
  alt?: string
  onSave: (newSrc: string, alt?: string) => void
  onCancel: () => void
}

export function ImageEditor({ src, alt = '', onSave, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [rotation, setRotation] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [altText, setAltText] = useState(alt)
  const [activeTab, setActiveTab] = useState('crop')
  
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const applyFilters = useCallback(() => {
    if (!imgRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imgRef.current
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    
    // Apply rotation
    if (rotation !== 0) {
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
      ctx.restore()
    } else {
      ctx.drawImage(img, 0, 0)
    }
  }, [brightness, contrast, saturation, rotation])

  const applyCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imgRef.current
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )
  }, [completedCrop])

  const handleSave = async () => {
    if (!canvasRef.current) return

    try {
      // Apply current edits to canvas
      if (completedCrop) {
        applyCrop()
      } else {
        applyFilters()
      }

      // Convert canvas to blob and create URL
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader()
          reader.onload = () => {
            onSave(reader.result as string, altText)
          }
          reader.readAsDataURL(blob)
        }
      }, 'image/jpeg', 0.9)
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Image</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crop">Crop</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="rotate">Rotate</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <div className="flex">
              {/* Image Preview */}
              <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center min-h-[400px]">
                <div className="relative">
                  {activeTab === 'crop' ? (
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={undefined}
                    >
                      <img
                        ref={imgRef}
                        src={src}
                        alt={altText}
                        className="max-w-full max-h-[400px] object-contain"
                        style={{
                          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                          transform: `rotate(${rotation}deg)`
                        }}
                      />
                    </ReactCrop>
                  ) : (
                    <img
                      ref={imgRef}
                      src={src}
                      alt={altText}
                      className="max-w-full max-h-[400px] object-contain"
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                        transform: `rotate(${rotation}deg)`
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="w-80 border-l">
                <TabsContent value="crop" className="p-4 space-y-4">
                  <div>
                    <Label>Crop Tool</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Click and drag on the image to select the area you want to keep.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCrop(undefined)
                        setCompletedCrop(undefined)
                      }}
                    >
                      Reset Crop
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="p-4 space-y-6">
                  <div>
                    <Label>Brightness: {brightness}%</Label>
                    <Slider
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      min={0}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Contrast: {contrast}%</Label>
                    <Slider
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                      min={0}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Saturation: {saturation}%</Label>
                    <Slider
                      value={[saturation]}
                      onValueChange={(value) => setSaturation(value[0])}
                      min={0}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </TabsContent>

                <TabsContent value="rotate" className="p-4 space-y-4">
                  <div>
                    <Label>Rotation: {rotation}°</Label>
                    <Slider
                      value={[rotation]}
                      onValueChange={(value) => setRotation(value[0])}
                      min={-180}
                      max={180}
                      step={15}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation(rotation - 90)}
                    >
                      <RotateCw className="h-4 w-4 mr-2 transform scale-x-[-1]" />
                      90° Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation(rotation + 90)}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      90° Right
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <Input
                      id="alt-text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe this image..."
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Alt text helps with accessibility and SEO
                    </p>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}