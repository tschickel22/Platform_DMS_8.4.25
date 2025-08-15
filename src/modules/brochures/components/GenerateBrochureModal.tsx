import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Palette, Download, Settings } from 'lucide-react'

interface GenerateBrochureModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle?: any
}

export function GenerateBrochureModal({ isOpen, onClose, vehicle }: GenerateBrochureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Brochure
          </DialogTitle>
          <DialogDescription>
            Create a professional brochure for {vehicle?.make} {vehicle?.model} {vehicle?.year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
              <CardDescription>
                Details for the selected vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Make:</span> {vehicle?.make || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Model:</span> {vehicle?.model || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Year:</span> {vehicle?.year || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {vehicle?.listingType || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Price:</span> ${vehicle?.salePrice?.toLocaleString() || vehicle?.rentPrice?.toLocaleString() || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {vehicle?.status || 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brochure Options - Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Palette className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Choose Template</h3>
                <p className="text-sm text-muted-foreground">Select brochure design</p>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Settings className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Customize</h3>
                <p className="text-sm text-muted-foreground">Edit content & layout</p>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Download className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Generate</h3>
                <p className="text-sm text-muted-foreground">Download PDF</p>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Brochure Generator Coming Soon</h3>
            </div>
            <p className="text-sm text-blue-700">
              The brochure generation feature is currently under development. 
              This modal will allow you to create professional marketing brochures 
              for your inventory items with customizable templates and layouts.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button disabled>
              Generate Brochure
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}