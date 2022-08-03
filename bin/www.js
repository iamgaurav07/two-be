require("dotenv").config();

import http from 'http'
import mongoose from 'mongoose';
const app = require('../server');
const Logger = require('../utils/logger');
const config = require('../config/appconfig');

const logger = new Logger();

/**
 * Create HTTP server.
 */
 const server = http.createServer(app);

 /**
  * Mongodb connection.
  */
  mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }, (err) => {
      if (err) {
        logger.log(`error while connecting to mongodb ${JSON.stringify(err)}`, 'error');
      };
      const logString = `database connected..`;
	  logger.log(logString, 'info');
  })

 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
     const port = parseInt(val, 10);
 
     if (Number.isNaN(port)) {
         // named pipe
         return val;
     }
 
     if (port >= 0) {
         // port number
         return port;
     }
 
     return false;
 }
 /**
  * Get port from environment and store in Express.
  */
 
 const port = normalizePort(process.env.DEV_APP_PORT || '3000');
 app.set('port', port);
 /**
  * Event listener for HTTP server "error" event.
  */
 
 
 function onError(error) {
     if (error.syscall !== 'listen') {
         throw error;
     }
 
     const bind = typeof port === 'string'
         ? `Pipe ${port}`
         : `Port ${port}`;
 
     // handle specific listen errors with friendly messages
     switch (error.code) {
     case 'EACCES':
         logger.log(`${bind} requires elevated privileges`);
         process.exit(1);
         break;
     case 'EADDRINUSE':
         logger.log(`${bind} is already in use`);
         process.exit(1);
         break;
     default:
         throw error;
     }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
     const addr = server.address();
     const bind = typeof addr === 'string'
         ? `pipe ${addr}`
         : `port ${addr.port}`;
 
     logger.log(`the server started listining on port ${bind}`, 'info');
 }
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);