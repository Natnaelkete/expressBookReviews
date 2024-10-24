const express = require("express");
let { books } = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.use(express.json());

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(400).json({ message: "Username already exists" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Username or password not provided" });
  }
});

public_users.get("/", async function (req, res) {
  if (books) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
    return res.status(404).json({ message: "No books found" });
  }
});

public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).send("No book found with ISBN " + isbn);
  }
});

public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let booksByAuthor = [];
  for (let isbn in books) {
    if (books[isbn].author == author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).send("No book found with author " + author);
  }
});

public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let booksByTitle = [];
  for (let isbn in books) {
    if (books[isbn].title == title) {
      booksByTitle.push(books[isbn]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).send("No book found with title " + title);
  }
});

public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).send("No book found with ISBN " + isbn);
  }
});

module.exports.general = public_users;
