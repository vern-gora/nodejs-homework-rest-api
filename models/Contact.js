import { Schema, model } from "mongoose";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

import Joi from "joi";


const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
}, {versionKey: false})

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
  favorite: Joi.boolean()
})

export const movieUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})


const Contact = model("contact", contactSchema);

export default Contact;