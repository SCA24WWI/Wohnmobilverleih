const express = require('express');
const router = express.Router();

// Platzhalter-Routen für Buchungen
router.get('/', (req, res) => {
    res.json({ message: 'GET all bookings' });
});

router.get('/:id', (req, res) => {
    res.json({ message: `GET booking ${req.params.id}` });
});

router.post('/', (req, res) => {
    res.json({ message: 'CREATE new booking' });
});

router.put('/:id', (req, res) => {
    res.json({ message: `UPDATE booking ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `DELETE booking ${req.params.id}` });
});

module.exports = router;
