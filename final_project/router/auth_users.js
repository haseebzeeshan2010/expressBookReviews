const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.use("/review/", function auth(req,res,next){
  if(req.session.authorization) {
      token = req.session.authorization['accessToken'];
      jwt.verify(token, "access",(err,user)=>{
          if(!err){
              req.user = req.session.authorization['username'];
              next();
          }
          else{
              return res.status(403).json({message: "User not authenticated"})
          }
       });
   } else {
       return res.status(403).json({message: "User not logged in"})
   }
});

regd_users.put("/review/add/:isbn",function (req,res){
  const isbn = req.params.isbn;
  const user = req.user
  const comment = req.query.review
  const review = { 
      [user] : comment
  }

  books[isbn].reviews = review
  res.send(JSON.stringify(books[isbn].reviews,null,4));
});

regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.user
  delete books[isbn].reviews[user]
  res.send(books[isbn])
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;