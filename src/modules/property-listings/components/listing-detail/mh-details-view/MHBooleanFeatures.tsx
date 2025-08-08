import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BooleanIndicator } from '../BooleanIndicator'
import { MHDetails } from '@/types/listings'

interface MHBooleanFeaturesProps {
  mhDetails: MHDetails
}

export function MHBooleanFeatures({ mhDetails }: MHBooleanFeaturesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <BooleanIndicator value={mhDetails.garage} label="Garage" />
          <BooleanIndicator value={mhDetails.carport} label="Carport" />
          <BooleanIndicator value={mhDetails.centralAir} label="Central Air" />
          <BooleanIndicator value={mhDetails.thermopaneWindows} label="Thermopane Windows" />
          <BooleanIndicator value={mhDetails.fireplace} label="Fireplace" />
          <BooleanIndicator value={mhDetails.storageShed} label="Storage Shed" />
          <BooleanIndicator value={mhDetails.gutters} label="Gutters" />
          <BooleanIndicator value={mhDetails.shutters} label="Shutters" />
          <BooleanIndicator value={mhDetails.deck} label="Deck" />
          <BooleanIndicator value={mhDetails.patio} label="Patio" />
          <BooleanIndicator value={mhDetails.cathedralCeilings} label="Cathedral Ceilings" />
          <BooleanIndicator value={mhDetails.ceilingFans} label="Ceiling Fans" />
          <BooleanIndicator value={mhDetails.skylights} label="Skylights" />
          <BooleanIndicator value={mhDetails.walkinClosets} label="Walk-in Closets" />
          <BooleanIndicator value={mhDetails.laundryRoom} label="Laundry Room" />
          <BooleanIndicator value={mhDetails.pantry} label="Pantry" />
          <BooleanIndicator value={mhDetails.sunRoom} label="Sun Room" />
          <BooleanIndicator value={mhDetails.basement} label="Basement" />
          <BooleanIndicator value={mhDetails.gardenTub} label="Garden Tub" />
          <BooleanIndicator value={mhDetails.garbageDisposal} label="Garbage Disposal" />
          <BooleanIndicator value={mhDetails.laundryHookups} label="Laundry Hookups" />
          <BooleanIndicator value={mhDetails.internetReady} label="Internet Ready" />
          <BooleanIndicator value={mhDetails.cableReady} label="Cable Ready" />
          <BooleanIndicator value={mhDetails.phoneReady} label="Phone Ready" />
        </div>
      </CardContent>
    </Card>
  )
}