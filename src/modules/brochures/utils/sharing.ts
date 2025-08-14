// Brochure sharing utilities

export function buildEmailLink(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildSMSLink(message: string): string {
  return `sms:?body=${encodeURIComponent(message)}`
}

export function buildSocialLinks(url: string, title: string): { 
  facebook: string
  twitter: string
  linkedin: string 
} {
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  }
}

export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

export function shareViaWebAPI(data: { title: string; text: string; url: string }): Promise<void> {
  if (!canUseWebShare()) {
    throw new Error('Web Share API not supported')
  }
  return navigator.share(data)
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  
  // Fallback for older browsers
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      textArea.remove()
      resolve()
    } catch (err) {
      textArea.remove()
      reject(err)
    }
  })
}

export function generateShareableUrl(brochureId: string, baseUrl?: string): string {
  const base = baseUrl || window.location.origin
  return `${base}/b/${brochureId}`
}

export function trackShareEvent(brochureId: string, method: string): void {
  // Analytics tracking for share events
  console.log(`Brochure ${brochureId} shared via ${method}`)
  
  // In production, you would send this to your analytics service
  // Example: analytics.track('brochure_shared', { brochureId, method })
}