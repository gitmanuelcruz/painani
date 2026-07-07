const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const getMiPaqueteNotificacion = async (idUsuario, idPaquete) => {
  const sql =`SELECT pqn.id_paquete_notificacion,
				n.id_notificacion,
				n.num_oficio,
				n.num_orden,
				n.domicilio,
				n.referencia_ubicacion,
				n.id_estatus_notificacion AS estatus_oficio,
				pqn.id_paquete,
				pqn.fecha_hora_notificacion,
				pqn.notificado,
				pqn.comentarios,
				pqn.id_estatus_notificacion,
				en.nombre_estatus_notificacion AS nombre_estatus,
				to_char(n.fecha_oficio,'YYYY-mm-dd') AS fecha_oficio,
				(CASE WHEN pqn.id_estatus_notificacion = 'POR_NOTIFICAR' THEN  1
					WHEN pqn.id_estatus_notificacion = 'NO_LOCALIZADO' THEN 2
					WHEN pqn.id_estatus_notificacion = 'NOTIFICADO' THEN 3 
					ELSE 4
				END )::integer AS ordenamiento,
				sop.soportes,
				(CASE WHEN p.fecha_hora_apertura_operacion IS NOT NULL 
					AND p.fecha_hora_cierre_operacion IS NOT NULL 
					THEN TRUE ELSE FALSE
				END) AS bloqueado
            FROM paquetes_notificaciones pqn
            INNER JOIN paquetes p ON pqn.id_paquete = p.id_paquete 
            INNER JOIN notificaciones n ON pqn.id_notificacion = n.id_notificacion 
            INNER JOIN estatus_notificacion en ON pqn.id_estatus_notificacion = en.id_estatus_notificacion
            LEFT JOIN (
            	SELECT
						id_notificacion,
						count(*) AS soportes
            	FROM soportes_notificacion sn 
            	WHERE creado_por = $1
            	GROUP BY id_notificacion
            ) sop ON n.id_notificacion = sop.id_notificacion
				WHERE p.fecha_programada = current_date
				AND p.id_usuario_notificador =$1
				AND p.id_paquete = $2
				ORDER BY ordenamiento,fecha_hora_notificacion,num_oficio`;

  	let oficios = [];

  	await pool.query(sql, [idUsuario, idPaquete]).then((result) => {
    	result.rows.map((row) => {
      	let reg = {
				key: Number(row.id_paquete_notificacion),
				idNotificacion: row.id_notificacion,
				idPaqueteNotificacion: Number(row.id_paquete_notificacion),
				idEstatusNotificacionPaquete: row.id_estatus_notificacion,
				nombreEstatusNotificacion: row.nombre_estatus,
				numOficio: row.num_orden, //temporal se pinta numOrden para los que no puedan actualizar su app
				numOrden:row.num_orden,
				domicilio: row.domicilio,
				referenciaUbicacion: row.referencia_ubicacion,
				idEstatusOficio: row.estatus_oficio,
				idPaquete: row.idPaquete,
				fechaOficio: row.fecha_oficio,
				fechaHoraNotificado: row.fechaHoraNotificado,
				notificado: row.notificado,
				comentarios: row.comentarios,
				ordenamiento: Number(row.ordenamiento),
				soportes: Number(row.soportes),
				bloqueado: row.bloqueado
			}

      	oficios.push(reg);
    	});
  	});

  	return oficios;
};

const guardarSoporte = async (
	idNotificacion,
	idPaqueteNotificacion,
	nombreOriginal,
	rutaSoporte,
	extension,
	comentarios,
	usuario,
) => {
  	const sql = `INSERT INTO soportes_notificacion
							(id_soporte_notificacion,id_notificacion,id_paquete_notificacion,
    						nombre_original,ruta_soporte,extension_archivo,comentarios,creado_por)
    					VALUES(nextval('seq_soporte_notificacion'),$1,$2,$3,$4,$5,$6,$7) returning *`;

  const result = await pool.query(sql, [
		idNotificacion,
		idPaqueteNotificacion,
		nombreOriginal,
		rutaSoporte,
		extension,
		comentarios,
		usuario,
  	]);

  	return result;
};

const iniciarRutaNotificacion = async (idPaquete, usuario) => {
  	const sql = `UPDATE paquetes SET fecha_hora_apertura_operacion = now(),
                  	modificado_por = $1
               WHERE id_paquete = $2`;
  	await pool.query(sql, [usuario, idPaquete]);
};

const cerrarRutaNotificacion = async (usuario, idPaquete) => {
  	const sql = `UPDATE paquetes SET fecha_hora_cierre_operacion = now(),
                  	modificado_por = $1
               WHERE id_paquete =$2`;

  	await pool.query(sql, [usuario, idPaquete]);
};

const cancelarOrdenesPorNotificar = async(usuario, idPaquete)=>{
 	const sql = `UPDATE paquetes_notificaciones SET fecha_ultimo_cambio = now(),
                  	modificado_por = $1,
                    	id_estatus_notificacion = 'NO_ENTREGADO'
                WHERE id_paquete =$2
                AND id_estatus_notificacion = 'POR_NOTIFICAR' `;

  	await pool.query(sql, [usuario, idPaquete]);
}

const liberarOficiosParaReasignar = async(usuario, idPaquete)=>{
 	const sql =`UPDATE notificaciones n SET
					id_estatus_notificacion = 'POR_ASIGNAR',
					fecha_hora_notificado = NULL,
					notificado_por = NULL,
					fecha_ultimo_cambio = NOW(),
					modificado_por = $1
				FROM paquetes_notificaciones pn
				WHERE pn.id_notificacion = n.id_notificacion
				AND pn.id_paquete = $2
				AND pn.id_estatus_notificacion IN ('NO_LOCALIZADO','NO_ENTREGADO')`;

  	await pool.query(sql, [usuario, idPaquete]);
}

const setMarcarOficioNotificado = async (usuario, idNotificacion,idStatus,horaNotificacion) => {
  	const horaFinal = (horaNotificacion && horaNotificacion.trim() !== "") ? horaNotificacion : null;
  	const sql = `UPDATE notificaciones SET
						id_estatus_notificacion = $2,
  						fecha_hora_notificado =  (CASE WHEN $3::time IS NULL THEN now() ELSE (current_date + $3::time) END),
						notificado_por = $1,
						fecha_ultimo_cambio = now(),
						modificado_por = $1
					WHERE id_notificacion = $4`;

  	await pool.query(sql, [usuario,idStatus,horaNotificacion,idNotificacion]);
};

const setMarcarOficioPaquete = async (
  	usuario,
  	idPaqueteNotificacion,
  	idStatus,
  	notificado,
  	comentarios,
  	latitud,
  	longitud,
  	horaNotificacion
) => {
	console.log("idStatus", idStatus);
  	const horaFinal = (horaNotificacion && horaNotificacion.trim() !== "") ? horaNotificacion : null;

  	const sql = `UPDATE paquetes_notificaciones SET
						comentarios = $1,
						fecha_hora_notificacion = (CASE  WHEN $7::time IS NULL THEN now() ELSE (current_date + $7::time) END),
						notificado = $2,
						id_estatus_notificacion = $3,
						modificado_por = $4,
						latitud=$5,
						longitud=$6,
						fecha_ultimo_cambio = now()
               WHERE id_paquete_notificacion = $8`;

  	await pool.query(sql, [
    	comentarios,
    	notificado,
    	idStatus,
    	usuario,
    	latitud,
    	longitud,
    	horaNotificacion,
    	idPaqueteNotificacion,
  	]);
};

const getPaquetesHoy = async (usuario) => {
  	const sql =`SELECT
						p.id_paquete,
						to_char(p.fecha_programada,'YYYY-MM-DD') AS fecha,
						to_char(fecha_hora_apertura_operacion,'YYYY-mm-dd hh12:mi:ss am') AS fecha_apertura,
						to_char(fecha_hora_cierre_operacion,'YYYY-mm-dd hh12:mi:ss am') AS fecha_cierre,
						u.nombre_completo
               FROM paquetes p 
					INNER JOIN usuarios u ON p.id_usuario_notificador = u.id_usuario
					WHERE p.fecha_programada = current_date
					AND p.id_usuario_notificador = $1
					ORDER BY id_paquete`;

  	let paquetes = [];

  	await pool.query(sql, [usuario]).then((result) => {
    	result.rows.map((row) => {
      	let reg = {
        		key: Number(row.id_paquete),
        		idPaquete: Number(row.id_paquete),
        		fechaProgramada: row.fecha,
        		fechaApertura: row.fecha_apertura,
        		fechaCierre: row.fecha_cierre,
        		asignadoA: row.nombre_completo,
      	}
      	paquetes.push(reg);
    	});
  	});

  	return paquetes;
};

const getEvidenciasNotificacion = async (idPaqueteNotificacion, usuario) => {
  	const sql = `SELECT sn.id_soporte_notificacion,
                	sn.ruta_soporte,
                	sn.extension_archivo,
                	to_char(sn.fecha_registro,'YYYY-mm-dd hh24:mi:ss') AS fecha_registro 
              	FROM soportes_notificacion sn 
              	WHERE sn.id_paquete_notificacion = $1
              	AND creado_por = $2
              	ORDER BY sn.fecha_registro`;

  	let evidencias = [];

  	try {
    	const resultadoBD = await pool.query(sql, [idPaqueteNotificacion, usuario]);
    	const filas = resultadoBD.rows || [];
    	const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER;

    	evidencias = filas
      .map((fila) => {
        	const rutaInterna = fila.ruta_soporte.replace(
          	"../painani_archivos",
          	"",
        	);
        	const rutaAbsoluta = path.join(UPLOAD_FOLDER, rutaInterna);

        	if (fs.existsSync(rutaAbsoluta)) {
          	const bitmap = fs.readFileSync(rutaAbsoluta);
          	const base64String = Buffer.from(bitmap).toString("base64");
          	const ext = fila.extension_archivo.toLowerCase();
          	const mimeType = ext === "jpeg" || ext === "jpg" ? "image/jpeg" : `image/${ext}`;
          	const fotoBase64 = `data:${mimeType};base64,${base64String}`;

          	return {
            	idSoporteNotificacion: fila.id_soporte_notificacion,
            	foto: fotoBase64,
            	extensionArchivo: fila.extension_archivo,
            	fecha: fila.fecha_registro,
          	}
        	}
			else {
          	console.log(`Archivo no encontrado físicamente en: ${rutaAbsoluta}`);
          	return null;
        	}
      })
      .filter((item) => item !== null);
  	} 
	catch (error) {
    	console.error(
			"Error al obtener evidencias en getEvidenciasNotificacion:",
			error,
		);

   	throw error;
  	}

  return evidencias;
};

module.exports = {
	getMiPaqueteNotificacion,
	guardarSoporte,
	iniciarRutaNotificacion,
	cerrarRutaNotificacion,
	setMarcarOficioNotificado,
	setMarcarOficioPaquete,
	getPaquetesHoy,
	getEvidenciasNotificacion,
	cancelarOrdenesPorNotificar,
	liberarOficiosParaReasignar,
};
