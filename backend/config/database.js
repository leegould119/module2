const strings = require('./connectionString');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// connect to cluster
mongoose
  .connect(strings.mongoose.connectionString, strings.mongoose.options)
  .catch((err) => console.log(err));

// crate connection
const connection = mongoose.connection;
connection
  .on('connected', () => {
    console.log('mongo db connected');
  })
  .on('error', (e) => {
    console.log('there is an error' + e);
  });
