import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ListingOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Listing overview component</p>
      </CardContent>
    </Card>
  )
}