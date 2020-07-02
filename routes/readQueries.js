const express = require('express');
const router = express.Router();

// Validate token import
const validateToken = require('../validateToken.js');               // We get req.verified
const permissionCheck = require('../permissionChecking.js');        // We get req.permissions

// Read all propiedades
router.get('/propiedades/', validateToken, permissionCheck, (req, res) =>{

});