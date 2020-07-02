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
    creationDate:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', UserSchema);