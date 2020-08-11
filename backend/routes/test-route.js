const router = require('express').Router();

const Profile = require('../schemas/userProfileSchema');
const { response } = require('express');

// save user data
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

// find all users
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

// find the user by name [using this technique as search]
router.get('/find-user-by-firstname', (req, res, next) => {
  const firstName = req.param('firstName');
  Profile.find({ firstName: firstName })
    .then((profile) => {
      if (!profile || profile.length == 0) {
        res.status(404).json({
          messageWrapper: {
            message: 'user ' + firstName + ' does not exist in the database',
            messageType: 'error'
          }
        });
      } else {
        res.status(200).json({
          messageWrapper: {
            message: 'user found with the name: ' + firstName,
            messageType: 'success'
          },
          profile
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'there is an error, please try again soon',
          messageType: 'error'
        },
        err
      });
    });
});

router.delete('/delete-user-by-id/:userId', (req, res, next) => {
  const userId = req.params.userId;

  Profile.findByIdAndDelete(userId)

    .then((profile) => {
      if (!profile || profile.length == 0) {
        res.send(404).json({
          messageWrapper: {
            message: 'user ' + userId + 'not found',
            messageType: 'error'
          }
        });
      } else {
        res.status(200).json({
          messageWrapper: {
            message: 'user deleted successfully with the id ' + profile._id,
            messageType: 'success'
          }
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'there seems to be an error, please try again later.',
          messageType: 'error'
        }
      });
    });
});

router.post('/update-user-profile/:userId', (req, res, next) => {
  const userId = req.params.userId;

  const updateProfile = {
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

  Profile.findByIdAndUpdate(userId, updateProfile, options)
    .then((profile) => {
      // if or else statement to see if the user exists
      res.status(200).json({
        messageWrapper: {
          message: 'User profile information updated successfully',
          messageType: 'sucecss'
        },
        profile
      });
    })
    .catch((error) => {
      res.status(400).json({
        messageWrapper: {
          message: ' there seems to be an error, please try again soon',
          messageType: 'error'
        }
      });
    });
});

//find user with multiple parameters
router.get('/find-user-by-name', (req, res, next) => {
  const firstName = req.param('firstName');
  const lastName = req.param('lastName');

  console.log(firstName);
  console.log(lastName);
  if (!firstName && !lastName) {
    res.status(400).json({
      message: 'no users defined, please make sure you send in the right data'
    });
  } else if (!firstName) {
    Profile.find({ lastName: lastName })
      .then((resp) => {
        res.send(resp);
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  } else if (!lastName) {
    Profile.find({ firstName: firstName })
      .then((resp) => {
        res.send(resp);
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  } else {
    Profile.find({ firstName: firstName, lastName: lastName })
      .then((resp) => {
        res.send(resp);
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  }
});

// delete by parmeter
router.post('/delete-by-name', (req, res, next) => {
  const name = req.param('name');

  Profile.deleteMany({ lastName: name })
    .then((response) => {
      res.status(200).send({
        messageWrapper: {
          message: 'data suceesfully deleted',
          messageType: 'success'
        },
        data: response
      });
    })
    .catch((err) => {
      res.status(400).send({
        messageWrapper: {
          message: 'there seems to be an error, please try agaain later.',
          messageType: 'error',
          error: err
        }
      });
    });
});

module.exports = router;
