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

// Passwort ändern
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validierung
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Aktuelles und neues Passwort sind erforderlich' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Neues Passwort muss mindestens 6 Zeichen lang sein' });
        }

        // Aktuellen Benutzer mit Passwort-Hash laden
        const user = await pool.query('SELECT id, email, passwort_hash FROM benutzer WHERE id = $1', [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        // Aktuelles Passwort überprüfen
        const isValidPassword = await bcrypt.compare(currentPassword, user.rows[0].passwort_hash);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Aktuelles Passwort ist falsch' });
        }

        // Neues Passwort hashen
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Passwort in Datenbank aktualisieren
        await pool.query('UPDATE benutzer SET passwort_hash = $1 WHERE id = $2', [hashedNewPassword, userId]);

        res.json({ message: 'Passwort erfolgreich geändert' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server Fehler beim Ändern des Passworts' });
    }
};

// Passwort-Reset anfordern (E-Mail senden)
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'E-Mail-Adresse ist erforderlich' });
        }

        // Prüfen ob Benutzer existiert
        const user = await pool.query('SELECT id, email, vorname FROM benutzer WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            // Aus Sicherheitsgründen immer success melden, auch wenn E-Mail nicht existiert
            return res.json({
                message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet'
            });
        }

        // Reset-Token generieren (gültig für 1 Stunde)
        const resetToken = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `${
            process.env.FRONTEND_URL || 'http://localhost:3000'
        }/auth/reset-password?token=${resetToken}`;

        // E-Mail mit Reset-Link senden
        try {
            // Debug: E-Mail-Konfiguration prüfen
            console.log('Versuche E-Mail zu senden an:', email);
            console.log('Reset-Link:', resetLink);
            console.log('EMAIL_USER verfügbar:', !!process.env.EMAIL_USER);
            console.log('EMAIL_PASSWORD verfügbar:', !!process.env.EMAIL_PASSWORD);

            // Prüfen ob E-Mail-Konfiguration vorhanden ist
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                console.log('E-Mail-Konfiguration fehlt - entwicklungsweise Reset-Link in Konsole ausgeben');
                console.log('\n=== PASSWORT RESET LINK (NUR FÜR ENTWICKLUNG) ===');
                console.log(`Benutzer: ${user.rows[0].vorname} ${user.rows[0].nachname} (${email})`);
                console.log(`Reset-Link: ${resetLink}`);
                console.log('================================================\n');

                // In Entwicklung: Erfolg melden, aber keinen E-Mail-Versand
                return res.json({
                    message: 'Reset-Link wurde generiert (siehe Server-Konsole für Entwicklungszwecke)'
                });
            }

            const EmailService = require('../utils/emailService');
            const emailService = new EmailService();

            await emailService.sendEmail(
                email,
                'Passwort zurücksetzen - Wohnmobilverleih',
                `
                <h2>Passwort zurücksetzen</h2>
                <p>Hallo ${user.rows[0].vorname || 'Kunde'},</p>
                <p>Sie haben eine Passwort-Reset-Anfrage für Ihr Konto gestellt.</p>
                <p><strong>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</strong></p>
                <p><a href="${resetLink}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Passwort zurücksetzen</a></p>
                <p><strong>Dieser Link ist nur 1 Stunde gültig.</strong></p>
                <p>Falls Sie keine Passwort-Reset-Anfrage gestellt haben, ignorieren Sie diese E-Mail.</p>
                <br>
                <p>Ihr Wohnmobilverleih-Team</p>
                `
            );

            console.log('E-Mail erfolgreich gesendet');
        } catch (emailError) {
            console.error('E-Mail sending error:', emailError);
            console.error('Error details:', {
                message: emailError.message,
                stack: emailError.stack,
                code: emailError.code
            });

            // Fallback: Reset-Link in der Konsole ausgeben (nur für Entwicklung)
            if (process.env.NODE_ENV === 'development') {
                console.log('\n=== FALLBACK: PASSWORT RESET LINK ===');
                console.log(`Benutzer: ${user.rows[0].vorname} ${user.rows[0].nachname} (${email})`);
                console.log(`Reset-Link: ${resetLink}`);
                console.log('=====================================\n');

                return res.json({
                    message:
                        'E-Mail-Versand fehlgeschlagen, aber Reset-Link wurde in der Server-Konsole ausgegeben (Entwicklungsmodus)'
                });
            }

            return res.status(500).json({
                message: 'Fehler beim Senden der Reset-E-Mail'
            });
        }

        res.json({ message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet' });
    } catch (error) {
        console.error('Request Password Reset Error:', error);
        res.status(500).json({ message: 'Server Fehler bei der Passwort-Reset-Anfrage' });
    }
};

// Reset-Token validieren
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token ist erforderlich' });
        }

        // Token entschlüsseln und validieren
        const decoded = jwt.verify(token, JWT_SECRET);

        // Prüfen ob Benutzer existiert
        const user = await pool.query('SELECT id FROM benutzer WHERE id = $1', [decoded.userId]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Token ist ungültig' });
        }

        res.json({ valid: true, userId: decoded.userId });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token ist abgelaufen' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Token ist ungültig' });
        }

        console.error('Validate Reset Token Error:', error);
        res.status(500).json({ message: 'Server Fehler bei der Token-Validierung' });
    }
};

// Passwort mit Reset-Token zurücksetzen
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token und neues Passwort sind erforderlich' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Neues Passwort muss mindestens 6 Zeichen lang sein' });
        }

        // Token entschlüsseln und validieren
        const decoded = jwt.verify(token, JWT_SECRET);

        // Prüfen ob Benutzer existiert
        const user = await pool.query('SELECT id FROM benutzer WHERE id = $1', [decoded.userId]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Token ist ungültig' });
        }

        // Neues Passwort hashen
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Passwort in Datenbank aktualisieren
        await pool.query('UPDATE benutzer SET passwort_hash = $1 WHERE id = $2', [hashedNewPassword, decoded.userId]);

        res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token ist abgelaufen' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Token ist ungültig' });
        }

        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server Fehler beim Zurücksetzen des Passworts' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    verifyToken,
    changePassword,
    requestPasswordReset,
    validateResetToken,
    resetPassword
};
