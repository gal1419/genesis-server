"use strict";
var express = require('express');
var request = require('request');
var passportConfig = require('../../config/passport');
var apiRouter = express.Router();
var getPinterest = function (req, res, next) {
    var userToken = req.user.tokens.find(function (token) { return token.kind === 'pinterest'; });
    request.get({
        url: 'https://api.pinterest.com/v1/me/boards/',
        qs: { access_token: userToken.accessToken },
        json: true
    }, function (err, req, body) {
        if (err) {
            return next(err);
        }
        return res.render('api/pinterest', {
            title: 'Pinterest API',
            boards: body.data
        });
    });
};
/**
 * GET /api/pinterest
 * Pinterest API example.
 */
apiRouter.get('/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, getPinterest);
apiRouter.get('/getUsername', function (req, res) { return res.send({ username: 'Gal' }); });
module.exports = apiRouter;
//# sourceMappingURL=index.js.map