import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Note } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { formatDateTime, generateId, saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NotesSectionProps {
  entityId: string
  entityType: Note['entityType']
  className?: string
}

export function NotesSection({ entityId, entityType, className }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editContent, setEditContent] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()

  const storageKey = `notes-${entityType}-${entityId}`

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = loadFromLocalStorage<Note[]>(storageKey, [])
    setNotes(savedNotes)
  }, [storageKey])

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    saveToLocalStorage(storageKey, updatedNotes)
  }

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast({
        title: 'Error',
        description: 'Note content cannot be empty',
        variant: 'destructive'
      })
      return
    }

    const newNote: Note = {
      id: generateId(),
      content: newNoteContent.trim(),
      entityType,
      entityId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.id || 'unknown',
      createdByName: user?.name || 'Unknown User'
    }

    const updatedNotes = [newNote, ...notes]
    saveNotes(updatedNotes)
    setNewNoteContent('')
    setIsAdding(false)

    toast({
      title: 'Success',
      description: 'Note added successfully'
    })
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      setEditingId(noteId)
      setEditContent(note.content)
    }
  }

  const handleSaveEdit = (noteId: string) => {
    if (!editContent.trim()) {
      toast({
        title: 'Error',
        description: 'Note content cannot be empty',
        variant: 'destructive'
      })
      return
    }

    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, content: editContent.trim(), updatedAt: new Date() }
        : note
    )

    saveNotes(updatedNotes)
    setEditingId(null)
    setEditContent('')

    toast({
      title: 'Success',
      description: 'Note updated successfully'
    })
  }

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId)
      saveNotes(updatedNotes)

      toast({
        title: 'Success',
        description: 'Note deleted successfully'
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setNewNoteContent('')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Notes</CardTitle>
            <CardDescription>
              Add notes and comments for this {entityType}
            </CardDescription>
          </div>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new note form */}
        {isAdding && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <Textarea
              placeholder="Enter your note..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={3}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAddNote}>
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelAdd}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No notes yet</p>
            <p className="text-sm">Add a note to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-4 border rounded-lg">
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleSaveEdit(note.id)}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {note.createdByName || 'Unknown'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(note.createdAt)}
                        </span>
                        {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                          <span className="text-xs text-muted-foreground">
                            (edited {formatDateTime(note.updatedAt)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note.id)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}