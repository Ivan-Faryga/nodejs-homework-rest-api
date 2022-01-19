const express = require("express");
const { User } = require("../../model");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { authenticate, upload } = require("../../middlwares");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

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

// updating avatar
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);
    const modifiedFile = await Jimp.read(tempUpload);
    modifiedFile.resize(250, 250).write(tempUpload);
    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFileName);
    console.log(avatarURL);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  }
);

module.exports = router;
