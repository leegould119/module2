const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.port || 3000;
// your mongo db connection
const connection = require('./config/database');
// express body parser
const timeLogger = require('./routes/timeLogger');
// FORM data
app.use(express.urlencoded({ extended: false }));
// JSON data
app.use(express.json());

app.get('/', (req, res) => res.send('dfsdfxcc xfdgisdfgt'));

// APPLICATION LEVEL MIDDLEWARE
app.use(timeLogger);

app.use('/auth', require('./routes/auth-routes'));
app.use('/profile', require('./routes/profile-routes'));
app.use('/blog', require('./routes/blog-routes'));

// lesson 5 middleware
app.use('/middleware', require('./routes/test-routes'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
