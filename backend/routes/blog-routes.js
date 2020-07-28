const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.send("BLOG ROUTES");
  //   next();
});

// POST request (create blog)
// PUT request (edit blog)
// DELETE request (delete blog)
// GET request (view blog)
module.exports = router;
