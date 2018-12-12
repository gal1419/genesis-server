"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
var crypto_1 = __importDefault(require("crypto"));
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
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
    if (!this.isModified('password')) {
        return next();
    }
    return bcrypt_nodejs_1.default.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt_nodejs_1.default.hash(user.password, salt, null, function (err, hash) {
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
    bcrypt_nodejs_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
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
    var md5 = crypto_1.default
        .createHash('md5')
        .update(this.email)
        .digest('hex');
    return "https://gravatar.com/avatar/" + md5 + "?s=" + gSize + "&d=retro";
};
var User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map