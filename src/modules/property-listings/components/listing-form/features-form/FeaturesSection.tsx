import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { Listing } from '@/types/listings'

interface FeaturesSectionProps {
  formData: Partial<Listing>
  handleInputChange: (field: keyof Listing, value: any) => void
  addToArray: (field: keyof Listing, value: string, setter: (value: string) => void) => void
  removeFromArray: (field: keyof Listing, index: number) => void
  newAmenity: string
  setNewAmenity: (value: string) => void
  newOutdoorFeature: string
  setNewOutdoorFeature: (value: string) => void
  newStorageOption: string
  setNewStorageOption: (value: string) => void
  newTechFeature: string
  setNewTechFeature: (value: string) => void
  newCommunityAmenity: string
  setNewCommunityAmenity: (value: string) => void
}

export default function FeaturesSection({
  formData,
  handleInputChange,
  addToArray,
  removeFromArray,
  newAmenity,
  setNewAmenity,
  newOutdoorFeature,
  setNewOutdoorFeature,
  newStorageOption,
  setNewStorageOption,
  newTechFeature,
  setNewTechFeature,
  newCommunityAmenity,
  setNewCommunityAmenity
}: FeaturesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Amenities */}
      <div>
        <Label>Amenities</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add amenity"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('amenities', newAmenity, setNewAmenity))}
          />
          <Button type="button" onClick={() => addToArray('amenities', newAmenity, setNewAmenity)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.amenities || []).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {amenity}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('amenities', index)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Outdoor Features */}
      <div>
        <Label>Outdoor Features</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newOutdoorFeature}
            onChange={(e) => setNewOutdoorFeature(e.target.value)}
            placeholder="Add outdoor feature"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('outdoorFeatures', newOutdoorFeature, setNewOutdoorFeature))}
          />
          <Button type="button" onClick={() => addToArray('outdoorFeatures', newOutdoorFeature, setNewOutdoorFeature)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.outdoorFeatures || []).map((feature, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {feature}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('outdoorFeatures', index)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Storage Options */}
      <div>
        <Label>Storage Options</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newStorageOption}
            onChange={(e) => setNewStorageOption(e.target.value)}
            placeholder="Add storage option"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('storageOptions', newStorageOption, setNewStorageOption))}
          />
          <Button type="button" onClick={() => addToArray('storageOptions', newStorageOption, setNewStorageOption)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.storageOptions || []).map((option, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {option}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('storageOptions', index)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Technology Features */}
      <div>
        <Label>Technology Features</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTechFeature}
            onChange={(e) => setNewTechFeature(e.target.value)}
            placeholder="Add technology feature"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('technologyFeatures', newTechFeature, setNewTechFeature))}
          />
          <Button type="button" onClick={() => addToArray('technologyFeatures', newTechFeature, setNewTechFeature)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.technologyFeatures || []).map((feature, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {feature}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('technologyFeatures', index)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Community Amenities */}
      <div>
        <Label>Community Amenities</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newCommunityAmenity}
            onChange={(e) => setNewCommunityAmenity(e.target.value)}
            placeholder="Add community amenity"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('communityAmenities', newCommunityAmenity, setNewCommunityAmenity))}
          />
          <Button type="button" onClick={() => addToArray('communityAmenities', newCommunityAmenity, setNewCommunityAmenity)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.communityAmenities || []).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {amenity}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('communityAmenities', index)} />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}