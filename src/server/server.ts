const express = require('express');
const socketIO = require('socket.io');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const http = require('http');
const socketService = require('./services/socket-service');
const serialService = require('./services/serial-service');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * API keys and Passport configuration.
 */
const apiRouts = require('./routes/api');
const authRouts = require('./routes/auth');

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err: any) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Create server.
 */
const app = express();
const server = http.Server(app);
const io = socketIO(server);

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT);
app.use(express.static('dist'));
app.use(expressStatusMonitor());
app.use(compression());
app.use(
  sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
  })
);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//   lusca.csrf()(req, res, next);
// });

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req: any, res: any, next: any) => {
  res.locals.user = req.user;
  next();
});

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 })
);
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 })
);
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 })
);
app.use(
  '/webfonts',
  express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), {
    maxAge: 31557600000
  })
);

/**
 * App routes.
 */
app.use('/api', apiRouts);
app.use('/auth', authRouts);

app.get('*', (request: any, response: any) => {
  response.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

/**
 * Init SocketIO
 */
socketService.initialize(io);

/**
 * Init Serial Port
 */
serialService.initialize();

/**
 * Start server.
 */
server.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
