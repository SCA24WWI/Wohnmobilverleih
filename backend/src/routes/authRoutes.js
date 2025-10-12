const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    verifyToken,
    changePassword,
    requestPasswordReset,
    validateResetToken,
    resetPassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register - Registrierung
router.post('/register', register);

// POST /api/auth/login - Anmeldung
router.post('/login', login);

// GET /api/auth/profile - Benutzerprofil abrufen (geschützt)
router.get('/profile', auth, getProfile);

// GET /api/auth/verify - Token validieren (geschützt)
router.get('/verify', auth, verifyToken);

// POST /api/auth/change-password - Passwort ändern (geschützt)
router.post('/change-password', auth, changePassword);

// POST /api/auth/request-password-reset - Passwort-Reset anfordern
router.post('/request-password-reset', requestPasswordReset);

// POST /api/auth/validate-reset-token - Reset-Token validieren
router.post('/validate-reset-token', validateResetToken);

// POST /api/auth/reset-password - Passwort mit Token zurücksetzen
router.post('/reset-password', resetPassword);

module.exports = router;
