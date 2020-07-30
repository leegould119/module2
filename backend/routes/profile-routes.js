const router = require('express').Router();

// import userProfileSchema
const Profile = require('../schemas/userProfileSchema');

router.get('/', (req, res, next) => {
  res.send('LOGIN ROUTES');
  //   next();
});

//  registering the user
router.post('/register', (req, res, next) => {
  // res.send({ type: 'POST', endpoint: 'REGISTER' });
  //   TODO register a new user
  //   then check if user has been created successfully
  //  { message: 'user has successfully registered, please check your email.', messageType: categories }
  //   categories { error, success, warning, info }

  // create a new profile
  const newUserProfile = new Profile({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    avatarUrl: req.body.avatarUrl,
    socialLinks: {
      facebookLink: req.body.socialLinks.facebookLink,
      twitterLink: req.body.socialLinks.twitterLink,
      pinterestLink: req.body.socialLinks.pinterestLink,
      linkedInLink: req.body.socialLinks.linkedInLink
    },
    adress: {
      street: req.body.adress.street,
      city: req.body.adress.city,
      state: req.body.adress.state,
      postalCode: req.body.adress.postalCode
    }
  });

  // save this data
  // taking the new user profile and saving it to the database (.save())
  // then [do something here]
  // catch  [ if there is an error]
  // Send back some message to the user to inform them on the status of the action taken
  // click on a button
  // return an object discribing weather or not the user has been successful
  // { mesasge: "sucessful submission of data ", status: { error, sucess, warning, info } }

  newUserProfile
    .save()
    .then((profile) => {
      const messageWrapper = {
        message: 'you have successfully created your profile',
        status: {
          error: false,
          success: true,
          warning: false,
          info: false
        },
        data: profile
      };
      res.send(messageWrapper);

      next();
    })
    .catch((err) => {
      res.send(err);
      next();
    });
});

// deleting the user
router.delete('/delete-user/:id', (req, res, next) => {
  let id = req.params.id;
  // let userIdBody = req.body.userId;

  //   TODO delete users

  // search the profile for the userId
  // return the profile as a response
  // send error
  Profile.findByIdAndDelete(id)
    .then((resp) => {
      const messageWrapper = {
        message: 'you have successfully deleted the profile with id' + id,
        status: {
          error: false,
          success: true,
          warning: false,
          info: false
        },
        data: resp
      };
      res.send(messageWrapper);
    })
    .catch((err) => {
      res.send(err);
    });
});

// getting a particular user by the id
router.get('/get-user-by-id/:id', (req, res, next) => {
  let id = req.params.id;
  Profile.find({ _id: id })
    .then((profile) => {
      if (profile.length == 0) {
        const messageWrapper = {
          message: 'there is no user with this id' + id,
          status: {
            error: true,
            success: false,
            warning: false,
            info: false
          }
        };

        res.send(messageWrapper);
      } else {
        const messageWrapper = {
          message: 'found the user with the id ' + id,
          status: {
            error: false,
            success: true,
            warning: false,
            info: false
          },
          data: profile
        };

        res.send(messageWrapper);
      }
    })
    .catch((err) => {
      const messageWrapper = {
        message: 'there is no user with this id ' + id,
        status: {
          error: true,
          success: false,
          warning: false,
          info: false
        },
        error: err
      };

      res.send(messageWrapper);
    });
});

// find all users
router.get('/find-all-users', (req, res, next) => {
  Profile.find()
    .then((profiles) => {
      res.send(profiles);
      next();
    })
    .catch((err) => {
      res.send(err);
      next();
    });
});

// udating the user
router.post('/update-user/:id', (req, res, next) => {
  const filter = req.params.id;

  // dreating a json object with new data
  const updateUserProfile = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    avatarUrl: req.body.avatarUrl,
    socialLinks: {
      facebookLink: req.body.socialLinks.facebookLink,
      twitterLink: req.body.socialLinks.twitterLink,
      pinterestLink: req.body.socialLinks.pinterestLink,
      linkedInLink: req.body.socialLinks.linkedInLink
    },
    adress: {
      street: req.body.adress.street,
      city: req.body.adress.city,
      state: req.body.adress.state,
      postalCode: req.body.adress.postalCode
    }
  };
  const options = { upsert: false, new: true };

  Profile.findOneAndUpdate(filter, updateUserProfile, options)
    .then((profile) => {
      res.send(profile);
      next();
    })
    .catch((err) => {
      res.send(err);
      next();
    });
});

module.exports = router;
