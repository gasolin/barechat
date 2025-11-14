import http from 'http'

/**
 * Creates a chat server using bare-http1
 * @param {string} staticContent - HTML content to serve at the root path
 * @returns {http.Server} The HTTP server instance
 */
export function createChatServer(staticContent) {
  // Create server
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('Content-Length', Buffer.byteLength(staticContent))
      res.write(staticContent)
      res.end()
    } else if (req.url === '/status') {
      // Provide basic server status info
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      const status = JSON.stringify({
        status: 'online',
        timestamp: new Date().toISOString()
      })
      res.setHeader('Content-Length', Buffer.byteLength(status))
      res.write(status)
      res.end()
    } else {
      res.statusCode = 404
      res.end('Not found')
    }
  })

  return server;
}
