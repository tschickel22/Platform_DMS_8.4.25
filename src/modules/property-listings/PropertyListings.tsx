// src/modules/property-listings/PropertyListings.tsx
import React, { useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Building, Home, DollarSign, Search, MapPin, Bed, Bath, Square, Users, Ruler, Eye, Trash2, Plus, Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

import InventoryPicker from "./components/InventoryPicker";
import ListingForm from "./components/ListingForm";
import { ShareAllListingsModal } from "./components/ShareAllListingsModal";
import InventoryDetailsModal from "./components/InventoryDetailsModal";

import { useCatalog, useEffectiveListings } from "@/data/catalog";

/* helpers */
const priceText = (sale?: number, rent?: number) => {
  if (sale && sale > 0) return `$${sale.toLocaleString()}`;
  if (rent && rent > 0) return `$${rent.toLocaleString()}/mo`;
  return "Price on request";
};
const statusBadge = (s?: string) => (s === "active" ? "bg-green-500" : s === "draft" ? "bg-yellow-500" : "bg-gray-500");
const typeBadge = (t?: string) => (t === "manufactured_home" ? "bg-blue-500" : "bg-purple-500");

function PropertyListingsDashboard() {
  const nav = useNavigate();
  const effective = useEffectiveListings();
  const { inventory, listings, createListingForInventory, updateListing, deleteListing, pushOverridesToInventory } =
    useCatalog();

  /* dialogs/state */
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [pickedInvId, setPickedInvId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [invDetailsId, setInvDetailsId] = useState<string | null>(null);

  const editingListing = useMemo(
    () => listings.find((l: any) => l.id === editingId) || null,
    [listings, editingId]
  );
  const editingInventory = useMemo(
    () => (editingListing ? inventory.find((i: any) => i.id === editingListing.inventoryId) || null : null),
    [inventory, editingListing]
  );
  const pickedInventory = useMemo(
    () => (pickedInvId ? inventory.find((i: any) => i.id === pickedInvId) || null : null),
    [inventory, pickedInvId]
  );
  const invDetails = useMemo(
    () => (invDetailsId ? inventory.find((i: any) => i.id === invDetailsId) || null : null),
    [inventory, invDetailsId]
  );

  /* filters */
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "manufactured_home" | "rv">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "under100k" | "100k-300k" | "over300k">("all");
  const [activeTile, setActiveTile] = useState<"all" | "active" | "premium">("all");

  const setIfChanged =
    <T,>(setter: (v: T) => void, cur: T) =>
    (v: T) => {
      if (!Object.is(v, cur)) setter(v);
    };

  /* stats */
  const stats = useMemo(() => {
    const total = effective.length;
    const active = effective.filter((l: any) => l.status === "active").length;
    const prices = effective.map((l: any) => Number(l.salePrice ?? l.rentPrice ?? 0)).filter((v: number) => v > 0);
    const avgPrice = prices.length ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : 0;
    return { total, active, avgPrice };
  }, [effective]);

  /* filtered list */
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const withinPrice = (sale?: number, rent?: number) => {
      const val = Number(sale ?? rent ?? 0);
      if (priceFilter === "under100k") return val < 100000;
      if (priceFilter === "100k-300k") return val >= 100000 && val <= 300000;
      if (priceFilter === "over300k") return val > 300000;
      return true;
    };
    return effective.filter((l: any) => {
      const text = [l.description, l.location?.city, l.location?.state, l.make, l.model, l.year]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const sOk = statusFilter === "all" || l.status === statusFilter;
      const tOk = typeFilter === "all" || l.listingType === typeFilter;
      return (!qq || text.includes(qq)) && sOk && tOk && withinPrice(l.salePrice, l.rentPrice);
    });
  }, [effective, q, statusFilter, typeFilter, priceFilter]);

  /* tiles */
  const activateAll = () => { setActiveTile("all"); setStatusFilter("all"); setPriceFilter("all"); };
  const activateActive = () => { setActiveTile("active"); setStatusFilter("active"); setPriceFilter("all"); };
  const activatePremium = () => { setActiveTile("premium"); setStatusFilter("all"); setPriceFilter("over300k"); };

  /* CRUD */
  const startCreate = () => { setPickedInvId(null); setPickerOpen(true); };
  const handlePick = (invId: string) => { setPickedInvId(invId); setPickerOpen(false); setFormOpen(true); };
  const saveCreate = (patch: any) => {
    if (!pickedInvId) return;
    try { createListingForInventory(pickedInvId, patch); setFormOpen(false); setPickedInvId(null); }
    catch (e: any) { alert(e?.message ?? "Failed to create listing"); }
  };
  const saveEdit = (patch: any) => { if (!editingListing) return; updateListing(editingListing.id, patch); setEditingId(null); };
  const remove = (id: string) => { if (!confirm("Delete this listing?")) return; deleteListing(id); };

  /** Resolve a raw listing id for a row from useEffectiveListings (ids may differ). */
  const openEdit = (row: any) => {
    const guessIds = [
      row?.id,
      row?.listingId,
      row?._id,
    ].filter(Boolean);

    // try direct id match first
    let found = listings.find((x: any) => guessIds.includes(x.id));
    // fall back to inventory lineage
    if (!found) {
      const invId = row?.inventoryId || row?.id;
      found =
        listings.find((x: any) => x.inventoryId === invId) ||
        null;
    }

    if (found) {
      setEditingId(found.id);
      return;
    }

    // last resort: open a create form prefilled from the matching inventory
    const inv = inventory.find((i: any) => i.id === (row?.inventoryId || row?.id));
    if (inv) {
      setPickedInvId(inv.id);
      setFormOpen(true);
    } else {
      console.warn("View/Edit: could not resolve listing from row:", row);
    }
  };

  /* share-all summary */
  const summaryStats = useMemo(
    () => ({ totalListings: stats.total, activeListings: stats.active, averagePrice: stats.avgPrice }),
    [stats]
  );

  return (
    <div className="space-y-6" data-pl-sentinel="property-listings-v2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">
            Listings are created from existing inventory. MH requires bedrooms, bathrooms and square feet.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShareOpen(true)} data-pl-share-all>
            <Share2 className="h-4 w-4" /> Share All Listings
          </Button>
          <Button className="flex items-center gap-2" onClick={startCreate}>
            <Plus className="h-4 w-4" /> Add New Listing
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card onClick={activateAll} role="button" tabIndex={0} className={cn("shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer", activeTile === "all" && "ring-2 ring-blue-300")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Listings</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">All property listings</p>
          </CardContent>
        </Card>

        <Card onClick={activateActive} role="button" tabIndex={0} className={cn("shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer", activeTile === "active" && "ring-2 ring-green-300")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.active}</div>
            <p className="text-xs text-green-600">Available now</p>
          </CardContent>
        </Card>

        <Card onClick={activatePremium} role="button" tabIndex={0} className={cn("shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer", activeTile === "premium" && "ring-2 ring-yellow-300")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">${stats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-yellow-600">Click to view premium (&gt;$300k)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Find listings fast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search make/model/city/state…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Select value={statusFilter} onValueChange={setIfChanged((v: any) => { setStatusFilter(v); setActiveTile("all"); }, statusFilter)}>
              <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setIfChanged((v: any) => { setTypeFilter(v); setActiveTile("all"); }, typeFilter)}>
              <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setIfChanged((v: any) => { setPriceFilter(v); setActiveTile("all"); }, priceFilter)}>
              <SelectTrigger><SelectValue placeholder="All Prices" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100k">Under $100K</SelectItem>
                <SelectItem value="100k-300k">$100K – $300K</SelectItem>
                <SelectItem value="over300k">Over $300K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Count */}
      <div className="text-sm text-muted-foreground">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</div>

      {/* Grid */}
      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l: any) => (
            <Card key={l.id ?? l.inventoryId} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={l.media?.primaryPhoto || "https://picsum.photos/800/450"} alt={l.model ?? l.make ?? "Listing"} className="w-full h-48 object-cover" />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={`${statusBadge(l.status)} text-white`}>{l.status}</Badge>
                  <Badge className={`${typeBadge(l.listingType)} text-white`}>{l.listingType === "manufactured_home" ? "MH" : "RV"}</Badge>
                  {l.hasOverrides && <Badge variant="secondary">Overrides</Badge>}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">{priceText(l.salePrice, l.rentPrice)}</Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{[l.year, l.make, l.model].filter(Boolean).join(" ")}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" /> {(l.location?.city || "—")}, {(l.location?.state || "")}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {l.listingType === "manufactured_home" ? (
                    <>
                      {l.bedrooms && <span className="flex items-center"><Bed className="h-4 w-4 mr-1" />{l.bedrooms}</span>}
                      {l.bathrooms && <span className="flex items-center"><Bath className="h-4 w-4 mr-1" />{l.bathrooms}</span>}
                      {l.dimensions?.squareFeet && <span className="flex items-center"><Square className="h-4 w-4 mr-1" />{l.dimensions.squareFeet} sq ft</span>}
                    </>
                  ) : (
                    <>
                      {l.sleeps && <span className="flex items-center"><Users className="h-4 w-4 mr-1" />Sleeps {l.sleeps}</span>}
                      {l.dimensions?.length && <span className="flex items-center"><Ruler className="h-4 w-4 mr-1" />{l.dimensions.length} ft</span>}
                      {l.slides && <span className="flex items-center">📐 {l.slides} slides</span>}
                    </>
                  )}
                </div>

                <div className="flex gap-2 pt-3">
                  <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => openEdit(l)}>
                    <Eye className="h-4 w-4 mr-1" /> View / Edit
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setInvDetailsId(l.inventoryId)}>
                    View Inventory
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => remove(l.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <div className="font-semibold mb-2">No listings yet</div>
            <Button onClick={startCreate}><Plus className="h-4 w-4 mr-2" />Add New Listing</Button>
          </CardContent>
        </Card>
      )}

      {/* Inventory picker */}
      <InventoryPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={handlePick} />

      {/* Add/Edit form */}
      <Dialog
        open={formOpen || editingId !== null}
        onOpenChange={(open) => {
          if (open) return;
          if (formOpen) setFormOpen(false);
          if (editingId) setEditingId(null);
          if (pickedInvId) setPickedInvId(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingListing ? "Edit Listing" : "Add Listing"}</DialogTitle>
          </DialogHeader>

          {/* Selected Inventory preview and actions */}
          {(pickedInventory || editingInventory) && (
            <div className="mb-4 rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">
                    {[
                      (pickedInventory || editingInventory)?.year,
                      (pickedInventory || editingInventory)?.make,
                      (pickedInventory || editingInventory)?.model,
                    ].filter(Boolean).join(" ")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(pickedInventory || editingInventory)?.location?.city},{" "}
                    {(pickedInventory || editingInventory)?.location?.state}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setInvDetailsId((pickedInventory || editingInventory)?.id)}>View details</Button>
                  <Button variant="outline" size="sm" onClick={() => nav("/inventory")}>Edit in Inventory</Button>
                </div>
              </div>
            </div>
          )}

          {editingListing && editingInventory && (
            <ListingForm
              inventoryItem={editingInventory}
              listing={editingListing}
              onCancel={() => setEditingId(null)}
              onSave={saveEdit}
              onPushToInventory={(fields: any) => pushOverridesToInventory(editingListing.id, fields)}
            />
          )}

          {!editingListing && pickedInventory && (
            <ListingForm
              inventoryItem={pickedInventory}
              onCancel={() => { setFormOpen(false); setPickedInvId(null); }}
              onSave={saveCreate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Inventory details modal */}
      <InventoryDetailsModal
        open={!!invDetailsId}
        onOpenChange={(o) => { if (!o) setInvDetailsId(null); }}
        inventoryItem={invDetails}
      />

      {/* Share All Listings modal */}
      <ShareAllListingsModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        listings={filtered}
        summaryStats={summaryStats}
      />
    </div>
  );
}

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsDashboard />} />
      <Route path="*" element={<PropertyListingsDashboard />} />
    </Routes>
  );
}
