import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, RefreshCw } from 'lucide-react'

interface Theme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

interface ThemePaletteProps {
  theme?: Theme
  onThemeUpdate: (theme: Theme) => void
}

const presetThemes = [
  {
    name: 'Ocean Blue',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    fontFamily: 'Inter'
  },
  {
    name: 'Forest Green',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    fontFamily: 'Inter'
  },
  {
    name: 'Sunset Orange',
    primaryColor: '#ea580c',
    secondaryColor: '#dc2626',
    fontFamily: 'Inter'
  },
  {
    name: 'Royal Purple',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
    fontFamily: 'Inter'
  },
  {
    name: 'Classic Gray',
    primaryColor: '#374151',
    secondaryColor: '#1f2937',
    fontFamily: 'Inter'
  }
]

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Oswald', label: 'Oswald' }
]

export default function ThemePalette({ theme, onThemeUpdate }: ThemePaletteProps) {
  const currentTheme = theme || {
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    fontFamily: 'Inter'
  }

  const handlePresetSelect = (preset: typeof presetThemes[0]) => {
    onThemeUpdate(preset)
  }

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor', color: string) => {
    onThemeUpdate({
      ...currentTheme,
      [colorType]: color
    })
  }

  const handleFontChange = (fontFamily: string) => {
    onThemeUpdate({
      ...currentTheme,
      fontFamily
    })
  }

  const resetToDefault = () => {
    onThemeUpdate({
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      fontFamily: 'Inter'
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Preset Themes */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Preset Themes</Label>
            <div className="grid grid-cols-1 gap-2">
              {presetThemes.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.secondaryColor }}
                      />
                    </div>
                    <span className="text-sm">{preset.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Custom Colors</Label>
            
            <div>
              <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={currentTheme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-8 rounded border cursor-pointer"
                />
                <Input
                  id="primary-color"
                  value={currentTheme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color" className="text-xs">Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={currentTheme.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-8 rounded border cursor-pointer"
                />
                <Input
                  id="secondary-color"
                  value={currentTheme.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  placeholder="#1d4ed8"
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Typography</Label>
            <Select
              value={currentTheme.fontFamily}
              onValueChange={handleFontChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Preview */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Preview</Label>
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: currentTheme.primaryColor + '10',
                fontFamily: currentTheme.fontFamily
              }}
            >
              <h3 
                className="font-bold mb-2"
                style={{ color: currentTheme.primaryColor }}
              >
                Sample Heading
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                This is how your content will look with the selected theme.
              </p>
              <Button
                size="sm"
                style={{ 
                  backgroundColor: currentTheme.primaryColor,
                  color: 'white'
                }}
              >
                Sample Button
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}