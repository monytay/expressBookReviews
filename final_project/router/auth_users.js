const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return !users.includes(username);
}

const authenticatedUser = (username,password)=>{
    const user = users.find(user_case => user_case.username === username && user_case.password === pasword);
    user ? true:false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;

  if(!username || !password){
    res.status(400).json({Message:"Username and password required"})
  };
  if (authenticatedUser(username,password)){
    const token =jwt.sign({ username }, SECRET_KEY, {expiresIn:"1Hr"});

    return res.status(200).json({
        message:"Login successful",
        token: token
    });
  } else {
    return res.status(401).json({message: "Invalid username and/or password"})
  }

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
