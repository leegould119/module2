module.exports = function (err, req, res, next) {
  console.log(err.stack);
  //   res.status(400).send('there has been an error');
  next();
};
