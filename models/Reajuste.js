const mongoose = require('mongoose');

const ReajusteSchema = mongoose.Schema({
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
    reajuste:{
        type: Number,
        default: 0,
        required: true
    },
    tipo:{
        type: String,
        default: 'Automatico',
        required: true
    }
});

module.exports = mongoose.model('Reajustes', ReajusteSchema);