import jsonServer from 'json-server'
import path from 'path'

const server = jsonServer.create()
const router = jsonServer.router(path.resolve(process.cwd(), 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Rewrite /api/* to /* 
// Example: /api/properties -> /properties
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}))

server.use(router)

export default server
