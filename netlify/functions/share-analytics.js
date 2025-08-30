const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { companyId, token } = event.queryStringParameters || {};
    
    if (!companyId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'companyId is required' })
      };
    }

    const statsStore = getStore('share_stats');
    
    if (token) {
      // Get analytics for specific token
      const statsKey = `${companyId}/${token}`;
      
      let stats;
      try {
        const data = await statsStore.get(statsKey);
        stats = data ? JSON.parse(data) : {
          totalClicks: 0,
          uniqueClicks: 0,
          clicksBySource: {},
          clicksByReferrer: {},
          firstClick: null,
          lastClick: null
        };
      } catch (error) {
        stats = {
          totalClicks: 0,
          uniqueClicks: 0,
          clicksBySource: {},
          clicksByReferrer: {},
          firstClick: null,
          lastClick: null
        };
      }
      
      // Add derived metrics
      const analytics = {
        ...stats,
        topSources: Object.entries(stats.clicksBySource)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([source, clicks]) => ({ source, clicks })),
        topReferrers: Object.entries(stats.clicksByReferrer)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([referrer, clicks]) => ({ referrer, clicks })),
        conversionRate: stats.totalClicks > 0 ? (stats.uniqueClicks / stats.totalClicks * 100).toFixed(2) : '0.00'
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(analytics)
      };
      
    } else {
      // Get summary analytics for all tokens in company
      const { blobs } = await statsStore.list({ prefix: `${companyId}/` });
      
      let totalStats = {
        totalClicks: 0,
        uniqueClicks: 0,
        totalTokens: blobs.length,
        activeTokens: 0,
        clicksBySource: {},
        clicksByReferrer: {},
        recentActivity: []
      };
      
      for (const blob of blobs) {
        try {
          const data = await statsStore.get(blob.key);
          if (data) {
            const tokenStats = JSON.parse(data);
            
            totalStats.totalClicks += tokenStats.totalClicks || 0;
            totalStats.uniqueClicks += tokenStats.uniqueClicks || 0;
            
            if (tokenStats.totalClicks > 0) {
              totalStats.activeTokens++;
            }
            
            // Merge source stats
            Object.entries(tokenStats.clicksBySource || {}).forEach(([source, clicks]) => {
              totalStats.clicksBySource[source] = (totalStats.clicksBySource[source] || 0) + clicks;
            });
            
            // Merge referrer stats
            Object.entries(tokenStats.clicksByReferrer || {}).forEach(([referrer, clicks]) => {
              totalStats.clicksByReferrer[referrer] = (totalStats.clicksByReferrer[referrer] || 0) + clicks;
            });
            
            // Add to recent activity
            if (tokenStats.lastClick) {
              const token = blob.key.split('/')[1];
              totalStats.recentActivity.push({
                token,
                lastClick: tokenStats.lastClick,
                totalClicks: tokenStats.totalClicks
              });
            }
          }
        } catch (error) {
          console.error(`Error parsing stats ${blob.key}:`, error);
        }
      }
      
      // Sort recent activity
      totalStats.recentActivity = totalStats.recentActivity
        .sort((a, b) => new Date(b.lastClick) - new Date(a.lastClick))
        .slice(0, 10);
      
      // Add derived metrics
      const analytics = {
        ...totalStats,
        averageClicksPerToken: totalStats.totalTokens > 0 ? 
          (totalStats.totalClicks / totalStats.totalTokens).toFixed(2) : '0.00',
        topSources: Object.entries(totalStats.clicksBySource)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([source, clicks]) => ({ source, clicks })),
        topReferrers: Object.entries(totalStats.clicksByReferrer)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([referrer, clicks]) => ({ referrer, clicks }))
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(analytics)
      };
    }
    
  } catch (error) {
    console.error('Share analytics error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};