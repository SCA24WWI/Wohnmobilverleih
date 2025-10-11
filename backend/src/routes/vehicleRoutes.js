const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');

// ENDPUNKT: Wohnmobile suchen mit Filtern
router.get('/search', VehicleController.searchVehicles);

// ENDPUNKT: GET /api/wohnmobile/:id - Holt die Detailinformationen für ein einzelnes Wohnmobil.
// INFO: Öffentlich zugänglich.
router.get('/:id', VehicleController.getVehicleById);

// ENDPUNKT: POST /api/wohnmobile - Erstellt ein neues Wohnmobil.
// ZUGRIFF: Alle angemeldeten Benutzer
router.post('/create', VehicleController.createVehicle);

// ENDPUNKT: PUT /api/wohnmobile/:id/edit - Aktualisiert ein bestehendes Wohnmobil.
// ZUGRIFF: Nur für den Besitzer des Wohnmobils
router.put('/:id/edit', VehicleController.updateVehicle);

// ENDPUNKT: DELETE /api/wohnmobile/:id - Löscht ein Wohnmobil.
// ZUGRIFF: Nur für den Besitzer des Wohnmobils
router.delete('/:id/delete', VehicleController.deleteVehicle);

module.exports = router;
