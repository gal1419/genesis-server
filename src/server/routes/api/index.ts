import express from 'express';
import request from 'request';
import * as passportConfig from '../../config/passport';

const apiRouter = express.Router();

const startGame = (req, res, next) => {
  res.status(200).json({ msg: 'Game Started' });
};

const iniitlizeGame = (req, res, next) => {
  res.status(200).json({ msg: 'Game Initilized' });
};

/**
 * POST /api/initilize-game
 * Initialize the Game
 */
apiRouter.post(
  '/initilize-game',
  passportConfig.isAuthenticated,
  passportConfig.roleAuthorization(['admin']),
  iniitlizeGame
);

/**
 * POST /api/start-game
 * Start the game
 */
apiRouter.post(
  '/start-game',
  passportConfig.isAuthenticated,
  passportConfig.roleAuthorization(['admin']),
  startGame
);

export default apiRouter;
