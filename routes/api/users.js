const express = require("express");
const { User } = require("../../model");
const router = express.Router();
const { authenticate } = require("../../middlwares");

module.exports = router;

router.get("/current", authenticate, async (req, res, next) => {
  const { name, email } = req.user;
  res.json({
    user: {
      name,
      email,
    },
  });
});

// logout
router.get("/signout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});
