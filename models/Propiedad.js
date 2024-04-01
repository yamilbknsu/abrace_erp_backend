const mongoose = require('mongoose');

const PropiedadSchema = mongoose.Schema({
    /*
    _id objID
    userid objID FK -< Usuario._id
    uId charkey # user provided id
    direccion objID FK >- Direccion._id
    Telefonos str
    RolSII str
    Arrendada bool
    Administrador objID FK >-< Persona._id
    Caracteristicas obj FK - Caracteristicas.id
    MandatoActual objID FK - Mandato._id
    Mandante objID FK -< Mandante._id
    */
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    uId :{
        type: String,
        required: true,
        min: 3
    },
    direccion: {
        type: mongoose.ObjectId,
        required: true
    },
    telefonos: [String],
    rolsii: String,
    arrendada: Boolean,
    administrador: mongoose.ObjectId,
    caracteristicas: {
        type: {
            anoedificacion: Number,
            mtsterreno: Number,
            mtsconstruidos: Number,
            pisos: Number,
            habitaciones: Number,
            banos: Number,
            salas: Number,
            comedores: Number,
            livcomedor: Number,
            piezasservicio: Number,
            banosservicio: Number,
            estacionamientos: Number,
            ascensor: Boolean,
            bodegas: Number,
            otros: [{nombre: String, detalle: String}]
        }
    },
    mandante: {
        type: mongoose.ObjectId,
        required: true},
    mandatoActual: mongoose.ObjectId
    
});

module.exports = mongoose.model('Propiedades', PropiedadSchema);