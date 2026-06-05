import { verificarJWT } from "../helpers/jwt";

const validarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticación requerido' });
    }

    try {
        const userAgent = req.headers['user-agent'];

        const usuarioDecodificado = verificarJWT(token,userAgent); 
        req.usuario = usuarioDecodificado;
        next();
        
    } catch (error) {
        if (error.message === 'FingerprintMismatch') {
            return res.status(403).json({ error: 'Dispositivo no autorizado o sesión inválida' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token ha expirado' });
        }
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = { validarToken };