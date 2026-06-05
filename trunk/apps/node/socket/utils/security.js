const crypto = require('crypto');

// Generar API KEY
const generarApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash SHA256
const hashSHA256 = (texto) => {
  return crypto.createHash('sha256').update(texto).digest('hex');
};

module.exports = {
  generarApiKey,
  hashSHA256
};