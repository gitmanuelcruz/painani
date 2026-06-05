const express = require('express');
const router = express.Router();
const { crearApiKey } = require('../controllers/apiKeyController');
const validarApiKey = require('../middleware/apiKeyValidator');

// Ruta para generar una nueva llave
router.post('/api-keys',validarApiKey, crearApiKey);

module.exports = router;