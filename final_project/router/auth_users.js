const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username:"Antonio",
    password:"Hello123"
}];

const isValid = (username)=>{
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
    return users.some(user_case => user_case.username === username && user_case.password === password);
};

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({Message:"Username and password required"})
    };

    if (authenticatedUser(username,password)){
        const token =jwt.sign({ username }, SECRET_KEY, {expiresIn:"1Hr"});

        return res.status(200).json({
            message:"Login successful",
            token: token
        });
    } else {
        return res.status(401).json({message: "Invalid credentials"})
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;
    
    if(!isbn||!review||!username){
        return res.status(400).json({message:"No information"});
    }

    if(!books[isbn]){
        return res.status(404).json({
            message:"Book not found"
        });
    }

    if(!books[isbn].reviews){
        books[isbn].reviews ={};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({
        message:"Review updated",
        reviews:books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
