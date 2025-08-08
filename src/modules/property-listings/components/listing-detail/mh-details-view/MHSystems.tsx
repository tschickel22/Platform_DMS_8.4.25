import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'
import { MHDetails } from '@/types/listings'

interface MHSystemsProps {
  mhDetails: MHDetails
}

export function MHSystems({ mhDetails }: MHSystemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mhDetails.hvacType && (
            <div>
              <span className="text-sm text-muted-foreground">HVAC</span>
              <div className="font-semibold">{mhDetails.hvacType}</div>
            </div>
          )}
          {mhDetails.waterHeaterType && (
            <div>
              <span className="text-sm text-muted-foreground">Water Heater</span>
              <div className="font-semibold">{mhDetails.waterHeaterType}</div>
            </div>
          )}
          {mhDetails.electricalSystem && (
            <div>
              <span className="text-sm text-muted-foreground">Electrical</span>
              <div className="font-semibold">{mhDetails.electricalSystem}</div>
            </div>
          )}
          {mhDetails.plumbingType && (
            <div>
              <span className="text-sm text-muted-foreground">Plumbing</span>
              <div className="font-semibold">{mhDetails.plumbingType}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}