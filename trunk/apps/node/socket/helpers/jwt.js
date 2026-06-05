const jwt = require('jsonwebtoken');
const { hashSHA256 } = require('../utils/security');

const verificarJWT = (token, userAgent) => {
    const decodificado = jwt.verify(token, process.env.JWT_KEY, {
        audience: 'app-movil-painani'
    });

    const hashActual = hashSHA256(userAgent);
    if (decodificado.fingerprint !== hashActual) {
        throw new Error('FingerprintMismatch');
    }

    return decodificado;
};

module.exports = { verificarJWT };