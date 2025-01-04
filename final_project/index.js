const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers["authorization"]; // Retrieve Authorization header
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token after 'Bearer'

    if (!token) {
        return res.status(401).send("No token provided for user.");
    }

    try {
        const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key"; // Use your secret key
        const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
        req.user = decoded; // Attach decoded data to req.user
        next(); // Proceed to the next middleware or route
    } catch (error) {
        res.status(401).send("Invalid token.");
    }
});


 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
