const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const { joiSchema } = require("../../model/contact");
const { Contact } = require("../../model");
const { authenticate } = require("../../middlwares");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const { _id } = req.user;
    const contacts = await Contact.find(
      { owner: _id },
      "-createdAt -updatedAt",
      { skip, limit: +limit }
    );
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFound();
    }
    res.json(contact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed for value")) {
      error.status = 404;
    }
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { _id } = req.user;
    const newContact = await Contact.create({ ...req.body, owner: _id });
    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updatedContact);
    if (!updatedContact) {
      throw new NotFound();
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactToDelete = await Contact.findByIdAndRemove(id);
    res.json({ message: "contact deleted !" });
    if (!contactToDelete) {
      throw new NotFound();
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/favourite", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favourite } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favourite },
      {
        new: true,
      }
    );
    console.log(updatedContact);
    if (!updatedContact) {
      throw new NotFound("missing field favourite");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
