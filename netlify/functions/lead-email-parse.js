const { getStore } = require('@netlify/blobs');

// Mock OpenAI API call (replace with actual implementation)
const parseEmailWithAI = async (emailText, fromEmail, subject) => {
  // In production, you would call OpenAI API here
  // For now, we'll do basic parsing
  
  try {
    // Basic email parsing logic
    const lines = emailText.split('\n').filter(line => line.trim());
    
    // Try to extract name from email signature or content
    let name = '';
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)/,
      /Best regards,\s*([A-Z][a-z]+ [A-Z][a-z]+)/i,
      /Thanks?,\s*([A-Z][a-z]+ [A-Z][a-z]+)/i,
      /Sincerely,\s*([A-Z][a-z]+ [A-Z][a-z]+)/i
    ];
    
    for (const line of lines) {
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          name = match[1];
          break;
        }
      }
      if (name) break;
    }
    
    // If no name found, use email prefix
    if (!name && fromEmail) {
      const emailName = fromEmail.split('@')[0];
      name = emailName.replace(/[._-]/g, ' ')
                    .split(' ')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join(' ');
    }
    
    // Try to extract phone number
    let phone = '';
    const phonePattern = /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/;
    for (const line of lines) {
      const phoneMatch = line.match(phonePattern);
      if (phoneMatch && phoneMatch[1]) {
        phone = phoneMatch[1].replace(/[-.\s\(\)]/g, '');
        break;
      }
    }
    
    // Try to extract listing ID or property reference
    let listingId = null;
    const listingPatterns = [
      /listing[:\s#]*([a-zA-Z0-9_-]+)/i,
      /property[:\s#]*([a-zA-Z0-9_-]+)/i,
      /MLS[:\s#]*([a-zA-Z0-9_-]+)/i,
      /ID[:\s#]*([a-zA-Z0-9_-]+)/i
    ];
    
    const fullText = emailText + ' ' + subject;
    for (const pattern of listingPatterns) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        listingId = match[1];
        break;
      }
    }
    
    // Clean up message (remove signatures, etc.)
    let message = emailText;
    const signatureMarkers = [
      /^--\s*$/m,
      /^Best regards,/im,
      /^Thanks?,/im,
      /^Sincerely,/im,
      /^Sent from my/im
    ];
    
    for (const marker of signatureMarkers) {
      const match = message.match(marker);
      if (match) {
        message = message.substring(0, match.index).trim();
        break;
      }
    }
    
    return {
      name: name || 'Unknown',
      email: fromEmail || '',
      phone: phone || null,
      message: message.trim(),
      listingId,
      confidence: name ? 0.8 : 0.3 // Mock confidence score
    };
    
  } catch (error) {
    console.error('Error parsing email with AI:', error);
    return null;
  }
};

// Determine partner and company from email routing
const determineContext = async (toEmail, fromEmail) => {
  try {
    // In production, you would have email routing rules
    // For now, we'll use basic logic
    
    let partnerId = null;
    let companyId = null;
    
    // Check if email came via partner forwarding
    const partnerDomains = {
      'mhvillage.com': 'mhvillage',
      'rvtrader.com': 'rvtrader',
      'zillow.com': 'zillow'
    };
    
    if (fromEmail) {
      const domain = fromEmail.split('@')[1]?.toLowerCase();
      partnerId = partnerDomains[domain] || null;
    }
    
    // Try to extract company from routing email
    // Format might be: leads+company123@yourdomain.com
    if (toEmail && toEmail.includes('+')) {
      const routingPart = toEmail.split('+')[1]?.split('@')[0];
      if (routingPart && routingPart.startsWith('company')) {
        companyId = routingPart;
      }
    }
    
    return { partnerId, companyId };
    
  } catch (error) {
    console.error('Error determining context:', error);
    return { partnerId: null, companyId: null };
  }
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const emailData = JSON.parse(event.body || '{}');
    
    // Extract email components (format depends on your email provider)
    const {
      from,
      to,
      subject,
      text: emailText,
      html,
      timestamp,
      messageId
    } = emailData;
    
    if (!emailText || !from) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email text and from address are required' })
      };
    }
    
    // Store raw email for audit
    const rawEmailsStore = getStore('raw_emails');
    const rawEmailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await rawEmailsStore.set(rawEmailId, JSON.stringify({
      ...emailData,
      receivedAt: new Date().toISOString(),
      processed: false
    }));
    
    // Determine context (partner, company)
    const { partnerId, companyId } = await determineContext(to, from);
    
    // Parse email with AI
    const parsedData = await parseEmailWithAI(emailText, from, subject);
    
    if (!parsedData) {
      console.error('Failed to parse email');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to parse email content' })
      };
    }
    
    // Create normalized lead data
    const leadData = {
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      message: parsedData.message,
      listingId: parsedData.listingId,
      companyId: companyId,
      partnerId: partnerId,
      source: 'email',
      referrer: `email:${messageId || 'unknown'}`,
      userAgent: 'email-parser/1.0',
      ipAddress: 'email-server',
      rawEmailId: rawEmailId,
      confidence: parsedData.confidence || 0.5
    };
    
    // Forward to lead-ingest
    const leadIngestUrl = `${event.headers.host}/.netlify/functions/lead-ingest`;
    const leadIngestResponse = await fetch(`https://${leadIngestUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });
    
    if (!leadIngestResponse.ok) {
      console.error('Lead ingest failed:', leadIngestResponse.status);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to process lead' })
      };
    }
    
    const leadResult = await leadIngestResponse.json();
    
    // Mark raw email as processed
    await rawEmailsStore.set(rawEmailId, JSON.stringify({
      ...emailData,
      receivedAt: new Date().toISOString(),
      processed: true,
      processedAt: new Date().toISOString(),
      leadId: leadResult.leadId,
      confidence: parsedData.confidence
    }));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        leadId: leadResult.leadId,
        confidence: parsedData.confidence,
        parsedData: {
          name: parsedData.name,
          hasPhone: !!parsedData.phone,
          hasListingId: !!parsedData.listingId,
          messageLength: parsedData.message.length
        }
      })
    };
    
  } catch (error) {
    console.error('Email parse error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};