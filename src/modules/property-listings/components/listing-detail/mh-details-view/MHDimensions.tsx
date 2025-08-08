import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MHDetails } from '@/types/listings'

interface MHDimensionsProps {
  mhDetails: MHDetails
}

export function MHDimensions({ mhDetails }: MHDimensionsProps) {
  const hasDimensions = mhDetails.width1 || mhDetails.length1

  if (!hasDimensions) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {mhDetails.width1 && (
            <div>
              <span className="text-sm text-muted-foreground">Width 1</span>
              <div className="font-semibold">{mhDetails.width1}'</div>
            </div>
          )}
          {mhDetails.length1 && (
            <div>
              <span className="text-sm text-muted-foreground">Length 1</span>
              <div className="font-semibold">{mhDetails.length1}'</div>
            </div>
          )}
          {mhDetails.width2 && (
            <div>
              <span className="text-sm text-muted-foreground">Width 2</span>
              <div className="font-semibold">{mhDetails.width2}'</div>
            </div>
          )}
          {mhDetails.length2 && (
            <div>
              <span className="text-sm text-muted-foreground">Length 2</span>
              <div className="font-semibold">{mhDetails.length2}'</div>
            </div>
          )}
          {mhDetails.width3 && (
            <div>
              <span className="text-sm text-muted-foreground">Width 3</span>
              <div className="font-semibold">{mhDetails.width3}'</div>
            </div>
          )}
          {mhDetails.length3 && (
            <div>
              <span className="text-sm text-muted-foreground">Length 3</span>
              <div className="font-semibold">{mhDetails.length3}'</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}