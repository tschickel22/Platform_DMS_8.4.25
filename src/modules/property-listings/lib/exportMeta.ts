// src/modules/property-listings/lib/exportMeta.ts
export type ListingExportMeta = {
  SellerID?: string;              // 11 char text
  CompanyID?: string;             // 11 char text
  RentalPrice?: number;           // integer
  Township?: string;
  SchoolDistrict?: string;
  Latitude?: number;
  Longitude?: number;
  LotRent?: string;               // text(20)
  Taxes?: string;                 // text(20)
  SellerAccountKey?: number;
  SellerFirstName?: string;       // text(30)
  SellerLastName?: string;        // text(30)
  SellerCompanyName?: string;     // text(80)
  SellerPhone?: string;           // text(10)
  SellerEmail?: string;
  SellerFax?: string;             // text(10)
  SoldPrice?: number;
  SearchResultsText?: string;     // text(80)
  SellerWebsite?: string;
  SellerEmail2?: string;
  SellerEmail3?: string;
  SellerEmail4?: string;
  SellerPhone2?: string;          // text(10)
};

type Maybe = string | number | undefined | null;

const onlyDigits = (s?: Maybe) =>
  typeof s === 'string' ? s.replace(/\D+/g, '') : s ?? undefined

export function buildExportMeta({
  tenant,
  user,
  inventory,
  existing,
}: {
  tenant?: { id?: string; name?: string; phone?: string; email?: string; website?: string };
  user?: { id?: string; name?: string; email?: string };
  inventory?: {
    id?: string;
    location?: { city?: string; state?: string; lat?: number; lng?: number; township?: string; schoolDistrict?: string };
    lotRent?: Maybe;
    taxes?: Maybe;
  };
  existing?: Partial<ListingExportMeta>;
}): ListingExportMeta {
  // Derive names
  const [firstName, ...rest] = (user?.name ?? '').trim().split(' ');
  const lastName = rest.join(' ');

  return {
    // keep anything already stored on the listing
    ...existing,

    // required-ish identifiers
    SellerID: existing?.SellerID ?? (inventory?.id ? String(inventory.id).slice(-11) : undefined),
    CompanyID: existing?.CompanyID ?? (tenant?.id ? String(tenant.id).slice(-11) : undefined),

    // price passthrough handled at save time if rent listing
    RentalPrice: existing?.RentalPrice,

    // location-ish
    Township: existing?.Township ?? inventory?.location?.township,
    SchoolDistrict: existing?.SchoolDistrict ?? inventory?.location?.schoolDistrict,
    Latitude: existing?.Latitude ?? inventory?.location?.lat,
    Longitude: existing?.Longitude ?? inventory?.location?.lng,

    LotRent: existing?.LotRent ?? (inventory?.lotRent != null ? String(inventory.lotRent) : undefined),
    Taxes: existing?.Taxes ?? (inventory?.taxes != null ? String(inventory.taxes) : undefined),

    // seller contact (not exposed in UI)
    SellerAccountKey: existing?.SellerAccountKey ?? undefined,
    SellerFirstName: existing?.SellerFirstName ?? (firstName || undefined),
    SellerLastName: existing?.SellerLastName ?? (lastName || undefined),
    SellerCompanyName: existing?.SellerCompanyName ?? tenant?.name,
    SellerPhone: existing?.SellerPhone ?? onlyDigits(tenant?.phone),
    SellerEmail: existing?.SellerEmail ?? (tenant?.email || user?.email),
    SellerFax: existing?.SellerFax ?? undefined,
    SellerWebsite: existing?.SellerWebsite ?? tenant?.website,

    // misc
    SoldPrice: existing?.SoldPrice ?? undefined,
    SearchResultsText: existing?.SearchResultsText ?? undefined,

    SellerEmail2: existing?.SellerEmail2 ?? undefined,
    SellerEmail3: existing?.SellerEmail3 ?? undefined,
    SellerEmail4: existing?.SellerEmail4 ?? undefined,
    SellerPhone2: existing?.SellerPhone2 ?? undefined,
  };
}