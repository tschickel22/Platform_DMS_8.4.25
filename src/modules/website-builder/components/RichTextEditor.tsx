import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Undo, Redo, Type, Palette, Link, Underline, Strikethrough, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  showAdvancedTools?: boolean
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder, showAdvancedTools = false }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [selectedFontSize, setSelectedFontSize] = useState('16')

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkDialog(false)
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
    setSelectedColor(color)
  }

  const applyFontSize = (size: string) => {
    editor.chain().focus().setFontSize(`${size}px`).run()
    setSelectedFontSize(size)
  }

  const presetColors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#EAB308', '#22C55E',
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
  ]

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48']

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </Button>
  )

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center gap-1 flex-wrap bg-gray-50">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
        
        {showAdvancedTools && (
          <>
            <Button
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('strike') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('code') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="h-4 w-4" />
            </Button>
          </>
        )}
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
        {showAdvancedTools && (
          <>
            <div className="w-px h-6 bg-border mx-1" />

            {/* Headings */}
            <Select
              value={
                editor.isActive('heading', { level: 1 }) ? 'h1' :
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                'paragraph'
              }
              onValueChange={(value) => {
                if (value === 'paragraph') {
                  editor.chain().focus().setParagraph().run()
                } else {
                  const level = parseInt(value.replace('h', ''))
                  editor.chain().focus().toggleHeading({ level }).run()
                }
              }}
            >
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Text</SelectItem>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
              </SelectContent>
            </Select>

            {/* Font Size */}
            <Select value={selectedFontSize} onValueChange={applyFontSize}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map(size => (
                  <SelectItem key={size} value={size}>{size}px</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Text Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: selectedColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid grid-cols-4 gap-2">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => applyColor(color)}
                    />
                  ))}
                </div>
                <div className="mt-3">
                  <Label htmlFor="custom-color">Custom Color</Label>
                  <Input
                    id="custom-color"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => applyColor(e.target.value)}
                    className="w-full h-8 mt-1"
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* Link */}
            <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <PopoverTrigger asChild>
                <Button
                  variant={editor.isActive('link') ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <Label htmlFor="link-url">Link URL</Label>
                  <Input
                    id="link-url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addLink}>Add Link</Button>
                    <Button size="sm" variant="outline" onClick={removeLink}>Remove</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Block Quote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' :
            'p'
          }
          onChange={(e) => {
            const value = e.target.value
            if (value === 'p') {
              editor.chain().focus().setParagraph().run()
            } else {
              const level = parseInt(value.replace('h', ''))
              editor.chain().focus().toggleHeading({ level }).run()
            }
          }}
          className="text-xs border rounded px-2 py-1 bg-background"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px]">
        <div className="border rounded-md">
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4"
          />
        </div>
      </div>
    </div>
  )
}

export default RichTextEditor