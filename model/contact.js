const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().min(6).required(),
  phone: Joi.string().min(7).required(),
  favourite: Joi.bool,
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  joiSchema,
};
