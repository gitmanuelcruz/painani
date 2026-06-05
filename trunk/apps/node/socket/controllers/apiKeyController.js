const apiKeyService = require('../services/apiKeyService');

const crearApiKey = async(req, res)=> {
    try {
         const { id, descripcion } = req.body;

        const apiKey = await apiKeyService.crearApiKey(id,descripcion)

        res.json({
            message:'API Key generada correctamente',
            data:apiKey
        });
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json({ error: error.message });
    }
}

module.exports = { crearApiKey };