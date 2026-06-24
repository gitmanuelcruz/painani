const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'];
    const { usuario, password } = req.body;

    const data = await authService.login(usuario, password,userAgent);

    res.json({
      ok: true,
      data,
      expiration:process.env.JWT_EXPIRATION_MOBILE
    });

  } catch (error) {
    console.log(error.toString());

    res.status(401).json({
      ok: false,
      message: error.message
    });
  }
};

const validarTokenActivo = async(req,res)=>{
  return res.status(200).json({ok:true,message:'Token Activo'});
}

module.exports = { login,validarTokenActivo };