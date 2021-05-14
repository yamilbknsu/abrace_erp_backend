const mongoose = require('mongoose');

const PersonaSchema = mongoose.Schema({
    /*
    _id objID
    userid objID
    rut str
    dv char
    Nombre str
    Actividad str
    Empresa str
    Cargo str
    DirParticular objID FK -< Direccion._id
    DirComercial objID FK -< Direccion._id
    Telefonos List[str]
    Emails List[str]
    */
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    rut : {
        type: String,
        required: true,
        min: 7,
        max: 13
    },
    dv: {
        type: String,
        required: true,
        min: 1,
        max: 1
    },
    nombre: {
        type: String,
        required: true,
        min: 3
    },
    actividad: String,
    empresa: String,
    cargo: String,
    dirParticular: mongoose.ObjectId,
    dirComercial: mongoose.ObjectId,
    telefonos: [String],
    emails: [String],
    personalidad: String,
    representante: {type: {
        rut : {
            type: String,
            required: true,
            min: 7,
            max: 13
        },
        dv: {
            type: String,
            required: true,
            min: 1,
            max: 1
        },
        nombre: {
            type: String,
            required: true,
            min: 3
        },
        actividad: String,
        empresa: String,
        cargo: String,
        dirParticular: mongoose.ObjectId,
        dirComercial: mongoose.ObjectId,
        telefonos: [String],
        emails: [String]
    }}
});

module.exports = mongoose.model('Personas', PersonaSchema);