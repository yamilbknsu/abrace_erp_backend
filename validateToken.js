const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    // Load the token header
    const token = req.headers['auth-token'];

    try{
        if (typeof token !== 'undefined'){
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.verified = verified;
            
            res.setHeader('auth-token', jwt.sign({userid: req.verified.userid}, process.env.TOKEN_SECRET, {"expiresIn": "20min"}));

            next();
        }else{
            res.status(403).send('Forbidden access');
        }
    }catch(err){
        res.status(403).send('Forbidden access');
    }
}

module.exports = validateToken;