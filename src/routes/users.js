'use strict';

const express = require('express');
const router = express.Router();
const { usersCollection } = require('../models');
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')



router.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
    try {
        const userRecords = await usersCollection.read();
        const list = userRecords.map(user => user.username);
        res.status(200).json(list);
    } catch (e) {
        next(e.message);
    }
  });

  module.exports = router;