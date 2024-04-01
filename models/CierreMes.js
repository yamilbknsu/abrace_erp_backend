const mongoose = require('mongoose');

const CierreMesSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    userid:{
        type: mongoose.ObjectId,
        required: true
    },
    boletas:{
        type: [mongoose.ObjectId],
        required: true,
        default: []
    },
    reajustes:{
        type: [mongoose.ObjectId],
        required: true,
        default: []
    }
});

module.exports = mongoose.model('cierresmes', CierreMesSchema);