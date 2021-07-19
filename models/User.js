const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    pw_hash: {
        type: String,
        required: true
    },
    displayname: {
        type: String
    },
    email: {
        type: String
    },
    permissions:{
        type: [String],
        default: ['none']
    },
    externalPermissions:{
        type: [{
            user: mongoose.ObjectId,
            permissions: [String]
        }],
        default: ['none']
    },
    creationDate:{
        type: Date,
        default: Date.now
    },
    inflinea1: {
        type: String
    },
    inflinea2: {
        type: String
    },
});

module.exports = mongoose.model('Users', UserSchema);