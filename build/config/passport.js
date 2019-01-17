"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
// import User from '../models/User';
// passport.serializeUser<any, any>((user, done) => {
//   done(undefined, user.id);
// });
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });
/**
 * Sign in using Email and Password.
 */
// passport.use(
//   new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//     User.findOne({ email: email.toLowerCase() }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { msg: `Email ${email} not found.` });
//       }
//       user.comparePassword(password, (err, isMatch) => {
//         if (err) {
//           return done(err);
//         }
//         if (isMatch) {
//           return done(null, user);
//         }
//         return done(null, false, { msg: 'Invalid email or password.' });
//       });
//     });
//   })
// );
/**
 * Login Required middleware.
 */
exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(400).json({ error: 'User is not authenticated' });
};
/**
 * Role Based Authorization middleware.
 */
// export const roleAuthorization = roles => (req, res, next) => {
//   const user = req.user;
//   User.findOne({ email: user.email.toLowerCase() }, (err, foundUser) => {
//     if (err) {
//       res.status(422).json({ error: 'No user found.' });
//       return next(err);
//     }
//     if (roles.indexOf(foundUser.role) > -1) {
//       return next();
//     }
//     res.status(401).json({ error: 'You are not authorized to view this content' });
//     return next('Unauthorized');
//   });
// };
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