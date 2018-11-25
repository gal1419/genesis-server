import express from 'express';
import request from 'request';
import * as passportConfig from '../../config/passport';

const apiRouter = express.Router();

const startGame = (req, res, next) => {
  const userToken = req.user.tokens.find(token => token.kind === 'pinterest');
};

const iniitlizeGame = (req, res, next) => {
  const userToken = req.user.tokens.find(token => token.kind === 'pinterest');
};

/**
 * POST /api/init-game
 * Initialize the Game
 */
apiRouter.get(
  '/initilize-game',
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  iniitlizeGame
);

/**
 * POST /api/start-game
 * Start the game
 */
apiRouter.get(
  '/start-game',
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  startGame
);

apiRouter.get('/getUsername', (req, res) => res.send({ username: 'Gal' }));
export default apiRouter;
