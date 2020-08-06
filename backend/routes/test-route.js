const router = require('express').Router();

const Profile = require('../schemas/userProfileSchema');
const { response } = require('express');

router.post('/add-profile', (req, res, next) => {
  const newProfile = new Profile({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    avatarUrl: req.body.avatarUrl,
    socialLinks: {
      facebookLink: req.body.socialLinks.facebookLink,
      twitterLink: req.body.socialLinks.twitterLink
    }
  });
  //   res.send(newProfile);

  // save the data to the database
  newProfile.save().then((profile) => {
    res
      .status(200)
      .json({
        messageWrapper: {
          message: 'user profile created successfully',
          messageType: 'success'
        },
        profile
      })
      .catch((err) => {
        res.status(400).json({
          messageWrapper: {
            message: 'something weent wrong, please tryagain later.',
            messageType: 'error',
            error: err
          }
        });
      });
  });
});
// find the user by their id
router.get('/find-user', (req, res, next) => {
  let userId = req.param('userId');

  Profile.findById(userId)
    .then((profile) => {
      res.status(200).json({
        messageWrapper: {
          message: 'user profile found with the id' + userId,
          messageType: 'success'
        },
        profile
      });
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'cannot find user with the id ' + userId,
          messageType: 'error',
          error: err
        }
      });
    });
});

// get all users
router.get('/get-all-users', (req, res, next) => {
  Profile.find({}).then((profile) => {
    res
      .status(200)
      .json({
        messageWrapper: {
          message: 'found all users',
          messageType: 'success'
        },
        profile
      })
      .catch((err) => {
        res.status(400).json({
          messageWrapper: {
            message: 'cannot find user with the id ' + userId,
            messageType: 'error',
            error: err
          }
        });
      });
  });
});

module.exports = router;
