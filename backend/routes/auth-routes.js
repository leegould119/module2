const router = require('express').Router();
// const crypt = require('crypto-js');
const bcrypt = require('bcrypt');
const Login = require('../schemas/authSchema');
const RefreshToken = require('../schemas/refreshTokenSchema');
const jwt = require('jsonwebtoken');
const { route } = require('./test-route');
const verifyToken = require('./veriryToken');

const nodemailer = require('nodemailer');

// email

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_EMAIL,
    pass: process.env.EMAIL_SERVER_PASSWORD
  },
  debug: true, // show debug output
  logger: true // log information in console
});

const mailOptions = {
  from: 'leegould119@live.com',
  to: 'leegould119@gmail.com',
  subject: 'Invoices due',
  text: 'Dudes, we really need your money.'
};

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

router.post('/email', (req, res, next) => {
  // reset password

  // get the data from the user - uswername email
  // update the password with a code or temp password
  // they would need th change it
  // old password
  // new pssword and verify pss
  // save the data
  // send a response.

  // forgot password
  // reset password

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send(error);
      next();
    } else {
      res.send('Email sent: ' + info.response);
      next();
    }
  });
});

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

router.post('/test-token', verifyToken, (req, res, next) => {
  res.json({
    data: req.user.userId
  });
});

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

function generateAccessToken(userId) {
  const authToken = jwt.sign({ userId }, process.env.JWT_AUTH_TOKEN_SECRET, {
    expiresIn: '1m'
  });
  return authToken;
}

module.exports = router;
