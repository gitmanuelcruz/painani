const Server = require("./models/Server");

require('dotenv').config({ quiet: true });

const server = new Server();

server.execute();