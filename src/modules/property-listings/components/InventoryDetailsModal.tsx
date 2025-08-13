// src/modules/property-listings/components/InventoryDetailsModal.tsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  inventoryItem: any | null;
};

export default function InventoryDetailsModal({ open, onOpenChange, inventoryItem }: Props) {
  if (!inventoryItem) return null;

  const type = inventoryItem?.listingType || inventoryItem?.inventoryType || "—";
  const dims = inventoryItem?.dimensions || {};
  const isMH = type === "manufactured_home";
  const isRV = type === "rv";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inventory Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border p-3">
            <div className="font-medium">
              {[inventoryItem?.year, inventoryItem?.make, inventoryItem?.model].filter(Boolean).join(" ")}
            </div>
            <div className="text-sm text-muted-foreground">
              {inventoryItem?.location?.city}, {inventoryItem?.state || inventoryItem?.location?.state}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Type: {isMH ? "Manufactured Home" : isRV ? "RV" : type}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {isMH && (
              <>
                {inventoryItem?.bedrooms != null && (
                  <div><span className="text-muted-foreground">Bedrooms: </span>{inventoryItem.bedrooms}</div>
                )}
                {inventoryItem?.bathrooms != null && (
                  <div><span className="text-muted-foreground">Bathrooms: </span>{inventoryItem.bathrooms}</div>
                )}
                {dims?.squareFeet != null && (
                  <div><span className="text-muted-foreground">Square feet: </span>{dims.squareFeet}</div>
                )}
              </>
            )}

            {isRV && (
              <>
                {inventoryItem?.sleeps != null && (
                  <div><span className="text-muted-foreground">Sleeps: </span>{inventoryItem.sleeps}</div>
                )}
                {dims?.length != null && (
                  <div><span className="text-muted-foreground">Length (ft): </span>{dims.length}</div>
                )}
                {inventoryItem?.slides != null && (
                  <div><span className="text-muted-foreground">Slides: </span>{inventoryItem.slides}</div>
                )}
              </>
            )}
          </div>

          {inventoryItem?.vin && (
            <div className="text-sm"><span className="text-muted-foreground">VIN: </span>{inventoryItem.vin}</div>
          )}
          {inventoryItem?.description && (
            <div className="text-sm"><span className="text-muted-foreground">Notes: </span>{inventoryItem.description}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
