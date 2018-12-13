import express from 'express';
import socketIO from 'socket.io';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import logger from 'morgan';
import chalk from 'chalk';
import errorHandler from 'errorhandler';
import lusca from 'lusca';
import dotenv from 'dotenv';
import flash from 'express-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import expressStatusMonitor from 'express-status-monitor';
import sass from 'node-sass-middleware';
import * as http from 'http';
import arduinoService from './services/arduino-service';

/**
 * API keys and Passport configuration.
 */
import apiRouts from './routes/api';
import authRouts from './routes/user';

const MongoStore = require('connect-mongo')(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

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
const server = (<any>http.Server)(app);
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
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 },
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

/**
 * App routes.
 */
app.use('/api', apiRouts);
app.use('/user', authRouts);

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
 * Init Arduino service
 */
arduinoService.initialize();

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

export default app;
