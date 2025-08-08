import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Listing } from '@/types/listings'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ListingDetailHeader } from './listing-detail/ListingDetailHeader'
import { ListingOverviewTab } from './listing-detail/ListingOverviewTab'
import { ListingDetailsTab } from './listing-detail/ListingDetailsTab'
import { ListingFeaturesTab } from './listing-detail/ListingFeaturesTab'
import { ListingMHDetailsTab } from './listing-detail/ListingMHDetailsTab'
import { ListingMediaTab } from './listing-detail/ListingMediaTab'
import { ListingContactTab } from './listing-detail/ListingContactTab'

interface ListingDetailProps {
  listing: Listing
  onEdit?: () => void
  onClose?: () => void
}

export default function ListingDetail({ listing, onEdit, onClose }: ListingDetailProps) {
  const isManufacturedHome = listing.propertyType === 'manufactured_home'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ErrorBoundary>
        <Card>
          <ListingDetailHeader listing={listing} onEdit={onEdit} onClose={onClose} />
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="mh-details" disabled={!isManufacturedHome}>MH Details</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ListingOverviewTab listing={listing} />
              </TabsContent>

              <TabsContent value="details">
                <ListingDetailsTab listing={listing} />
              </TabsContent>

              <TabsContent value="features">
                <ListingFeaturesTab listing={listing} />
              </TabsContent>

              <TabsContent value="mh-details">
                <ListingMHDetailsTab listing={listing} />
              </TabsContent>

              <TabsContent value="media">
                <ListingMediaTab listing={listing} />
              </TabsContent>

              <TabsContent value="contact">
                <ListingContactTab listing={listing} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  )
}