const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Kein Token, Zugriff verweigert' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

        // Benutzer aus Datenbank laden
        const user = await pool.query('SELECT id, email, vorname, nachname FROM benutzer WHERE id = $1', [
            decoded.userId
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Token ungültig' });
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Token ungültig' });
    }
};

module.exports = auth;
