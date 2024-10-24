const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/books", books_route);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    let token = req.session.authorization.token;
    jwt.verify(token, "my-secret-key", (err, user) => {
      if (err) {
        return res.status(401).json({ error: err });
      } else {
        req.session.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized here" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
