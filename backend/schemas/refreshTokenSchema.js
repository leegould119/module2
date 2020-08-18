const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  refreshToken: String,
  creationDate: { type: Date, default: Date.now }
});

const RefreshToken = mongoose.model('tokens', refreshTokenSchema);
module.exports = RefreshToken;
