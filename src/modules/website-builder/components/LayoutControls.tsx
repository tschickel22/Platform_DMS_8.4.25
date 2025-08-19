import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Move,
  Square,
  Circle,
  Palette
} from 'lucide-react'

interface LayoutControlsProps {
  blockId: string
  currentStyles: any
  onStyleUpdate: (styles: any) => void
}

export function LayoutControls({ blockId, currentStyles, onStyleUpdate }: LayoutControlsProps) {
  const [padding, setPadding] = useState({
    top: currentStyles?.padding?.top || 16,
    right: currentStyles?.padding?.right || 16,
    bottom: currentStyles?.padding?.bottom || 16,
    left: currentStyles?.padding?.left || 16
  })

  const [margin, setMargin] = useState({
    top: currentStyles?.margin?.top || 0,
    bottom: currentStyles?.margin?.bottom || 0
  })

  const [backgroundColor, setBackgroundColor] = useState(currentStyles?.backgroundColor || 'transparent')
  const [borderRadius, setBorderRadius] = useState(currentStyles?.borderRadius || 0)
  const [borderWidth, setBorderWidth] = useState(currentStyles?.borderWidth || 0)
  const [borderColor, setBorderColor] = useState(currentStyles?.borderColor || '#e5e7eb')
  const [shadowIntensity, setShadowIntensity] = useState(currentStyles?.shadowIntensity || 0)

  const updateStyles = (newStyles: any) => {
    const updatedStyles = { ...currentStyles, ...newStyles }
    onStyleUpdate(updatedStyles)
  }

  const handlePaddingChange = (side: string, value: number) => {
    const newPadding = { ...padding, [side]: value }
    setPadding(newPadding)
    updateStyles({ padding: newPadding })
  }

  const handleMarginChange = (side: string, value: number) => {
    const newMargin = { ...margin, [side]: value }
    setMargin(newMargin)
    updateStyles({ margin: newMargin })
  }

  const presetBackgrounds = [
    { name: 'Transparent', value: 'transparent' },
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f8fafc' },
    { name: 'Dark Gray', value: '#1e293b' },
    { name: 'Primary', value: '#3b82f6' },
    { name: 'Success', value: '#10b981' },
    { name: 'Warning', value: '#f59e0b' },
    { name: 'Danger', value: '#ef4444' }
  ]

  const shadowPresets = [
    { name: 'None', value: 0, shadow: 'none' },
    { name: 'Small', value: 1, shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { name: 'Medium', value: 2, shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    { name: 'Large', value: 3, shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    { name: 'Extra Large', value: 4, shadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }
  ]

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg">Layout & Styling</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spacing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="border">Border</TabsTrigger>
          </TabsList>

          <TabsContent value="spacing" className="space-y-6">
            {/* Padding Controls */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding (px)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="padding-top" className="text-xs">Top</Label>
                  <Input
                    id="padding-top"
                    type="number"
                    value={padding.top}
                    onChange={(e) => handlePaddingChange('top', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="padding-right" className="text-xs">Right</Label>
                  <Input
                    id="padding-right"
                    type="number"
                    value={padding.right}
                    onChange={(e) => handlePaddingChange('right', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="padding-bottom" className="text-xs">Bottom</Label>
                  <Input
                    id="padding-bottom"
                    type="number"
                    value={padding.bottom}
                    onChange={(e) => handlePaddingChange('bottom', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="padding-left" className="text-xs">Left</Label>
                  <Input
                    id="padding-left"
                    type="number"
                    value={padding.left}
                    onChange={(e) => handlePaddingChange('left', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            {/* Margin Controls */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Margin (px)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="margin-top" className="text-xs">Top</Label>
                  <Input
                    id="margin-top"
                    type="number"
                    value={margin.top}
                    onChange={(e) => handleMarginChange('top', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="margin-bottom" className="text-xs">Bottom</Label>
                  <Input
                    id="margin-bottom"
                    type="number"
                    value={margin.bottom}
                    onChange={(e) => handleMarginChange('bottom', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Background Color</Label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetBackgrounds.map((bg) => (
                  <button
                    key={bg.value}
                    className="h-8 rounded border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center text-xs"
                    style={{ backgroundColor: bg.value === 'transparent' ? 'white' : bg.value }}
                    onClick={() => {
                      setBackgroundColor(bg.value)
                      updateStyles({ backgroundColor: bg.value })
                    }}
                  >
                    {bg.value === 'transparent' && (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-white rounded" />
                    )}
                  </button>
                ))}
              </div>
              <Input
                type="color"
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value)
                  updateStyles({ backgroundColor: e.target.value })
                }}
                className="w-full h-8"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Shadow</Label>
              <div className="grid grid-cols-2 gap-2">
                {shadowPresets.map((shadow) => (
                  <Button
                    key={shadow.value}
                    variant={shadowIntensity === shadow.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setShadowIntensity(shadow.value)
                      updateStyles({ 
                        shadowIntensity: shadow.value,
                        boxShadow: shadow.shadow 
                      })
                    }}
                  >
                    {shadow.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="border" className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Border Radius: {borderRadius}px</Label>
              <Slider
                value={[borderRadius]}
                onValueChange={(value) => {
                  setBorderRadius(value[0])
                  updateStyles({ borderRadius: `${value[0]}px` })
                }}
                min={0}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Border Width: {borderWidth}px</Label>
              <Slider
                value={[borderWidth]}
                onValueChange={(value) => {
                  setBorderWidth(value[0])
                  updateStyles({ 
                    borderWidth: `${value[0]}px`,
                    borderStyle: value[0] > 0 ? 'solid' : 'none'
                  })
                }}
                min={0}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>

            {borderWidth > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Border Color</Label>
                <Input
                  type="color"
                  value={borderColor}
                  onChange={(e) => {
                    setBorderColor(e.target.value)
                    updateStyles({ borderColor: e.target.value })
                  }}
                  className="w-full h-8"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}