const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialLinksSchema = new Schema(
  {
    facebookLink: {
      type: String
    },
    twitterLink: {
      type: String
    }
  },
  { _id: false }
);

const userProfileSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: Number
  },
  gender: {
    type: String
  },
  avatarUrl: {
    type: String
  },
  socialLinks: SocialLinksSchema
});

const Profile = mongoose.model('profile', userProfileSchema);
module.exports = Profile;
