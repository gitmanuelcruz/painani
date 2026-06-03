const {
   getNotificaciones,
   insertaNotificacion,
   getDatosNotificacion
} = require('../controllers/notificaciones');

class SocketsNotificaciones {
   constructor(io) {
      this.io = io;
      this.socketEvents();
   }
   socketEvents() {
      //? on connection
      this.io.on("connection", async (socket) => {
         console.log("Cliente conectado a notificaciones");
         // TODO: Proceso de mis notificaciones
         socket.on("get-notificaciones", async (payload) => {
            const json = { "notificaciones": await getNotificaciones(payload), "para": payload.usuario };
            this.io.emit("mis-notificaciones", json);
         });
         // TODO: Proceso de registro notificaciones por usuario 
         socket.on("registro_notificacion", async (payload) => {
            for (let i = 0; i < payload.sendUser.length; i++) {
               let id_notificacion = await insertaNotificacion({
                  'mensaje': payload.mensaje, 'de': payload.usuario, 'para': payload.sendUser[i],
                  'usuario': payload.usuario
               });
               let dnotificacion = await getDatosNotificacion(id_notificacion);
               this.io.emit("notificacion-privada", {
                  "para": payload.sendUser[i], "nombreDe": dnotificacion.nombreDe, "mensaje": payload.mensaje,
                  "icono": payload.icono, "hora": dnotificacion.hora
               });
            }
            if (payload.refresh !== null && payload.refresh !== undefined && payload.refresh !== '')
               this.io.emit(payload.refresh, payload);
         });
      });
   }
}

module.exports = SocketsNotificaciones;