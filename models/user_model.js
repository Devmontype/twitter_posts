const db = require('../config/db');

const UserSchema = new db.mongoose.Schema({
    email: {
        type: String,
        default: null
    },
    fullname: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    about: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    }
}, { timestamps: true, collection: 'users' })

module.exports.UserModel = db.mongoose.model('User', UserSchema);