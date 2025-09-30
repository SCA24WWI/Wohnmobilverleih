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

// ENDPUNKT: GET /api/bookings/check-availability - Verfügbarkeit prüfen
router.get('/check-availability', async (req, res) => {
    try {
        const { vehicle_id, start_date, end_date } = req.query;
        
        if (!vehicle_id || !start_date || !end_date) {
            return res.status(400).json({ 
                error: 'vehicle_id, start_date und end_date sind erforderlich' 
            });
        }

        // Prüfung auf überlappende Buchungen
        const conflictingBookings = await pool.query(`
            SELECT * FROM buchungen 
            WHERE wohnmobil_id = $1 
            AND status IN ('angefragt', 'bestätigt')
            AND (
                (start_datum <= $2 AND end_datum > $2) OR
                (start_datum < $3 AND end_datum >= $3) OR
                (start_datum >= $2 AND end_datum <= $3)
            )
        `, [vehicle_id, start_date, end_date]);

        const available = conflictingBookings.rows.length === 0;
        
        res.json({
            available,
            vehicle_id: parseInt(vehicle_id),
            start_date,
            end_date,
            conflicting_bookings: available ? [] : conflictingBookings.rows
        });
        
    } catch (err) {
        console.error('Fehler bei der Verfügbarkeitsprüfung:', err.message);
        res.status(500).json({ error: 'Server Fehler bei der Verfügbarkeitsprüfung' });
    }
});

// ENDPUNKT: GET /api/bookings/:id - Eine spezifische Buchung abrufen
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const buchung = await pool.query(`
            SELECT b.*, w.name as vehicle_name, w.modell, w.preis_pro_tag,
                   u.vorname, u.nachname, u.email
            FROM buchungen b
            LEFT JOIN wohnmobile w ON b.wohnmobil_id = w.id
            LEFT JOIN benutzer u ON b.kunde_id = u.id
            WHERE b.id = $1
        `, [id]);
        
        if (buchung.rows.length === 0) {
            return res.status(404).json({ message: "Buchung nicht gefunden" });
        }
        
        res.json(buchung.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Fehler beim Abrufen der Buchung" });
    }
});

// ENDPUNKT: POST /api/bookings - Neue Buchung erstellen
router.post('/', async (req, res) => {
    try {
        const { vehicle_id, user_id, start_date, end_date, total_price, customer_info, extras } = req.body;
        
        // Validierung der Eingabedaten
        if (!vehicle_id || !user_id || !start_date || !end_date || !total_price) {
            return res.status(400).json({ 
                error: 'Alle Pflichtfelder müssen ausgefüllt werden (vehicle_id, user_id, start_date, end_date, total_price)' 
            });
        }

        // Datums-Validierung
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (startDate >= endDate) {
            return res.status(400).json({ 
                error: 'Das Startdatum muss vor dem Enddatum liegen' 
            });
        }

        if (startDate < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ 
                error: 'Das Startdatum darf nicht in der Vergangenheit liegen' 
            });
        }

        // Prüfung, ob das Fahrzeug existiert
        const vehicleCheck = await pool.query('SELECT * FROM wohnmobile WHERE id = $1', [vehicle_id]);
        if (vehicleCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
        }

        // Verfügbarkeitsprüfung: Prüfe, ob das Fahrzeug im gewählten Zeitraum bereits gebucht ist
        const availabilityCheck = await pool.query(`
            SELECT * FROM buchungen 
            WHERE wohnmobil_id = $1 
            AND status IN ('angefragt', 'bestätigt')
            AND (
                (start_datum <= $2 AND end_datum > $2) OR
                (start_datum < $3 AND end_datum >= $3) OR
                (start_datum >= $2 AND end_datum <= $3)
            )
        `, [vehicle_id, start_date, end_date]);

        if (availabilityCheck.rows.length > 0) {
            return res.status(409).json({ 
                error: 'Das Fahrzeug ist im gewählten Zeitraum bereits gebucht',
                conflicting_bookings: availabilityCheck.rows 
            });
        }

        // Neue Buchung erstellen
        const neueBuchung = await pool.query(`
            INSERT INTO buchungen (wohnmobil_id, kunde_id, start_datum, end_datum, gesamtpreis, status, extras) 
            VALUES ($1, $2, $3, $4, $5, 'angefragt', $6) 
            RETURNING *
        `, [vehicle_id, user_id, start_date, end_date, total_price, JSON.stringify(extras || [])]);
        
        // Buchungsdetails für Response vorbereiten
        const buchung = neueBuchung.rows[0];
        const response = {
            ...buchung,
            customer_info: customer_info || null,
            extras: extras || [],
            vehicle: vehicleCheck.rows[0]
        };

        res.status(201).json(response);
    } catch (err) {
        console.error('Fehler beim Erstellen der Buchung:', err.message);
        res.status(500).json({ error: 'Server Fehler beim Erstellen der Buchung' });
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
