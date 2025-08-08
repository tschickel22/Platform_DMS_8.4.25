import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Listing, MHDetails, ContactInfo } from '@/types/listings'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ListingFormHeader from './listing-form/ListingFormHeader'
import ListingFormBasicInfoTab from './listing-form/ListingFormBasicInfoTab'
import ListingFormLocationTab from './listing-form/ListingFormLocationTab'
import ListingFormPricingTab from './listing-form/ListingFormPricingTab'
import ListingFormFeaturesTab from './listing-form/ListingFormFeaturesTab'
import ListingFormMHDetailsTab from './listing-form/ListingFormMHDetailsTab'
import ListingFormContactTab from './listing-form/ListingFormContactTab'

interface ListingFormProps {
  listing?: Listing
  onSubmit: (listing: Partial<Listing>) => void
  onCancel: () => void
}

export default function ListingForm({ listing, onSubmit, onCancel }: ListingFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Partial<Listing>>({
    listingType: 'rent',
    title: '',
    description: '',
    termsOfSale: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    county: '',
    township: '',
    schoolDistrict: '',
    latitude: undefined,
    longitude: undefined,
    rent: undefined,
    purchasePrice: undefined,
    lotRent: undefined,
    hoaFees: undefined,
    monthlyTax: undefined,
    monthlyUtilities: undefined,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 0,
    yearBuilt: undefined,
    preferredTerm: '',
    propertyType: 'apartment',
    status: 'active',
    amenities: [],
    outdoorFeatures: [],
    storageOptions: [],
    technologyFeatures: [],
    communityAmenities: [],
    petPolicy: '',
    isRepossessed: false,
    packageType: '',
    pendingSale: false,
    soldPrice: undefined,
    searchResultsText: '',
    agentPhotoUrl: '',
    mhDetails: {
      manufacturer: '',
      model: '',
      serialNumber: '',
      modelYear: undefined,
      color: '',
      communityName: '',
      propertyId: '',
      lotSize: '',
      width1: undefined,
      length1: undefined,
      width2: undefined,
      length2: undefined,
      width3: undefined,
      length3: undefined,
      foundation: '',
      roofType: '',
      roofMaterial: '',
      exteriorMaterial: '',
      ceilingMaterial: '',
      wallMaterial: '',
      hvacType: '',
      waterHeaterType: '',
      electricalSystem: '',
      plumbingType: '',
      insulationType: '',
      windowType: '',
      thermopaneWindows: false,
      flooringType: '',
      kitchenAppliances: [],
      laundryHookups: false,
      laundryRoom: false,
      internetReady: false,
      cableReady: false,
      phoneReady: false,
      garage: false,
      carport: false,
      centralAir: false,
      fireplace: false,
      storageShed: false,
      gutters: false,
      shutters: false,
      deck: false,
      patio: false,
      cathedralCeilings: false,
      ceilingFans: false,
      skylights: false,
      walkinClosets: false,
      pantry: false,
      sunRoom: false,
      basement: false,
      gardenTub: false,
      garbageDisposal: false,
      refrigeratorIncluded: false,
      microwaveIncluded: false,
      ovenIncluded: false,
      dishwasherIncluded: false,
      washerIncluded: false,
      dryerIncluded: false
    },
    images: [],
    videos: [],
    floorPlans: [],
    virtualTours: [],
    contactInfo: {
      mhVillageAccountKey: '',
      firstName: '',
      lastName: '',
      companyName: '',
      phone: '',
      email: '',
      fax: '',
      website: '',
      additionalEmail1: '',
      additionalEmail2: '',
      additionalEmail3: '',
      alternatePhone: ''
    },
    ...listing
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [newOutdoorFeature, setNewOutdoorFeature] = useState('')
  const [newStorageOption, setNewStorageOption] = useState('')
  const [newTechFeature, setNewTechFeature] = useState('')
  const [newCommunityAmenity, setNewCommunityAmenity] = useState('')
  const [newKitchenAppliance, setNewKitchenAppliance] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newVideo, setNewVideo] = useState('')
  const [newFloorPlan, setNewFloorPlan] = useState('')
  const [newVirtualTour, setNewVirtualTour] = useState('')
  const [associatedLandId, setAssociatedLandId] = useState<string>(listing?.associatedLandId || '')
  const [associatedInventoryId, setAssociatedInventoryId] = useState<string>(listing?.associatedInventoryId || '')

  const handleInputChange = (field: keyof Listing, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMHDetailsChange = (field: keyof MHDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      mhDetails: { ...prev.mhDetails, [field]: value }
    }))
  }

  const handleContactInfoChange = (field: keyof ContactInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }))
  }

  const addToArray = (field: keyof Listing, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = (formData[field] as string[]) || []
      handleInputChange(field, [...currentArray, value.trim()])
      setter('')
    }
  }

  const removeFromArray = (field: keyof Listing, index: number) => {
    const currentArray = (formData[field] as string[]) || []
    handleInputChange(field, currentArray.filter((_, i) => i !== index))
  }

  const addKitchenAppliance = () => {
    if (newKitchenAppliance.trim()) {
      const currentAppliances = formData.mhDetails?.kitchenAppliances || []
      handleMHDetailsChange('kitchenAppliances', [...currentAppliances, newKitchenAppliance.trim()])
      setNewKitchenAppliance('')
    }
  }

  const removeKitchenAppliance = (index: number) => {
    const currentAppliances = formData.mhDetails?.kitchenAppliances || []
    handleMHDetailsChange('kitchenAppliances', currentAppliances.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof onSubmit === 'function') {
      const submissionData = {
        ...formData,
        associatedLandId: associatedLandId || null,
        associatedInventoryId: associatedInventoryId || null,
      }
      onSubmit(submissionData)
    }
  }

  const handleCancel = () => {
    navigate('/inventory')
  }

  const isManufacturedHome = formData.propertyType === 'manufactured_home'

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <ListingFormHeader listing={listing} onSubmit={handleSubmit} />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="mh-details" disabled={!isManufacturedHome}>MH Details</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <ListingFormBasicInfoTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    associatedLandId={associatedLandId}
                    setAssociatedLandId={setAssociatedLandId}
                    associatedInventoryId={associatedInventoryId}
                    setAssociatedInventoryId={setAssociatedInventoryId}
                  />
                </TabsContent>

                <TabsContent value="location">
                  <ListingFormLocationTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </TabsContent>

                <TabsContent value="pricing">
                  <ListingFormPricingTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </TabsContent>

                <TabsContent value="features">
                  <ListingFormFeaturesTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    addToArray={addToArray}
                    removeFromArray={removeFromArray}
                    newAmenity={newAmenity}
                    setNewAmenity={setNewAmenity}
                    newOutdoorFeature={newOutdoorFeature}
                    setNewOutdoorFeature={setNewOutdoorFeature}
                    newStorageOption={newStorageOption}
                    setNewStorageOption={setNewStorageOption}
                    newTechFeature={newTechFeature}
                    setNewTechFeature={setNewTechFeature}
                    newCommunityAmenity={newCommunityAmenity}
                    setNewCommunityAmenity={setNewCommunityAmenity}
                    newImage={newImage}
                    setNewImage={setNewImage}
                    newVideo={newVideo}
                    setNewVideo={setNewVideo}
                    newFloorPlan={newFloorPlan}
                    setNewFloorPlan={setNewFloorPlan}
                    newVirtualTour={newVirtualTour}
                    setNewVirtualTour={setNewVirtualTour}
                  />
                </TabsContent>

                <TabsContent value="mh-details">
                  <ListingFormMHDetailsTab
                    formData={formData}
                    handleMHDetailsChange={handleMHDetailsChange}
                    newKitchenAppliance={newKitchenAppliance}
                    setNewKitchenAppliance={setNewKitchenAppliance}
                    addKitchenAppliance={addKitchenAppliance}
                    removeKitchenAppliance={removeKitchenAppliance}
                  />
                </TabsContent>

                <TabsContent value="contact">
                  <ListingFormContactTab
                    formData={formData}
                    handleContactInfoChange={handleContactInfoChange}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}