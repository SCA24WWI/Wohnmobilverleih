const { Pool } = require('pg');

// Datenbank-Konfiguration
const pool = new Pool({
    user: 'app_user',
    host: 'localhost',
    database: 'wohnmobil_db',
    password: 'sicheres_passwort',
    port: 5432,
});

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
