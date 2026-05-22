const express = require('express');
const router = express.Router();

// NOTE: in this file the prefix 'users' isnt added in the route endpoints because its added in the general route file 'routes.js'
// Mock database

let users = [
    {
        'firstName': 'chris',
        'lastName': 'blanco',
        'id': 1, 
        'email': 'chrisblanco04',
        'password': 'chrisb04'
    },
    {
        'firstName': 'josu',
        'lastName': 'hernandez',
        'id': 2, 
        'email': 'josuhernandez06',
        'password': 'jsoher06'
    },
    {
        'firstName': 'vicente',
        'lastName': 'sanabria',
        'id': 3, 
        'email': 'vicesanabria26',
        'password': 'vices26'
    },
    {
        'firstName': 'pablo',
        'lastName': 'zuniga',
        'id': 4, 
        'email': 'pablozuniga15',
        'password': 'pz15'
    }
];

// --------- GET routes ---------

router.get('/', (req, res) => { // get all users
    return res.status(200).send(users);
});

router.get('/:id', (req, res) => { 
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
});

router.post('/', (req, res) => {
    const { firstName, lastName, id, email, password } = req.body;

    if (!firstName || !lastName || !id || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

   users.push({
        'firstName': firstName,
        'lastName': lastName,
        'id': id,
        'email': email, 
        'password': password
   });

   res.status(201).send("The user " + firstName + ' ' + lastName + " has been added!");
});

module.exports = {router, users};
