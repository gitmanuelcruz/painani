const {Router} = require('express');
const validarApiKey = require('../middleware/apiKeyValidator');
const validarToken = require('../middleware/authMiddleware');
const { getNumOrdenes } = require('../controllers/numOrdenes');
const router = Router();

//router.post('/datos_num_ordenes',validarApiKey,validarToken,getNumOrdenes);
router.post('/datos_num_ordenes',getNumOrdenes);

module.exports = router;