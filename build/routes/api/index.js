"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var request_1 = __importDefault(require("request"));
var passportConfig = __importStar(require("../../config/passport"));
var apiRouter = express_1.default.Router();
var getPinterest = function (req, res, next) {
    var userToken = req.user.tokens.find(function (token) { return token.kind === 'pinterest'; });
    request_1.default.get({
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
exports.default = apiRouter;
//# sourceMappingURL=index.js.map