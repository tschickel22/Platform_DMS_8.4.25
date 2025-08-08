import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, X, Camera } from 'lucide-react'
import { Listing } from '@/types/listings'

interface MediaSectionProps {
  formData: Partial<Listing>
  handleInputChange: (field: keyof Listing, value: any) => void
  addToArray: (field: keyof Listing, value: string, setter: (value: string) => void) => void
  removeFromArray: (field: keyof Listing, index: number) => void
  newImage: string
  setNewImage: (value: string) => void
  newVideo: string
  setNewVideo: (value: string) => void
  newFloorPlan: string
  setNewFloorPlan: (value: string) => void
  newVirtualTour: string
  setNewVirtualTour: (value: string) => void
}

export default function MediaSection({
  formData,
  handleInputChange,
  addToArray,
  removeFromArray,
  newImage,
  setNewImage,
  newVideo,
  setNewVideo,
  newFloorPlan,
  setNewFloorPlan,
  newVirtualTour,
  setNewVirtualTour
}: MediaSectionProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          <h4 className="text-md font-semibold">Media</h4>
        </div>

        {/* Images */}
        <div>
          <Label>Images</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Add image URL"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('images', newImage, setNewImage))}
            />
            <Button type="button" onClick={() => addToArray('images', newImage, setNewImage)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.images || []).map((image, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                Image {index + 1}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('images', index)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div>
          <Label>Videos</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newVideo}
              onChange={(e) => setNewVideo(e.target.value)}
              placeholder="Add video URL"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('videos', newVideo, setNewVideo))}
            />
            <Button type="button" onClick={() => addToArray('videos', newVideo, setNewVideo)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.videos || []).map((video, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                Video {index + 1}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('videos', index)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Floor Plans */}
        <div>
          <Label>Floor Plans</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newFloorPlan}
              onChange={(e) => setNewFloorPlan(e.target.value)}
              placeholder="Add floor plan URL"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('floorPlans', newFloorPlan, setNewFloorPlan))}
            />
            <Button type="button" onClick={() => addToArray('floorPlans', newFloorPlan, setNewFloorPlan)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.floorPlans || []).map((plan, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                Floor Plan {index + 1}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('floorPlans', index)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Virtual Tours */}
        <div>
          <Label>Virtual Tours</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newVirtualTour}
              onChange={(e) => setNewVirtualTour(e.target.value)}
              placeholder="Add virtual tour URL"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('virtualTours', newVirtualTour, setNewVirtualTour))}
            />
            <Button type="button" onClick={() => addToArray('virtualTours', newVirtualTour, setNewVirtualTour)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.virtualTours || []).map((tour, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                Virtual Tour {index + 1}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('virtualTours', index)} />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="agentPhotoUrl">Agent/Company Photo URL</Label>
          <Input
            id="agentPhotoUrl"
            value={formData.agentPhotoUrl || ''}
            onChange={(e) => handleInputChange('agentPhotoUrl', e.target.value)}
            placeholder="URL for agent or company logo photo"
          />
        </div>
      </div>
    </div>
  )
}