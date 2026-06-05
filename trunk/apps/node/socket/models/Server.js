// Servidor de Express
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const Sockets = require('./Socket');
const SocketsNotificaciones = require('./SocketsNotificaciones');

class Server {
   constructor() {
      this.app = express();
      this.port = process.env.PORT || 3039;
      
      // Http server
      this.server = http.createServer(this.app);

      // Configuraciones de sockets
      this.io = socketio(this.server, {
         cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"]
         }
      });
   }
   //
   configurarSockets() {
      new Sockets(this.io);
   }
   //
   configurarSocketsNotificaciones() {
      new SocketsNotificaciones(this.io);
   }
   //
   middlewares() {      
      // CORS
      this.app.use(cors());
      
      // Parseo del body
      this.app.use(express.json({ limit: '20mb' }));

      // Desplegar el directorio público
      this.app.use(express.static(path.resolve(__dirname, '../public')));

      this.app.get('/mensaje', function(req, res) {
         res.json({ mensaje: 'Método GET test' })
      });

   }
  
   execute() {
      // Inicializar Middlewares
      this.middlewares();

      // Inicializar sockets
      this.configurarSockets();

      // Inicializar sockets de notificaciones
      this.configurarSocketsNotificaciones();

      // Inicializar Server
      this.server.listen(this.port, () => {
         console.log('Server corriendo en puerto:', this.port);
      });
   }
}

module.exports = Server;