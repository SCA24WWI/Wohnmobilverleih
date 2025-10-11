const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// JWT Secret aus Environment Variable oder Fallback
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Registrierung
const register = async (req, res) => {
    try {
        const { email, passwort, vorname, nachname } = req.body;

        // Validierung
        if (!email || !passwort || !vorname || !nachname) {
            return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
        }

        // Prüfen ob Benutzer bereits existiert
        const existingUser = await pool.query('SELECT id FROM benutzer WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Benutzer mit dieser E-Mail existiert bereits' });
        }

        // Passwort hashen
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(passwort, saltRounds);

        // Benutzer in Datenbank speichern
        const newUser = await pool.query(
            'INSERT INTO benutzer (email, passwort_hash, vorname, nachname) VALUES ($1, $2, $3, $4) RETURNING id, email, vorname, nachname',
            [email, hashedPassword, vorname, nachname]
        );

        // JWT Token erstellen
        const token = jwt.sign({ userId: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Registrierung erfolgreich',
            token,
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Registrierung Error:', error);
        res.status(500).json({ message: 'Server Fehler bei der Registrierung' });
    }
};

// Anmeldung
const login = async (req, res) => {
    try {
        const { email, passwort, rememberMe } = req.body;

        // Validierung
        if (!email || !passwort) {
            return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich' });
        }

        // Benutzer suchen
        const user = await pool.query(
            'SELECT id, email, passwort_hash, vorname, nachname FROM benutzer WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
        }

        // Passwort prüfen
        const isValidPassword = await bcrypt.compare(passwort, user.rows[0].passwort_hash);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
        }

        // JWT Token erstellen
        const expiresIn = rememberMe ? '30d' : '7d';
        const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn });

        // Passwort Hash aus Response entfernen
        const { passwort_hash, ...userWithoutPassword } = user.rows[0];

        res.json({
            message: 'Anmeldung erfolgreich',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Fehler bei der Anmeldung' });
    }
};

// Benutzer-Profil abrufen (geschützte Route)
const getProfile = async (req, res) => {
    try {
        // req.user wurde durch auth middleware gesetzt
        res.json({ user: req.user });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server Fehler beim Abrufen des Profils' });
    }
};

// Token validieren
const verifyToken = async (req, res) => {
    try {
        // req.user wurde durch auth middleware gesetzt
        res.json({
            valid: true,
            user: req.user
        });
    } catch (error) {
        console.error('Verify Token Error:', error);
        res.status(500).json({ message: 'Server Fehler bei der Token-Validierung' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    verifyToken
};
