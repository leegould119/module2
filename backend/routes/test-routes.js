const test = require("express").Router();

// app.METHOD (lowercase) (PATH, HANDLER)
test.get("/", (req, res, next) => {
  res.send("bingo");
});
test.get("/get-data", (req, res, next) => {
  const data = req.body;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  console.log(data);
  //   res.send("data");
  //   res.send("Welcome back " + firstName);
  //   res.status(201).send("Bad request");

  // dummy first name is in our DB
  let dummyFirstName = "Pernilla";
  if (firstName === dummyFirstName) {
    res.status(200).json({
      message: " succeful, you have found" + firstName,
      messageType: "Success",
    });
  } else {
    res.status(404).json({
      message: "it seems that you what you are looking for in not in the DB",
      messageType: "Error",
    });
  }
});

test.put("/put-request", (request, response, callback) => {});
test.delete("/depete-request", (request, response, callback) => {});

module.exports = test;
