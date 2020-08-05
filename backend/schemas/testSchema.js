// import mogoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define our schema

// format to follow
// field name
// type of data
// atuomatically create a ObjectId which is (_id)

const testSchema = new Schema({
  fistName: String,
  lastName: String,
  websiteUrl: String,
  hasProgammingExperience: Boolean,
  regsiterTimestamp: Date
});

// create a model
const Test = mongoose.model('test', testSchema);
module.exports = Test;
