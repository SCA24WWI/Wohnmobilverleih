const pool = require('../config/database');

/**
 * Professioneller Booking Controller
 * Implementiert erweiterte Buchungslogik für Wohnmobil-Verleih
 */
class BookingController {
    /**
     * Verfügbarkeit prüfen mit erweiterten Regeln
     */
    static async checkAvailability(req, res) {
        try {
            const { vehicle_id, start_date, end_date, exclude_booking_id } = req.query;

            if (!vehicle_id || !start_date || !end_date) {
                return res.status(400).json({
                    error: 'vehicle_id, start_date und end_date sind erforderlich',
                    code: 'MISSING_PARAMETERS'
                });
            }

            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Validierungen
            if (startDate >= endDate) {
                return res.status(400).json({
                    error: 'Startdatum muss vor Enddatum liegen',
                    code: 'INVALID_DATE_RANGE'
                });
            }

            if (startDate < today) {
                return res.status(400).json({
                    error: 'Startdatum darf nicht in der Vergangenheit liegen',
                    code: 'DATE_IN_PAST'
                });
            }

            // Fahrzeug existiert?
            const vehicleExists = await pool.query('SELECT id, name FROM wohnmobile WHERE id = $1', [vehicle_id]);

            if (vehicleExists.rows.length === 0) {
                return res.status(404).json({
                    error: 'Fahrzeug nicht gefunden',
                    code: 'VEHICLE_NOT_FOUND'
                });
            }

            // Professionelle Verfügbarkeitsprüfung
            const conflicts = await BookingController.findConflicts(
                vehicle_id,
                start_date,
                end_date,
                exclude_booking_id
            );

            const availability = {
                available: conflicts.length === 0,
                vehicle_id: parseInt(vehicle_id),
                start_date,
                end_date,
                nights: BookingController.calculateNights(start_date, end_date),
                conflicts: conflicts,
                check_in_time: '15:00',
                check_out_time: '11:00'
            };

            // Wenn verfügbar, berechne Preise
            if (availability.available) {
                const pricing = await BookingController.calculatePricing(vehicle_id, start_date, end_date);
                availability.pricing = pricing;
            }

            res.json(availability);
        } catch (err) {
            console.error('Fehler bei der Verfügbarkeitsprüfung:', err);
            res.status(500).json({
                error: 'Server Fehler bei der Verfügbarkeitsprüfung',
                code: 'SERVER_ERROR'
            });
        }
    }

    /**
     * Konflikte finden (Buchungen + Sperrungen)
     */
    static async findConflicts(vehicleId, startDate, endDate, excludeBookingId = null) {
        const conflicts = [];

        // 1. Bestehende Buchungen prüfen (End-Tag wird jetzt als belegt behandelt)
        let bookingQuery = `
            SELECT b.*, 'booking' as conflict_type,
                   u.vorname, u.nachname, u.email
            FROM buchungen b
            LEFT JOIN benutzer u ON b.kunde_id = u.id
            WHERE b.wohnmobil_id = $1 
            AND b.status IN ('angefragt', 'bestätigt', 'in_bearbeitung')
            AND (
                (b.start_datum <= $2 AND b.end_datum >= $2) OR
                (b.start_datum <= $3 AND b.end_datum >= $3) OR
                (b.start_datum >= $2 AND b.end_datum <= $3)
            )
        `;

        const bookingParams = [vehicleId, startDate, endDate];

        if (excludeBookingId) {
            bookingQuery += ' AND b.id != $4';
            bookingParams.push(excludeBookingId);
        }

        const bookingConflicts = await pool.query(bookingQuery, bookingParams);
        conflicts.push(...bookingConflicts.rows);

        // Fahrzeug-Sperrungen wurden in der vereinfachten Version entfernt
        // können später wieder hinzugefügt werden wenn nötig

        return conflicts;
    }

    /**
     * Vereinfachte Preisberechnung
     */
    static async calculatePricing(vehicleId, startDate, endDate) {
        const nights = BookingController.calculateNights(startDate, endDate);

        // Grundpreis vom Fahrzeug
        const vehicleResult = await pool.query('SELECT preis_pro_tag FROM wohnmobile WHERE id = $1', [vehicleId]);

        const basePrice = parseFloat(vehicleResult.rows[0].preis_pro_tag);
        let totalPrice = basePrice * nights;

        // Vereinfachte Preisberechnung (ohne komplexe Regeln)
        return {
            base_price_per_night: basePrice,
            nights: nights,
            total_price: Math.round(totalPrice * 100) / 100
        };
    }

    /**
     * Neue Buchung erstellen
     */
    static async createBooking(req, res) {
        const client = await pool.connect(); // Für Transaktionen

        try {
            await client.query('BEGIN');

            const {
                vehicle_id,
                user_id,
                start_date,
                end_date,
                customer_info,
                extras = [],
                discount_code,
                notes
            } = req.body;

            // Validierungen
            if (!vehicle_id || !user_id || !start_date || !end_date) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: 'Alle Pflichtfelder müssen ausgefüllt werden',
                    code: 'MISSING_REQUIRED_FIELDS'
                });
            }

            // Verfügbarkeit final prüfen
            const conflicts = await BookingController.findConflicts(vehicle_id, start_date, end_date);
            if (conflicts.length > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    error: 'Fahrzeug ist nicht verfügbar',
                    code: 'VEHICLE_NOT_AVAILABLE',
                    conflicts: conflicts
                });
            }

            // Preisberechnung
            const pricing = await BookingController.calculatePricing(vehicle_id, start_date, end_date);
            const nights = BookingController.calculateNights(start_date, end_date);

            // Buchung erstellen (vereinfachte Struktur)
            const bookingResult = await client.query(
                `
                INSERT INTO buchungen (
                    wohnmobil_id, kunde_id, start_datum, end_datum, 
                    anzahl_naechte, gesamtpreis, extras, notizen, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'angefragt')
                RETURNING *
            `,
                [vehicle_id, user_id, start_date, end_date, nights, pricing.total_price, JSON.stringify(extras), notes]
            );

            const booking = bookingResult.rows[0];

            // Fahrzeug- und Kundendaten für Response
            const detailsResult = await client.query(
                `
                SELECT 
                    b.*,
                    w.name as vehicle_name, w.modell, w.preis_pro_tag,
                    u.vorname, u.nachname, u.email
                FROM buchungen b
                LEFT JOIN wohnmobile w ON b.wohnmobil_id = w.id
                LEFT JOIN benutzer u ON b.kunde_id = u.id
                WHERE b.id = $1
            `,
                [booking.id]
            );

            await client.query('COMMIT');

            const response = {
                ...detailsResult.rows[0],
                pricing: pricing,
                customer_info: customer_info || null,
                success: true,
                message: 'Buchung erfolgreich erstellt'
            };

            res.status(201).json(response);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Fehler beim Erstellen der Buchung:', err);
            res.status(500).json({
                error: 'Server Fehler beim Erstellen der Buchung',
                code: 'SERVER_ERROR'
            });
        } finally {
            client.release();
        }
    }

    /**
     * Buchung aktualisieren
     */
    static async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const { status, notes, stornierung_grund } = req.body;

            const allowedStatusChanges = {
                angefragt: ['bestätigt', 'abgelehnt', 'storniert'],
                bestätigt: ['in_bearbeitung', 'storniert', 'abgeschlossen'],
                in_bearbeitung: ['abgeschlossen', 'storniert'],
                abgelehnt: [], // Final
                storniert: [], // Final
                abgeschlossen: [] // Final
            };

            // Aktuelle Buchung laden
            const currentBooking = await pool.query('SELECT * FROM buchungen WHERE id = $1', [id]);

            if (currentBooking.rows.length === 0) {
                return res.status(404).json({
                    error: 'Buchung nicht gefunden',
                    code: 'BOOKING_NOT_FOUND'
                });
            }

            const current = currentBooking.rows[0];

            if (status && !allowedStatusChanges[current.status].includes(status)) {
                return res.status(400).json({
                    error: `Status-Änderung von '${current.status}' zu '${status}' nicht erlaubt`,
                    code: 'INVALID_STATUS_CHANGE',
                    allowed_changes: allowedStatusChanges[current.status]
                });
            }

            // Update durchführen
            let updateQuery = 'UPDATE buchungen SET ';
            let updateParams = [];
            let paramIndex = 1;

            if (status) {
                updateQuery += `status = $${paramIndex}, `;
                updateParams.push(status);
                paramIndex++;

                if (status === 'storniert') {
                    updateQuery += `storniert_am = NOW(), `;
                    if (stornierung_grund) {
                        updateQuery += `stornierung_grund = $${paramIndex}, `;
                        updateParams.push(stornierung_grund);
                        paramIndex++;
                    }
                }
            }

            if (notes) {
                updateQuery += `notizen = $${paramIndex}, `;
                updateParams.push(notes);
                paramIndex++;
            }

            updateQuery = updateQuery.slice(0, -2) + ` WHERE id = $${paramIndex} RETURNING *`;
            updateParams.push(id);

            const result = await pool.query(updateQuery, updateParams);

            res.json({
                ...result.rows[0],
                success: true,
                message: 'Buchung erfolgreich aktualisiert'
            });
        } catch (err) {
            console.error('Fehler beim Aktualisieren der Buchung:', err);
            res.status(500).json({
                error: 'Server Fehler beim Aktualisieren der Buchung',
                code: 'SERVER_ERROR'
            });
        }
    }

    /**
     * Hilfsfunktionen
     */
    static calculateNights(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    static dateInRange(date, startRange, endRange) {
        if (!startRange || !endRange) return false;
        const checkDate = new Date(date);
        const start = new Date(startRange);
        const end = new Date(endRange);
        return checkDate >= start && checkDate <= end;
    }

    /**
     * Buchungshistorie abrufen
     */
    static async getBookingHistory(req, res) {
        try {
            const { id } = req.params;

            const history = await pool.query(
                `
                SELECT bh.*, u.vorname, u.nachname
                FROM buchungs_historie bh
                LEFT JOIN benutzer u ON bh.benutzer_id = u.id
                WHERE bh.buchung_id = $1
                ORDER BY bh.geaendert_am DESC
            `,
                [id]
            );

            res.json(history.rows);
        } catch (err) {
            console.error('Fehler beim Laden der Buchungshistorie:', err);
            res.status(500).json({
                error: 'Server Fehler beim Laden der Buchungshistorie',
                code: 'SERVER_ERROR'
            });
        }
    }
}

module.exports = BookingController;
