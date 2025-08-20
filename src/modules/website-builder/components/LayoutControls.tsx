import React from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Layout, Spacing, Palette } from 'lucide-react'

interface LayoutControlsProps {
  content: any
  onChange: (content: any) => void
}

export default function LayoutControls({ content, onChange }: LayoutControlsProps) {
  const spacing = content.spacing || {}
  const borders = content.borders || {}
  const shadows = content.shadows || {}

  const updateSpacing = (type: string, value: number) => {
    onChange({
      ...content,
      spacing: { ...spacing, [type]: value }
    })
  }

  const updateBorders = (property: string, value: any) => {
    onChange({
      ...content,
      borders: { ...borders, [property]: value }
    })
  }

  const updateShadows = (property: string, value: any) => {
    onChange({
      ...content,
      shadows: { ...shadows, [property]: value }
    })
  }

  const shadowPresets = [
    { name: 'None', value: 'none' },
    { name: 'Small', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { name: 'Medium', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    { name: 'Large', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
    { name: 'Extra Large', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }
  ]

  return (
    <div className="space-y-6">
      {/* Spacing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Spacing className="h-4 w-4" />
            Spacing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Padding Top</Label>
              <Slider
                value={[spacing.paddingTop || 0]}
                onValueChange={([value]) => updateSpacing('paddingTop', value)}
                max={100}
                step={4}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {spacing.paddingTop || 0}px
              </div>
            </div>

            <div>
              <Label>Padding Bottom</Label>
              <Slider
                value={[spacing.paddingBottom || 0]}
                onValueChange={([value]) => updateSpacing('paddingBottom', value)}
                max={100}
                step={4}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {spacing.paddingBottom || 0}px
              </div>
            </div>

            <div>
              <Label>Padding Left</Label>
              <Slider
                value={[spacing.paddingLeft || 0]}
                onValueChange={([value]) => updateSpacing('paddingLeft', value)}
                max={100}
                step={4}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {spacing.paddingLeft || 0}px
              </div>
            </div>

            <div>
              <Label>Padding Right</Label>
              <Slider
                value={[spacing.paddingRight || 0]}
                onValueChange={([value]) => updateSpacing('paddingRight', value)}
                max={100}
                step={4}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {spacing.paddingRight || 0}px
              </div>
            </div>

            <div>
              <Label>Margin Top</Label>
              <Slider
                value={[spacing.marginTop || 0]}
                onValueChange={([value]) => updateSpacing('marginTop', value)}
                max={100}
                step={4}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {spacing.marginTop || 0}px
              </div>
            </div>

            <div>
              <Label>Margin Bottom</Label>
              <Slider
                value={[spacing.marginBottom || 0]}
                onValueChange={([value]) => updateSpacing('marginBottom', value)}
                max={100}
                step={4}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {spacing.marginBottom || 0}px
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Border Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Borders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Border Width</Label>
              <Slider
                value={[borders.width || 0]}
                onValueChange={([value]) => updateBorders('width', value)}
                max={10}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {borders.width || 0}px
              </div>
            </div>

            <div>
              <Label>Border Color</Label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={borders.color || '#000000'}
                  onChange={(e) => updateBorders('color', e.target.value)}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  value={borders.color || '#000000'}
                  onChange={(e) => updateBorders('color', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <Label>Border Radius</Label>
              <Slider
                value={[borders.radius || 0]}
                onValueChange={([value]) => updateBorders('radius', value)}
                max={50}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {borders.radius || 0}px
              </div>
            </div>

            <div>
              <Label>Border Style</Label>
              <Select
                value={borders.style || 'solid'}
                onValueChange={(value) => updateBorders('style', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shadow Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Shadows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Shadow Preset</Label>
              <Select
                value={shadows.preset || 'none'}
                onValueChange={(value) => {
                  const preset = shadowPresets.find(p => p.name.toLowerCase().replace(' ', '-') === value)
                  updateShadows('preset', value)
                  updateShadows('value', preset?.value || 'none')
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shadowPresets.map((preset) => (
                    <SelectItem 
                      key={preset.name} 
                      value={preset.name.toLowerCase().replace(' ', '-')}
                    >
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Shadow Intensity</Label>
              <Slider
                value={[shadows.intensity || 100]}
                onValueChange={([value]) => updateShadows('intensity', value)}
                max={200}
                step={10}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {shadows.intensity || 100}%
              </div>
            </div>
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
          <div className="space-y-4">
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