const express = require("express");
const jwt = require("jsonwebtoken");
let { books } = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "Nati", password: "Kj4114" }];

const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let token = jwt.sign({ username: username }, "my-secret-key", {
        expiresIn: "1h",
      });
      req.session.authorization = {
        token,
        username,
      };
      return res
        .status(200)
        .json({ message: "User logged in successfully", token: token });
    } else {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  console.log(JSON.stringify(books[isbn]));

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "No book found with ISBN " + isbn });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "No review found for ISBN " + isbn });
    }
  } else {
    return res.status(404).json({ message: "No book found with ISBN " + isbn });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
