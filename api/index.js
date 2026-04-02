import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const dbPath = path.resolve(process.cwd(), 'api/db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));

server.use(router);

export default server;
