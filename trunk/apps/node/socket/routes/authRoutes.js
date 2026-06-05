const {Router} = require('express');
const { login } = require('../controllers/authController');
const validarApiKey = require('../middleware/apiKeyValidator');

const router = Router();

router.post('/login',validarApiKey,login);

module.exports = router;