const pool = require('../config/database');

class UserController {
    // Alle Benutzer abrufen
    static async getAllUsers(req, res) {
        try {
            const alleBenutzer = await pool.query('SELECT id, email, vorname, nachname, rolle FROM benutzer');
            res.json(alleBenutzer.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Abrufen der Benutzer');
        }
    }

    // Einzelnen Benutzer abrufen
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const benutzer = await pool.query(
                'SELECT id, email, vorname, nachname, rolle FROM benutzer WHERE id = $1',
                [id]
            );

            if (benutzer.rows.length === 0) {
                return res.status(404).json({ message: 'Benutzer nicht gefunden' });
            }

            res.json(benutzer.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Abrufen des Benutzers');
        }
    }

    // Buchungen eines Benutzers abrufen
    static async getUserBookings(req, res) {
        try {
            const { id } = req.params;

            console.log(`Fetching bookings for user ID: ${id}`);

            // Erst prüfen, ob der User existiert
            const userCheck = await pool.query('SELECT id, vorname, nachname FROM benutzer WHERE id = $1', [id]);

            if (userCheck.rows.length === 0) {
                console.log(`User with ID ${id} not found`);
                return res.status(404).json({ error: 'Benutzer nicht gefunden' });
            }

            console.log(`User found: ${userCheck.rows[0].vorname} ${userCheck.rows[0].nachname}`);

            // Dann alle Buchungen abrufen (erst ohne JOIN zum Testen)
            const allBookings = await pool.query('SELECT * FROM buchungen');
            console.log(`Total bookings in database: ${allBookings.rows.length}`);

            // Join mit wohnmobile Tabelle um Fahrzeugdetails zu erhalten
            const buchungen = await pool.query(
                `SELECT b.*, w.name as vehicle_name, w.modell, w.preis_pro_tag, w.hauptbild FROM buchungen b LEFT JOIN wohnmobile w ON b.wohnmobil_id = w.id WHERE b.kunde_id = $1 ORDER BY b.gebucht_am DESC`,
                [id]
            );

            console.log(`Found ${buchungen.rows.length} bookings for user ${id}`);

            // Auch die Rohdaten loggen
            if (buchungen.rows.length > 0) {
                console.log('First booking data:', JSON.stringify(buchungen.rows[0], null, 2));
            }

            res.json(buchungen.rows);
        } catch (err) {
            console.error('Error fetching user bookings:', err.message);
            res.status(500).json({
                error: 'Server Fehler beim Abrufen der Buchungen',
                details: err.message
            });
        }
    }

    // Benutzer aktualisieren
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { email, vorname, nachname } = req.body;
            const updateBenutzer = await pool.query(
                'UPDATE benutzer SET email = $1, vorname = $2, nachname = $3 WHERE id = $4 RETURNING id, email, vorname, nachname, rolle',
                [email, vorname, nachname, id]
            );

            if (updateBenutzer.rows.length === 0) {
                return res.status(404).json({ message: 'Benutzer nicht gefunden' });
            }

            res.json(updateBenutzer.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Fehler beim Aktualisieren des Benutzers');
        }
    }

    // Benutzer löschen
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const deletedUser = await pool.query('DELETE FROM benutzer WHERE id = $1 RETURNING *', [id]);

            if (deletedUser.rows.length === 0) {
                return res.status(404).json({ message: 'Benutzer nicht gefunden' });
            }

            res.json({ message: 'Benutzer erfolgreich gelöscht' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server Fehler beim Löschen des Benutzers' });
        }
    }
}

module.exports = UserController;
