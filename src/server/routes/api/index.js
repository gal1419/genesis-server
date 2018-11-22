const express = require('express');
const request = require('request');
const passportConfig = require('../../config/passport');

const apiRouter = express.Router();

const getPinterest = (req, res, next) => {
  const userToken = req.user.tokens.find(token => token.kind === 'pinterest');
  request.get(
    {
      url: 'https://api.pinterest.com/v1/me/boards/',
      qs: { access_token: userToken.accessToken },
      json: true
    },
    (err, req, body) => {
      if (err) {
        return next(err);
      }
      return res.render('api/pinterest', {
        title: 'Pinterest API',
        boards: body.data
      });
    }
  );
};

/**
 * GET /api/pinterest
 * Pinterest API example.
 */
apiRouter.get(
  '/pinterest',
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  getPinterest
);

apiRouter.get('/getUsername', (req, res) => res.send({ username: 'Gal' }));
module.exports = apiRouter;
