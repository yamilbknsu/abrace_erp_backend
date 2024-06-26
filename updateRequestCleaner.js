const cleanRequest = async (req, res, next) => {

    // Clean the body from values that should not be inserted in the documents
    const { mandanteData, administradorData, direccionData, lastcontrato, _id, __v,
            direccionStr, arrendatario_rut, arrendatario_dv, ...reqClean } = req.body;
    req.body = reqClean;

    next();
}

module.exports = cleanRequest;