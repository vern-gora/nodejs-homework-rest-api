import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

const router = express.Router();

router.get('/', contactsController.getAll)

router.get('/:id', contactsController.getById)

router.post('/', contactsController.add)

router.delete('/:id', contactsController.deleteById)

router.put('/:id', contactsController.updateById)

export default router
