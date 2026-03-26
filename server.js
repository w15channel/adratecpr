// Servidor local para testar o ADRA-TEC
// Execute: node server.js
// Depois acesse: http://localhost:3000/course-view.html

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Se for a raiz, servir index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Arquivo não encontrado
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Página não encontrada</h1><p>Verifique o URL e tente novamente.</p>');
      } else {
        // Outro erro
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Erro no servidor</h1>');
      }
      return;
    }

    // Enviar o arquivo
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('🚀 Servidor ADRA-TEC rodando em http://localhost:' + PORT);
  console.log('📚 Acesse os cursos em: http://localhost:' + PORT + '/course-view.html');
  console.log('🏠 Página inicial: http://localhost:' + PORT + '/index.html');
  console.log('\n⚠️  Pressione Ctrl+C para parar o servidor\n');
});

// Tratar interrupção gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Servidor parado. Obrigado por testar o ADRA-TEC!');
  process.exit(0);
});
