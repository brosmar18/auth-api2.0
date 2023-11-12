'use strict';

const express = require('express');
const errorHandler = require('./handlers/500');;
const notFound = require('./handlers/404');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const secretRoutes = require('./routes/secret');
const coursesRoutes = require('./routes/courses');

require('dotenv').config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.status(200).send("Hello World!");
});

app.get('/error', (req, res, next) => {
  // Trigger the 500 error handler for testing.
  throw new Error('Forced Error for Testing');
});

app.use(authRoutes);
app.use(usersRoutes);
app.use(secretRoutes);
app.use(coursesRoutes);

app.use('*', notFound);
app.use(errorHandler);

const start = () => {
  app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))
}

module.exports = {
    app,
    start
  };