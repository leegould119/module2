const router = require('express').Router();

// middleware for checking access privelages
const verifyToken = require('./veriryToken');
// prile schema
const Profile = require('../schemas/userProfileSchema');
// PROFILE ROUTES FOR APPLICATION SERVER

router.post('/create-profile', verifyToken, async (req, res, next) => {
  // get the userid from the middleware
  const userId = req.user.userId;
  const user = await Profile.findOne({ userId });

  if (!user) {
    // setup the new profile
    const newProfile = new Profile({
      userId: req.user.userId,
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
    // save the profile into the db
    newProfile
      .save()
      .then((data) => {
        res.status(200).json({
          messageWrapper: {
            message: 'user profile created successfully',
            messagType: 'success'
          },
          data
        });
      })
      .catch((err) => {
        res.status(400).json({
          messageWrapper: {
            message: 'something went wrong, please try again soon.',
            messageType: 'error'
          }
        });
      });
  } else {
    res.json({
      messageWrapper: {
        message:
          'the user already exists, please try again with another account',
        messageType: 'error'
      }
    });
  }
});

router.post('/update-profile', verifyToken, async (req, res, next) => {
  // get the userid from the middleware
  const userId = req.user.userId;
  const user = await Profile.findOne({ userId });

  if (!user)
    return res.status(400).json({
      messageWrapper: {
        message: 'no user found with userid',
        messageType: 'error'
      }
    });

  const userName = user.userName;
  const update = {
    userId: req.user.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    avatarUrl: req.body.avatarUrl,
    socialLinks: {
      facebookLink: req.body.socialLinks.facebookLink,
      twitterLink: req.body.socialLinks.twitterLink
    }
  };
  const options = {
    new: true
  };
});

router.get('/get-user-profile-by-id', verifyToken, (req, res, next) => {
  // get the userid from the middleware
  const userId = req.user.userId;
  Profile.findOne({ userId })
    .then((data) => {
      res.status(200).json({
        messageWrapper: {
          message: ' user profile data retrieved successsfully',
          messageType: 'success'
        },
        data
      });
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'no user found, please try again later',
          messageType: 'error'
        },
        err
      });
    });
});

router.get('/get-all-profiles', verifyToken, (req, res, next) => {
  // res.json({ type: 'GET', message: 'this is the get all user profiles' });

  Profile.find({})
    .then((data) => {
      res.status(200).json({
        messageWrapper: {
          message: ' user profile data retrieved successsfully',
          messageType: 'success'
        },
        data
      });
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'no user found, please try again later',
          messageType: 'error'
        },
        err
      });
    });
});

router.delete('/delete-user-profile', (req, res, next) => {
  res.json({
    type: 'DELETE',
    message: 'this is the endpont for deleting the user profile'
  });
});

module.exports = router;
