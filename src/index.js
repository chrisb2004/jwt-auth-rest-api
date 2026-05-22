require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

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

app.use('/user', (req, res, next) => {
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

app.use('/user', routes);

// Login middleware

/*

1. get the string from req.body thats being used to log in
2. compare that string to the database data
3. if user doesnt exist, return 404
4. else sign jwt and return it

*/

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const foundUser = users.find((user) => user.email === email && user.password === password);

    if(!foundUser) {
        return res.status(404).json({message: 'User not found'});
    }

    let accessToken = jwt.sign({ data: email }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
    
    // Just send it back, don't store it anywhere on the server
    return res.status(200).json({ accessToken });
});

app.listen(process.env.PORT, () => console.log('App is listenging to port: ' + process.env.PORT));
