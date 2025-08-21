import React from 'react'

export type GoogleMapBlockData = {
  address?: string
  lat?: number
  lng?: number
  zoom?: number
  height?: number
  markerLabel?: string
  apiKey?: string
  mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
  className?: string
}

export default function GoogleMapBlock({ data }: { data: GoogleMapBlockData }) {
  const {
    address,
    lat,
    lng,
    zoom = 14,
    height = 360,
    apiKey,
    mapTypeId = 'roadmap',
    className = '',
  } = data || {}

  const hasCoords = typeof lat === 'number' && typeof lng === 'number'
  const q = address ? encodeURIComponent(address) : hasCoords ? `${lat},${lng}` : ''
  const style: React.CSSProperties = { border: 0, width: '100%', height }

  let src = ''
  if (apiKey) {
    const base = 'https://www.google.com/maps/embed/v1/'
    const mode = address ? 'place' : hasCoords ? 'view' : 'search'
    const params = new URLSearchParams({
      key: apiKey,
      q,
      center: hasCoords ? `${lat},${lng}` : '',
      zoom: String(zoom),
      maptype: mapTypeId,
    })
    src = `${base}${mode}?${params.toString()}`
  } else if (q) {
    src = `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`
  }

  if (!src) {
    return (
      <div className={`w-full bg-muted/40 flex items-center justify-center text-sm text-muted-foreground rounded-xl p-6 ${className}`}>
        Configure the map by setting an address or coordinates.
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <iframe
        title="Google Map"
        src={src}
        style={style}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}