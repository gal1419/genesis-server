"use strict";
var express = require('express');
var promisify = require('util').promisify;
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../../models/User');
var passportConfig = require('../../config/passport');
var authRouter = express.Router();
var randomBytesAsync = promisify(crypto.randomBytes);
/**
 * POST /login
 * Sign in using email and password.
 */
var postLogin = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return next(errors);
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', info);
            return next(info);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.status(200).json({ msg: 'Success! You are logged in.' });
        });
    })(req, res, next);
};
/**
 * POST /logout
 * Log out.
 */
var postLogout = function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        if (err)
            console.log('Error : Failed to destroy the session during logout.', err);
        req.user = null;
        res.status(200).json('OK');
    });
};
/**
 * POST /signup
 * Create a new local account.
 */
var postSignup = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return next(errors);
    }
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    User.findOne({ email: req.body.email }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(400).json({ message: 'Account with that email address already exists.' });
        }
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json('OK');
            });
        });
    });
};
/**
 * GET /account
 * Profile page.
 */
var getAccount = function (req, res) {
    res.render('account/profile', {
        title: 'Account Management'
    });
};
/**
 * POST /account/profile
 * Update profile information.
 */
var postUpdateProfile = function (req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return next(errors);
    }
    User.findById(req.user.id, function (err, user) {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';
        user.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                    return res.redirect('/account');
                }
                return next(err);
            }
            req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/account');
        });
    });
};
/**
 * POST /account/password
 * Update current password.
 */
var postUpdatePassword = function (req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }
    User.findById(req.user.id, function (err, user) {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
};
/**
 * POST /account/delete
 * Delete user account.
 */
var postDeleteAccount = function (req, res, next) {
    User.deleteOne({ _id: req.user.id }, function (err) {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash('info', { msg: 'Your account has been deleted.' });
        res.redirect('/');
    });
};
/**
 * POST /reset/:token
 * Reset Password page.
 */
var getReset = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('/forgot');
        }
        res.render('account/reset', {
            title: 'Password Reset'
        });
    });
};
/**
 * POST /reset/:token
 * Process the reset password request.
 */
var postReset = function (req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }
    var resetPassword = function () { return User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .then(function (user) {
        if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(function () { return new Promise(function (resolve, reject) {
            req.logIn(user, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(user);
            });
        }); });
    }); };
    var sendResetPasswordEmail = function (user) {
        if (!user) {
            return;
        }
        var transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'hackathon@starter.com',
            subject: 'Your Hackathon Starter password has been changed',
            text: "Hello,\n\nThis is a confirmation that the password for your account " + user.email + " has just been changed.\n"
        };
        return transporter.sendMail(mailOptions)
            .then(function () {
            req.flash('success', { msg: 'Success! Your password has been changed.' });
        })
            .catch(function (err) {
            if (err.message === 'self signed certificate in certificate chain') {
                console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
                transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                return transporter.sendMail(mailOptions)
                    .then(function () {
                    req.flash('success', { msg: 'Success! Your password has been changed.' });
                });
            }
            console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
            req.flash('warning', { msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
            return err;
        });
    };
    resetPassword()
        .then(sendResetPasswordEmail)
        .then(function () { if (!res.finished)
        res.redirect('/'); })
        .catch(function (err) { return next(err); });
};
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
var postForgot = function (req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }
    var createRandomToken = randomBytesAsync(16)
        .then(function (buf) { return buf.toString('hex'); });
    var setRandomToken = function (token) { return User
        .findOne({ email: req.body.email })
        .then(function (user) {
        if (!user) {
            req.flash('errors', { msg: 'Account with that email address does not exist.' });
        }
        else {
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 3600000; // 1 hour
            user = user.save();
        }
        return user;
    }); };
    var sendForgotPasswordEmail = function (user) {
        if (!user) {
            return;
        }
        var token = user.passwordResetToken;
        var transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'hackathon@starter.com',
            subject: 'Reset your password on Hackathon Starter',
            text: "You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n\n        Please click on the following link, or paste this into your browser to complete the process:\n\n\n        http://" + req.headers.host + "/reset/" + token + "\n\n\n        If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        return transporter.sendMail(mailOptions)
            .then(function () {
            req.flash('info', { msg: "An e-mail has been sent to " + user.email + " with further instructions." });
        })
            .catch(function (err) {
            if (err.message === 'self signed certificate in certificate chain') {
                console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
                transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                return transporter.sendMail(mailOptions)
                    .then(function () {
                    req.flash('info', { msg: "An e-mail has been sent to " + user.email + " with further instructions." });
                });
            }
            console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
            req.flash('errors', { msg: 'Error sending the password reset message. Please try again shortly.' });
            return err;
        });
    };
    createRandomToken
        .then(setRandomToken)
        .then(sendForgotPasswordEmail)
        .then(function () { return res.redirect('/forgot'); })
        .catch(next);
};
authRouter.post('/login', postLogin);
authRouter.post('/logout', postLogout);
authRouter.post('/forgot', postForgot);
authRouter.post('/reset/:token', postReset);
authRouter.get('/reset/:token', getReset);
authRouter.post('/signup', postSignup);
authRouter.get('/account', passportConfig.isAuthenticated, getAccount);
authRouter.post('/account/profile', passportConfig.isAuthenticated, postUpdateProfile);
authRouter.post('/account/password', passportConfig.isAuthenticated, postUpdatePassword);
authRouter.post('/account/delete', passportConfig.isAuthenticated, postDeleteAccount);
module.exports = authRouter;
//# sourceMappingURL=index.js.map