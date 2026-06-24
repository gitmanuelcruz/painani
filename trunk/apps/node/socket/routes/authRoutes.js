const {Router} = require('express');
const { login, validarTokenActivo } = require('../controllers/authController');
const validarApiKey = require('../middleware/apiKeyValidator');
const validarToken = require('../middleware/authMiddleware');

const router = Router();

router.post('/login',validarApiKey,login);
router.post('/token-activo',validarApiKey,validarToken,validarTokenActivo);

module.exports = router;