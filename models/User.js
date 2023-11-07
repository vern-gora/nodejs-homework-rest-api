import { Schema, model } from "mongoose";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

import Joi from "joi";


const emailRegexp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: 6,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  }, {versionKey: false, timestamps: true})

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userRegisterSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string(),
    // token: Joi.string()
})

export const userLoginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
})

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
})

const User = model('user', userSchema);

export default User