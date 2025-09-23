const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Controller wird später implementiert
// const { getAllUsers, getUserById, updateUser } = require('../controllers/userController');

// ENDPUNKT: GET /api/users - Alle Benutzer abrufen
router.get('/', async (req, res) => {
    try {
        const alleBenutzer = await pool.query("SELECT id, email, vorname, nachname, rolle FROM benutzer");
        res.json(alleBenutzer.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Benutzer");
    }
});

// ENDPUNKT: GET /api/users/:id - Einen spezifischen Benutzer abrufen
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const benutzer = await pool.query(
            "SELECT id, email, vorname, nachname, rolle FROM benutzer WHERE id = $1",
            [id]
        );
        
        if (benutzer.rows.length === 0) {
            return res.status(404).json({ message: "Benutzer nicht gefunden" });
        }
        
        res.json(benutzer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen des Benutzers");
    }
});

// ENDPUNKT: GET /api/users/:id/bookings - Buchungen eines Benutzers abrufen
router.get('/:id/bookings', async (req, res) => {
    try {
        const { id } = req.params;
        const buchungen = await pool.query(
            "SELECT * FROM buchungen WHERE kunde_id = $1",
            [id]
        );
        res.json(buchungen.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Buchungen");
    }
});

// ENDPUNKT: PUT /api/users/:id - Benutzer aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, vorname, nachname } = req.body;
        const updateBenutzer = await pool.query(
            "UPDATE benutzer SET email = $1, vorname = $2, nachname = $3 WHERE id = $4 RETURNING id, email, vorname, nachname, rolle",
            [email, vorname, nachname, id]
        );
        
        if (updateBenutzer.rows.length === 0) {
            return res.status(404).json({ message: "Benutzer nicht gefunden" });
        }
        
        res.json(updateBenutzer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Aktualisieren des Benutzers");
    }
});

module.exports = router;
