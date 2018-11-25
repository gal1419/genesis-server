import express from 'express';
import { promisify } from 'util';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import User from '../../models/User';
import * as passportConfig from '../../config/passport';

const authRouter = express.Router();
const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * POST /login
 * Sign in using email and password.
 */
const postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return next(errors);
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(info);
    }
    req.logIn(user, (err) => {
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
const postLogout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.status(200).json('OK');
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
const postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return next(errors);
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(400).json({ message: 'Account with that email address already exists.' });
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.logIn(user, (err) => {
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
const getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
const postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return next(errors);
  }

  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return res.ok(400).json({
            msg: 'The email address you have entered is already associated with an account.'
          });
        }
        return next(err);
      }
      return res.ok(200).json({ msg: 'Profile information has been updated.' });
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
const postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Password has been changed.' });
      return res.ok(200).json({ msg: 'Password has been changed.' });
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
const postDeleteAccount = (req, res, next) => {
  User.deleteOne({ _id: req.user.id }, (err) => {
    if (err) {
      return next(err);
    }
    req.logout();
    return res.ok(200).json({ msg: 'Your account has been deleted.' });
  });
};

/**
 * POST /reset/:token
 * Reset Password page.
 */
const getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires')
    .gt(Date.now())
    .exec((err, user) => {
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
const postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () => User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires')
    .gt(Date.now())
    .then((user) => {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('back');
      }
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      return user.save().then(
        () => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) {
              return reject(err);
            }
            resolve(user);
          });
        })
      );
    });

  const sendResetPasswordEmail = (user) => {
    if (!user) {
      return;
    }
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Hackathon Starter password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${
        user.email
      } has just been changed.\n`
    };
    return transporter
      .sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log(
            'WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.'
          );
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
          return transporter.sendMail(mailOptions).then(() => {
            req.flash('success', { msg: 'Success! Your password has been changed.' });
          });
        }
        console.log(
          'ERROR: Could not send password reset confirmation email after security downgrade.\n',
          err
        );
        req.flash('warning', {
          msg:
            'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.'
        });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => {
      if (!res.finished) res.redirect('/');
    })
    .catch(err => next(err));
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
const postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = randomBytesAsync(16).then(buf => buf.toString('hex'));

  const setRandomToken = token => User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      req.flash('errors', { msg: 'Account with that email address does not exist.' });
    } else {
      user.passwordResetToken = token;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      user = user.save();
    }
    return user;
  });

  const sendForgotPasswordEmail = (user) => {
    if (!user) {
      return;
    }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter
      .sendMail(mailOptions)
      .then(() => {
        req.flash('info', {
          msg: `An e-mail has been sent to ${user.email} with further instructions.`
        });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log(
            'WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.'
          );
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
          return transporter.sendMail(mailOptions).then(() => {
            req.flash('info', {
              msg: `An e-mail has been sent to ${user.email} with further instructions.`
            });
          });
        }
        console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
        req.flash('errors', {
          msg: 'Error sending the password reset message. Please try again shortly.'
        });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
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

export default authRouter;
