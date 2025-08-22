import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ListingForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Listing form component</p>
      </CardContent>
    </Card>
  )
}