const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Controller wird später implementiert
// const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

// ENDPUNKT: Wohnmobile suchen mit Filtern
router.get('/search', async (req, res) => {
    try {
        const { location, guests, dateFrom, dateTo } = req.query;

        // Basis-SQL-Query
        let query = 'SELECT * FROM wohnmobile WHERE 1=1';
        let queryParams = [];
        let paramCount = 0;

        // Filter nach Gästeanzahl (Mindestanzahl Betten)
        if (guests && !isNaN(guests) && parseInt(guests) > 0) {
            paramCount++;
            query += ` AND bettenzahl >= $${paramCount}`;
            queryParams.push(parseInt(guests));
        }

        // Filter nach Standort (sucht in name, modell)
        if (location && location.trim() !== '') {
            paramCount++;
            query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(modell) LIKE LOWER($${paramCount}))`;
            queryParams.push(`%${location.trim()}%`);
        }

        // Datum-Filter: Hier könnten wir später Buchungskonflikte prüfen
        // Für jetzt validieren wir nur die Datumslogik
        if (dateFrom && dateTo) {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Validierung: Startdatum muss vor Enddatum liegen und in der Zukunft
            if (fromDate >= toDate || fromDate < today) {
                return res.status(400).json({
                    error: 'Ungültige Datumswerte. Startdatum muss vor Enddatum liegen und in der Zukunft sein.'
                });
            }

            // Hier könnte später eine Buchungskonflikt-Prüfung stehen:
            // query += ` AND id NOT IN (SELECT wohnmobil_id FROM buchungen WHERE ...)`
        }

        console.log('SQL Query:', query);
        console.log('Parameters:', queryParams);

        const alleWohnmobile = await pool.query(query, queryParams);
        res.status(200).json(alleWohnmobile.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Abrufen der Wohnmobile');
    }
});

// ENDPUNKT: GET /api/wohnmobile/:id - Holt die Detailinformationen für ein einzelnes Wohnmobil.
// INFO: Öffentlich zugänglich.
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const wohnmobil = await pool.query('SELECT * FROM wohnmobile WHERE id = $1', [id]);
        if (wohnmobil.rows.length == 0) {
            return res.status(404).send('Wohnmobil nicht gefunden');
        }
        res.status(200).json(wohnmobil.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Abrufen des Wohnmobils');
    }
});

// ENDPUNKT: POST /api/wohnmobile - Erstellt ein neues Wohnmobil.
// ZUGRIFF: Nur für 'anbieter' oder 'admin'..
router.post('/create', async (req, res) => {
    const { benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am } = req.body;

    try {
        const neuesWohnmobil = await pool.query(
            'INSERT INTO wohnmobile (id, benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM wohnmobile), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am]
        );
        res.status(201).json(neuesWohnmobil.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Erstellen des Wohnmobils');
    }
});

// ENDPUNKT: PUT /api/wohnmobile/:id/edit - Aktualisiert ein bestehendes Wohnmobil.
// ZUGRIFF: Nur für den Besitzer des Wohnmobils oder 'admin'.
router.put('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const { name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag } = req.body;

    try {
        const updateWohnmobil = await pool.query(
            'UPDATE wohnmobile SET name = $1, modell = $2, beschreibung = $3, bettenzahl = $4, fuehrerschein = $5, preis_pro_tag = $6 WHERE id = $7 RETURNING *',
            [name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, id]
        );

        if (updateWohnmobil.rows.length === 0) {
            return res.status(404).json({ message: 'Wohnmobil nicht gefunden' });
        }

        res.json(updateWohnmobil.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Aktualisieren des Wohnmobils');
    }
});

// ENDPUNKT: DELETE /api/wohnmobile/:id - Löscht ein Wohnmobil.
// ZUGRIFF: Nur für den Besitzer des Wohnmobils oder 'admin'.s
router.delete('/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteWohnmobil = await pool.query('DELETE FROM wohnmobile WHERE id = $1 RETURNING *', [id]);

        if (deleteWohnmobil.rows.length === 0) {
            return res.status(404).json({ message: 'Wohnmobil nicht gefunden' });
        }

        res.json({ message: 'Wohnmobil erfolgreich gelöscht' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Löschen des Wohnmobils');
    }
});

module.exports = router;
