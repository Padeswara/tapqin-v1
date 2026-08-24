import { resolve } from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom Vite plugin to save CMS edits directly into src/data/profile.json during local development
function localPersistencePlugin() {
  return {
    name: 'local-persistence-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-profile', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const filePath = resolve(import.meta.dirname, 'src/data/profile.json')
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'Saved to src/data/profile.json on disk' }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localPersistencePlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
      },
    },
  },
})
