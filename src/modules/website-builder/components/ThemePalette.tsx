import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, RefreshCw } from 'lucide-react'
import { Theme } from '../types'

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
    secondaryColor: '#4b5563',
    fontFamily: 'Inter'
  }
]

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' }
]

export default function ThemePalette({ theme, onThemeUpdate }: ThemePaletteProps) {
  const [customColors, setCustomColors] = useState({
  const [customPrimaryColor, setCustomPrimaryColor] = useState(theme?.primaryColor || '#2563eb')
  const [customSecondaryColor, setCustomSecondaryColor] = useState(theme?.secondaryColor || '#64748b')
  const [customFontFamily, setCustomFontFamily] = useState(theme?.fontFamily || 'Inter')
    primary: theme?.primaryColor || '#3b82f6',
    secondary: theme?.secondaryColor || '#64748b'
  })

  const currentTheme: Theme = {
    primaryColor: theme?.primaryColor || '#3b82f6',
    secondaryColor: theme?.secondaryColor || '#64748b',
    fontFamily: theme?.fontFamily || 'Inter'
  }

  const handlePresetSelect = (preset: typeof presetThemes[0]) => {
    const newTheme: Theme = {
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      fontFamily: preset.fontFamily
    }
    onThemeUpdate(newTheme)
    setCustomColors({
      primary: preset.primaryColor,
      secondary: preset.secondaryColor
    })
  }

  const handleCustomColorUpdate = () => {
    const newTheme: Theme = {
      ...currentTheme,
      primaryColor: customColors.primary,
      secondaryColor: customColors.secondary
    }
    onThemeUpdate(newTheme)
  }

  const handleFontChange = (fontFamily: string) => {
    const newTheme: Theme = {
      ...currentTheme,
      fontFamily
  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' }
  ]

    }
    onThemeUpdate(newTheme)
  }

  const handleCustomColorChange = () => {
    const customTheme: Theme = {
      primaryColor: customPrimaryColor,
      secondaryColor: customSecondaryColor,
      fontFamily: customFontFamily
    }
    applyTheme(customTheme)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme & Style
        </CardTitle>
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme & Style</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="space-y-3 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Preset Themes</h4>
                <div className="space-y-2">
                  {presetThemes.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => applyTheme(preset.theme)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.theme.primaryColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.theme.secondaryColor }}
                          />
                        </div>
                        <span className="text-sm">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Custom Colors</Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                  className="w-10 h-8 rounded border cursor-pointer"
                />
                <Input
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                  className="flex-1 text-xs font-mono"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                  className="w-10 h-8 rounded border cursor-pointer"
                />
                <Input
                  value={customColors.secondary}
                  onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                  className="flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleCustomColorUpdate}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Apply Colors
            </Button>
          </div>
        </div>

        {/* Typography */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Typography</Label>
          <div>
            <Label className="text-xs text-muted-foreground">Font Family</Label>
            <select
              value={currentTheme.fontFamily}
              onChange={(e) => handleFontChange(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md text-sm"
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Theme Preview */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Preview</Label>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              fontFamily: currentTheme.fontFamily,
              backgroundColor: `${currentTheme.primaryColor}10`
            }}
          >
            <h3 
              className="font-bold text-lg mb-2"
              style={{ color: currentTheme.primaryColor }}
            >
              Sample Heading
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              This is how your content will look with the selected theme.
            </p>
            <button
              className="px-4 py-2 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="primary-color" className="text-sm font-medium">
                    Primary Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="flex-1"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary-color" className="text-sm font-medium">
                    Secondary Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={customSecondaryColor}
                      onChange={(e) => setCustomSecondaryColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={customSecondaryColor}
                      onChange={(e) => setCustomSecondaryColor(e.target.value)}
                      className="flex-1"
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="font-family" className="text-sm font-medium">
                    Font Family
                  </Label>
                  <select
                    id="font-family"
                    value={customFontFamily}
                    onChange={(e) => setCustomFontFamily(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button 
                  onClick={handleCustomColorChange}
                  className="w-full"
                >
                  Apply Custom Theme
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}