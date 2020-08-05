const express = require('express');
require('dotenv').config();
require('./dbconfig/database');
const app = express();
const port = process.env.PORT;

// MIDDLEWARE

// FORM data
app.use(express.urlencoded({ extended: false }));
// JSON data
app.use(express.json());

app.get('/', (req, res) => res.send('dfsdfxcc xfdgisdfgt'));
app.use('/lesson6', require('./routes/testRoute'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
