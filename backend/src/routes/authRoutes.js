const express = require('express');
const router = express.Router();
const { register, login, getProfile, verifyToken } = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register - Registrierung
router.post('/register', register);

// POST /api/auth/login - Anmeldung
router.post('/login', login);

// GET /api/auth/profile - Benutzerprofil abrufen (geschützt)
router.get('/profile', auth, getProfile);

// GET /api/auth/verify - Token validieren (geschützt)
router.get('/verify', auth, verifyToken);

module.exports = router;
