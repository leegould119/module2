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
// array [make a db to store tokens]
let refreshTokens = [];

router.post('/login', async (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;

  const user = await Login.findOne({ userName });
  // res.send({ user });

  const hash = user.userPassword;
  const userId = user._id;
  console.log(userId);

  bcrypt.compare(userPassword, hash, (err, result) => {
    if (result == true) {
      const accessToken = generateAccessToken(userId);
      const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      // mock database
      refreshTokens.push(refreshToken);

      res
        .status(200)
        .header('auth-token', accessToken)
        .json({
          messageWrapper: {
            message: ' you have successfully logged in',
            messageType: 'success'
          },
          accessToken,
          refreshToken
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

router.post('/token', (req, res, next) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  // check db for tokens
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(user.userId);
      res.json({ accessToken: accessToken });
    }
  );
});

router.post('/test-token', verifyToken, (req, res, next) => {
  res.json({
    data: req.user.userId
  });
});

router.delete('/logout', (req, res, next) => {
  // check the db for token and delete it.
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  console.log(refreshTokens);

  res.status(200).json({
    messageWrapper: { message: 'logout successfuk' }
  });
});

// middleware for createating an access token
function generateAccessToken(userId) {
  const authToken = jwt.sign({ userId }, process.env.JWT_AUTH_TOKEN_SECRET, {
    expiresIn: '1m'
  });
  return authToken;
}
module.exports = router;
