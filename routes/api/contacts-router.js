import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import {authenticate, isEmptyBody, isValidId, upload} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {contactsAddSchema, movieUpdateFavoriteSchema} from "../../models/Contact.js"

const contactAddValidate = validateBody(contactsAddSchema)
const contactUpdateValidate = validateBody(movieUpdateFavoriteSchema)

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAll)

router.get('/:id', isValidId, contactsController.getById)

router.post('/', upload.single("poster"), isEmptyBody, contactAddValidate, contactsController.add)

router.delete('/:id', isValidId, contactsController.deleteById)

router.put('/:id', isValidId, isEmptyBody, contactAddValidate, contactsController.updateById)

router.patch('/:id/favorite', isValidId, isEmptyBody, contactUpdateValidate, contactsController.updateById)


export default router
