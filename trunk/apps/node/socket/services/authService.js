const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const { hashSHA256 } = require("../utils/security");

const login = async (username, password, userAgent) => {
  if (!username || !password) {
    throw new Error("Faltan credenciales");
  }

  //Buscar usuario
  const result = await pool.query(
    `SELECT * FROM usuarios
            WHERE id_usuario =$1 `,
    [username],
  );

  if (result.rows.length === 0) {
    throw new Error("Usuario no existe");
  }

  const user = result.rows[0];

  const usuario = {
    idUsuario: user.id_usuario,
    nombreCompleto: user.nombre_completo,
    esNotificador: user.es_notificador == 1 ? true : false,
  };

  // Validar password MD5
  if (user.contrasenia !== password) {
    throw new Error("Password incorrecto");
  }

  //Generar JWT
  const token = jwt.sign(
    {
      id: user.id_usuario,
      nombreCompleto: user.nombre_completo,
      jti: crypto.randomUUID(),
      fingerprint: hashSHA256(userAgent),
    },
    process.env.JWT_KEY,
    {
      //algorithm: 'RS256', esto se usa con clave privada .pem
      expiresIn: process.env.JWT_EXPIRATION_MOBILE,
      audience: "app-movil-painani",
    },
  );

  return { token, usuario };
};

module.exports = { login };
