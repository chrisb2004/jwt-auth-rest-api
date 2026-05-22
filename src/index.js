require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { users } = require('./routes/users');
const routes = require('./routes')
const app = new express;

app.use(express.json()); 

// Auth middleware

/*

1. get the auth header from req.headers[]
2. check if the headers is provided
3. Header looks like "Bearer <token>", so split and grab the token: split(' ')[1];
4. verify the token
5. call the next middleware or protected route

NOTE: since express middlewares are secuential, the 'use' for specific routes is called after the auth middleware


*/

app.use('/users', (req, res, next) => {
    let authHeader = req.headers['authorization'];
    console.log('authHeader:', authHeader);

    if(!authHeader) {
        return res.status(403).json({message: 'Token not provided'});
    }

    let token = authHeader.split(' ')[1];
    console.log('token:', token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log('err:', err);   // see what error jwt is throwing
        console.log('user:', user);

        if(err) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        req.user = user; 

        /*
        
       When the user makes a request, the auth middleware checks for a JWT and verifies it
       If this process is valid, it decodes the users credentials from the JWT and adds it to the req
       so the server knows its safe to send a response.
        
        */

        next();
    });
});

app.use('/users', routes);

// Login middleware

/*

1. get the string from req.body thats being used to log in
2. compare that string to the database data
3. if user doesnt exist, return 404
4. else sign jwt and return it

*/

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const foundUser = users.find((user) => user.email === email);

    if(!foundUser) {
        return res.status(404).json({message: 'User not found'});
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }

    let accessToken = jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
    
    // Just send it back, don't store it anywhere on the server
    return res.status(200).json({ accessToken });
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const id = users.length + 1;
    const foundUser = users.find((user) => user.email === email);

    if(foundUser) {
        return res.status(403).json({message: 'User already exists.'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.push({
        'firstName': firstName,
        'lastName': lastName, 
        'id': id,
        'email': email,
        'password': hashedPassword
    });
    
    return res.status(201).send("User successfuly registered");
});

app.listen(process.env.PORT, () => console.log('App is listenging to port: ' + process.env.PORT));
