const User = require('./models/User');
/*
Documentation for permission types:

admin: Full control over the DB (including creating users)

read-all: Access to all select/find statements
read-propiedades: Access to select/find propiedades

write-all: Acces to all insert statements
write-propiedad: Access to insert on propiedad collection
write-persona: Access to insert on persona collection
wrtie-mandante: Access to insert on mandante collection
write-direccion: Access to insert on direccion collection
write-mandato: Access to insert on mandato collection
write-contrato: Access to insert on contrato collection
*/

const loadPermissions = async (req, res, next) => {
    // Checking if user exists
    const user = await User.findOne({_id: req.verified.userid});
    if (!user) return res.status(400).send('userid passed along with the token is not valid!');
    
    req.permissions = user.permissions;
    req.body.userid = req.verified.userid;
    next();
}

module.exports = loadPermissions;