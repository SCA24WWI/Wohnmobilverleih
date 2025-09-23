const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Controller wird später implementiert
// const { getAllUsers, getUserById, updateUser } = require('../controllers/userController');

// ENDPUNKT: GET /api/bookings - Alle Buchungen abrufen
router.get('/', async (req, res) => {
    try {
        const alleBuchungen = await pool.query("SELECT * FROM buchungen");
        res.json(alleBuchungen.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Buchungen");
    }
});

// ENDPUNKT: GET /api/bookings/:id - Eine spezifische Buchung abrufen
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const buchung = await pool.query("SELECT * FROM buchungen WHERE id = $1", [id]);
        
        if (buchung.rows.length === 0) {
            return res.status(404).json({ message: "Buchung nicht gefunden" });
        }
        
        res.json(buchung.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Buchung");
    }
});

// ENDPUNKT: POST /api/bookings - Neue Buchung erstellen
router.post('/', async (req, res) => {
    try {
        const { wohnmobil_id, kunde_id, start_datum, end_datum, gesamtpreis } = req.body;
        const neueBuchung = await pool.query(
            "INSERT INTO buchungen (wohnmobil_id, kunde_id, start_datum, end_datum, gesamtpreis) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [wohnmobil_id, kunde_id, start_datum, end_datum, gesamtpreis]
        );
        
        res.status(201).json(neueBuchung.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Erstellen der Buchung");
    }
});

// ENDPUNKT: GET /api/wohnmobile/:id/bookings - Buchungen für ein Wohnmobil abrufen
router.get('/wohnmobil/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const buchungen = await pool.query(
            "SELECT * FROM buchungen WHERE wohnmobil_id = $1",
            [id]
        );
        res.json(buchungen.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Buchungen");
    }
});

// ENDPUNKT: PUT /api/bookings/:id - Status einer Buchung aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updateBuchung = await pool.query(
            "UPDATE buchungen SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        
        if (updateBuchung.rows.length === 0) {
            return res.status(404).json({ message: "Buchung nicht gefunden" });
        }
        
        res.json(updateBuchung.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Aktualisieren der Buchung");
    }
});

module.exports = router;
