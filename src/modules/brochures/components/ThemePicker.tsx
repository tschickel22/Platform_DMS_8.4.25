import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrochureTheme } from '../types'

interface ThemePickerProps {
  themes: BrochureTheme[]
  selectedTheme: string
  onThemeChange: (themeId: string) => void
}

export function ThemePicker({ themes, selectedTheme, onThemeChange }: ThemePickerProps) {
  return (
    <div className="grid gap-3">
      {themes.map((theme) => (
        <Card 
          key={theme.id}
          className={`cursor-pointer transition-colors ${
            selectedTheme === theme.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
          }`}
          onClick={() => onThemeChange(theme.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{theme.name}</h4>
              <div className="flex space-x-1">
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: theme.secondaryColor }}
                />
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{theme.description}</p>
            <Badge variant="outline" className="text-xs">
              {theme.fontFamily}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}