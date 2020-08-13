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

  //   const bytes = crypt.AES.decrypt(cypher, process.env.SECRET_HASH);
  //   const unencryptedPassword = bytes.toString(crypt.enc.Utf8);

  //   res.json({
  //     password: userPassword,
  //     encryptedPassword: cypher,
  //     unencryptedPassword: unencryptedPassword
  //   });
});
router.post('/login', async (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;

  await Login.find({ userName: userName })
    .then((userData) => {
      //   res.send(userData);
      //   const compare = crypt.compare(password, cypher);
      const validPassword = await crypt.compare(
        req.body.userPassword,
        userData.userPassword
      );
      res.send(validPassword);
    })
    .catch((err) => {
      res.send(err);
    });
});
router.post('/logout', (req, resp, next) => {});

module.exports = router;
