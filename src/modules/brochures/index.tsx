// Export all brochure components for use in the main app
export { BrochureList } from './pages/BrochureList'
export { BrochureTemplateEditor } from './pages/BrochureTemplateEditor'
export { PublicBrochureView } from './pages/PublicBrochureView'

// Export other components that might be needed
export { BrochureRenderer } from './components/BrochureRenderer'
export { GenerateBrochureModal } from './components/GenerateBrochureModal'
export { ShareBrochureModal } from './components/ShareBrochureModal'

// Export types
export type { BrochureTemplate, BrochureBlock, BrochureTheme } from './types'

// Export hooks
export { useBrochureStore } from './store/useBrochureStore'