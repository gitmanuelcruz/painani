const {Router} = require('express');
const validarApiKey = require('../middleware/apiKeyValidator');
const validarToken = require('../middleware/authMiddleware');
const { listadoOficiosNotificar, 
    uploadSoporteNotificacion, 
    getPaquetesNotificacion, 
    iniciarRuta, 
    finalizarRutaNotificacion,
    marcarOficioPaquete, 
    marcarOficioNotificado 
} = require('../controllers/notificacionController');
const router = Router();

router.post('/paquetes',validarApiKey,validarToken,getPaquetesNotificacion);
router.post('/paquete-oficios',validarApiKey,validarToken,listadoOficiosNotificar);
router.post('/iniciar-ruta',validarApiKey,validarToken,iniciarRuta);
router.post('/finalizar-ruta',validarApiKey,validarToken,finalizarRutaNotificacion);
router.post('/marcar-oficio-paquete',validarApiKey,validarToken,marcarOficioPaquete);
router.post('/marcar-oficio-notificado',validarApiKey,validarToken,marcarOficioPaquete);
router.post('/upload-soporte',validarApiKey,validarToken,uploadSoporteNotificacion);

module.exports = router;