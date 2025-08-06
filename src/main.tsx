import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import * as pdfjs from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = PdfWorker
    <HelmetProvider>
      <App />
    </HelmetProvider>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)