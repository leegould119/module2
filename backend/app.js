const express = require("express");
const app = express();
const port = process.env.port || 3000;

// express body parser

// FORM data
app.use(express.urlencoded({ extended: false }));
// JSON data
app.use(express.json());

app.get("/", (req, res) => res.send("dfsdfxcc xfdgisdfgt"));

app.use("/auth", require("./routes/authentication-routes"));
app.use("/blog", require("./routes/blog-routes"));
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
