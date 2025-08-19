# Website Builder Content Editing Implementation Plan

## Overview
This plan outlines the phased approach to wire up the website builder so users can edit content, images, and other elements. The implementation focuses on creating an intuitive, visual editing experience.

## Phase 1: Core Content Editing (✅ IMPLEMENTED)
**Timeline: Immediate**

### 1.1 Block-Level Editing
- ✅ Hover overlays with edit/delete buttons on each content block
- ✅ Modal-based editors for different block types (hero, text, image, CTA)
- ✅ Real-time preview updates after saving changes
- ✅ Drag-and-drop block reordering (basic implementation)

### 1.2 Text Content Editing
- ✅ Rich text editor for text blocks with HTML support
- ✅ Inline editing for titles, subtitles, and button text
- ✅ Text alignment controls (left, center, right)

### 1.3 Image Management
- ✅ File upload with drag-and-drop support
- ✅ Image preview and replacement
- ✅ Alt text and caption editing
- ✅ Media library integration

### 1.4 Basic Block Management
- ✅ Add new blocks with type selection menu
- ✅ Delete blocks with confirmation
- ✅ Block reordering within pages

## Phase 2: Enhanced Editing Experience ✅ IMPLEMENTED
**Timeline: 1-2 weeks**

### 2.1 Advanced Text Editing
- ✅ WYSIWYG rich text editor with TipTap
- ✅ Text formatting toolbar (bold, italic, underline, strike, code)
- ✅ Font size and color controls with presets
- ✅ Link insertion and management
- ✅ Heading levels (H1, H2, H3, Paragraph)

### 2.2 Image Enhancement
- ✅ Image cropping and resizing tools
- ✅ Image filters (brightness, contrast, saturation)
- ✅ Image rotation controls
- ✅ Alt text and caption editing
- [ ] Stock photo integration (Unsplash/Pexels) - Future enhancement

### 2.3 Layout Controls
- ✅ Spacing and padding controls (per-side)
- ✅ Margin controls (top/bottom)
- ✅ Background colors with presets
- ✅ Border radius, width, and color controls
- ✅ Shadow presets and intensity

### 2.4 Component Library
- ✅ Pre-built component templates (Hero, Text, CTA, Contact, Features)
- ✅ Component categories and search
- ✅ One-click component insertion
- ✅ Component variations (centered hero, split hero, etc.)
- ✅ Block duplication functionality

## Phase 2 Implementation Details ✅

### Enhanced Rich Text Editor
- Full WYSIWYG experience with TipTap
- Advanced formatting: headings, colors, font sizes, links
- User-friendly toolbar with visual controls
- No more raw HTML editing required

### Advanced Image Editor
- Built-in image cropping with ReactCrop
- Real-time filters: brightness, contrast, saturation
- Image rotation in 15-degree increments
- Alt text editing for accessibility
- Canvas-based image processing

### Layout & Styling System
- Granular spacing controls (padding/margin per side)
- Background color picker with presets
- Border styling (radius, width, color)
- Shadow effects with intensity presets
- Real-time style preview

### Component Library
- 10+ pre-built components across 6 categories
- Hero sections (centered, split layouts)
- Text components (headings, paragraphs)
- Media components (single image, gallery)
- CTA components (centered, newsletter signup)
- Contact components (info, forms)
- Feature grids and testimonials
- Search and category filtering
- One-click insertion with sensible defaults

## Phase 3: Advanced Features (FUTURE)
**Timeline: 2-4 weeks**

### 3.1 Dynamic Content
- [ ] Inventory integration blocks
- [ ] Contact form builder
- [ ] Testimonial carousels
- [ ] Blog/news sections

### 3.2 SEO and Performance
- [ ] Meta tag editing
- [ ] Image alt text validation
- [ ] Page speed optimization
- [ ] Mobile responsiveness testing

### 3.3 Collaboration Features
- [ ] Multi-user editing
- [ ] Change tracking and history
- [ ] Comments and feedback system
- [ ] Approval workflows

### 3.4 Advanced Customization
- [ ] Custom CSS injection
- [ ] JavaScript widget support
- [ ] Third-party integrations
- [ ] A/B testing capabilities

## Technical Implementation Details

### Current Architecture
```
SiteEditor (main container)
├── EditorCanvas (visual editing area)
│   ├── Block rendering with hover controls
│   ├── BlockEditorModal (content editing)
│   └── AddBlockMenu (block creation)
├── PageList (page management)
├── ThemePalette (styling controls)
├── MediaManager (asset management)
└── PublishPanel (deployment)
```

### Key Components Implemented

#### EditorCanvas
- Visual block rendering with edit overlays
- Block-specific editing modals
- Add/delete block functionality
- Real-time preview updates

#### PageList
- Page creation with templates
- Page editing (name, slug)
- Page duplication
- Page deletion (except home page)

#### MediaManager
- File upload with validation
- Media library browsing
- Image preview and details
- URL copying and external links

#### ThemePalette
- Preset theme selection
- Custom color picker
- Font family selection
- Live theme preview

### Data Flow
1. User clicks edit button on block
2. BlockEditorModal opens with current content
3. User makes changes in form fields
4. Changes saved via websiteService API
5. Local state updated to reflect changes
6. Canvas re-renders with new content

### File Upload Process
1. User selects file in MediaManager or block editor
2. File validated for size and type
3. File uploaded via websiteService.uploadMedia()
4. Media URL returned and stored in block content
5. Image immediately visible in preview

## Next Steps for Phase 2

### 1. Rich Text Editor Integration
```typescript
// Install TinyMCE or similar
npm install @tinymce/tinymce-react

// Replace textarea in text block editor
<Editor
  value={content.html}
  onEditorChange={(content) => setContent({ ...content, html: content })}
  init={{
    height: 300,
    menubar: false,
    plugins: ['link', 'lists', 'image'],
    toolbar: 'bold italic | link | bullist numlist | image'
  }}
/>
```

### 2. Advanced Image Controls
```typescript
// Add image editing controls
const ImageEditor = ({ src, onUpdate }) => (
  <div className="space-y-4">
    <ImageCropper src={src} onCrop={onUpdate} />
    <ImageFilters src={src} onFilter={onUpdate} />
    <StockPhotoSearch onSelect={onUpdate} />
  </div>
)
```

### 3. Layout System
```typescript
// Add layout block type
case 'layout':
  return (
    <section className={`py-16 ${getLayoutClasses(block.content.layout)}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={getGridClasses(block.content.columns)}>
          {block.content.columns.map(column => (
            <div key={column.id} className="space-y-4">
              {column.blocks.map(renderBlock)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
```

## Success Metrics
- [ ] Users can edit all text content without technical knowledge
- [ ] Image uploads work reliably with good UX
- [ ] Changes are saved and persist across sessions
- [ ] Preview accurately reflects published site
- [ ] No data loss during editing sessions
- [ ] Mobile-responsive editing experience

## Risk Mitigation
- Auto-save functionality to prevent data loss
- Version history for rollback capability
- Input validation and error handling
- Graceful degradation for unsupported browsers
- Comprehensive error logging and monitoring

This implementation provides a solid foundation for content editing while maintaining the flexibility to add more advanced features in future phases.