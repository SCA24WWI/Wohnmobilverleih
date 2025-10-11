const EmailService = require('../utils/emailService');
const pool = require('../config/database');

/**
 * E-Mail Controller
 * Verwaltet alle E-Mail-bezogenen Funktionen
 */
class EmailController {
    /**
     * Test-E-Mail versenden
     */
    static async sendTestEmail(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: 'E-Mail-Adresse ist erforderlich',
                    code: 'EMAIL_REQUIRED'
                });
            }

            const emailService = new EmailService();
            const result = await emailService.sendTestEmail(email);

            res.json({
                success: true,
                message: 'Test-E-Mail wurde versendet',
                messageId: result.messageId
            });
        } catch (error) {
            console.error('Fehler beim Versenden der Test-E-Mail:', error);
            res.status(500).json({
                error: 'Fehler beim Versenden der Test-E-Mail',
                details: error.message
            });
        }
    }

    /**
     * Buchungsbestätigung für eine bestehende Buchung erneut versenden
     */
    static async resendBookingConfirmation(req, res) {
        try {
            const { bookingId } = req.params;

            // Buchungsdaten aus der Datenbank laden
            const bookingResult = await pool.query(
                `
                SELECT 
                    b.*,
                    w.name as vehicle_name, w.modell, w.preis_pro_tag, w.hauptbild,
                    u.vorname, u.nachname, u.email
                FROM buchungen b
                LEFT JOIN wohnmobile w ON b.wohnmobil_id = w.id
                LEFT JOIN benutzer u ON b.kunde_id = u.id
                WHERE b.id = $1
            `,
                [bookingId]
            );

            if (bookingResult.rows.length === 0) {
                return res.status(404).json({
                    error: 'Buchung nicht gefunden',
                    code: 'BOOKING_NOT_FOUND'
                });
            }

            const bookingData = bookingResult.rows[0];
            const emailService = new EmailService();
            const result = await emailService.sendBookingConfirmation(bookingData);

            res.json({
                success: true,
                message: 'Buchungsbestätigung wurde erneut versendet',
                messageId: result.messageId,
                sentTo: bookingData.email
            });
        } catch (error) {
            console.error('Fehler beim erneuten Versenden der Buchungsbestätigung:', error);
            res.status(500).json({
                error: 'Fehler beim erneuten Versenden der Buchungsbestätigung',
                details: error.message
            });
        }
    }

    /**
     * E-Mail-Konfiguration testen
     */
    static async testConfiguration(req, res) {
        try {
            // Prüfen ob E-Mail-Variablen gesetzt sind
            const config = {
                emailUser: !!process.env.EMAIL_USER,
                emailPassword: !!process.env.EMAIL_PASSWORD,
                emailFrom: !!process.env.EMAIL_FROM,
                nodeEnv: process.env.NODE_ENV
            };

            res.json({
                success: true,
                message: 'E-Mail-Konfiguration überprüft',
                config: config,
                ready: config.emailUser && config.emailPassword
            });
        } catch (error) {
            res.status(500).json({
                error: 'Fehler bei der Konfigurationsprüfung',
                details: error.message
            });
        }
    }

    /**
     * E-Mail-Vorschau für Buchungsbestätigung generieren
     */
    static async previewBookingConfirmation(req, res) {
        try {
            const { bookingId } = req.params;

            // Buchungsdaten aus der Datenbank laden
            const bookingResult = await pool.query(
                `
                SELECT 
                    b.*,
                    w.name as vehicle_name, w.modell, w.preis_pro_tag, w.hauptbild,
                    u.vorname, u.nachname, u.email
                FROM buchungen b
                LEFT JOIN wohnmobile w ON b.wohnmobil_id = w.id
                LEFT JOIN benutzer u ON b.kunde_id = u.id
                WHERE b.id = $1
            `,
                [bookingId]
            );

            if (bookingResult.rows.length === 0) {
                return res.status(404).json({
                    error: 'Buchung nicht gefunden',
                    code: 'BOOKING_NOT_FOUND'
                });
            }

            const bookingData = bookingResult.rows[0];
            const emailService = new EmailService();

            // HTML-Vorschau generieren ohne E-Mail zu versenden
            const htmlPreview = emailService.generateBookingConfirmationHTML({
                vorname: bookingData.vorname,
                nachname: bookingData.nachname,
                buchungId: bookingData.id,
                vehicle_name: bookingData.vehicle_name,
                modell: bookingData.modell,
                startDate: new Date(bookingData.start_datum).toLocaleDateString('de-DE'),
                endDate: new Date(bookingData.end_datum).toLocaleDateString('de-DE'),
                anzahl_naechte: bookingData.anzahl_naechte,
                gesamtpreis: bookingData.gesamtpreis,
                extrasText: emailService.formatExtrasForEmail(bookingData.extras)
            });

            res.setHeader('Content-Type', 'text/html');
            res.send(htmlPreview);
        } catch (error) {
            console.error('Fehler beim Generieren der E-Mail-Vorschau:', error);
            res.status(500).json({
                error: 'Fehler beim Generieren der E-Mail-Vorschau',
                details: error.message
            });
        }
    }
}

module.exports = EmailController;
