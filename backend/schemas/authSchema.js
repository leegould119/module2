const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  userPassword: String,
  creationDate: { type: Date, default: Date.now }
});

const Login = mongoose.model('login', userSchema);
module.exports = Login;
