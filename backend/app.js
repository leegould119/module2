const express = require("express");
const app = express();
const port = process.env.port || 3000;

// express body parser

// FORM data
//MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
// JSON data
app.use(express.json());

// app.METHOD (PATH, HANDLER)
// app.get("/auth/login", (req, res) => {
//   res.send("hello world!");
// });

// app.post("/auth/register", (req, res) => {
//   const request = req.body;
//   res.send("posted new whaterver!");
// });

// app.delete("/auth/delete-user", (req, res, next) => {
//   res.send("deleted data!");
// });

// app.get  => route.get
// app.use [USE THIS INCLUDED FILE]
app.use("/test", require("./routes/test-routes"));
// app.use("/auth", require("./routes/authentication-routes"));
// app.use("/blog", require("./routes/blog-routes"));
// blog posts
// admin dashboard
// whatever routes

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
