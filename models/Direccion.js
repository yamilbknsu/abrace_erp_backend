const mongoose = require('mongoose');

const DireccionSchema = mongoose.Schema({
    /*
    _id objID
    userid objID
    Calle str
    Comuna str
    Numero int
    Depto str
    Ciudad str
    Region str # ID?
    */
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    calle: {
        type: String,
        required: true,
        min: 3
    },
    comuna: {
        type: String
    },
    numero: Number,
    depto: String,
    ciudad: String,
    region: String
});

module.exports = mongoose.model('Direcciones', DireccionSchema);