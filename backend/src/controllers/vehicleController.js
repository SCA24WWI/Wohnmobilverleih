const pool = require('../config/database');

class VehicleController {
    // Wohnmobile suchen mit Filtern
    static async searchVehicles(req, res) {
        try {
            const { location, guests, dateFrom, dateTo, page = 1, limit = 6 } = req.query;

            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 6;
            const offset = (pageNumber - 1) * limitNumber;

            if (dateFrom && dateTo) {
                const fromDate = new Date(dateFrom);
                const toDate = new Date(dateTo);
                if (fromDate >= toDate) {
                    return res.status(400).json({
                        error: 'Das Startdatum muss vor dem Enddatum liegen.'
                    });
                }
            }

            const countQuery = `
                SELECT COUNT(DISTINCT w.id) as total
                FROM wohnmobile w
                LEFT JOIN buchungen b ON w.id = b.wohnmobil_id
                    AND b.end_datum > $3::DATE
                    AND b.start_datum < $4::DATE
                WHERE
                    (w.bettenzahl >= $1 OR $1 IS NULL)
                AND
                    (
                        LOWER(w.ort) LIKE LOWER($2) OR
                        $2 = '%%'
                    )
                AND
                    ( ($3 IS NULL OR $4 IS NULL) OR b.id IS NULL )
            `;

            const dataQuery = `
                SELECT DISTINCT w.*
                FROM wohnmobile w
                LEFT JOIN buchungen b ON w.id = b.wohnmobil_id
                    AND b.end_datum > $3::DATE
                    AND b.start_datum < $4::DATE
                WHERE
                    (w.bettenzahl >= $1 OR $1 IS NULL)
                AND
                    (
                        LOWER(w.ort) LIKE LOWER($2) OR
                        $2 = '%%'
                    )
                AND
                    ( ($3 IS NULL OR $4 IS NULL) OR b.id IS NULL )
                ORDER BY w.preis_pro_tag ASC
                LIMIT $5 OFFSET $6
            `;

            const queryParams = [
                parseInt(guests) || null,
                location ? `%${location.trim()}%` : '%%',
                dateFrom || null,
                dateTo || null
            ];

            const countResult = await pool.query(countQuery, queryParams);
            const totalVehicles = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(totalVehicles / limitNumber);

            const dataQueryParams = [...queryParams, limitNumber, offset];
            const dataResult = await pool.query(dataQuery, dataQueryParams);

            res.status(200).json({
                vehicles: dataResult.rows,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalVehicles,
                    vehiclesPerPage: limitNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPreviousPage: pageNumber > 1
                }
            });
        } catch (err) {
            console.error('Fehler bei der Wohnmobilsuche:', err.message);
            res.status(500).send('Serverfehler beim Abrufen der Wohnmobile');
        }
    }

    // Einzelnes Wohnmobil abrufen
    static async getVehicleById(req, res) {
        const id = req.params.id;
        try {
            const wohnmobil = await pool.query('SELECT * FROM wohnmobile WHERE id = $1', [id]);
            if (wohnmobil.rows.length == 0) {
                return res.status(404).send('Wohnmobil nicht gefunden');
            }
            res.status(200).json(wohnmobil.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Abrufen des Wohnmobils');
        }
    }

    // Neues Wohnmobil erstellen
    static async createVehicle(req, res) {
        const { benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am } =
            req.body;

        try {
            const neuesWohnmobil = await pool.query(
                'INSERT INTO wohnmobile (id, benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM wohnmobile), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [benutzer_id, name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, erstellt_am]
            );
            res.status(201).json(neuesWohnmobil.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Erstellen des Wohnmobils');
        }
    }

    // Wohnmobil aktualisieren
    static async updateVehicle(req, res) {
        const { id } = req.params;
        const { name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag } = req.body;

        try {
            const updateWohnmobil = await pool.query(
                'UPDATE wohnmobile SET name = $1, modell = $2, beschreibung = $3, bettenzahl = $4, fuehrerschein = $5, preis_pro_tag = $6 WHERE id = $7 RETURNING *',
                [name, modell, beschreibung, bettenzahl, fuehrerschein, preis_pro_tag, id]
            );

            if (updateWohnmobil.rows.length === 0) {
                return res.status(404).json({ message: 'Wohnmobil nicht gefunden' });
            }

            res.json(updateWohnmobil.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Aktualisieren des Wohnmobils');
        }
    }

    // Wohnmobil löschen
    static async deleteVehicle(req, res) {
        try {
            const { id } = req.params;
            const deleteWohnmobil = await pool.query('DELETE FROM wohnmobile WHERE id = $1 RETURNING *', [id]);

            if (deleteWohnmobil.rows.length === 0) {
                return res.status(404).json({ message: 'Wohnmobil nicht gefunden' });
            }

            res.json({ message: 'Wohnmobil erfolgreich gelöscht' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Löschen des Wohnmobils');
        }
    }
}

module.exports = VehicleController;
