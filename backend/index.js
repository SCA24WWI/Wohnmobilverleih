// Lade das eingebaute http-Modul von Node.js
const http = require('http');

// Definiere den Port, auf dem der Server lauschen soll
const port = 3001;

// Erstelle den Server
// Die Funktion hier wird bei jeder einzelnen Anfrage ausgeführt
const server = http.createServer((req, res) => {
  // Simples Routing: Wir prüfen, welche URL aufgerufen wurde
  if (req.url === '/') {
    // Schreibe den Erfolgs-Header (Status-Code 200)
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    // Sende die Antwort und beende die Verbindung
    res.end('Hallo vom Backend ohne Express!  minimalistisch & schnell ✨');
  } else {
    // Wenn eine andere URL aufgerufen wird, sende einen 404 "Not Found"
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Seite nicht gefunden');
  }
});

// Starte den Server und lasse ihn auf Anfragen warten
server.listen(port, () => {
  console.log(`Minimalistischer Node.js Server läuft auf Port ${port}`);
});