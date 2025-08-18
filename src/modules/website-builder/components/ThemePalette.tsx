import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Palette, RotateCcw, Eye, Download } from 'lucide-react'
import { Site } from '../types'

interface ThemePaletteProps {
  site: Site
  onUpdateSite: (updates: Partial<Site>) => void
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
    secondaryColor: '#5b21b6',
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
  { value: 'Inter', label: 'Inter (Modern Sans-serif)' },
  { value: 'Roboto', label: 'Roboto (Clean Sans-serif)' },
  { value: 'Open Sans', label: 'Open Sans (Friendly Sans-serif)' },
  { value: 'Montserrat', label: 'Montserrat (Geometric Sans-serif)' },
  { value: 'Lato', label: 'Lato (Humanist Sans-serif)' },
  { value: 'Poppins', label: 'Poppins (Rounded Sans-serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
  { value: 'Merriweather', label: 'Merriweather (Readable Serif)' }
]

export default function ThemePalette({ site, onUpdateSite }: ThemePaletteProps) {
  const [localTheme, setLocalTheme] = useState({
    primaryColor: site.theme?.primaryColor || '#3b82f6',
    secondaryColor: site.theme?.secondaryColor || '#64748b',
    fontFamily: site.theme?.fontFamily || 'Inter'
  })

  const [showPreview, setShowPreview] = useState(false)

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor', value: string) => {
    const newTheme = { ...localTheme, [colorType]: value }
    setLocalTheme(newTheme)
    
    // Update site immediately for live preview
    onUpdateSite({
      theme: {
        ...site.theme,
        ...newTheme
      }
    })
  }

  const handleFontChange = (fontFamily: string) => {
    const newTheme = { ...localTheme, fontFamily }
    setLocalTheme(newTheme)
    
    onUpdateSite({
      theme: {
        ...site.theme,
        ...newTheme
      }
    })
  }

  const applyPresetTheme = (preset: typeof presetThemes[0]) => {
    setLocalTheme(preset)
    onUpdateSite({
      theme: {
        ...site.theme,
        ...preset
      }
    })
  }

  const resetToDefaults = () => {
    const defaultTheme = {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    }
    setLocalTheme(defaultTheme)
    onUpdateSite({
      theme: {
        ...site.theme,
        ...defaultTheme
      }
    })
  }

  const exportTheme = () => {
    const themeData = {
      name: `${site.name} Theme`,
      ...localTheme,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${site.slug}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Theme & Styling</h3>
          <p className="text-sm text-muted-foreground">
            Customize colors, fonts, and visual appearance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button variant="outline" size="sm" onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preset Themes</CardTitle>
          <CardDescription>
            Quick start with professionally designed color schemes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPresetTheme(preset)}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors text-left"
              >
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
                <span className="text-sm font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colors</CardTitle>
          <CardDescription>
            Customize your brand colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={localTheme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={localTheme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={localTheme.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={localTheme.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  placeholder="#64748b"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="p-4 border rounded-lg" style={{ backgroundColor: `${localTheme.primaryColor}10` }}>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: localTheme.primaryColor }}
              >
                Primary
              </div>
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: localTheme.secondaryColor }}
              >
                Secondary
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: localTheme.primaryColor }}>
                  This is how your primary color looks in text
                </p>
                <p className="text-sm" style={{ color: localTheme.secondaryColor }}>
                  This is how your secondary color looks in text
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Typography</CardTitle>
          <CardDescription>
            Choose fonts that match your brand personality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={localTheme.fontFamily} onValueChange={handleFontChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Preview */}
          <div className="p-4 border rounded-lg space-y-2" style={{ fontFamily: localTheme.fontFamily }}>
            <h3 className="text-xl font-bold">Sample Heading</h3>
            <p className="text-base">
              This is how your body text will look with the selected font family. 
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-sm text-muted-foreground">
              Small text and captions will appear like this.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advanced</CardTitle>
          <CardDescription>
            Additional styling options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Reset to Defaults</Label>
              <p className="text-sm text-muted-foreground">
                Restore the original theme settings
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Preview</CardTitle>
            <CardDescription>
              See how your theme looks on a sample page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg overflow-hidden"
              style={{ fontFamily: localTheme.fontFamily }}
            >
              {/* Sample header */}
              <div 
                className="p-4 text-white"
                style={{ backgroundColor: localTheme.primaryColor }}
              >
                <h2 className="text-lg font-bold">{site.name}</h2>
                <p className="text-sm opacity-90">Your website tagline here</p>
              </div>
              
              {/* Sample content */}
              <div className="p-4 space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: localTheme.primaryColor }}>
                  Welcome to Our Dealership
                </h3>
                <p className="text-muted-foreground">
                  This is a preview of how your content will look with the selected theme.
                  Your actual content will replace this sample text.
                </p>
                <Button 
                  size="sm"
                  style={{ 
                    backgroundColor: localTheme.secondaryColor,
                    borderColor: localTheme.secondaryColor
                  }}
                >
                  Sample Button
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}