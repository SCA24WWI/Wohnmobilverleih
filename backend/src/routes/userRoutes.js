const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// ENDPUNKT: GET /api/users - Alle Benutzer abrufen
router.get('/', UserController.getAllUsers);

// ENDPUNKT: GET /api/users/:id - Einen spezifischen Benutzer abrufen
router.get('/:id', UserController.getUserById);

// ENDPUNKT: GET /api/users/:id/bookings - Buchungen eines Benutzers abrufen
router.get('/:id/bookings', UserController.getUserBookings);

// ENDPUNKT: PUT /api/users/:id - Benutzer aktualisieren
router.put('/:id', UserController.updateUser);

module.exports = router;
