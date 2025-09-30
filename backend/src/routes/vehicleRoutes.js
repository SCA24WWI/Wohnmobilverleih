const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Controller wird später implementiert
// const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

// ENDPUNKT: Wohnmobile suchen mit Filtern
router.get('/search', async (req, res) => {
    try {
        const { location, guests, dateFrom, dateTo, page = 1, limit = 6 } = req.query;

        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 6;
        const offset = (pageNumber - 1) * limitNumber;

        if (dateFrom && dateTo) {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            if (fromDate >= toDate) {
                return res.status(400).json({
                    error: 'Das Startdatum muss vor dem Enddatum liegen.'
                });
            }
        }

        const countQuery = `
            SELECT COUNT(DISTINCT w.id) as total
            FROM wohnmobile w
            LEFT JOIN buchungen b ON w.id = b.wohnmobil_id
                AND b.status IN ('bestätigt', 'angefragt')
                AND b.end_datum > $3::DATE
                AND b.start_datum < $4::DATE
            WHERE
                (w.bettenzahl >= $1 OR $1 IS NULL)
            AND
                (
                    LOWER(w.ort) LIKE LOWER($2) OR
                    $2 = '%%'
                )
            AND
                ( ($3 IS NULL OR $4 IS NULL) OR b.id IS NULL )
        `;

        const dataQuery = `
            SELECT DISTINCT w.*
            FROM wohnmobile w
            LEFT JOIN buchungen b ON w.id = b.wohnmobil_id
                AND b.status IN ('bestätigt', 'angefragt')
                AND b.end_datum > $3::DATE
                AND b.start_datum < $4::DATE
            WHERE
                (w.bettenzahl >= $1 OR $1 IS NULL)
            AND
                (
                    LOWER(w.ort) LIKE LOWER($2) OR
                    $2 = '%%'
                )
            AND
                ( ($3 IS NULL OR $4 IS NULL) OR b.id IS NULL )
            ORDER BY w.preis_pro_tag ASC
            LIMIT $5 OFFSET $6
        `;

        const queryParams = [
            parseInt(guests) || null,
            location ? `%${location.trim()}%` : '%%',
            dateFrom || null,
            dateTo || null
        ];

        const countResult = await pool.query(countQuery, queryParams);
        const totalVehicles = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(totalVehicles / limitNumber);

        const dataQueryParams = [...queryParams, limitNumber, offset];
        const dataResult = await pool.query(dataQuery, dataQueryParams);

        res.status(200).json({
            vehicles: dataResult.rows,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalVehicles,
                vehiclesPerPage: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });
    } catch (err) {
        console.error('Fehler bei der Wohnmobilsuche:', err.message);
        res.status(500).send('Serverfehler beim Abrufen der Wohnmobile');
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
