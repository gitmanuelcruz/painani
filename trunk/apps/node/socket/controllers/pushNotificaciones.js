const pool = require('../config/db');

const getNotificaciones = async (data) => {
   const sql = "SELECT n.*, " +
               "  substr(u.nombre_completo, 0,17)||'...' AS nombre_de," +
               "  u.id_genero AS id_genero_de, " +
               "  g.codigo_genero AS genero_de, " +
               "  u.path_foto AS foto_usuario_de, " +
               "  TO_CHAR(n.fecha_registro,'dd-mm-yyyy hh12:mi:ss AM') AS fecha_reg_not " +
               "FROM notificaciones n " +
               "LEFT JOIN usuarios u ON n.de = u.id_usuario " +
               "LEFT JOIN generos g ON u.id_genero = g.id_genero " +
               "WHERE n.leido = 0 " +
               "AND n.para = $1 " +
               "ORDER BY n.fecha_registro DESC";

   let mensajes = []
   await pool.query(sql, [data.usuario]).then(result => {
      result.rows.map(mensaje => {
         let datos = {
            "idNotificacion": mensaje.id_notificacion,
            "de": mensaje.de.trim(),
            "nombreDe": mensaje.nombre_de.trim(),
            "para": mensaje.para.trim(),
            "mensaje": mensaje.mensaje.trim(),
            "leido": mensaje.leido.trim(),
            "fecha": mensaje.fecha_reg_not,
            "fotoUserDe": mensaje.foto_usuario_de,
            "generoUserDe": mensaje.genero_de
         };

         mensajes.push(datos);
      });
   });

   return mensajes;
}

const insertaNotificacion = async (data) => {
   const sql = "INSERT INTO notificaciones(id_notificacion,de,para,mensaje,creado_por) "+
               "VALUES(nextval('seq_notificaciones'),trim($1),trim($2),trim($3),trim($4)) RETURNING *";

   const idNotificacion = await pool.query(sql, [data.usuario, data.para, data.mensaje, data.usuario])
   .then(result => {
      return result.rows[0].id_notificacion;
   });

   return idNotificacion;
}

const getUsuariosRol = async (rol) => {
   const sql = "SELECT DISTINCT id_usuario " +
               "FROM usuarios_roles " +
               "WHERE id_rol = $1 " +
               "ORDER BY id_usuario";
   let users;
   await pool.query(sql, [rol]).then(result => {
      users = []
      result.rows.map(usuario => {
         let datos = {
            "idUsuario": usuario.id_usuario.trim()
         };
         users.push(datos);
      });
   });

   return users;
}

const getDatosNotificacion = async (data) => {
   const sql = "SELECT n.*, " +
			      "	   substr(u.nombre_completo, 0,20)||'...' AS nombre_de, "+
			      "	   TO_CHAR(n.fecha_registro,'dd-mm-yyyy hh12:mi:ss AM') AS fecha_reg_not, "+
			      "	   TO_CHAR(n.fecha_registro,'hh12:mi:ss AM') AS hora_reg_not, "+
               "	   u.path_foto AS foto_usuario "+
               "FROM notificaciones n "+
               "LEFT JOIN usuarios u ON n.de = u.id_usuario "+
               "WHERE n.id_notificacion = $1";

   let datos;
   const result = await pool.query(sql, [data]);
   datos = {
      "idNotificacion": result.rows[0].id_notificacion,
      "de": result.rows[0].de.trim(),
      "nombreDe": result.rows[0].nombre_de.trim(),
      "para": result.rows[0].para.trim(),
      "mensaje": result.rows[0].mensaje.trim(),
      "hora": result.rows[0].hora_reg_not,
      "fotoUser": result.rows[0].foto_usuario
   }

   return datos;
}

module.exports = {
   getNotificaciones,
   insertaNotificacion,
   getUsuariosRol,
   getDatosNotificacion
}