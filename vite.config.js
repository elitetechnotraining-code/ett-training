import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import demoRegistrationWhatsAppHandler from './api/demo-registration-whatsapp.js'

function localDemoRegistrationApi() {
  return {
    name: 'local-demo-registration-api',
    configureServer(server) {
      server.middlewares.use('/api/demo-registration-whatsapp', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        try {
          const body = await new Promise((resolve, reject) => {
            let raw = ''

            req.on('data', chunk => {
              raw += chunk
            })

            req.on('end', () => {
              if (!raw) {
                resolve({})
                return
              }

              try {
                resolve(JSON.parse(raw))
              } catch (error) {
                reject(error)
              }
            })

            req.on('error', reject)
          })

          req.body = body

          if (typeof res.status !== 'function') {
            res.status = function status(code) {
              res.statusCode = code
              return res
            }
          }

          await demoRegistrationWhatsAppHandler(req, res)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            ok: false,
            error: error?.message || 'Unable to process local demo registration notifications.',
          }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localDemoRegistrationApi()],
})
