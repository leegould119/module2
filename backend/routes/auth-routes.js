const router = require('express').Router();
// const crypt = require('crypto-js');
const bcrypt = require('bcrypt');
const Login = require('../schemas/authSchema');
const jwt = require('jsonwebtoken');
const { route } = require('./test-route');
const verifyToken = require('./veriryToken');
router.post('/register', async (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;

  // res.send({ userName, userPassword });

  const user = await Login.findOne({ userName });

  if (!user) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        const newLogin = new Login({
          userName,
          userPassword: hash
        });
        newLogin
          .save()
          .then((user) => {
            res.status(200).json({
              messageWrapper: {
                message: 'user created successfully',
                messageType: 'success'
              },
              user
            });
          })
          .catch((err) => {
            res.status(500).json({
              messageWrapper: {
                message: 'something went wrong please try again soon',
                messageType: 'error'
              },
              err
            });
          });
      });
    });
  } else {
    res.status(400).json({
      messageWrapper: {
        message: ' user already exists with this email adress',
        messageTypepe: 'error'
      }
    });
  }
});

router.post('/login', async (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;

  const user = await Login.findOne({ userName });
  // res.send({ user });

  const hash = user.userPassword;
  const userId = user._id;
  console.log(userId);

  bcrypt.compare(userPassword, hash, (err, result) => {
    // res.send(result);
    if (result == true) {
      const token = jwt.sign({ userId }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '1h'
      });

      res
        .status(200)
        .header('auth-token', token)
        .json({
          messageWrapper: {
            message: ' you have successfully logged in',
            messageType: 'success'
          },
          token
        });
    } else {
      res.status(400).json({
        messageWrapper: {
          message: 'please make sure your credentials are correct',
          messageType: 'error'
        }
      });
    }
  });
});

router.post('/test-token', verifyToken, (req, res, next) => {
  res.json({
    data: req.user.userId
  });
});
router.post('/logout', (req, resp, next) => {});

module.exports = router;
