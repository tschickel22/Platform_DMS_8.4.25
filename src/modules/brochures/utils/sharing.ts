// Brochure sharing utilities
export interface ShareOptions {
  title?: string
  description?: string
  url?: string
  hashtags?: string[]
}

export interface EmailShareOptions extends ShareOptions {
  subject?: string
  body?: string
  recipient?: string
}

export interface SMSShareOptions extends ShareOptions {
  message?: string
  phoneNumber?: string
}

export interface SocialShareOptions extends ShareOptions {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'pinterest'
  imageUrl?: string
}

// Email sharing
export function buildEmailLink(options: EmailShareOptions): string {
  const params = new URLSearchParams()
  
  if (options.recipient) {
    // For direct email to specific recipient
    const subject = options.subject || `Check out this brochure: ${options.title || 'Property Listing'}`
    const body = options.body || `I thought you might be interested in this: ${options.url || ''}\n\n${options.description || ''}`
    
    return `mailto:${options.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  } else {
    // For general email sharing
    if (options.subject) params.set('subject', options.subject)
    if (options.body) params.set('body', options.body)
    
    return `mailto:?${params.toString()}`
  }
}

// SMS sharing
export function buildSMSLink(options: SMSShareOptions): string {
  const message = options.message || `Check out this brochure: ${options.url || ''}`
  
  if (options.phoneNumber) {
    return `sms:${options.phoneNumber}?body=${encodeURIComponent(message)}`
  } else {
    return `sms:?body=${encodeURIComponent(message)}`
  }
}

// Social media sharing
export function buildSocialLinks(options: SocialShareOptions): string {
  const { platform, title, description, url, imageUrl, hashtags } = options
  
  switch (platform) {
    case 'facebook':
      const fbParams = new URLSearchParams()
      if (url) fbParams.set('u', url)
      if (title) fbParams.set('quote', title)
      return `https://www.facebook.com/sharer/sharer.php?${fbParams.toString()}`
    
    case 'twitter':
      const twitterParams = new URLSearchParams()
      const tweetText = [title, description].filter(Boolean).join(' - ')
      if (tweetText) twitterParams.set('text', tweetText)
      if (url) twitterParams.set('url', url)
      if (hashtags && hashtags.length > 0) {
        twitterParams.set('hashtags', hashtags.join(','))
      }
      return `https://twitter.com/intent/tweet?${twitterParams.toString()}`
    
    case 'linkedin':
      const linkedinParams = new URLSearchParams()
      if (url) linkedinParams.set('url', url)
      if (title) linkedinParams.set('title', title)
      if (description) linkedinParams.set('summary', description)
      return `https://www.linkedin.com/sharing/share-offsite/?${linkedinParams.toString()}`
    
    case 'pinterest':
      const pinterestParams = new URLSearchParams()
      if (url) pinterestParams.set('url', url)
      if (imageUrl) pinterestParams.set('media', imageUrl)
      if (description) pinterestParams.set('description', description)
      return `https://pinterest.com/pin/create/button/?${pinterestParams.toString()}`
    
    default:
      throw new Error(`Unsupported social platform: ${platform}`)
  }
}

// Web Share API support
export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

export async function shareViaWebAPI(options: ShareOptions): Promise<boolean> {
  if (!canUseWebShare()) {
    return false
  }
  
  try {
    await navigator.share({
      title: options.title,
      text: options.description,
      url: options.url
    })
    return true
  } catch (error) {
    console.warn('Web Share API failed:', error)
    return false
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      return false
    }
  }
  
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Generate shareable URL with tracking
export function generateShareableUrl(
  brochureId: string, 
  companySlug: string, 
  options: { 
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  } = {}
): string {
  const baseUrl = window.location.origin
  const url = new URL(`/b/${brochureId}`, baseUrl)
  
  // Add UTM parameters for tracking
  if (options.utm_source) url.searchParams.set('utm_source', options.utm_source)
  if (options.utm_medium) url.searchParams.set('utm_medium', options.utm_medium)
  if (options.utm_campaign) url.searchParams.set('utm_campaign', options.utm_campaign)
  
  return url.toString()
}

// QR Code generation (returns data URL)
export function generateQRCode(text: string, size: number = 200): string {
  // This is a simple implementation - in production you might use a QR code library
  // For now, we'll use a QR code service
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
}

// Analytics tracking
export function trackShare(
  brochureId: string, 
  platform: string, 
  method: 'link' | 'email' | 'sms' | 'social' | 'qr'
): void {
  // Track sharing events for analytics
  try {
    // This would integrate with your analytics service
    console.log('Share tracked:', { brochureId, platform, method, timestamp: new Date().toISOString() })
    
    // Example: Send to analytics service
    // analytics.track('brochure_shared', { brochureId, platform, method })
  } catch (error) {
    console.warn('Failed to track share event:', error)
  }
}

// Bulk sharing utilities
export function generateBulkShareData(
  brochureIds: string[],
  companySlug: string,
  options: ShareOptions = {}
): {
  emailBody: string
  smsMessage: string
  socialText: string
  urls: string[]
} {
  const urls = brochureIds.map(id => generateShareableUrl(id, companySlug, {
    utm_source: 'bulk_share',
    utm_medium: 'direct'
  }))
  
  const emailBody = `
${options.description || 'Check out these property brochures:'}

${urls.map((url, index) => `${index + 1}. ${url}`).join('\n')}

${options.title ? `\n${options.title}` : ''}
  `.trim()
  
  const smsMessage = urls.length === 1 
    ? `Check out this brochure: ${urls[0]}`
    : `Check out these ${urls.length} brochures: ${urls[0]} ${urls.length > 1 ? '(and more)' : ''}`
  
  const socialText = `${options.title || 'Property Brochures'} ${options.hashtags ? hashtags.map(tag => `#${tag}`).join(' ') : ''}`
  
  return {
    emailBody,
    smsMessage,
    socialText,
    urls
  }
}