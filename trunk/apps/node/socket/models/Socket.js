class Sockets {
	constructor(io) {
		this.io = io;
		this.socketEvents();
	}

	socketEvents() {
		//? on connection
		this.io.on("connection", async (socket) => {
			console.log("Cliente conectado");
			// TODO: Proceso de registro de movimiento en almacen
			socket.on("new-movimiento-almacen", async (payload) => {
				//console.log("se ha insertado un nuevo movimiento de almacen");
				this.io.emit("new-movimiento", payload);
			});			
			
			// TODO: Proceso donde se obliga a salir de la plataforma
			socket.on("close-session", async (payload) => {
				this.io.emit(payload.refresh, payload);
			});
			
		});
	}
}

module.exports = Sockets;