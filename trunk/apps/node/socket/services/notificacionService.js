const pool = require("../config/db");

const getMiPaqueteNotificacion = async (idUsuario, idPaquete) => {
  const sql = `SELECT pqn.id_paquete_notificacion,
            n.id_notificacion,
            n.num_oficio,
            n.domicilio,
            n.referencia_ubicacion,
            n.id_estatus_notificacion estatus_oficio,
            pqn.id_paquete,
            pqn.fecha_hora_notificacion,
            pqn.notificado,
            pqn.comentarios,
            pqn.id_estatus_notificacion,
            (CASE WHEN pqn.id_estatus_notificacion = 'POR_NOTIFICAR' THEN  1
                WHEN pqn.id_estatus_notificacion = 'NO_LOCALIZADO' THEN 2
                WHEN pqn.id_estatus_notificacion = 'NOTIFICADO' THEN 3 
                ELSE 4 END )::integer ordenamiento
            FROM paquetes_notificaciones pqn
            INNER JOIN paquetes p ON pqn.id_paquete = p.id_paquete 
            INNER JOIN notificaciones n ON pqn.id_notificacion = n.id_notificacion 
        WHERE p.id_usuario_notificador =$1
        AND p.fecha_programada = current_date
        AND p.id_paquete = $2
        ORDER BY ordenamiento,fecha_hora_notificacion,num_oficio`;

  let oficios = [];

  await pool.query(sql, [idUsuario, idPaquete]).then((result) => {
    result.rows.map((row) => {
      let reg = {
        key: Number(row.id_paquete_notificacion),
        idNotificacion: row.id_notificacion,
        idPaqueteNotificacion: Number(row.id_paquete_notificacion),
        numOficio: row.num_oficio,
        domicilio: row.domicilio,
        referenciaUbicacion: row.referencia_ubicacion,
        idEstatusOficio: row.estatus_oficio,
        idPaquete: row.idPaquete,
        fechaHoraNotificado: row.fechaHoraNotificado,
        notificado: row.notificado,
        comentarios: row.comentarios,
        idEstatusNotificacionPaquete: row.id_estatus_notificacion,
        ordenamiento: Number(row.ordenamiento),
      };

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
  const sql = `INSERT INTO soportes_notificacion(id_soporte_notificacion,id_notificacion,id_paquete_notificacion,
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

const setMarcarOficioNotificado = async (usuario, idNotificacion) => {
  const sql = `UPDATE notificaciones SET fecha_hora_notificado = now(),
                    modificado_por = $1,
                    notificado_por = $1'
                WHERE id_notificacion = $2`;

  await pool.query(sql, [
    usuario,
    idPaquete,
    notificado,
    idEstatusNotificacion,
  ]);
};

const setMarcarOficioPaquete = async (
  usuario,
  idPaqueteNotificacion,
  idEstatus,
  notificado,
  comentarios,
) => {
  const sql = `UPDATE paquetes_notificaciones SET comentarios = $1,
                    fecha_hora_notificacion = now(),
                    notificado = $2,
                    id_estatus_notificacion = $3,
                    modificado_por = $4
                WHERE id_paquete_notificacion = $5`;

  await pool.query(sql, [
    comentarios,
    notificado,
    idEstatus,
    usuario,
    idPaqueteNotificacion,
  ]);
};

const getPaquetesHoy = async (usuario) => {
  const sql = `SELECT p.id_paquete,
                    to_char(p.fecha_programada,'YYYY-MM-DD') fecha,
                    fecha_hora_apertura_operacion,
                    fecha_hora_cierre_operacion,
                    u.nombre_completo
                FROM paquetes p 
                    INNER JOIN usuarios u ON p.id_usuario_notificador = u.id_usuario
                WHERE p.id_usuario_notificador =$1
                AND p.fecha_programada = current_date`;

  let paquetes = [];

  await pool.query(sql, [usuario]).then((result) => {
    result.rows.map((row) => {
      let reg = {
        key: Number(row.id_paquete),
        idPaquete: Number(row.id_paquete),
        fechaProgramada: row.fecha,
        fechaApertura: row.fecha_hora_apertura_operacion,
        fechaCierre: row.fecha_hora_cierre_operacion,
        asignadoA:row.nombre_completo
      };

      paquetes.push(reg);
    });
  });

  return paquetes;
};

module.exports = {
  getMiPaqueteNotificacion,
  guardarSoporte,
  iniciarRutaNotificacion,
  cerrarRutaNotificacion,
  setMarcarOficioNotificado,
  setMarcarOficioPaquete,
  getPaquetesHoy,
};
