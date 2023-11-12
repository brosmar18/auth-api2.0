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

// Route to get all courses
router.get('/course', bearerAuth, acl('read'), async (req, res, next) => {
    try {
        const courses = await coursesCollection.read();
        res.status(200).send(courses);
    } catch (e) {
        console.log(e);
        next();
    }
});

// Route to update a specific course by ID
router.put('/course/:id', bearerAuth, acl('update'), async (req, res, next) => {
    try {
        const updatedCourse = await coursesCollection.update(req.params.id, req.body);
        if (updatedCourse) {
            res.status(200).send(updatedCourse);

        } else {
            res.status(404).send({ message: "Course not found"})
        }
    } catch (e) {
        next(e);
    }
});

// Route to delete a specific course by ID
router.delete('/course/:id', bearerAuth, acl('delete'), async (req, res, next) => {
    try {
        const result = await coursesCollection.delete(req.params.id);
        if(result.message === 'Record deleted successfully') {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "Course not found or not deleted"});
        }
    } catch (e) {
        next(e);
    }
});



module.exports = router;