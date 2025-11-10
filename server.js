const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Example: custom route
  server.get('/api/health', (req, res) => res.json({ status: 'ok' }))

  // Handle all Next.js pages
  server.all('*', (req, res) => handle(req, res))

  const port = process.env.PORT || 3000
  server.listen(port, () => console.log(`Listening on http://localhost:${port}`))
})
