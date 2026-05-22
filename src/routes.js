// Main file to store all routers from different endpoints

const express = require('express');
const router = express.Router();

const { router: userRoutes } = require('./routes/users'); // import all routes from users.js

router.use('/users', userRoutes); // adds '/users' prefix to the routes from 'users.js'

module.exports = router;