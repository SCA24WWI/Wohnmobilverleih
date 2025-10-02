const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const BookingController = require('../controllers/bookingController');

// ENDPUNKT: GET /api/bookings - Alle Buchungen abrufen
router.get('/', async (req, res) => {
    try {
        const alleBuchungen = await pool.query('SELECT * FROM buchungen');
        res.json(alleBuchungen.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Abrufen der Buchungen');
    }
});

// ENDPUNKT: GET /api/bookings/check-availability - Professionelle Verfügbarkeitsprüfung
router.get('/check-availability', BookingController.checkAvailability);

// ENDPUNKT: GET /api/bookings/:id - Eine spezifische Buchung abrufen
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const buchung = await pool.query(
            `
            SELECT b.*, w.name as vehicle_name, w.modell, w.preis_pro_tag,
                   u.vorname, u.nachname, u.email
            FROM buchungen b
            LEFT JOIN wohnmobile w ON b.wohnmobil_id = w.id
            LEFT JOIN benutzer u ON b.kunde_id = u.id
            WHERE b.id = $1
        `,
            [id]
        );

        if (buchung.rows.length === 0) {
            return res.status(404).json({ message: 'Buchung nicht gefunden' });
        }

        res.json(buchung.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Fehler beim Abrufen der Buchung' });
    }
});

// ENDPUNKT: POST /api/bookings - Professionelle Buchungserstellung
router.post('/', BookingController.createBooking);

// ENDPUNKT: GET /api/wohnmobile/:id/bookings - Buchungen für ein Wohnmobil abrufen
router.get('/wohnmobil/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const buchungen = await pool.query(
            `SELECT 
                id, wohnmobil_id, kunde_id,
                TO_CHAR(start_datum, 'YYYY-MM-DD') as start_datum,
                TO_CHAR(end_datum, 'YYYY-MM-DD') as end_datum,
                anzahl_naechte, gesamtpreis, status, extras, notizen,
                stornierung_grund, storniert_am, gebucht_am, geaendert_am
             FROM buchungen 
             WHERE wohnmobil_id = $1`,
            [id]
        );
        res.json(buchungen.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler beim Abrufen der Buchungen');
    }
});

// ENDPUNKT: PUT /api/bookings/:id - Professionelle Buchungsaktualisierung
router.put('/:id', BookingController.updateBooking);

// ENDPUNKT: GET /api/bookings/:id/history - Buchungshistorie
router.get('/:id/history', BookingController.getBookingHistory);

module.exports = router;
