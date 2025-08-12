@@ .. @@
 import { 
   Search, 
   Filter, 
   Plus, 
   Eye, 
   Edit, 
   Share2, 
   MoreVertical, 
   MapPin,
   Calendar,
   DollarSign,
   Home,
   Car,
   Settings
 } from 'lucide-react'
 import { ShareListingModal } from './components/ShareListingModal'
-
-// Mock data for listings
-const mockListings = [
-  {
-    id: 'listing_001',
-    listingType: 'manufactured_home',
-    year: 2023,
-    make: 'Clayton',
-    model: 'The Edge',
-    title: '2023 Clayton The Edge - 3BR/2BA',
-    offerType: 'for_sale',
-    salePrice: 89000,
-    rentPrice: null,
-    status: 'active',
-    location: {
-      city: 'Austin',
-      state: 'TX',
-      postalCode: '78701'
-    },
-    bedrooms: 3,
-    bathrooms: 2,
-    dimensions: {
-      width_ft: 28,
-      length_ft: 52
-    },
-    media: {
-      primaryPhoto: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
-      photos: [
-        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
-        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
-      ]
-    },
-    description: 'Beautiful 3 bedroom, 2 bathroom manufactured home with modern finishes and open floor plan.',
-    searchResultsText: '2023 Clayton The Edge 3BR/2BA - Move-in Ready!',
-    createdAt: '2024-01-15T10:30:00Z',
-    updatedAt: '2024-01-15T10:30:00Z'
-  },
-  {
-    id: 'listing_002',
-    listingType: 'rv',
-    year: 2022,
-    make: 'Forest River',
-    model: 'Cherokee',
-    title: '2022 Forest River Cherokee - Travel Trailer',
-    offerType: 'both',
-    salePrice: 45000,
-    rentPrice: 350,
-    status: 'active',
-    location: {
-      city: 'Dallas',
-      state: 'TX',
-      postalCode: '75201'
-    },
-    sleeps: 6,
-    slides: 2,
-    length: 28.5,
-    media: {
-      primaryPhoto: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg',
-      photos: [
-        'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg',
-        'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg'
-      ]
-    },
-    description: 'Spacious travel trailer perfect for family adventures with slide-outs for extra room.',
-    searchResultsText: '2022 Forest River Cherokee 28.5ft - Sleeps 6',
-    createdAt: '2024-01-10T14:20:00Z',
-    updatedAt: '2024-01-10T14:20:00Z'
-  }
-]
+import { mockListings } from '@/mocks/listingsMock'

 const PropertyListings = () => {
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState(null)
   const { handleError, handleAsyncError } = useErrorHandler()
-  const [listings, setListings] = useState(mockListings)
-  const [filteredListings, setFilteredListings] = useState(mockListings)
+  const [listings, setListings] = useState(mockListings.sampleListings)
+  const [filteredListings, setFilteredListings] = useState(mockListings.sampleListings)
   const [searchQuery, setSearchQuery] = useState('')
   const [filterType, setFilterType] = useState('all')
   const [filterOfferType, setFilterOfferType] = useState('all')
   const [shareModalOpen, setShareModalOpen] = useState(false)
   const [selectedListing, setSelectedListing] = useState(null)

@@ .. @@
       try {
         // Simulate API call delay
         await new Promise(resolve => setTimeout(resolve, 500));
         // In real implementation, this would be an API call
-        setListings(mockListings);
+        setListings(mockListings.sampleListings);
       } catch (error) {
         handleError(error, 'property_listings_load');
         setError('Failed to load listings');
       } finally {
         setIsLoading(false);
       }
     };
     
     loadData();
   }, [handleError]);

   const handleShareListing = (listing) => {
     logger.userAction('share_listing_clicked', { listingId: listing.id });
     setSelectedListing(listing)
     setShareModalOpen(true)
   }

   const handleBulkShare = () => {
     logger.userAction('bulk_share_clicked', { 
       selectedCount: selectedListings.length,
       listingIds: selectedListings 
     });
     setShareAllModalOpen(true);
   };