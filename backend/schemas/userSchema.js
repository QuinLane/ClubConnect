import Joi from "joi";
const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  passwordHash: Joi.string().min(8).required(),
  userType: Joi.string().valid("Student", "SUAdmin").required(),
});
