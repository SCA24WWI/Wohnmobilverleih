const express = require('express');
const router = express.Router();

// Controller wird später implementiert
// const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

// ENDPUNKT: Alle Wohnmobile aus der Datenbank holen
router.get('/', async (req, res) => {
    try {
        const alleWohnmobile = await pool.query("SELECT * FROM wohnmobile");
        res.status(200).json(alleWohnmobile.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen der Wohnmobile");
    }
});

// ENDPUNKT: GET /api/wohnmobile/:id - Holt die Detailinformationen für ein einzelnes Wohnmobil.
// INFO: Öffentlich zugänglich.
rou.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const wohnmobil = await pool.query("SELECT * FROM wohnmobile WHERE id = $1", [id]);
        if (wohnmobil.rows.length == 0) {
            return res.status(404).send("Wohnmobil nicht gefunden");
        }
        res.status(200).json(wohnmobil.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Abrufen des Wohnmobils");
    }
});

// ENDPUNKT: POST /api/wohnmobile - Erstellt ein neues Wohnmobil.
// ZUGRIFF: Nur für 'anbieter' oder 'admin'..
server.post('/create', async (req, res) => {
    const { benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am } = req.body;

    try {
        const neuesWohnmobil = await pool.query(
            "INSERT INTO wohnmobile (id, benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM wohnmobile), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am]
        );
        res.status(201).json(neuesWohnmobil.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler beim Erstellen des Wohnmobils");
    } 
});

// ENDPUNKT: PUT /api/wohnmobile/:id/edit - Aktualisiert ein bestehendes Wohnmobil.
// ZUGRIFF: Nur für den Besitzer des Wohnmobils oder 'admin'.
router.put('/:id', (req, res) => {
    res.json({ message: `PUT update vehicle ${req.params.id} - to be implemented` });
});

// ENDPUNKT: DELETE /api/wohnmobile/:id - Löscht ein Wohnmobil.
// ZUGRIFF: Nur für den Besitzer des Wohnmobils oder 'admin'.s
router.delete('/:id', (req, res) => {
    res.json({ message: `DELETE vehicle ${req.params.id} - to be implemented` });
});

module.exports = router;