import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpeg' | 'html'
  quality?: number
  filename?: string
  includeMetadata?: boolean
}

export async function downloadExport(data: any, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function exportBrochureToPDF(
  brochureElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  try {
    const canvas = await html2canvas(brochureElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const filename = options.filename || 'brochure.pdf'
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Failed to export brochure to PDF')
  }
}

export async function exportBrochureToImage(
  brochureElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  try {
    const canvas = await html2canvas(brochureElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const format = options.format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const quality = options.quality || 0.9
    
    canvas.toBlob((blob) => {
      if (blob) {
        const filename = options.filename || `brochure.${options.format || 'png'}`
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }, format, quality)
  } catch (error) {
    console.error('Error exporting to image:', error)
    throw new Error('Failed to export brochure to image')
  }
}

export function exportBrochureToHTML(
  brochureHTML: string,
  options: ExportOptions = {}
): void {
  try {
    const filename = options.filename || 'brochure.html'
    
    // Create a complete HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brochure</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .brochure-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div class="brochure-container">
        ${brochureHTML}
    </div>
</body>
</html>`

    downloadExport(fullHTML, filename, 'text/html')
  } catch (error) {
    console.error('Error exporting to HTML:', error)
    throw new Error('Failed to export brochure to HTML')
  }
}

export function getExportFormats() {
  return [
    { value: 'pdf', label: 'PDF Document', icon: 'FileText' },
    { value: 'png', label: 'PNG Image', icon: 'Image' },
    { value: 'jpeg', label: 'JPEG Image', icon: 'Image' },
    { value: 'html', label: 'HTML File', icon: 'Code' }
  ]
}

export function validateExportOptions(options: ExportOptions): string[] {
  const errors: string[] = []
  
  if (!['pdf', 'png', 'jpeg', 'html'].includes(options.format)) {
    errors.push('Invalid export format')
  }
  
  if (options.quality && (options.quality < 0.1 || options.quality > 1)) {
    errors.push('Quality must be between 0.1 and 1')
  }
  
  if (options.filename && !/^[a-zA-Z0-9._-]+$/.test(options.filename)) {
    errors.push('Filename contains invalid characters')
  }
  
  return errors
}