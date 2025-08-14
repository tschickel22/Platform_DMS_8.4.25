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

export async function toPDF(elOrId: HTMLElement | string, options: ExportOptions = {}): Promise<Result> {
  try {
    const el = ensureHTMLElement(elOrId)

    let html2canvas: any
    try {
      html2canvas = (await import('html2canvas')).default
    } catch {
      const blob = new Blob([el.outerHTML], { type: 'text/html;charset=utf-8' })
      downloadBlob(blob, `${options.filename ?? 'brochure'}.html`)
      return { ok: true }
    }
    // Import jsPDF via named export to avoid ESM default pitfalls
    let jsPDFCtor: any
    try {
      const mod = await import('jspdf')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jsPDFCtor = (mod as any).jsPDF ?? (mod as any).default
    } catch (e) {
      // No jsPDF? Export image instead.
      await exportAsImage(el, {
        filename: options.filename ?? 'brochure',
        quality: options.quality ?? 0.92,
        scale: options.scale ?? 2,
        format: 'png',
      })
      return { ok: true }
    }

    await waitForFontsAndImages(el)
    const canvas = await html2canvas(el, { scale: options.scale ?? 2, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png', options.quality ?? 0.92)

    const page = options.page ?? { orientation: 'p', unit: 'pt', format: 'a4' }
    const pdf = new jsPDFCtor(page)
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const ratio = Math.min(pageW / canvas.width, pageH / canvas.height)
    const w = canvas.width * ratio
    const h = canvas.height * ratio
    const x = (pageW - w) / 2
    const y = (pageH - h) / 2
    pdf.addImage(imgData, 'PNG', x, y, w, h)
    pdf.save(`${options.filename ?? 'brochure'}.pdf`)
    return { ok: true }
  } catch (e: any) {
    console.error('toPDF error:', e)
    return { ok: false, error: e?.message ?? 'Unknown PDF export error' }
  }
}

export async function toImage(
  elOrId: HTMLElement | string,
  format: 'png' | 'jpeg' = 'png',
  options: ExportOptions = {},
): Promise<Result> {
  try {
    const el = ensureHTMLElement(elOrId)
    await exportAsImage(el, {
      format,
      filename: options.filename ?? 'brochure',
      quality: options.quality ?? 0.92,
      scale: options.scale ?? 2,
    })
    return { ok: true }
  } catch (e: any) {
    console.error('toImage error:', e)
    return { ok: false, error: e?.message ?? 'Unknown image export error' }
  }
}

export async function toHTML(elOrId: HTMLElement | string, options: ExportOptions = {}): Promise<Result> {
  try {
    const el = ensureHTMLElement(elOrId)
    const blob = new Blob([el.outerHTML], { type: 'text/html;charset=utf-8' })
    downloadBlob(blob, `${options.filename ?? 'brochure'}.html`)
    return { ok: true }
  } catch (e: any) {
    console.error('toHTML error:', e)
    return { ok: false, error: e?.message ?? 'Unknown HTML export error' }
  }
}

// Back-compat aliases (so existing calls keep working)
export const exportBrochureToPDF = toPDF
export const exportToPDF = toPDF

// Named bundle for convenience
export const Exporters = { toPDF, toImage, toHTML, downloadExport }