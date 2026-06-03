const jwt = require('jsonwebtoken');

const generarJWT = (uuid)=>{
	return new Promise(  ( resolve, reject ) => {
		const payload = { uuid };
		jwt.sign( payload, process.env.JWT_KEY, {
			expiresIn: process.env.JWT_EXPIRATION
		}, ( err, token ) => {
			if ( err ) {
				console.log(err);
				reject('No se pudo generar el JWT');
			} else {
				resolve( token );
			}

		});
	});
}

const comprobarToken=(token = '')=>{
	try {
		const { uid } = jwt.verify( token, process.env.JWT_KEY );
		return [ true, uid ];
	} catch (error) {
		return [ false, null ];
	}
}

module.exports={
   generarJWT,
   comprobarToken
}