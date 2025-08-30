// NOTE: We avoid static imports of html2canvas/jsPDF to prevent SSR/preview crashes.
// Everything below is browser-guarded and lazy-loaded.

export interface ExportOptions {
  /** 'pdf' | 'png' | 'jpeg' | 'html' (default: 'pdf' when exporting from an element) */
  format?: 'pdf' | 'png' | 'jpeg' | 'html'
  /** image quality for png/jpeg and canvas -> dataURL, 0..1 (default 0.92) */
  quality?: number
  /** output file name without extension (default 'brochure') */
  filename?: string
  /** optional: include meta text if you add it later */
  includeMetadata?: boolean
  /** html2canvas scale (default 2) */
  scale?: number
  /** PDF page options */
  page?: { orientation?: 'p' | 'l'; unit?: 'pt' | 'mm' | 'cm' | 'in'; format?: string | [number, number] }
}

type Ok = { ok: true }
type Err = { ok: false; error: string }
type Result = Ok | Err

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

function ensureHTMLElement(target: HTMLElement | string): HTMLElement {
  if (!isBrowser) throw new Error('Export is only available in the browser.')
  if (typeof target === 'string') {
    const el = document.getElementById(target)
    if (!el) throw new Error(`Element with id "${target}" not found.`)
    return el as HTMLElement
  }
  return target
}

async function waitForFontsAndImages(root: HTMLElement): Promise<void> {
  try {
    // fonts
    // @ts-ignore
    if (document.fonts?.ready) await document.fonts.ready
  } catch {}
  // images
  const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[]
  await Promise.allSettled(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((res, rej) => {
            img.addEventListener('load', () => res(), { once: true })
            img.addEventListener('error', () => rej(new Error(`Image failed: ${img.src}`)), { once: true })
          }),
    ),
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Back-compat utility: download raw data (string/Blob) */
export async function downloadExport(data: any, filename: string, mimeType: string): Promise<void> {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType })
  downloadBlob(blob, filename)
}

async function exportAsImage(
  el: HTMLElement,
  opts: Required<Pick<ExportOptions, 'filename' | 'quality' | 'scale'>> & { format: 'png' | 'jpeg' },
): Promise<void> {
  let html2canvas: any
  try {
    html2canvas = (await import('html2canvas')).default
  } catch {
    // Fallback: dump HTML so user still gets something
    const blob = new Blob([el.outerHTML], { type: 'text/html;charset=utf-8' })
    downloadBlob(blob, `${opts.filename}.html`)
    return
  }
  await waitForFontsAndImages(el)
  const canvas = await html2canvas(el, { scale: opts.scale, backgroundColor: '#ffffff' })
  const dataUrl = canvas.toDataURL(`image/${opts.format}`, opts.quality)
  const blob = await (await fetch(dataUrl)).blob()
  downloadBlob(blob, `${opts.filename}.${opts.format}`)
}

export async function toPDF(brochureData: any, filename: string): Promise<void> {
  try {
    // Create a temporary element for PDF generation
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = await toHTML(brochureData, filename, false) // Get HTML without download
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    document.body.appendChild(tempDiv)

    // Use jsPDF to generate PDF
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Add content to PDF (simplified version)
    pdf.setFontSize(20)
    pdf.text(brochureData.title || 'Brochure', 20, 30)
    
    pdf.setFontSize(12)
    let yPosition = 50
    
    // Add specs
    if (brochureData.content?.specs?.items) {
      pdf.text('Specifications:', 20, yPosition)
      yPosition += 10
      
      brochureData.content.specs.items.forEach((spec: any) => {
        pdf.text(`${spec.label}: ${spec.value}`, 25, yPosition)
        yPosition += 8
      })
    }
    
    // Add pricing
    if (brochureData.content?.price) {
      yPosition += 10
      pdf.text('Pricing:', 20, yPosition)
      yPosition += 10
      
      if (brochureData.content.price.salePrice) {
        pdf.text(`Sale Price: $${brochureData.content.price.salePrice.toLocaleString()}`, 25, yPosition)
        yPosition += 8
      }
      
      if (brochureData.content.price.rentPrice) {
        pdf.text(`Rent Price: $${brochureData.content.price.rentPrice.toLocaleString()}/month`, 25, yPosition)
        yPosition += 8
      }
    }
    
    // Clean up
    document.body.removeChild(tempDiv)
    
    // Download PDF
    pdf.save(`${filename}.pdf`)
    
    // Track export
    trackExport('pdf', filename)
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('Failed to export PDF')
  }
}

export async function toImage(brochureData: any, filename: string): Promise<void> {
  try {
    // Create a temporary element for image generation
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = await toHTML(brochureData, filename, false) // Get HTML without download
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.width = '800px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.padding = '20px'
    document.body.appendChild(tempDiv)

    // Use html2canvas to generate image
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(tempDiv, {
      width: 800,
      height: 1000,
      backgroundColor: '#ffffff'
    })
    
    // Clean up
    document.body.removeChild(tempDiv)
    
    // Download image
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    
    // Track export
    trackExport('image', filename)
  } catch (error) {
    console.error('Image export failed:', error)
    throw new Error('Failed to export image')
  }
}

export async function toHTML(brochureData: any, filename: string, download: boolean = true): Promise<string> {
  try {
    // Generate standalone HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brochureData.title || 'Brochure'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            color: #1e293b;
        }
        .brochure {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .hero h1 {
            font-size: 2.5rem;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .hero p {
            font-size: 1.2rem;
            margin: 0;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #1e293b;
        }
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .spec-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: #f1f5f9;
            border-radius: 6px;
        }
        .price-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .price {
            font-size: 2rem;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
        }
        .features-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            list-style: none;
            padding: 0;
        }
        .features-list li {
            padding: 8px 12px;
            background: #e0f2fe;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .gallery img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="brochure">
        <div class="hero">
            <h1>${brochureData.title || 'Vehicle Brochure'}</h1>
            <p>${brochureData.description || ''}</p>
        </div>
        
        <div class="content">
            ${brochureData.content?.specs?.items ? `
            <div class="section">
                <h2>Specifications</h2>
                <div class="specs-grid">
                    ${brochureData.content.specs.items.map((spec: any) => `
                        <div class="spec-item">
                            <span>${spec.label}</span>
                            <strong>${spec.value}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${brochureData.content?.price ? `
            <div class="section">
                <h2>Pricing</h2>
                <div class="price-section">
                    ${brochureData.content.price.salePrice ? `
                        <div class="price">$${brochureData.content.price.salePrice.toLocaleString()}</div>
                        <p>Sale Price</p>
                    ` : ''}
                    ${brochureData.content.price.rentPrice ? `
                        <div class="price">$${brochureData.content.price.rentPrice.toLocaleString()}/month</div>
                        <p>Monthly Rent</p>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            ${brochureData.content?.features?.items?.length ? `
            <div class="section">
                <h2>Features</h2>
                <ul class="features-list">
                    ${brochureData.content.features.items.map((feature: string) => `
                        <li>${feature}</li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${brochureData.content?.gallery?.images?.length ? `
            <div class="section">
                <h2>Gallery</h2>
                <div class="gallery">
                    ${brochureData.content.gallery.images.map((image: string) => `
                        <img src="${image}" alt="Vehicle photo" />
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>`

    if (download) {
      // Download HTML file
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.html`
      link.click()
      URL.revokeObjectURL(url)
    }
    
    // Track export
    if (download) {
      trackExport('html', filename)
    }
    
    return html
  } catch (error) {
    console.error('HTML export failed:', error)
    throw new Error('Failed to export HTML')
  }
}

// Back-compat aliases (so existing calls keep working)
export const exportBrochureToPDF = toPDF
export const exportToPDF = toPDF

// Named bundle for convenience
export const Exporters = { toPDF, toImage, toHTML, downloadExport }