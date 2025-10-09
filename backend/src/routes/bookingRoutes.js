const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// ENDPUNKT: GET /api/bookings - Alle Buchungen abrufen
router.get('/', BookingController.getAllBookings);

// ENDPUNKT: GET /api/bookings/check-availability - Professionelle Verfügbarkeitsprüfung
router.get('/check-availability', BookingController.checkAvailability);

// ENDPUNKT: GET /api/bookings/:id - Eine spezifische Buchung abrufen
router.get('/:id', BookingController.getBookingById);

// ENDPUNKT: POST /api/bookings - Buchungserstellung (nur für angemeldete Benutzer)
router.post('/', auth, BookingController.createBooking);

// ENDPUNKT: GET /api/wohnmobile/:id/bookings - Buchungen für ein Wohnmobil abrufen
router.get('/wohnmobil/:id', BookingController.getBookingsByVehicle);

// ENDPUNKT: PUT /api/bookings/:id - Professionelle Buchungsaktualisierung
router.put('/:id', BookingController.updateBooking);

// ENDPUNKT: GET /api/bookings/:id/history - Buchungshistorie
router.get('/:id/history', BookingController.getBookingHistory);

module.exports = router;
