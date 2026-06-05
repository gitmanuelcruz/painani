const crypto = require("crypto");
const db = require("../config/db");
const { hashSHA256 } = require("../utils/security");

const validarApiKey = async (req, res,next) => {
  const appId = req.headers["x-app-id"];
  const apiKeyHeader = req.headers["x-api-key"];
 
  if (!appId || !apiKeyHeader) {
    return res
      .status(401)
      .json({ error: "Faltan credenciales en los headers.", ok:false });
  }

  try {
    const apiKeyHash = hashSHA256(apiKeyHeader);

    const query =`SELECT * FROM api_keys 
            WHERE id = $1 
            AND api_key_hash = $2 
            AND activo = true`;
    const result = await db.query(query, [appId, apiKeyHash]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'API KEY inválido', ok:false });
    }

    req.id = result.rows[0].id;
    req.apiKey = result.rows[0].descripcion;

    next();

  } catch (error) {
    console.error("Error de validación:", error);
    return res.status(500).json({ error: "Error interno.", ok:false });
  }
};

module.exports = validarApiKey;
