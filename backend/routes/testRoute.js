const router = require('express').Router();
const TestSchema = require('../schemas/testSchema');

router.post('/test', (req, res, next) => {
  //   create a new data entry using TestSchema,
  const newTestData = new TestSchema({
    fistName: 'Lee',
    lastName: 'Gould',
    websiteUrl: 'http://google.com',
    hasProgammingExperience: true,
    regsiterTimestamp: Date.now()
  });

  newTestData
    .save()
    .then((response) => {
      res.status(200).json({ response });
      next();
    })
    .catch((err) => {
      res.sendStatus(400);
      next();
    });
});

module.exports = router;
