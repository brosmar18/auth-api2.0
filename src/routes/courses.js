'use strict';

const express = require('express');
const { coursesCollection } = require('../models');
const bearerAuth = require('../middleware/bearer');
const acl = require('../middleware/acl');


const router = express.Router();


// Route to create a new course
router.post('/course', bearerAuth, acl('create'), async (req, res, next) => {
    try {
        let newCourse = await coursesCollection.create(req.body);
        console.log("New Course: ", newCourse);
        res.status(201).send({ message: "New course created: ", course: newCourse});
    } catch (e) {
        console.error(e);
        next();
    }
  
}); 

module.exports = router;