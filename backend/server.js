const http = require('http');
const port = 3001;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Schreibe den Erfolgs-Header (Status-Code 200)
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    // Sende die Antwort und beende die Verbindung
    res.end('Hallo vom Backend! ✨');
  } else {
    // Wenn eine andere URL aufgerufen wird, sende einen 404 "Not Found"
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Seite nicht gefunden');
  }
});

server.listen(port, () => {
  console.log(`Minimalistischer Node.js Server läuft auf Port ${port}`);
});