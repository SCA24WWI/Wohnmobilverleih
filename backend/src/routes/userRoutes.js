const express = require('express');
const router = express.Router();

// Platzhalter-Routen für Benutzer
router.get('/', (req, res) => {
    res.json({ message: 'GET all users' });
});

router.get('/:id', (req, res) => {
    res.json({ message: `GET user ${req.params.id}` });
});

router.post('/', (req, res) => {
    res.json({ message: 'CREATE new user' });
});

router.put('/:id', (req, res) => {
    res.json({ message: `UPDATE user ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `DELETE user ${req.params.id}` });
});

module.exports = router;
