const router = require('express').Router();
const User = require('../schemas/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// register
router.post('/register', async (req, res, next) => {
  // send the data from the into a new model [User]

  // check is the user email is used
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword
    });

    // send the data into the db
    newUser
      .save()
      .then((resp) => {
        res
          .status(200)
          .json({ message: 'user successfilly created', id: resp._id });
        next();
      })
      .catch((err) => {
        res.status(400).json({
          message: 'there seems to be an error try again later',
          error: err
        });
        next();
      });
  } else {
    res.status(400).json({ message: 'this email is already in use' });
  }
});

// login
router.post('/login', async (req, res, next) => {
  // fist find the user in the database
  const user = await User.findOne({ email: req.body.email });
  // if the user doesnt exist send an error back
  if (!user) {
    res.status(400).json({ message: 'User not valid' });
    next();
  }
  // check if the user has a valid password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  // if the password doesnt exist send an error
  if (!validPassword) {
    res.status(400).json({ message: 'Invalid password' });
    next();
  }

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: '1h'
  });
  res.status(200).header('auth-token', token).send(token);
});

// logout
router.post('/logout', (req, res, next) => {
  const userId = req.body.id;
  const token = jwt.sign({ userId: userId }, process.env.TOKEN_SECRET, {
    expiresIn: '120ms'
  });
  res.status(200).send(token);
});

router.post('/change-password', async (req, res, next) => {
  // change the password
  // old password
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    res.send(validPassword);
    next();
  }
  // new password
});

module.exports = router;
