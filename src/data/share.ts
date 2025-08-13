// Share functionality for property listings
export interface ShareLink {
  id: string;
  url: string;
  shortUrl: string;
  title: string;
  description: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
}

export interface ShareOptions {
  title?: string;
  description?: string;
  includeWatermark?: boolean;
  expiresInDays?: number;
}

// Mock implementation - in production this would call your backend
export function createCatalogShareLink(
  listings: any[], 
  options: ShareOptions = {}
): Promise<ShareLink> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/shared/catalog/${id}`;
      const shortUrl = `${baseUrl}/s/${id}`;
      
      const shareLink: ShareLink = {
        id,
        url,
        shortUrl,
        title: options.title || `Property Catalog (${listings.length} listings)`,
        description: options.description || `View ${listings.length} available properties`,
        createdAt: new Date().toISOString(),
        expiresAt: options.expiresInDays 
          ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        clicks: 0
      };
      
      // Store in localStorage for demo purposes
      const existingLinks = JSON.parse(localStorage.getItem('shareLinks') || '[]');
      existingLinks.push(shareLink);
      localStorage.setItem('shareLinks', JSON.stringify(existingLinks));
      
      resolve(shareLink);
    }, 500);
  });
}

export function getShareLinks(): ShareLink[] {
  return JSON.parse(localStorage.getItem('shareLinks') || '[]');
}

export function deleteShareLink(id: string): void {
  const links = getShareLinks().filter(link => link.id !== id);
  localStorage.setItem('shareLinks', JSON.stringify(links));
}