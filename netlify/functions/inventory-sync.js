const { getStore } = require('@netlify/blobs');

// Mock inventory sources - in production, these would be real integrations
const mockInventorySources = {
  'dealership_dms': {
    name: 'Dealership DMS',
    endpoint: 'https://api.dealership-dms.com/inventory',
    lastSync: null,
    status: 'connected'
  },
  'manufacturer_api': {
    name: 'Manufacturer API',
    endpoint: 'https://api.manufacturer.com/inventory',
    lastSync: null,
    status: 'connected'
  }
};

// Normalize inventory item from external source
const normalizeInventoryItem = (item, sourceId) => {
  // This would contain mapping logic for each source
  return {
    id: item.id || item.vin || item.serial,
    sourceId: sourceId,
    externalId: item.id,
    listingType: item.type === 'manufactured_home' ? 'manufactured_home' : 'rv',
    year: parseInt(item.year) || 0,
    make: item.make || '',
    model: item.model || '',
    vin: item.vin || item.serial || '',
    color: item.color || '',
    condition: item.condition || 'used',
    
    // Pricing
    salePrice: parseFloat(item.salePrice || item.price) || null,
    rentPrice: parseFloat(item.rentPrice) || null,
    cost: parseFloat(item.cost) || null,
    
    // MH specific
    bedrooms: parseInt(item.bedrooms) || null,
    bathrooms: parseFloat(item.bathrooms) || null,
    
    // RV specific
    sleeps: parseInt(item.sleeps) || null,
    slides: parseInt(item.slides || item.slideouts) || null,
    length: parseFloat(item.length) || null,
    
    // Location
    location: {
      lot: item.lot || '',
      section: item.section || '',
      notes: item.locationNotes || ''
    },
    
    // Status
    status: item.status || 'available', // available, sold, rented, pending, service
    availability: item.availability || 'in_stock',
    
    // Metadata
    lastSeen: new Date().toISOString(),
    syncedAt: new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    
    // Raw data for debugging
    _raw: item
  };
};

// Sync inventory from a specific source
const syncFromSource = async (sourceId, sourceConfig, companyId) => {
  try {
    // In production, you would make actual API calls here
    console.log(`Syncing inventory from ${sourceConfig.name} for company ${companyId}`);
    
    // Mock data for demo - replace with actual API calls
    const mockItems = [
      {
        id: 'vh001',
        type: 'rv',
        year: 2023,
        make: 'Forest River',
        model: 'Cherokee',
        vin: 'FR123456789',
        salePrice: 45000,
        condition: 'new',
        sleeps: 4,
        slides: 1,
        length: 28.5,
        status: 'available',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mh001', 
        type: 'manufactured_home',
        year: 2022,
        make: 'Clayton',
        model: 'The Edge',
        serial: 'CL987654321',
        salePrice: 85000,
        bedrooms: 3,
        bathrooms: 2,
        condition: 'new',
        status: 'available',
        updatedAt: new Date().toISOString()
      }
    ];
    
    const normalizedItems = mockItems.map(item => normalizeInventoryItem(item, sourceId));
    
    // Store inventory items
    const inventoryStore = getStore('inventory');
    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    };
    
    for (const item of normalizedItems) {
      try {
        const inventoryKey = `${companyId}/${item.id}`;
        
        // Check if item already exists
        const existing = await inventoryStore.get(inventoryKey);
        const isUpdate = !!existing;
        
        await inventoryStore.set(inventoryKey, JSON.stringify(item));
        
        results.processed++;
        if (isUpdate) {
          results.updated++;
        } else {
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          itemId: item.id,
          error: error.message
        });
      }
    }
    
    // Update source sync status
    const syncStore = getStore('sync_status');
    const syncStatus = {
      sourceId,
      companyId,
      lastSync: new Date().toISOString(),
      status: 'completed',
      results
    };
    
    await syncStore.set(`${companyId}/${sourceId}`, JSON.stringify(syncStatus));
    
    return results;
    
  } catch (error) {
    console.error(`Error syncing from ${sourceId}:`, error);
    
    // Update source sync status with error
    const syncStore = getStore('sync_status');
    const syncStatus = {
      sourceId,
      companyId,
      lastSync: new Date().toISOString(),
      status: 'failed',
      error: error.message
    };
    
    await syncStore.set(`${companyId}/${sourceId}`, JSON.stringify(syncStatus));
    
    throw error;
  }
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const { companyId, sourceId, action = 'sync' } = event.queryStringParameters || {};
    
    if (!companyId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'companyId is required' })
      };
    }

    switch (event.httpMethod) {
      case 'GET': {
        if (action === 'status') {
          // Get sync status for all sources
          const syncStore = getStore('sync_status');
          const { blobs } = await syncStore.list({ prefix: `${companyId}/` });
          const statuses = [];
          
          for (const blob of blobs) {
            try {
              const data = await syncStore.get(blob.key);
              if (data) {
                statuses.push(JSON.parse(data));
              }
            } catch (error) {
              console.error(`Error parsing sync status ${blob.key}:`, error);
            }
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ statuses })
          };
        }
        
        // List available sources
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ sources: mockInventorySources })
        };
      }

      case 'POST': {
        if (action === 'sync') {
          const results = {
            companyId,
            syncedAt: new Date().toISOString(),
            sources: []
          };
          
          if (sourceId) {
            // Sync specific source
            const sourceConfig = mockInventorySources[sourceId];
            if (!sourceConfig) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Source not found' })
              };
            }
            
            const sourceResults = await syncFromSource(sourceId, sourceConfig, companyId);
            results.sources.push({ sourceId, ...sourceResults });
          } else {
            // Sync all sources
            for (const [id, config] of Object.entries(mockInventorySources)) {
              try {
                const sourceResults = await syncFromSource(id, config, companyId);
                results.sources.push({ sourceId: id, ...sourceResults });
              } catch (error) {
                results.sources.push({
                  sourceId: id,
                  error: error.message,
                  processed: 0,
                  created: 0,
                  updated: 0
                });
              }
            }
          }
          
          // Log the sync operation
          const logsStore = getStore('logs');
          const date = new Date().toISOString().split('T')[0];
          const logKey = `events/${date}`;
          
          const logEntry = {
            timestamp: new Date().toISOString(),
            event: 'inventory.sync',
            companyId,
            sourceId: sourceId || 'all',
            results: results.sources.reduce((acc, source) => ({
              processed: acc.processed + (source.processed || 0),
              created: acc.created + (source.created || 0),
              updated: acc.updated + (source.updated || 0)
            }), { processed: 0, created: 0, updated: 0 })
          };
          
          let existingLogs = '';
          try {
            existingLogs = await logsStore.get(logKey) || '';
          } catch (error) {
            // File doesn't exist yet
          }
          
          await logsStore.set(logKey, existingLogs + JSON.stringify(logEntry) + '\n');
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results)
          };
        }
        
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
      }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Inventory sync error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};