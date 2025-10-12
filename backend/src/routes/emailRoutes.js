const express = require('express');
const EmailController = require('../controllers/emailController');
const router = express.Router();

/**
 * E-Mail Routes
 * Alle E-Mail-bezogenen Endpunkte
 */

// Test-E-Mail versenden
router.post('/test-email', EmailController.sendTestEmail);

// Buchungsbestätigung für eine bestehende Buchung erneut versenden
router.post('/resend-confirmation/:bookingId', EmailController.resendBookingConfirmation);

// E-Mail-Konfiguration testen
router.get('/test-config', EmailController.testConfiguration);

// E-Mail-Vorschau für Buchungsbestätigung (HTML-Preview)
router.get('/preview-confirmation/:bookingId', EmailController.previewBookingConfirmation);

module.exports = router;
