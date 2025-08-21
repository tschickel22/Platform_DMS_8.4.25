import React from 'react'

export interface TextSection {
  heading?: string
  body?: string // accepts plain text or simple HTML
}

export type MultiTextBlockData = {
  title?: string
  sections: TextSection[]
  columns?: 1 | 2 | 3
  showDividers?: boolean
  className?: string
}

export default function MultiTextBlock({ data }: { data: MultiTextBlockData }) {
  const {
    title,
    sections = [],
    columns = 2,
    showDividers = false,
    className = '',
  } = data || {}

  const grid = columns === 1 ? 'grid-cols-1' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'

  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      <div className={`grid ${grid} gap-6`}>
        {sections.map((s, i) => (
          <div key={i} className={showDividers ? 'border-l pl-4 first:border-0 first:pl-0' : ''}>
            {s.heading && <h4 className="font-medium mb-2">{s.heading}</h4>}
            {s.body && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            )}
            {!s.heading && !s.body && (
              <div className="text-sm text-muted-foreground">Empty section…</div>
            )}
          </div>
        ))}
        {sections.length === 0 && (
          <div className="text-sm text-muted-foreground">Add text sections in the editor…</div>
        )}
      </div>
    </div>
  )
}