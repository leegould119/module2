const router = require('express').Router();
//  ROUTER LEVEL MIDDLEWARE
const timeLogger = require('./timeLogger');
const verify = require('./verifyToken');
// parameter bases endpoint
router.get('/parameters', timeLogger, (req, res, next) => {
  const userId = req.param('userId');
  const test = req.param('searchString');
  res.json({ message: 'WORKS', userId: userId, test: test });
  //   next();

  next();
});

router.get('/headers', timeLogger, verify, (req, res, next) => {
  const Auth = req.header('auth-token');
  res.send(Auth);
});
module.exports = router;
