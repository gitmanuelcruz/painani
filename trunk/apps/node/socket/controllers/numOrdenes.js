const pool = require('../config/db');

const getNumOrdenes = async (req,res) => {
   const { idControlVersion } = req.body;
   const sql = `SELECT
               	nn.id_notificacion,
               	nc.id_control_version,
               	nn.fecha_oficio,
               	nn.num_orden,
               	nn.fecha_hora_notificado,
               	nn.id_estatus_notificacion,
               	nc.id_estatus_notificacion_al_corte
               FROM notificaciones nn
               INNER JOIN notificaciones_cortes nc ON nn.id_notificacion = nc.id_notificacion
               WHERE nc.id_control_version = $1`;

   let numOrdenes = []
   await pool.query(sql,[idControlVersion]).then(result => {
      result.rows.map(item => {
         let datos = {
            "id_control_version": item.id_control_version,
            "id_notificacion": item.id_notificacion,
            "num_orden": item.num_orden.trim(),
            "fecha_oficio": item.fecha_oficio,
            "fecha_hora_notificado": item.fecha_hora_notificado,
            "id_estatus_notificacion": item.id_estatus_notificacion.trim(),
            "id_estatus_notificacion_al_corte": item.id_estatus_notificacion_al_corte.trim()
         }
         numOrdenes.push(datos);
      });
   });

   return res.json(numOrdenes);
}

module.exports = {
   getNumOrdenes
}
