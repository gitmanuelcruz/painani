const pool = require('../config/db');
const { generarApiKey, hashSHA256 } = require('../utils/security');

const crearApiKey = async (id, descripcion) => {

  const apiKey = generarApiKey();
  const apiKeyHash = hashSHA256(apiKey);

  await pool.query(
    `INSERT INTO api_keys(id, api_key,api_key_hash, descripcion)
     VALUES ($1, $2, $3,$4)`,
    [id, apiKey,apiKeyHash,descripcion]
  );

  return ({id,apiKey,apiKeyHash,descripcion});
};

module.exports = { crearApiKey };