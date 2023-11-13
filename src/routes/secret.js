'use strict';

const express = require('express');
const router = express.Router();
const bearerAuth = require('../middleware/bearer.js');



router.get('/secret', bearerAuth, async (req, res, next) => {
    res.status(200).send('Welcome to the secret area')
  });
  

  module.exports = router;