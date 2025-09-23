const { Pool } = require('pg');

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10)
};

// Datenbank-Konfiguration
const pool = new Pool(dbConfig);

// Test der Datenbankverbindung
pool.connect((err, client, release) => {
    if (err) {
        console.error('Fehler bei der Verbindung zur Datenbank:', err.stack);
        return;
    }
    console.log('Erfolgreich mit der Datenbank verbunden!');
    release();
});

// Error Handler für unerwartete Pool-Fehler
pool.on('error', (err) => {
    console.error('Unerwarteter Fehler am Idle-Client', err);
    process.exit(-1);
});

module.exports = pool;
