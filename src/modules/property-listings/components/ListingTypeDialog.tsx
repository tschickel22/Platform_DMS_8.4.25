import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Home, Caravan } from 'lucide-react' // Caravan may not exist; fallback to Truck or RV icon you have.

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onPick: (type: 'manufactured_home' | 'rv') => void
}

export default function ListingTypeDialog({ open, onOpenChange, onPick }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What are you listing?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex-col" onClick={() => onPick('manufactured_home')}>
            <Home className="h-5 w-5 mb-1" />
            Manufactured Home
          </Button>
          <Button variant="outline" className="h-20 flex-col" onClick={() => onPick('rv')}>
            {/* If you don't have Caravan icon, swap for Truck/Van */}
            <Home className="h-5 w-5 mb-1 rotate-90" />
            RV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}