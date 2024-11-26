const http = require('http');
const { register, login } = require('./controllers/UserController');

const routes = async (req, res) => {
  if (req.url === '/register' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => register({ ...req, body: JSON.parse(body) }, res));
  } else if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => login({ ...req, body: JSON.parse(body) }, res));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
};

module.exports = routes;
