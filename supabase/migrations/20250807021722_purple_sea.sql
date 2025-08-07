/*
  # Expand Listings Schema for Comprehensive Property Details

  1. New Columns Added
    - Seller and company identification fields
    - Complete address breakdown (address2, city, state, zipCode, county, township, schoolDistrict)
    - GPS coordinates (latitude, longitude)
    - Additional pricing fields (monthlyTax, monthlyUtilities, soldPrice)
    - Listing status fields (isRepossessed, packageType, pendingSale)
    - Display fields (searchResultsText, agentPhotoUrl, preferredTerm, termsOfSale)

  2. Manufactured Home Details Expansion
    - Physical specifications (modelYear, color, dimensions)
    - Construction materials (roofMaterial, ceilingMaterial, wallMaterial)
    - Boolean features for amenities and included appliances
    - Room and utility specifications

  3. Contact Information Enhancement
    - MHVillage integration fields
    - Multiple contact methods and additional emails
    - Company information fields

  4. Data Integrity
    - All new fields are optional to maintain backward compatibility
    - Proper data types for numeric and boolean fields
    - Text fields with appropriate length limits
*/

-- Add seller and company identification
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_id TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS company_id TEXT;

-- Add complete address breakdown
ALTER TABLE listings ADD COLUMN IF NOT EXISTS address2 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS county TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS township TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS school_district TEXT;

-- Add GPS coordinates
ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add additional pricing fields
ALTER TABLE listings ADD COLUMN IF NOT EXISTS monthly_tax DECIMAL(10, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS monthly_utilities DECIMAL(10, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS sold_price DECIMAL(12, 2);

-- Add listing status and display fields
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_repossessed BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS package_type TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pending_sale BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS search_results_text TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS agent_photo_url TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS preferred_term TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS terms_of_sale TEXT;

-- Expand manufactured home details
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_model_year INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_color TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_property_id TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_width1 DECIMAL(5, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_length1 DECIMAL(5, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_width2 DECIMAL(5, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_length2 DECIMAL(5, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_width3 DECIMAL(5, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_length3 DECIMAL(5, 2);

-- Add construction materials
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_roof_material TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_ceiling_material TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_wall_material TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_thermopane_windows BOOLEAN DEFAULT FALSE;

-- Add boolean features
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_garage BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_carport BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_central_air BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_fireplace BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_storage_shed BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_gutters BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_shutters BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_deck BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_patio BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_cathedral_ceilings BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_ceiling_fans BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_skylights BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_walkin_closets BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_laundry_room BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_pantry BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_sun_room BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_basement BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_garden_tub BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_garbage_disposal BOOLEAN DEFAULT FALSE;

-- Add included appliances
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_refrigerator_included BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_microwave_included BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_oven_included BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_dishwasher_included BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_washer_included BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mh_dryer_included BOOLEAN DEFAULT FALSE;

-- Expand contact information
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_mh_village_key TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_first_name TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_last_name TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_company_name TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_fax TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_website TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_additional_email1 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_additional_email2 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_additional_email3 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_alternate_phone TEXT;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_company_id ON listings(company_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_state ON listings(state);
CREATE INDEX IF NOT EXISTS idx_listings_zip_code ON listings(zip_code);
CREATE INDEX IF NOT EXISTS idx_listings_mh_manufacturer ON listings(mh_manufacturer);
CREATE INDEX IF NOT EXISTS idx_listings_mh_model_year ON listings(mh_model_year);
CREATE INDEX IF NOT EXISTS idx_listings_package_type ON listings(package_type);