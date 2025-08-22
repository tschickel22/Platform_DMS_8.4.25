import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ListingDetail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Listing detail component</p>
      </CardContent>
    </Card>
  )
}