// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialLinksSchema = new Schema(
  {
    facebookLink: String,
    twitterLink: String,
    pinterestLink: String,
    linkedInLink: String
  },
  { _id: false }
);

const AdressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    postalCode: Number
  },
  { _id: false }
);

const ProfileSchema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: Number,
  gender: String,
  avatarUrl: String,
  socialLinks: SocialLinksSchema,
  adress: AdressSchema
});

const Profile = mongoose.model('profile', ProfileSchema);
module.exports = Profile;
