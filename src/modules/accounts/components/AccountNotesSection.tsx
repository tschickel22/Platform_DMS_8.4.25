import React from 'react'
import { NotesSection } from '@/components/common/NotesSection'

interface AccountNotesSectionProps {
  accountId: string
  title: string
}

export function AccountNotesSection({ accountId, title }: AccountNotesSectionProps) {
  return (
    <NotesSection
      entityId={accountId}
      entityType="account"
      className="col-span-full" // This section typically spans full width
    />
  )
}