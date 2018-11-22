"use strict";
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    tokens: Array,
    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });
/**
 * Password hash middleware.
 */
userSchema.pre('save', function preSave(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    return bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            return next();
        });
    });
});
/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};
/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
    var gSize = size || 200;
    if (!this.email) {
        return "https://gravatar.com/avatar/?s=" + gSize + "&d=retro";
    }
    var md5 = crypto
        .createHash('md5')
        .update(this.email)
        .digest('hex');
    return "https://gravatar.com/avatar/" + md5 + "?s=" + gSize + "&d=retro";
};
var User = mongoose.model('User', userSchema);
module.exports = User;
//# sourceMappingURL=User.js.map