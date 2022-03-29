const PORT = 8000;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const bcrypt = require("bcrypt");
app.use(cors());

app.get("/hashedPassword", (req, res) => {
  const plainPassword = req.query.plainPassword;
  bcrypt.hash(plainPassword, 12).then((hash) => {
    res.json(hash);
  });
});

app.get("/comparePassword", (req, res) => {
  const plainPassword = req.query.plainPassword;
  const hashedPassword = req.query.hashedPassword;
  bcrypt.compare(plainPassword, hashedPassword, function (err, isMatch) {
    if (err) {
      throw err;
    } else if (!isMatch) {
      res.json(false);
    } else {
      res.json(true);
    }
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
