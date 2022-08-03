import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = mongoose.Schema({
    username: { type: String, default: null },
    password: { type: String, default: null },
    name: { type: String, default: null }
}, { timestamps: true} )

//save password in encrypt form

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next();
            })
        })
    } else {
        return next();
    }
});

// compare input passwod with stored database

UserSchema.methods.comparedPassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)