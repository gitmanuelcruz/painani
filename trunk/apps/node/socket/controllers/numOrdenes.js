const pool = require('../config/db');

const getNumOrdenes = async (req,res) => {
   const sql = `SELECT
                  id_notificacion,
                  fecha_oficio,
                  num_orden,
                  fecha_hora_notificado,
                  id_estatus_notificacion
               FROM notificaciones`;

   let numOrdenes = []
   await pool.query(sql,[]).then(result => {
      result.rows.map(item => {
         let datos = {
            "idNotificacion": item.id_notificacion,
            "fechaOficio": item.fecha_oficio,
            "numOrden": item.num_orden.trim(),
            "fechaHoraNotificado": item.fecha_hora_notificado,
            "idEstatusNotificacion": item.id_estatus_notificacion.trim()
         }

         numOrdenes.push(datos);
      });
   });

   return res.json(numOrdenes);
}

module.exports = {
   getNumOrdenes
}