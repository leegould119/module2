const router = require('express').Router();
// const crypt = require('crypto-js');
const bcrypt = require('bcrypt');
const Login = require('../schemas/authSchema');
const RefreshToken = require('../schemas/refreshTokenSchema');
const jwt = require('jsonwebtoken');
const { route } = require('./test-route');
const verifyToken = require('./veriryToken');
const nodemailer = require('nodemailer');

// transporter (email server)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'xzavier.kris@ethereal.email',
    pass: 'xn3YTwVZp1zfTT6n8S'
  }
});

let message = {
  from: 'xzavier.kris@ethereal.email',
  to: 'xzavier.kris@ethereal.email',
  subject: 'Welcome to the app',
  text: 'welcome ti the site blah',
  html: '<p>Welcome to the site</p>'
};

router.post('/send-email', (req, res, next) => {
  transporter.sendMail(message, (err, info) => {
    if (err) return res.json({ error: err.message });

    res.json({ respnse: info.messageId });
    next();
  });
});

router.post('/forgot-password', async (req, res, next) => {
  const userName = req.body.userName;
  try {
    const user = await Login.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        messageWrapper: {
          message: 'no user found, please make sure your username is correct',
          messageType: 'error'
        }
      });
    } else {
      const passwordResetToken = Math.random().toString(36).slice(-8);

      const update = {
        userName: user.userName,
        userPassword: user.userPassword,
        passwordResetToken: passwordResetToken
      };

      const option = {
        new: true
      };

      Login.findOneAndUpdate(userName, update, option)
        .then((data) => {
          const toEmail = user.userName;

          let message = {
            from: 'xzavier.kris@ethereal.email',
            to: toEmail,
            subject: 'Reset your password',
            text: ` use this token to reset your password ${passwordResetToken}`,
            html: ` <p>use this token to reset your password <strong>${passwordResetToken}</strong></p>`
          };

          transporter.sendMail(message, (err, info) => {
            // add a message wrapper here for the client
            if (err) return res.json({ error: err.message });

            res.json({
              messageWrapper: {
                message: ' please check your inbox for a reset password token',
                messageType: 'success'
              },
              data
            });
            next();
          });
        })
        .catch((err) => {
          res.send(err);
          next();
        });
    }
  } catch (err) {
    res.send(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  const passwordResetToken = req.body.resetToken,
    newPassword = req.body.newPassword;
  try {
    const user = await Login.findOne({ passwordResetToken });

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        const userName = user.userName;

        const update = {
          userName: user.userName,
          userPassword: hash,
          passwordResetToken: ''
        };
        const option = {
          new: true
        };

        // res.json({ update });
        Login.findOneAndUpdate(userName, update, option)
          .then((data) => {
            res.status(200).json({
              messageWrapper: {
                message:
                  'your password has successfully been changes. please login',
                messageType: 'success'
              },
              data
            });
          })
          .catch((err) => {
            res.send(err);
          });
      });
    });
  } catch (err) {
    res.send(err);
  }
});

router.post('/register', async (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;
  const user = await Login.findOne({ userName });
  if (!user) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        const newLogin = new Login({
          userName,
          userPassword: hash,
          passwordResetToken: ''
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

  bcrypt.compare(userPassword, hash, (err, result) => {
    if (result == true) {
      const accessToken = generateAccessToken(userId);
      const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_TOKEN_SECRET
      );

      const newRefreshToken = new RefreshToken({
        refreshToken: refreshToken
      });

      newRefreshToken
        .save()
        .then((data) => {
          res.status(200).json({
            messageWrapper: {
              message: ' you have successfully logged in',
              messageType: 'success'
            },
            accessToken: accessToken,
            refreshToken: data.refreshToken,
            creationDate: data.creationDate
          });
        })
        .catch((err) => {
          res.json(err);
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

// check token endpoint
router.post('/token', (req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  RefreshToken.find({ refreshToken: refreshToken })
    .then((data) => {
      const refreshToken = data[0].refreshToken;
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken(user.userId);
          res.json({ accessToken: accessToken });
        }
      );
    })
    .catch((err) => {
      res.json(err);
    });
});

// test token to get back user id
router.post('/test-token', verifyToken, (req, res, next) => {
  res.json({
    data: req.user.userId
  });
});

// delete token logout
router.delete('/logout', (req, res, next) => {
  const refreshToken = req.body.token;

  RefreshToken.findOneAndDelete({ refreshToken: refreshToken })
    .then((resp) => {
      // invalidate the refresh token in one second
      jwt.sign({ name: 'expires' }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1000'
      });
      // send a response that the refresh token has been deleted from the db
      res.json({
        messageWrapper: {
          message: 'you have successfully logged out.',
          messageType: 'success'
        },
        resp
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

// generate access token middleware
function generateAccessToken(userId) {
  const authToken = jwt.sign({ userId }, process.env.JWT_AUTH_TOKEN_SECRET, {
    expiresIn: '1m'
  });
  return authToken;
}

module.exports = router;
