import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StickyNote, GripVertical } from 'lucide-react'
import { NotesSection } from '@/components/common/NotesSection'

interface AccountNotesSectionProps {
  accountId: string
  onRemove?: () => void
  isDragging?: boolean
}

export function AccountNotesSection({ accountId, onRemove, isDragging }: AccountNotesSectionProps) {
  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-1' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div>
            <CardTitle className="text-lg flex items-center">
              <StickyNote className="h-5 w-5 mr-2" />
              Notes & Comments
            </CardTitle>
            <CardDescription>
              Internal notes and comments about this account
            </CardDescription>
          </div>
        </div>
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            ×
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <NotesSection 
          entityId={accountId} 
          entityType="account"
        />
      </CardContent>
    </Card>
  )
}