// src/components/ui/textarea.tsx
import * as React from 'react'

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`border rounded-md px-3 py-2 w-full ${props.className||''}`} />
}

export default Textarea