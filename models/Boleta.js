const mongoose = require('mongoose');

const BoletaSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    contrato:{
        type: mongoose.ObjectId,
        required: true
    },
    userid:{
        type: mongoose.ObjectId,
        required: true
    },
    valorinicial:{
        type: Number,
        required: false,
        default: 0
    },
    valorfinal:{
        type: Number,
        required: true
    },
    estado:{
        type: String,
        default: 'Generada',
        required: true
    },
    tipo:{
        type: String,
        default: 'Automatica',
        required: true
    }
});

module.exports = mongoose.model('Boletas', BoletaSchema);