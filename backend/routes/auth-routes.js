const router = require('express').Router();
const crypt = require('crypto-js');
const Login = require('../schemas/authSchema');

router.post('/register', (req, res, next) => {
  // require a username and a password
  const userName = req.body.userName,
    userPassword = req.body.userPassword;

  //   let placeholder = 'Password-1234';

  const cypher = crypt.AES.encrypt(
    userPassword,
    process.env.SECRET_HASH
  ).toString();

  const newLogin = new Login({
    userName: userName,
    userPassword: cypher
  });

  //   mongo save the user
  newLogin
    .save()
    .then((resp) => {
      res.send({ resp });
    })
    .catch((err) => {
      res.send({ err });
    });

  //

  //   res.json({
  //     password: userPassword,
  //     encryptedPassword: cypher,
  //     unencryptedPassword: unencryptedPassword
  //   });
});
router.post('/login', (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;

  //  check for the user by userName
  Login.find({ userName: userName })
    .then((resp) => {
      //  decrypt the password
      const bytes = crypt.AES.decrypt(
        resp[0].userPassword,
        process.env.SECRET_HASH
      );
      // create a new string
      const decryptedPassword = bytes.toString(crypt.enc.Utf8);

      // compare the passwords
      if (userPassword === decryptedPassword) {
        res.send('passwords are the same');
      } else {
        res.send(' passwords are not the same');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post('/logout', (req, resp, next) => {});

module.exports = router;
