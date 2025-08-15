import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Keyboard, Scan } from 'lucide-react'

interface BarcodeScannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScan: (barcode: string) => void
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  open,
  onOpenChange,
  onScan
}) => {
  const [manualInput, setManualInput] = useState('')
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual')
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup camera stream when dialog closes
  useEffect(() => {
    if (!open && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setIsScanning(false)
    }
  }, [open])

  const startCamera = async () => {
    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setIsScanning(false)
      setScanMode('manual')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
      setManualInput('')
      onOpenChange(false)
    }
  }

  const handleScanModeChange = (mode: 'camera' | 'manual') => {
    if (mode === 'camera' && scanMode === 'manual') {
      setScanMode('camera')
      startCamera()
    } else if (mode === 'manual' && scanMode === 'camera') {
      setScanMode('manual')
      stopCamera()
    }
  }

  // Mock barcode detection (in production, use a real barcode scanning library)
  const simulateScan = () => {
    const mockBarcodes = [
      '1FDXE45S8HDA12345',
      '2GCEC19T3X1234567',
      'CLT123456789',
      '4T1BF1FK5CU123456'
    ]
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
    onScan(randomBarcode)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Scan a VIN or serial number barcode, or enter it manually
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScanModeChange('camera')}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScanModeChange('manual')}
              className="flex-1"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Manual
            </Button>
          </div>

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <Card>
              <CardContent className="p-4">
                {isScanning ? (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 bg-black rounded-md"
                    />
                    <div className="flex gap-2">
                      <Button onClick={simulateScan} className="flex-1">
                        <Scan className="h-4 w-4 mr-2" />
                        Simulate Scan
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Stop
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Position the barcode within the camera view
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Camera access required for scanning
                    </p>
                    <Button onClick={startCamera}>
                      Start Camera
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Manual Mode */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <Label htmlFor="manual-input">Enter VIN or Serial Number</Label>
                <Input
                  id="manual-input"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g., 1FDXE45S8HDA12345"
                  className="font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!manualInput.trim()} className="flex-1">
                  Submit
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}