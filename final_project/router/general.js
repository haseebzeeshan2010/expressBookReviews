const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.json());

public_users.post("/register", (req,res) => {
  let usr = req.query.username;
  let pwd = req.query.password;
  if (!usr | !pwd) {
    return res.status(400).json("Please enter a username and password.");
  }
  var unq = true;
  for (var user in users) {
      if (user["username"]===usr) {
          unq = false;
      }
  }
  if (unq) {
      users.push({"username": usr, "password": pwd})
      return res.status(300).json({message: "User sucessfully registered."});
  }
  else {return res.status(400).json({message: "User already registered previously."});}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   let bookList = [];
   for (var i in books) {
       bookList.push(books[i]["title"]);
   }
   return res.status(300).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  for (var i in books) {
      if (books[i]["author"]===req.params.author) {
        return res.status(300).json(books[i]);
      }
  }
  return res.status(300).json("No matching author found. Check spelling/capitalization.");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    for (var i in books) {
        if (books[i]["title"]===req.params.title) {
          return res.status(300).json(books[i]);
        }
    }
    return res.status(300).json("No matching title found. Check spelling/capitalization.");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(300).json(books[parseInt(req.params.isbn)]["reviews"]);
});

// TASK 10 - Get the book list using promises
public_users.get('/async-get-books',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// TASK 11 - Get book details by ISBN using promises
public_users.get('/async-get-isbn/:isbn',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      let isbn = parseInt(req.params.isbn);
      let book = books[isbn];
      resolve(res.send(JSON.stringify({book}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 11 resolved"));

});
// TASK 12 - Get book details by author using promises
public_users.get('/async-get-author/:author',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      for (var i in books) {
          if (books[i]["author"]===req.params.author) {
              let book = bboks[i]
              resolve(res.send(JSON.stringify({book}, null, 4)));
          }
      }
      resolve(res.send("Author not found."));
    });

    get_books.then(() => console.log("Promise for Task 12 resolved"));

});