const User = require('./models/User');
/*
Documentation for permission types:

admin: Full control over the DB (including creating users)

read-all: Access to all select/find statements
read-propiedad: Access to select/find propiedades
read-direccion: Access to select/find direcciones
read-persona: Access to select/find personas
read-mandato: Access to select/find mandato
read-contrato: Access to select/find contrato
read-boleta: Access to select/find boleta
read-parametro: Access to select/find parametro

write-all: Access to all insert statements
write-propiedad: Access to insert on propiedad collection
write-persona: Access to insert on persona collection
wrtie-mandante: Access to insert on mandante collection
write-direccion: Access to insert on direccion collection
write-mandato: Access to insert on mandato collection
write-contrato: Access to insert on contrato collection
write-boleta: Access to insert on boleta collection

update-all: Access to all update statements
update-propiedad: Access to update on propiedad collection
update-persona: Access to update on persona collection
update-direccion: Access to update on direccion collection
update-parametro: Access to update on parametro collection
update-mandato: Access to update on mandato collection
update-contrato: Access to update on contrato collection

delete-all: Access to all delete statements
delete-propiedad: Access to delete on propiedad collection
delete-persona: Access to delete on persona collection
delete-direccion: Access to delete on direccion collection
delete-mandato: Access to delete on mandato collection
delete-contrato: Access to delete on contrato collection
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