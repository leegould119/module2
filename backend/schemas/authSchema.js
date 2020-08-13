const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
  userName: String,
  userPassword: String
});

const Login = mongoose.model('login', loginSchema);
module.exports = Login;
