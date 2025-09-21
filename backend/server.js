const express = require('express');
const { Pool } = require('pg'); // PostgreSQL-Treiber

const server = express();
const PORT = 3000;

server.use(express.json());

const pool = new Pool({
    user: 'app_user',
    host: 'localhost', 
    database: 'wohnmobil_db',
    password: 'sicheres_passwort',
    port: 5432,
});

// --- API-ENDPUNKTE (ROUTEN) ---

server.get('/', (req, res) => {
    res.send('Willkommen auf dem Wohnmobilverleih-API-Server!');
});

// ENDPUNKT: Alle Wohnmobile aus der Datenbank holen
server.get('/api/wohnmobile', async (req, res) => {
    try {
        const alleWohnmobile = await pool.query("SELECT * FROM wohnmobile");
        res.status(200).json(alleWohnmobile.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Wohnmobile");
    }
});

server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});