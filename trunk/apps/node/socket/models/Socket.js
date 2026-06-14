class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    //? on connection
    this.io.on("connection", async (socket) => {
      const { userId } = socket.handshake.auth;

      if (userId) {
        socket.userId = userId;

        socket.join(`user:${userId}`);
      }

	  console.log(`El usuario ${userId} conectado`);

      socket.on('iniciarRuta',async(payload)=>{
        console.log(payload);

        const userId = socket.userId;
        console.log(userId);

        if(userId){
          console.log(`El usuario ${userId} ha Iniciado su ruta`);
        }

        this.io.emit('refresh_apertura_operacion',payload);
      });

      socket.on('finalizarRuta',async(payload)=>{
        const userId = socket.userId;
        if(userId){
          console.log(`El usuario ${userId} ha finalizado su ruta`);
        }

        this.io.emit('refresh_cierre_operacion',payload);
      });

      socket.on('marcaNotificador',async(payload)=>{
        const userId = socket.userId;
        if(userId){
          console.log(`El usuario ${userId} ha actualizado sus oficios`);
        }
        this.io.emit('refresh_cambio_estatus',payload);
      });
	  
      // TODO: Proceso donde se obliga a salir de la plataforma
      socket.on("close-session", async (payload) => {
        this.io.emit(payload.refresh, payload);
      });

      socket.on('disconnect',(reason)=>{
        const usuarioDesconectado = socket.userId;

        if(usuarioDesconectado){
          console.log(`El usuario [${usuarioDesconectado}] se ha desconectado, motivo: ${reason}`);
        }
        else{
          console.log(`Un cliente anónimo (sin registrar) se ha desconectado.n Motivo ${reson}`);
        }
      });

    });
  }
}

module.exports = Sockets;
