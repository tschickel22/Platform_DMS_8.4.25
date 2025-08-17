import React, { useState, useEffect } from 'react'
import { Theme, Brand } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette, Upload } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'

interface ThemePaletteProps {
  theme?: Theme
  brand?: Brand
  onUpdateTheme: (theme: Theme) => void
  onUpdateBrand: (brand: Brand) => void
}

const presetThemes: Theme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      section: '4rem',
      container: '1200px'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#dc2626',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      section: '3rem',
      container: '1200px'
    }
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter'
    },
    spacing: {
      section: '4rem',
      container: '1200px'
    }
  }
]

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Playfair Display',
  'Merriweather',
  'Lato',
  'Poppins'
]

export function ThemePalette({ theme, brand, onUpdateTheme, onUpdateBrand }: ThemePaletteProps) {
  const { tenant } = useTenant()
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme || presetThemes[0])
  const [currentBrand, setCurrentBrand] = useState<Brand>(brand || {})

  // Auto-populate brand from company settings
  useEffect(() => {
    if (tenant?.branding && !brand?.logoUrl && !brand?.color) {
      const companyBrand: Brand = {
        logoUrl: tenant.branding.logo,
        color: tenant.branding.primaryColor
      }
      setCurrentBrand(companyBrand)
      onUpdateBrand(companyBrand)
    }
  }, [tenant, brand, onUpdateBrand])

  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme)
    onUpdateTheme(newTheme)
  }

  const handleColorChange = (colorKey: keyof Theme['colors'], value: string) => {
    const updatedTheme = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [colorKey]: value
      }
    }
    handleThemeChange(updatedTheme)
  }

  const handleFontChange = (fontKey: keyof Theme['fonts'], value: string) => {
    const updatedTheme = {
      ...currentTheme,
      fonts: {
        ...currentTheme.fonts,
        [fontKey]: value
      }
    }
    handleThemeChange(updatedTheme)
  }

  const handleBrandChange = (key: keyof Brand, value: string) => {
    const updatedBrand = {
      ...currentBrand,
      [key]: value
    }
    setCurrentBrand(updatedBrand)
    onUpdateBrand(updatedBrand)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Palette className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Theme & Branding</h3>
      </div>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preset Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presetThemes.map((preset) => (
              <Card 
                key={preset.id}
                className={`cursor-pointer transition-colors ${
                  currentTheme.id === preset.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => handleThemeChange(preset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <span className="text-sm font-medium">{preset.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    {Object.values(preset.colors).slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Override */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Override</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              value={currentBrand.logoUrl || ''}
              onChange={(e) => handleBrandChange('logoUrl', e.target.value)}
              placeholder={tenant?.branding?.logo || 'https://example.com/logo.png'}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {tenant?.branding?.logo ? 'Using company logo as default' : 'Enter a logo URL'}
            </p>
          </div>
          <div>
            <Label htmlFor="brand-color">Brand Color</Label>
            <div className="flex space-x-2">
              <Input
                id="brand-color"
                type="color"
                value={currentBrand.color || tenant?.branding?.primaryColor || '#3b82f6'}
                onChange={(e) => handleBrandChange('color', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={currentBrand.color || tenant?.branding?.primaryColor || '#3b82f6'}
                onChange={(e) => handleBrandChange('color', e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(currentTheme.colors).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={`color-${key}`} className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id={`color-${key}`}
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={value}
                  onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heading-font">Heading Font</Label>
            <select
              id="heading-font"
              value={currentTheme.fonts.heading}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="body-font">Body Font</Label>
            <select
              id="body-font"
              value={currentTheme.fonts.body}
              onChange={(e) => handleFontChange('body', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text,
              fontFamily: currentTheme.fonts.body
            }}
          >
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ 
                color: currentTheme.colors.primary,
                fontFamily: currentTheme.fonts.heading
              }}
            >
              Sample Heading
            </h1>
            <p className="mb-4">
              This is how your body text will look with the current theme settings.
            </p>
            <Button
              style={{ 
                backgroundColor: currentBrand.color || currentTheme.colors.primary,
                color: currentTheme.colors.background
              }}
            >
              Sample Button
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}