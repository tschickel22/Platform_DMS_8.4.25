import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Netlify Functions not available - using fallback');
            // Fallback response when Netlify dev server is not running
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Netlify Functions not available', 
                message: 'Run "npm run dev:netlify" to start Netlify dev server' 
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
              console.log('Proxying to Netlify Functions:', req.url);
            }
          });
        }
      }
    }
  }
})