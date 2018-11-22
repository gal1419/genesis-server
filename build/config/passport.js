"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var lodash_1 = __importDefault(require("lodash"));
var User_1 = __importDefault(require("../models/User"));
passport_1.default.serializeUser(function (user, done) {
    done(undefined, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    User_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
/**
 * Sign in using Email and Password.
 */
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, function (email, password, done) {
    User_1.default.findOne({ email: email.toLowerCase() }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { msg: "Email " + email + " not found." });
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, { msg: 'Invalid email or password.' });
        });
    });
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function (req, res, next) {
    var provider = req.path.split('/').slice(-1)[0];
    if (lodash_1.default.find(req.user.tokens, { kind: provider })) {
        next();
    }
    else {
        res.redirect("/auth/" + provider);
    }
};
//# sourceMappingURL=passport.js.map