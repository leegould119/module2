module.exports = function (req, res, next) {
  const data = req.body;
  console.log('data : ' + JSON.stringify(data));
  console.log('Time:', Date.now());
  next();
};
