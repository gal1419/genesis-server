import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */

userSchema.pre('save', function preSave(next) {
  const user = this;
  if (!this.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
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
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  const gSize = size || 200;
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${gSize}&d=retro`;
  }
  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${gSize}&d=retro`;
};

const User = mongoose.model('User', userSchema);

export default User;
