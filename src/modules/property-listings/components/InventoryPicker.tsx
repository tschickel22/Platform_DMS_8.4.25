// src/modules/property-listings/components/InventoryPicker.tsx
import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCatalog } from "@/data/catalog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPick: (inventoryId: string) => void;
  listingType?: "manufactured_home" | "rv";
};

export default function InventoryPicker({ open, onOpenChange, onPick, listingType }: Props) {
  const { inventory } = useCatalog();
  const [q, setQ] = React.useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const t = listingType;
    const matchesType = (i: any) => {
      if (!t) return true;
      return t === "manufactured_home"
        ? i.bedrooms || i.bathrooms || i?.dimensions?.squareFeet
        : i.sleeps || i?.dimensions?.length;
    };
    const qq = q.trim().toLowerCase();
    return inventory
      .filter(matchesType)
      .filter((i) =>
        !qq ||
        [i.year, i.make, i.model, i?.location?.city, i?.location?.state]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(qq)
      );
  }, [inventory, q, listingType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>Select inventory</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/inventory")}>
              + Add Inventory
            </Button>
          </div>
        </DialogHeader>

        <div className="mb-3">
          <Input placeholder="Search inventory..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {filtered.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((i: any) => (
              <Card key={i.id} className="overflow-hidden">
                <img src={i.media?.primaryPhoto || "https://picsum.photos/seed/inv/600/320"} className="w-full h-32 object-cover" />
                <CardContent className="p-3">
                  <div className="font-medium">{[i.year, i.make, i.model].filter(Boolean).join(" ")}</div>
                  <div className="text-xs text-muted-foreground">{i.location?.city}, {i.location?.state}</div>
                  <Button className="mt-2 w-full" onClick={() => onPick(i.id)}>Use this</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No inventory matched.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
