const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const{username,password} = req.body;

    if(!username || !password) {
        return res.status(400).json({message: "Username and password are required."});
    };

    if(!isValid(username)) {
        return res.status(409).json({message: "Username is already in use"});
    };

    users.push({username,password});
    res.status(200).json({message: "User succesfully registered"});
});

public_users.get('/', function (req, res) {
    let promise = new Promise((resolve) => {
        setTimeout(() => {
            console.log("Fetching information...");
        }, 1000); // First log after 1 second

        setTimeout(() => {
            if (books) {
                resolve(books); // Resolve the promise with books
            } else {
                reject("No books found");
            }
        }, 4000); // Resolve/reject after 4 seconds
    });

    promise
        .then((books) => {
            res.status(200).json({
                message: "Fetching information... Books fetched successfully!",
                data: books
            });
        })
        .catch((error) => {
            res.status(400).json({ message: "Error occurred while processing the request", error });
        });
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]) {
    return res.status(201).send(books[isbn]);
  } else {
    return res.status(401).send({error : "ISBN not found."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matching_books = [];

    for (let key in books) {
        if (books[key].author === author)
        matching_books.push(books[key]);
    }


if (matching_books.length > 0) {
    return res.status(201).json(matching_books);
} else {
    return res.status(404).send("No books found matching the author.");
}

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];

    for (let key in books) {
        if (books[key].title === title) {
            matchingBooks.push(books[key]);
        }
    }
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).send("No books matching the title found.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);

    if(books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).send("No books found for the ISBN.");
    }
});

module.exports.general = public_users;
