const { getStore } = require('@netlify/blobs');
const { v4: uuidv4 } = require('uuid');

// Email sending utility (mock for now, replace with actual email service)
const sendNotificationEmail = async (to, subject, body, leadData) => {
  // In production, integrate with your email service (SendGrid, Mailgun, etc.)
  console.log('Sending notification email:', {
    to,
    subject,
    body: body.substring(0, 100) + '...',
    leadId: leadData.id
  });
  
  // For now, just log the email content
  // TODO: Integrate with actual email service
  return true;
};

// CRM webhook utility
const sendCrmWebhook = async (webhookUrl, leadData) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RenterInsight-LeadIngest/1.0'
      },
      body: JSON.stringify({
        event: 'lead.created',
        timestamp: new Date().toISOString(),
        data: leadData
      })
    });
    
    if (!response.ok) {
      console.error('CRM webhook failed:', response.status, response.statusText);
      return false;
    }
    
    console.log('CRM webhook sent successfully:', leadData.id);
    return true;
  } catch (error) {
    console.error('Error sending CRM webhook:', error);
    return false;
  }
};

// Validate and normalize lead data
const validateLead = (leadData) => {
  const errors = [];
  
  // Name is required
  if (!leadData.name || leadData.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  // At least phone or email is required
  if (!leadData.email && !leadData.phone) {
    errors.push('Either email or phone number is required');
  }
  
  // Validate email format if provided
  if (leadData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      errors.push('Invalid email format');
    }
  }
  
  // Validate phone format if provided (basic validation)
  if (leadData.phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = leadData.phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Invalid phone number format');
    }
  }
  
  // Message should have some content
  if (leadData.message && leadData.message.trim().length > 1000) {
    errors.push('Message is too long (max 1000 characters)');
  }
  
  return errors;
};

// Normalize lead data
const normalizeLead = (leadData) => {
  const normalized = {
    id: uuidv4(),
    name: leadData.name?.trim() || '',
    email: leadData.email?.toLowerCase().trim() || null,
    phone: leadData.phone?.replace(/[\s\-\(\)\.]/g, '') || null,
    message: leadData.message?.trim() || '',
    listingId: leadData.listingId || null,
    companyId: leadData.companyId || null,
    partnerId: leadData.partnerId || null,
    source: leadData.source || 'website',
    referrer: leadData.referrer || '',
    userAgent: leadData.userAgent || '',
    ipAddress: leadData.ipAddress || '',
    utmParams: {
      source: leadData.utm_source || null,
      medium: leadData.utm_medium || null,
      campaign: leadData.utm_campaign || null,
      term: leadData.utm_term || null,
      content: leadData.utm_content || null
    },
    receivedAt: new Date().toISOString(),
    processedAt: null,
    status: 'pending' // pending, processed, failed
  };
  
  // Remove null UTM params
  Object.keys(normalized.utmParams).forEach(key => {
    if (normalized.utmParams[key] === null) {
      delete normalized.utmParams[key];
    }
  });
  
  return normalized;
};

// Generate email notification content
const generateNotificationEmail = (leadData, listingData = null) => {
  const subject = `New Lead: ${leadData.name} - ${listingData?.title || 'Property Inquiry'}`;
  
  const body = `
    New lead received from your property listing!
    
    Lead Information:
    • Name: ${leadData.name}
    • Email: ${leadData.email || 'Not provided'}
    • Phone: ${leadData.phone || 'Not provided'}
    • Source: ${leadData.source}
    ${leadData.partnerId ? `• Partner: ${leadData.partnerId}` : ''}
    
    ${leadData.message ? `Message:\n${leadData.message}` : 'No message provided.'}
    
    ${listingData ? `
    Property Details:
    • Title: ${listingData.title}
    • Type: ${listingData.listingType}
    • Price: $${listingData.salePrice || listingData.rentPrice}
    • Location: ${listingData.location?.city}, ${listingData.location?.state}
    ` : ''}
    
    Lead ID: ${leadData.id}
    Received: ${new Date(leadData.receivedAt).toLocaleString()}
    
    Please respond to this lead promptly to maximize conversion.
  `;
  
  return { subject, body };
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Forwarded-For',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const rawLeadData = JSON.parse(event.body || '{}');
    
    // Add request context
    rawLeadData.ipAddress = event.headers['x-forwarded-for']?.split(',')[0] || 
                           event.headers['x-real-ip'] || 
                           'unknown';
    rawLeadData.userAgent = event.headers['user-agent'] || '';
    rawLeadData.referrer = event.headers['referer'] || event.headers['referrer'] || '';
    
    // Validate lead data
    const validationErrors = validateLead(rawLeadData);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Validation failed', 
          errors: validationErrors 
        })
      };
    }
    
    // Normalize lead data
    const leadData = normalizeLead(rawLeadData);
    
    // Queue the lead
    const queueStore = getStore('leads');
    const queueKey = `queue/${leadData.id}`;
    
    const success = await queueStore.set(queueKey, JSON.stringify(leadData));
    if (!success) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to queue lead' })
      };
    }
    
    // Get listing data for context (if listingId provided)
    let listingData = null;
    if (leadData.listingId && leadData.companyId) {
      try {
        const listingsStore = getStore('listings');
        const listingKey = `${leadData.companyId}/${leadData.listingId}`;
        const listing = await listingsStore.get(listingKey);
        if (listing) {
          listingData = JSON.parse(listing);
        }
      } catch (error) {
        console.warn('Could not fetch listing data:', error);
      }
    }
    
    // Determine notification email
    let notificationEmail = null;
    
    if (leadData.partnerId && leadData.companyId) {
      // Check for partner-specific email override
      try {
        const companiesStore = getStore('companies');
        const partnerKey = `${leadData.companyId}/partners/${leadData.partnerId}`;
        const partnerConfig = await companiesStore.get(partnerKey);
        if (partnerConfig) {
          const config = JSON.parse(partnerConfig);
          notificationEmail = config.leadEmail;
        }
      } catch (error) {
        console.warn('Could not fetch partner config:', error);
      }
      
      // Fallback to global partner email
      if (!notificationEmail) {
        try {
          const partnersStore = getStore('partners');
          const partner = await partnersStore.get(`${leadData.partnerId}`);
          if (partner) {
            const partnerData = JSON.parse(partner);
            notificationEmail = partnerData.leadEmail;
          }
        } catch (error) {
          console.warn('Could not fetch global partner:', error);
        }
      }
    }
    
    // Fallback to company default email
    if (!notificationEmail && leadData.companyId) {
      try {
        const companiesStore = getStore('companies');
        const company = await companiesStore.get(`${leadData.companyId}/settings`);
        if (company) {
          const companyData = JSON.parse(company);
          notificationEmail = companyData.defaultLeadEmail || companyData.email;
        }
      } catch (error) {
        console.warn('Could not fetch company settings:', error);
      }
    }
    
    // Send notification email
    if (notificationEmail) {
      try {
        const { subject, body } = generateNotificationEmail(leadData, listingData);
        await sendNotificationEmail(notificationEmail, subject, body, leadData);
      } catch (error) {
        console.error('Error sending notification email:', error);
        // Don't fail the request if email fails
      }
    }
    
    // Send CRM webhook if configured
    if (leadData.companyId) {
      try {
        const companiesStore = getStore('companies');
        const company = await companiesStore.get(`${leadData.companyId}/settings`);
        if (company) {
          const companyData = JSON.parse(company);
          if (companyData.crmWebhookUrl) {
            await sendCrmWebhook(companyData.crmWebhookUrl, leadData);
          }
        }
      } catch (error) {
        console.error('Error sending CRM webhook:', error);
        // Don't fail the request if webhook fails
      }
    }
    
    // Log the event
    try {
      const logsStore = getStore('logs');
      const date = new Date().toISOString().split('T')[0];
      const logKey = `events/${date}`;
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        event: 'lead.received',
        leadId: leadData.id,
        companyId: leadData.companyId,
        partnerId: leadData.partnerId,
        listingId: leadData.listingId,
        source: leadData.source
      };
      
      // Append to daily log file
      let existingLogs = '';
      try {
        existingLogs = await logsStore.get(logKey) || '';
      } catch (error) {
        // File doesn't exist yet, which is fine
      }
      
      await logsStore.set(logKey, existingLogs + JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Error logging event:', error);
    }
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        leadId: leadData.id,
        message: 'Lead received and queued for processing'
      })
    };
    
  } catch (error) {
    console.error('Lead ingest error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};