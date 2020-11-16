const https = require('https'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      express = require('express'),
      cors = require('cors'),
      path = require('path'),
      helmet = require('helmet'),
      serveStatic = require('serve-static');

let app = express();
let config = require('./config/config');
let routes = require('./routes/routes');

// mongoose connection and state handlers
mongoose.connect(config.databaseUrl, { autoIndex: false, auto_reconnect:true });
mongoose.connection.on('connected', function(){
  console.log('Mongoose conectado');
});
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose desconectado');
  mongoose.connect(config.databaseUrl, { autoIndex: false, auto_reconnect:true });
});
mongoose.connection.on('error', function(error){
  console.log('Erro na conexão do Mongoose: ' + error);
  mongoose.connect(config.databaseUrl, { autoIndex: false, auto_reconnect:true });
});
mongoose.set('debug', true);

// create HTTPS server
let server = https.createServer({
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem'),
  passphrase: config.certificatePassphrase
}, app);

// get port from environment and store in Express
let port = process.env.PORT || '3000';
app.set('port', port);

// listen on provided port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));

// parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// http head security improvements - helmet
app.use(helmet());

// deal Cross Origin Resource Sharing (CORS) issues we might run into
app.use(cors());

// log requests using Morgan
app.use(morgan('dev'));

// point static path to public
app.use(serveStatic(path.join(__dirname, 'public')));

// set API routes
app.use('/api', routes);

// catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});