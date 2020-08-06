const express = require('express');
require('dotenv').config();
const port = process.env.PORT;
const app = express();
require('./dbconfig/database');
// FORM data
app.use(express.urlencoded({ extended: false }));
// JSON data
app.use(express.json());

app.get('/', (req, res) => res.send('dfsdfxcc xfdgisdfgt'));

app.use('/lesson7', require('./routes/test-route'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
