import React from 'react'
import {
  Facebook, Instagram, Twitter, Youtube, Linkedin, Globe, Mail, Phone, MessageSquare, Share2,
  Twitch, Github, Pinterest
} from 'lucide-react'

export type SocialPlatform =
  | 'facebook' | 'instagram' | 'x' | 'twitter' | 'youtube' | 'linkedin'
  | 'website' | 'email' | 'phone' | 'tiktok' | 'pinterest' | 'github' | 'twitch'

export interface SocialLink {
  platform: SocialPlatform
  url: string
  label?: string
}

export type SocialLinksBlockData = {
  title?: string
  links: SocialLink[]
  layout?: 'row' | 'grid'
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  gap?: number
  className?: string
}

export interface SocialLinksBlockProps {
  data: SocialLinksBlockData
}

function iconFor(platform: SocialPlatform, size: number) {
  const common = { width: size, height: size }
  switch (platform) {
    case 'facebook': return <Facebook {...common} />
    case 'instagram': return <Instagram {...common} />
    case 'x':
    case 'twitter': return <Twitter {...common} />
    case 'youtube': return <Youtube {...common} />
    case 'linkedin': return <Linkedin {...common} />
    case 'website': return <Globe {...common} />
    case 'email': return <Mail {...common} />
    case 'phone': return <Phone {...common} />
    case 'pinterest': return <Pinterest {...common} />
    case 'github': return <Github {...common} />
    case 'twitch': return <Twitch {...common} />
    default: return <Share2 {...common} />
  }
}

export default function SocialLinksBlock({ data }: SocialLinksBlockProps) {
  const {
    title,
    links = [],
    layout = 'row',
    align = 'left',
    size = 'md',
    gap = 4,
    className = '',
  } = data || {}

  const sizePx = size === 'sm' ? 16 : size === 'lg' ? 28 : 20
  const justify =
    align === 'center' ? 'justify-center' :
    align === 'right' ? 'justify-end' : 'justify-start'

  const container =
    layout === 'grid'
      ? `grid grid-cols-2 sm:grid-cols-3 gap-${gap}`
      : `flex flex-wrap items-center ${justify} gap-${gap}`

  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
      <div className={container}>
        {links.map((link, idx) => (
          <a
            key={`${link.platform}-${idx}`}
            href={link.platform === 'email' ? `mailto:${link.url}` :
                  link.platform === 'phone' ? `tel:${link.url}` : link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition"
          >
            {iconFor(link.platform, sizePx)}
            <span className="text-sm">{link.label ?? prettyLabel(link.platform)}</span>
          </a>
        ))}
        {links.length === 0 && (
          <div className="text-sm text-muted-foreground">Add social links in the editor…</div>
        )}
      </div>
    </div>
  )
}

function prettyLabel(p: SocialPlatform) {
  switch (p) {
    case 'x': return 'X (Twitter)'
    default: return p.charAt(0).toUpperCase() + p.slice(1)
  }
}