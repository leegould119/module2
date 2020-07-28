const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.send("LOGIN ROUTES");
  //   next();
});

router.post("/login", (req, res, next) => {
  console.log("user data : " + JSON.stringify(req.body));
  res.send({
    type: "POST",
    endpoint: "LOGIN",
    username: req.body.username,
    password: req.body.password,
  });

  // TODO authentication

  next();
});

router.post("/logout", (req, res, next) => {
  res.send({ type: "POST", endpoint: "LOGOUT", message: "LOGOUT SUCCESS" });

  // TODO logout user
  next();
});

router.delete("/delete-user", (req, res, next) => {
  res.send({ type: "DELETE", enpoint: "DELETE-USER" });
  //   TODO delete users
});

module.exports = router;
